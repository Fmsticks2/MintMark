# Mintmark - Decentralized POAP Platform on Aptos

Mintmark is a decentralized Proof of Attendance Protocol (POAP) platform built on the Aptos blockchain. It enables organizations to create events and mint commemorative NFTs for participants.

## Project Structure

This project is structured as a monorepo with separate frontend and backend components for independent deployment:

```
mintmark/
├── frontend/              # React frontend application
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── README.md         # Frontend documentation
├── backend/              # Smart contract backend
│   ├── move/            # Move smart contract
│   ├── server.js        # Express API server
│   ├── package.json     # Backend scripts
│   └── README.md        # Backend documentation
├── .env                 # Root environment variables
├── DEPLOYMENT.md        # Detailed deployment instructions
├── render.yaml          # Render deployment configuration
└── README.md           # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- [Aptos CLI](https://aptos.dev/tools/aptos-cli/install-cli/)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd mintmark
```

### 2. Setup Backend (Smart Contract)
```bash
cd backend
npm install
npm run init:devnet
npm run fund:devnet
npm run compile
npm run deploy:devnet
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
# Update .env with deployed contract address
npm run dev
```

### 4. Start Backend API Server
```bash
cd ../backend
npm run dev
```

## Architecture Overview

### Frontend (React Application)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Blockchain**: Aptos TypeScript SDK
- **Wallet**: Multi-wallet adapter support

### Backend (Smart Contract & API)
- **Smart Contract**: Move language on Aptos
- **API Server**: Express.js
- **Features**: POAP minting, event management, organization registry

## Features

### Core Functionality
- 🎫 **Event Creation**: Organizations can create events with custom metadata
- 🏆 **POAP Minting**: Participants receive commemorative NFTs
- 👥 **Organization Management**: Register and manage organizations
- 💰 **GUI Token Integration**: Platform token for fees and governance
- 📊 **Analytics Dashboard**: Track event metrics and participation

### Technical Features
- 🔐 **Multi-Wallet Support**: Petra, Martian, Pontem, Fewcha
- 🌐 **Multi-Network**: Devnet, Testnet, Mainnet support
- 📱 **Responsive Design**: Mobile-first approach
- ⚡ **Fast Performance**: Optimized with Vite and modern React
- 🛡️ **Type Safety**: Full TypeScript implementation

## Development Workflow

### Backend Development
1. Navigate to `backend/` directory
2. Modify Move contracts in `move/sources/`
3. Compile: `npm run compile`
4. Test: `npm run test`
5. Deploy: `npm run deploy:devnet`
6. Start API server: `npm run dev`

### Frontend Development
1. Navigate to `frontend/` directory
2. Start dev server: `npm run dev`
3. Make changes to React components
4. Build: `npm run build`

## Deployment

Detailed deployment instructions are available in [DEPLOYMENT.md](./DEPLOYMENT.md).

### Backend Deployment Options

- **Render**: Configured with `render.yaml`
- **Custom Server**: Deploy the Express API server

### Frontend Deployment Options

- **Render**: Configured with `render.yaml`
- **Vercel**: Configured with `frontend/vercel.json`
- **Netlify**: Configured with `frontend/netlify.toml`

### Environment Configuration

#### Backend (.env)
```env
APTOS_NETWORK=devnet
APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
CONTRACT_ADDRESS=0x...
MODULE_NAME=platform
DEVNET_PRIVATE_KEY=0x...
```

#### Frontend (.env)
```env
VITE_APTOS_NETWORK=devnet
VITE_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
VITE_CONTRACT_ADDRESS=0x...
VITE_MODULE_NAME=platform
VITE_API_URL=http://localhost:3000
```

## Smart Contract Functions

### Platform Management
- `initialize_platform()` - Initialize platform configuration
- `initialize_event_pricing()` - Set event pricing structure
- `get_platform_config()` - Retrieve platform settings

### Organization Functions
- `register_organization()` - Register new organization
- `create_event()` - Create event with metadata

### POAP Functions
- `mint_poap()` - Mint POAP for participant
- `add_participant()` - Add participant to event
- `get_event()` - Retrieve event information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Update documentation as needed

## Security

- Smart contracts are audited for security vulnerabilities
- Private keys should never be committed to version control
- Use environment variables for sensitive configuration
- Follow Aptos security best practices

## Support

- [Documentation](./docs/)
- [API Reference](./docs/api.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Discord Community](https://discord.gg/mintmark)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on [Aptos](https://aptos.dev/) blockchain
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [React](https://react.dev/) and [Vite](https://vitejs.dev/)
