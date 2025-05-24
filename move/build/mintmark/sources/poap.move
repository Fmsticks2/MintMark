module mintmark::poap {
    use std::signer;
    use std::string;
    use std::option;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::object;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;

    /// Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const ECOLLECTION_NOT_INITIALIZED: u64 = 2;
    const ETOKEN_ALREADY_MINTED: u64 = 3;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct POAPCollection has key {
        collection_addr: address,
        mint_events: event::EventHandle<MintEvent>,
    }

    struct MintEvent has drop, store {
        minter_address: address,
        token_address: address,
        timestamp: u64,
    }

    /// Initialize the POAP collection
    public entry fun initialize_collection(
        admin: &signer,
        collection_name: string::String,
        collection_description: string::String,
        collection_uri: string::String,
    ) {
        // Create the collection
        let constructor_ref = collection::create_fixed_collection(
            admin,
            collection_description,
            10000, // max supply
            collection_name,
            option::none(),
            collection_uri,
        );

        let collection_addr = object::address_from_constructor_ref(&constructor_ref);

        // Initialize POAPCollection resource
        let collection = POAPCollection {
            collection_addr,
            mint_events: account::new_event_handle<MintEvent>(admin),
        };

        move_to(admin, collection);
    }

    /// Mint a new POAP NFT
    public entry fun mint_poap(
        recipient: &signer,
        token_name: string::String,
        token_description: string::String,
        token_uri: string::String,
    ) acquires POAPCollection {
        let recipient_addr = signer::address_of(recipient);
        
        // Create the token
        let constructor_ref = token::create(
            recipient,
            token_name,
            token_description,
            token_uri,
            option::none(), // royalty
            token_uri,
        );

        let token_address = object::address_from_constructor_ref(&constructor_ref);

        // Emit mint event
        let collection = borrow_global_mut<POAPCollection>(@mintmark);
        event::emit_event(
            &mut collection.mint_events,
            MintEvent {
                minter_address: recipient_addr,
                token_address: token_address,
                timestamp: timestamp::now_microseconds(),
            },
        );
    }

    /// Check if an address has minted a POAP
    public fun has_minted(addr: address): bool {
        exists<POAPCollection>(addr)
    }
}