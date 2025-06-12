module mintmark::platform {
    use std::signer;
    use std::string;
    use std::option;
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_token_objects::token;

    /// Error codes
    const EINSUFFICIENT_GUI_BALANCE: u64 = 1;
    const EPLATFORM_ALREADY_INITIALIZED: u64 = 2;
    const EPLATFORM_NOT_INITIALIZED: u64 = 3;
    const EINVALID_PREMIUM_THRESHOLD: u64 = 4;
    const EINVALID_ROYALTY_PERCENTAGE: u64 = 5;
    const EUNAUTHORIZED_ORGANIZATION: u64 = 6;
    const ECERTIFICATE_TEMPLATE_NOT_FOUND: u64 = 7;
    const ERECIPIENT_ALREADY_CERTIFIED: u64 = 8;
    const EINVALID_CERTIFICATE_STATUS: u64 = 9;
    const EPOAP_NOT_ENABLED: u64 = 10;
    const EINVALID_EVENT_ID: u64 = 11;
    const EPARTICIPANT_NOT_REGISTERED: u64 = 12;
    const EPRICING_ALREADY_INITIALIZED: u64 = 13;
    const EINVALID_ORGANIZATION_TYPE: u64 = 14;

    /// Platform configuration
    struct PlatformConfig has key {
        minting_fee: u64,
        royalty_percentage: u64,
        premium_threshold: u64,
        reward_rate: u64,
        admin: address,
    }

    /// Organization registry
    struct OrganizationRegistry has key {
        organizations: vector<Organization>,
        organization_count: u64,
    }

    /// Organization data
    struct Organization has store, copy, drop {
        id: u64,
        name: string::String,
        admin: address,
        is_verified: bool,
        created_at: u64,
        template_count: u64,
        certificates_issued: u64,
        certificates_revoked: u64,
    }

    /// Certificate template
    struct CertificateTemplate has key {
        id: u64,
        organization_id: u64,
        name: string::String,
        description: string::String,
        image_uri: string::String,
        fields: vector<string::String>,
        is_active: bool,
        created_at: u64,
        issued_count: u64,
    }

    /// Certificate record
    struct Certificate has key {
        id: u64,
        template_id: u64,
        organization_id: u64,
        recipient: address,
        recipient_name: string::String,
        recipient_email: string::String,
        field_values: vector<string::String>,
        issued_at: u64,
        expires_at: option::Option<u64>,
        is_revoked: bool,
        verification_hash: string::String,
    }

    /// Event pricing configuration
    struct EventPricing has key {
        individual_fee: u64,        // Free (0)
        small_org_fee: u64,         // $25 equivalent in GUI tokens
        enterprise_fee: u64,        // $100 equivalent in GUI tokens
        poap_addon_fee: u64,        // $15 equivalent in GUI tokens
    }

    /// Event data structure
    struct Event has key, copy, drop {
        id: u64,
        name: string::String,
        organizer: address,
        organization_type: u8,      // 0=individual, 1=small_org, 2=enterprise
        poap_enabled: bool,
        max_attendees: u64,
        created_at: u64,
        event_date: u64,
        total_fee_paid: u64,
        participants: vector<address>,
    }

    /// Event registry to track event IDs
    struct EventRegistry has key {
        next_event_id: u64,
    }

    /// GUI Token resource
    struct GUIToken has key {
        total_supply: u64,
        circulating_supply: u64,
        mint_events: event::EventHandle<MintGUIEvent>,
        burn_events: event::EventHandle<BurnGUIEvent>,
        reward_events: event::EventHandle<RewardEvent>,
    }

    struct MintGUIEvent has drop, store {
        amount: u64,
        recipient: address,
        timestamp: u64,
    }

    struct BurnGUIEvent has drop, store {
        amount: u64,
        from: address,
        timestamp: u64,
    }

    struct RewardEvent has drop, store {
        amount: u64,
        recipient: address,
        event_type: string::String,
        timestamp: u64,
    }

    struct OrganizationRegisteredEvent has drop, store {
        organization_id: u64,
        name: string::String,
        admin: address,
        timestamp: u64,
    }

    struct TemplateCreatedEvent has drop, store {
        template_id: u64,
        organization_id: u64,
        name: string::String,
        creator: address,
        timestamp: u64,
    }

    struct CertificateIssuedEvent has drop, store {
        certificate_id: u64,
        template_id: u64,
        organization_id: u64,
        recipient: address,
        recipient_name: string::String,
        timestamp: u64,
    }

    struct CertificateRevokedEvent has drop, store {
        certificate_id: u64,
        organization_id: u64,
        recipient: address,
        timestamp: u64,
    }

    /// Initialize the platform
    public entry fun initialize_platform(
        admin: &signer,
        minting_fee: u64,
        royalty_percentage: u64,
        premium_threshold: u64,
        reward_rate: u64,
    ) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<PlatformConfig>(admin_addr), EPLATFORM_ALREADY_INITIALIZED);
        assert!(royalty_percentage <= 100, EINVALID_ROYALTY_PERCENTAGE);
        assert!(premium_threshold > 0, EINVALID_PREMIUM_THRESHOLD);

        move_to(admin, PlatformConfig {
            minting_fee,
            royalty_percentage,
            premium_threshold,
            reward_rate,
            admin: admin_addr,
        });

        move_to(admin, OrganizationRegistry {
            organizations: vector::empty<Organization>(),
            organization_count: 0,
        });

        move_to(admin, GUIToken {
            total_supply: 0,
            circulating_supply: 0,
            mint_events: account::new_event_handle<MintGUIEvent>(admin),
            burn_events: account::new_event_handle<BurnGUIEvent>(admin),
            reward_events: account::new_event_handle<RewardEvent>(admin),
        });
    }

    /// Initialize event pricing
    public entry fun initialize_event_pricing(
        admin: &signer,
        individual_fee: u64,
        small_org_fee: u64,
        enterprise_fee: u64,
        poap_addon_fee: u64,
    ) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<EventPricing>(admin_addr), EPRICING_ALREADY_INITIALIZED);
        
        move_to(admin, EventPricing {
            individual_fee,
            small_org_fee,
            enterprise_fee,
            poap_addon_fee,
        });

        // Initialize event registry
        if (!exists<EventRegistry>(admin_addr)) {
            move_to(admin, EventRegistry {
                next_event_id: 1,
            });
        };
    }

    /// Register a new organization
    public entry fun register_organization(
        admin: &signer,
        name: string::String,
        org_admin: address,
    ) acquires OrganizationRegistry {
        let admin_addr = signer::address_of(admin);
        let registry = borrow_global_mut<OrganizationRegistry>(@mintmark);
        
        let organization_id = registry.organization_count + 1;
        let organization = Organization {
            id: organization_id,
            name,
            admin: org_admin,
            is_verified: false,
            created_at: timestamp::now_microseconds(),
            template_count: 0,
            certificates_issued: 0,
            certificates_revoked: 0,
        };
        
        vector::push_back(&mut registry.organizations, organization);
        registry.organization_count = organization_id;
    }

    /// Get next event ID
    fun get_next_event_id(): u64 acquires EventRegistry {
        let registry = borrow_global_mut<EventRegistry>(@mintmark);
        let event_id = registry.next_event_id;
        registry.next_event_id = event_id + 1;
        event_id
    }

    /// Create event with pricing
    public entry fun create_event(
        creator: &signer,
        name: string::String,
        organization_type: u8,
        poap_enabled: bool,
        max_attendees: u64,
        event_date: u64,
    ) acquires EventPricing, GUIToken, EventRegistry {
        let creator_addr = signer::address_of(creator);
        assert!(organization_type <= 2, EINVALID_ORGANIZATION_TYPE);
        
        let pricing = borrow_global<EventPricing>(@mintmark);
        
        // Calculate total fee
        let base_fee = if (organization_type == 0) {
            pricing.individual_fee
        } else if (organization_type == 1) {
            pricing.small_org_fee
        } else {
            pricing.enterprise_fee
        };
        
        let total_fee = base_fee + if (poap_enabled) { pricing.poap_addon_fee } else { 0 };
        
        // Charge fee if not free
        if (total_fee > 0) {
            let gui_token = borrow_global_mut<GUIToken>(@mintmark);
            burn_gui_tokens(creator_addr, total_fee, gui_token);
        };
        
        // Create event
        let event_id = get_next_event_id();
        move_to(creator, Event {
            id: event_id,
            name,
            organizer: creator_addr,
            organization_type,
            poap_enabled,
            max_attendees,
            created_at: timestamp::now_microseconds(),
            event_date,
            total_fee_paid: total_fee,
            participants: vector::empty<address>(),
        });
    }

    /// Add participant to event
    public entry fun add_participant(
        organizer: &signer,
        event_id: u64,
        participant: address,
    ) acquires Event {
        let organizer_addr = signer::address_of(organizer);
        let event = borrow_global_mut<Event>(organizer_addr);
        
        assert!(event.id == event_id, EINVALID_EVENT_ID);
        assert!(event.organizer == organizer_addr, EUNAUTHORIZED_ORGANIZATION);
        assert!(vector::length(&event.participants) < event.max_attendees, EINSUFFICIENT_GUI_BALANCE);
        
        if (!vector::contains(&event.participants, &participant)) {
            vector::push_back(&mut event.participants, participant);
        };
    }

    /// Mint POAP for event participant
    public entry fun mint_poap(
        participant: &signer,
        event_id: u64,
        event_creator: address,
    ) acquires Event {
        let participant_addr = signer::address_of(participant);
        let event = borrow_global<Event>(event_creator);
        
        // Verify event allows POAP minting
        assert!(event.poap_enabled, EPOAP_NOT_ENABLED);
        assert!(event.id == event_id, EINVALID_EVENT_ID);
        
        // Check if participant is registered for event
        assert!(vector::contains(&event.participants, &participant_addr), EPARTICIPANT_NOT_REGISTERED);
        
        // Create POAP NFT using token framework
        let constructor_ref = token::create(
            participant,
            event.name,
            string::utf8(b"POAP for event participation"),
            string::utf8(b"https://example.com/poap.png"),
            option::none(),
            string::utf8(b"https://example.com/poap.png"),
        );
    }

    /// Mint GUI tokens
    fun mint_gui_tokens(recipient: address, amount: u64, gui_token: &mut GUIToken) {
        gui_token.total_supply = gui_token.total_supply + amount;
        gui_token.circulating_supply = gui_token.circulating_supply + amount;

        event::emit_event(
            &mut gui_token.mint_events,
            MintGUIEvent {
                amount,
                recipient,
                timestamp: timestamp::now_microseconds(),
            },
        );

        // Note: Actual coin minting would require proper coin module implementation
        // This is a placeholder for the GUI token minting logic
    }

    /// Burn GUI tokens
    fun burn_gui_tokens(from: address, amount: u64, gui_token: &mut GUIToken) {
        gui_token.circulating_supply = gui_token.circulating_supply - amount;

        event::emit_event(
            &mut gui_token.burn_events,
            BurnGUIEvent {
                amount,
                from,
                timestamp: timestamp::now_microseconds(),
            },
        );

        // Note: Actual coin burning would require proper coin module implementation
        // This is a placeholder for the GUI token burning logic
    }

    /// Get platform configuration
    public fun get_platform_config(): (u64, u64, u64, u64, address) acquires PlatformConfig {
        let config = borrow_global<PlatformConfig>(@mintmark);
        (config.minting_fee, config.royalty_percentage, config.premium_threshold, config.reward_rate, config.admin)
    }

    /// Get GUI token info
    public fun get_gui_token_info(): (u64, u64) acquires GUIToken {
        let token = borrow_global<GUIToken>(@mintmark);
        (token.total_supply, token.circulating_supply)
    }

    /// Get event pricing
    public fun get_event_pricing(): (u64, u64, u64, u64) acquires EventPricing {
        let pricing = borrow_global<EventPricing>(@mintmark);
        (pricing.individual_fee, pricing.small_org_fee, pricing.enterprise_fee, pricing.poap_addon_fee)
    }

    /// Get event details
    public fun get_event(event_creator: address): Event acquires Event {
        *borrow_global<Event>(event_creator)
    }

    /// Get organization count
    public fun get_organization_count(): u64 acquires OrganizationRegistry {
        let registry = borrow_global<OrganizationRegistry>(@mintmark);
        registry.organization_count
    }

    /// Get all organizations
    public fun get_all_organizations(): vector<Organization> acquires OrganizationRegistry {
        let registry = borrow_global<OrganizationRegistry>(@mintmark);
        registry.organizations
    }

    /// Get organization by ID
    public fun get_organization(organization_id: u64): Organization acquires OrganizationRegistry {
        let registry = borrow_global<OrganizationRegistry>(@mintmark);
        let i = 0;
        let len = vector::length(&registry.organizations);
        while (i < len) {
            let org = vector::borrow(&registry.organizations, i);
            if (org.id == organization_id) {
                return *org
            };
            i = i + 1;
        };
        // Return empty organization if not found
        Organization {
            id: 0,
            name: string::utf8(b""),
            admin: @0x0,
            is_verified: false,
            created_at: 0,
            template_count: 0,
            certificates_issued: 0,
            certificates_revoked: 0,
        }
    }

    /// Update organization verification status (admin only)
    public entry fun update_organization_verification(
        admin: &signer,
        organization_id: u64,
        is_verified: bool,
    ) acquires PlatformConfig, OrganizationRegistry {
        let admin_addr = signer::address_of(admin);
        let config = borrow_global<PlatformConfig>(@mintmark);
        assert!(admin_addr == config.admin, EUNAUTHORIZED_ORGANIZATION);
        
        let registry = borrow_global_mut<OrganizationRegistry>(@mintmark);
        let i = 0;
        let len = vector::length(&registry.organizations);
        while (i < len) {
            let org = vector::borrow_mut(&mut registry.organizations, i);
            if (org.id == organization_id) {
                org.is_verified = is_verified;
                break
            };
            i = i + 1;
        };
    }
}