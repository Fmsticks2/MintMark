module mintmark::certifychain {
    use std::signer;
    use std::string;
    use std::option;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_token_objects::collection;
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
        };
        
        vector::push_back(&mut registry.organizations, organization);
        registry.organization_count = organization_id;
    }

    /// Create a certificate template
    public entry fun create_certificate_template(
        org_admin: &signer,
        organization_id: u64,
        name: string::String,
        description: string::String,
        image_uri: string::String,
        fields: vector<string::String>,
    ) acquires OrganizationRegistry {
        let org_admin_addr = signer::address_of(org_admin);
        let registry = borrow_global_mut<OrganizationRegistry>(@mintmark);
        
        // Find and verify organization admin
         let len = vector::length(&registry.organizations);
         let i = 0;
         while (i < len) {
             let org = vector::borrow(&registry.organizations, i);
             if (org.id == organization_id) {
                 assert!(org.admin == org_admin_addr, EUNAUTHORIZED_ORGANIZATION);
                 break
             };
             i = i + 1;
         };
         assert!(i < len, ECERTIFICATE_TEMPLATE_NOT_FOUND);
         
         // Update template count
         let org_mut = vector::borrow_mut(&mut registry.organizations, i);
         org_mut.template_count = org_mut.template_count + 1;
        
        let template_id = organization_id * 1000 + org_mut.template_count;
        
        move_to(org_admin, CertificateTemplate {
            id: template_id,
            organization_id,
            name,
            description,
            image_uri,
            fields,
            is_active: true,
            created_at: timestamp::now_microseconds(),
            issued_count: 0,
        });
    }

    /// Issue a certificate
    public entry fun issue_certificate(
        org_admin: &signer,
        template_id: u64,
        recipient: address,
        recipient_name: string::String,
        recipient_email: string::String,
        field_values: vector<string::String>,
        expires_at: option::Option<u64>,
    ) acquires CertificateTemplate, OrganizationRegistry, GUIToken {
        let org_admin_addr = signer::address_of(org_admin);
        
        // Get template and verify ownership
        let template = borrow_global_mut<CertificateTemplate>(org_admin_addr);
        assert!(template.id == template_id, ECERTIFICATE_TEMPLATE_NOT_FOUND);
        assert!(template.is_active, EINVALID_CERTIFICATE_STATUS);
        
        let certificate_id = template_id * 10000 + template.issued_count + 1;
        template.issued_count = template.issued_count + 1;
        
        // Update organization stats
         let registry = borrow_global_mut<OrganizationRegistry>(@mintmark);
         let len = vector::length(&registry.organizations);
         let i = 0;
         while (i < len) {
             let org = vector::borrow(&registry.organizations, i);
             if (org.id == template.organization_id) {
                 break
             };
             i = i + 1;
         };
         if (i < len) {
             let org_mut = vector::borrow_mut(&mut registry.organizations, i);
             org_mut.certificates_issued = org_mut.certificates_issued + 1;
         };
        
        // Create verification hash (simplified)
        let verification_hash = string::utf8(b"cert_");
        string::append(&mut verification_hash, string::utf8(b"123456789"));
        
        // Create certificate NFT
        let constructor_ref = token::create(
            org_admin,
            recipient_name,
            string::utf8(b"Certificate issued by CertifyChain"),
            template.image_uri,
            option::none(),
            template.image_uri,
        );
        
        // Store certificate record
        move_to(org_admin, Certificate {
            id: certificate_id,
            template_id,
            organization_id: template.organization_id,
            recipient,
            recipient_name,
            recipient_email,
            field_values,
            issued_at: timestamp::now_microseconds(),
            expires_at,
            is_revoked: false,
            verification_hash,
        });
        
        // Reward organization with GUI tokens
        let gui_token = borrow_global_mut<GUIToken>(@mintmark);
        mint_gui_tokens(org_admin_addr, 10, gui_token); // 10 tokens per certificate
    }

    /// Revoke a certificate
    public entry fun revoke_certificate(
        org_admin: &signer,
        certificate_id: u64,
    ) acquires Certificate, OrganizationRegistry {
        let org_admin_addr = signer::address_of(org_admin);
        let certificate = borrow_global_mut<Certificate>(org_admin_addr);
        
        assert!(certificate.id == certificate_id, ECERTIFICATE_TEMPLATE_NOT_FOUND);
        assert!(!certificate.is_revoked, EINVALID_CERTIFICATE_STATUS);
        
        certificate.is_revoked = true;
        
        // Update organization stats
         let registry = borrow_global_mut<OrganizationRegistry>(@mintmark);
         let len = vector::length(&registry.organizations);
         let i = 0;
         while (i < len) {
             let org = vector::borrow(&registry.organizations, i);
             if (org.id == certificate.organization_id) {
                 break
             };
             i = i + 1;
         };
         if (i < len) {
             let org_mut = vector::borrow_mut(&mut registry.organizations, i);
             org_mut.certificates_revoked = org_mut.certificates_revoked + 1;
         };
         
         event::emit(CertificateRevokedEvent {
             certificate_id,
             organization_id: certificate.organization_id,
             recipient: certificate.recipient,
             revoked_by: org_admin_addr,
             timestamp: timestamp::now_seconds(),
         });
    }

    /// Verify a certificate
    public fun verify_certificate(
        certificate_id: u64,
        verification_hash: string::String,
    ): bool acquires Certificate {
        // This is a simplified verification - in production, you'd want more robust verification
        if (exists<Certificate>(@mintmark)) {
            let certificate = borrow_global<Certificate>(@mintmark);
            certificate.id == certificate_id && 
            certificate.verification_hash == verification_hash && 
            !certificate.is_revoked
        } else {
            false
        }
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
        }
    }

    /// Get certificate template
    public fun get_certificate_template(template_address: address): CertificateTemplate acquires CertificateTemplate {
        *borrow_global<CertificateTemplate>(template_address)
    }

    /// Get certificate
    public fun get_certificate(certificate_address: address): Certificate acquires Certificate {
        *borrow_global<Certificate>(certificate_address)
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

        coin::mint<GUIToken>(amount, recipient);
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

        coin::burn<GUIToken>(amount, from);
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

    /// Deactivate certificate template
    public entry fun deactivate_template(
        org_admin: &signer,
        template_id: u64,
    ) acquires CertificateTemplate {
        let org_admin_addr = signer::address_of(org_admin);
        let template = borrow_global_mut<CertificateTemplate>(org_admin_addr);
        assert!(template.id == template_id, ECERTIFICATE_TEMPLATE_NOT_FOUND);
        template.is_active = false;
    }
}