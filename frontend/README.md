# Mintmark Frontend - React Application

This is the frontend React application for the Mintmark POAP platform built with Vite, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 18+
- npm or yarn

## Project Structure

```
frontend/
├── src/
│   ├── blockchain/          # Blockchain integration
│   │   ├── config.ts       # Network and contract configuration
│   │   ├── ContractService.ts # Smart contract interactions
│   │   ├── mint.ts         # POAP minting functions
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── wallet.ts       # Wallet connection utilities
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── Footer.tsx     # Site footer
│   │   └── ...
│   ├── pages/             # Application pages
│   │   ├── Index.tsx      # Landing page
│   │   ├── CreateEvent.tsx # Event creation
│   │   ├── ExploreEvents.tsx # Event discovery
│   │   └── dashboard/     # Organization dashboard
│   ├── hooks/             # Custom React hooks
│   ├── services/          # External service integrations
│   └── lib/               # Utility functions
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` and update values:
   ```env
   VITE_APTOS_NETWORK=devnet
   VITE_CONTRACT_ADDRESS=0x...
   VITE_MODULE_NAME=platform
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Core Functionality
- **Wallet Integration**: Multi-wallet support (Petra, Martian, etc.)
- **Event Management**: Create and manage POAP events
- **POAP Minting**: Mint proof-of-attendance tokens
- **Organization Dashboard**: Manage events and participants
- **Event Discovery**: Browse and explore available events

### Technical Features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **React Router**: Client-side routing
- **Responsive Design**: Mobile-first approach
- **Error Boundaries**: Graceful error handling

## Blockchain Integration

### Wallet Connection
The app supports multiple Aptos wallets:
- Petra Wallet
- Martian Wallet
- Pontem Wallet
- Fewcha Wallet

### Smart Contract Interaction
All blockchain interactions are handled through:
- `ContractService.ts` - Main contract interface
- `config.ts` - Network and contract configuration
- `mint.ts` - POAP minting logic
- `wallet.ts` - Wallet utilities

## Environment Variables

```env
# Network Configuration
VITE_APTOS_NETWORK=devnet|testnet|mainnet
VITE_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1

# Contract Configuration
VITE_CONTRACT_ADDRESS=0x...
VITE_MODULE_NAME=platform

# Application Configuration
VITE_APP_NAME=Mintmark
VITE_APP_DESCRIPTION=Decentralized POAP Platform on Aptos
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables for Production
Set the following environment variables in your deployment platform:
- `VITE_APTOS_NETWORK`
- `VITE_CONTRACT_ADDRESS`
- `VITE_MODULE_NAME`
- `VITE_APTOS_NODE_URL`

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for code formatting
- Implement proper error handling

### Component Structure
- Use functional components with hooks
- Implement proper prop types
- Use custom hooks for complex logic
- Follow atomic design principles

### State Management
- Use React Context for global state
- Implement custom hooks for data fetching
- Use local state for component-specific data

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure wallet extension is installed
   - Check network configuration
   - Verify contract address is correct

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all imports are correct

3. **Network Issues**
   - Verify Aptos network is accessible
   - Check environment variables
   - Ensure contract is deployed

### Getting Help

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Aptos TypeScript SDK](https://aptos.dev/sdks/ts-sdk/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT License - see LICENSE file for details.