# MintMark POAP Smart Contract

This is the Move smart contract for the MintMark POAP (Proof of Attendance Protocol) NFT system on Aptos.

## Contract Structure

- `POAPCollection`: Manages the NFT collection
- `MintEvent`: Tracks minting events
- Functions:
  - `initialize_collection`: Creates the POAP collection
  - `mint_poap`: Mints a new POAP NFT
  - `has_minted`: Checks if an address has minted

## Deployment Instructions

1. Install Aptos CLI if not already installed:
   ```bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. Configure your account:
   ```bash
   aptos init
   ```

3. Update the address in `Move.toml`:
   - Replace `_` with your account address

4. Compile the contract:
   ```bash
   aptos move compile
   ```

5. Test the contract:
   ```bash
   aptos move test
   ```

6. Deploy to devnet:
   ```bash
   aptos move publish --named-addresses mintmark=<your-address>
   ```

## Initialization

After deployment, initialize the collection:

```bash
aptos move run --function-id "<your-address>::poap::initialize_collection" \
    --args string:"MintMark POAP" \
    string:"Proof of Attendance NFTs for MintMark events" \
    string:"https://mintmark.example.com/collection"
```

## Contract Address

After deployment, update the `CONTRACT_ADDRESS` in your frontend configuration (`src/blockchain/config.ts`).

## Security Considerations

- The contract uses Aptos Token Objects for better NFT management
- Implements event emission for tracking mints
- Includes basic access control
- Has a fixed maximum supply