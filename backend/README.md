# Mintmark Backend - Smart Contract

This directory contains the Move smart contract for the Mintmark POAP platform on Aptos blockchain.

## Prerequisites

- [Aptos CLI](https://aptos.dev/tools/aptos-cli/install-cli/) installed
- Node.js 18+ (for package scripts)
- Git

## Project Structure

```
backend/
├── move/                 # Move smart contract source
│   ├── sources/         # Contract source files
│   │   └── mintmark.move
│   ├── Move.toml        # Move package configuration
│   └── build/           # Compiled artifacts
├── package.json         # NPM scripts for deployment
├── .env                 # Environment configuration
└── README.md           # This file
```

## Setup

1. **Initialize Aptos Profiles**
   ```bash
   npm run init:devnet
   npm run init:testnet
   npm run init:mainnet
   ```

2. **Fund Accounts (for devnet/testnet)**
   ```bash
   npm run fund:devnet
   npm run fund:testnet
   ```

## Development Workflow

### 1. Compile Contract
```bash
npm run compile
```

### 2. Test Contract
```bash
npm run test
```

### 3. Clean Build Artifacts
```bash
npm run clean
```

## Deployment

### Deploy to Devnet
```bash
npm run deploy:devnet
```

### Deploy to Testnet
```bash
npm run deploy:testnet
```

### Deploy to Mainnet
```bash
npm run deploy:mainnet
```

## Contract Features

The Mintmark smart contract provides:

- **Platform Management**: Initialize and configure the POAP platform
- **Organization Registration**: Register organizations to create events
- **Event Creation**: Create events with custom metadata and pricing
- **POAP Minting**: Mint proof-of-attendance tokens for participants
- **Participant Management**: Add and manage event participants
- **GUI Token Integration**: Platform token for fees and governance

## Contract Functions

### Platform Functions
- `initialize_platform()` - Initialize the platform configuration
- `initialize_event_pricing()` - Set up event pricing structure
- `get_platform_config()` - Retrieve platform configuration

### Organization Functions
- `register_organization()` - Register a new organization
- `create_event()` - Create a new event

### POAP Functions
- `mint_poap()` - Mint a POAP token for a participant
- `add_participant()` - Add participant to an event
- `get_event()` - Retrieve event information

### Token Functions
- `get_gui_token_info()` - Get GUI token information
- `get_event_pricing()` - Get event pricing details

## Environment Variables

Configure the following in `.env`:

```env
# Network Configuration
APTOS_NETWORK=devnet
APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1

# Contract Configuration
CONTRAT_ADDRESS=0x...
MODULE_NAME=platform

# Private Keys (for deployment)
DEVNET_PRIVATE_KEY=0x...
TESTNET_PRIVATE_KEY=0x...
MAINNET_PRIVATE_KEY=0x...
```

## Security Considerations

1. **Private Key Management**: Never commit private keys to version control
2. **Access Controls**: The contract implements proper access controls for admin functions
3. **Input Validation**: All inputs are validated before processing
4. **Gas Optimization**: Functions are optimized for gas efficiency

## Troubleshooting

### Common Issues

1. **Compilation Errors**
   - Ensure Aptos CLI is updated to the latest version
   - Check Move.toml dependencies are correct
   - Run `npm run clean` and try again

2. **Deployment Failures**
   - Verify account has sufficient balance
   - Check network connectivity
   - Ensure profile is properly configured

3. **Gas Limit Errors**
   - Increase gas limit in deployment command
   - Optimize contract code if necessary

### Getting Help

- [Aptos Documentation](https://aptos.dev/)
- [Move Language Guide](https://aptos.dev/move/move-on-aptos/)
- [Aptos CLI Reference](https://aptos.dev/tools/aptos-cli/)

## License

MIT License - see LICENSE file for details.