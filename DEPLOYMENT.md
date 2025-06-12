# Mintmark Deployment Guide

This document provides instructions for deploying the Mintmark application to various platforms.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Aptos CLI (for contract deployment)
- Git

## Backend Deployment (Render)

### Manual Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `mintmark-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

4. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or your preferred port)
   - `APTOS_NETWORK`: `devnet`, `testnet`, or `mainnet`
   - `APTOS_NODE_URL`: The Aptos node URL for your selected network
   - `CONTRACT_ADDRESS`: Your deployed contract address
   - `MODULE_NAME`: `platform` (or your module name)
   - `DEVNET_PRIVATE_KEY`: Your Aptos account private key for devnet (if using devnet)
   - `TESTNET_PRIVATE_KEY`: Your Aptos account private key for testnet (if using testnet)
   - `MAINNET_PRIVATE_KEY`: Your Aptos account private key for mainnet (if using mainnet)

5. Click "Create Web Service"

### Using render.yaml (Recommended)

1. Push the `render.yaml` file to your repository
2. Go to the Render Dashboard and click "Blueprint" to create a new blueprint
3. Connect your repository and follow the prompts
4. Configure the environment variables as needed

## Frontend Deployment

### Render

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `mintmark-frontend` (or your preferred name)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add the following environment variables:
   - `VITE_APTOS_NETWORK`: `devnet`, `testnet`, or `mainnet`
   - `VITE_APTOS_NODE_URL`: The Aptos node URL for your selected network
   - `VITE_CONTRACT_ADDRESS`: Your deployed contract address
   - `VITE_MODULE_NAME`: `platform` (or your module name)
   - `VITE_APP_NAME`: `Mintmark`
   - `VITE_APP_DESCRIPTION`: `Decentralized POAP Platform on Aptos`
   - `VITE_API_URL`: Your backend API URL (e.g., `https://mintmark-backend.onrender.com`)

5. Click "Create Static Site"

### Netlify

1. Push the `netlify.toml` file to your repository
2. Create a new site on Netlify
3. Connect your GitHub repository
4. Configure the build settings (should be auto-detected from netlify.toml)
5. Add the environment variables as listed above
6. Click "Deploy site"

### Vercel

1. Push the `vercel.json` file to your repository
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Configure the build settings (should be auto-detected from vercel.json)
5. Add the environment variables as listed above
6. Click "Deploy"

## Important Notes

### Dependency Resolution

To resolve the version conflict between `@aptos-labs/ts-sdk` and `@aptos-labs/wallet-adapter-core`, we've standardized on using `@aptos-labs/ts-sdk@1.33.1` across the project. This ensures compatibility with `@aptos-labs/wallet-adapter-core` which requires `ts-sdk@^1.33.1`.

If you need to use features from `@aptos-labs/ts-sdk@2.0.1` in the future, you have two options:

1. Use the `--legacy-peer-deps` flag during installation:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Wait for `@aptos-labs/wallet-adapter-core` to be updated to support the newer version of the SDK.

### Private Keys

Never commit private keys to your repository. Always use environment variables for sensitive information.

### CORS Configuration

The backend server is configured to allow cross-origin requests. If you need to restrict this, modify the CORS settings in `server.js`.

### Network Selection

Make sure both frontend and backend are configured to use the same Aptos network (devnet, testnet, or mainnet).

### Contract Deployment

Before deploying the application, make sure your smart contract is deployed to the Aptos blockchain. Use the following command:

```bash
cd backend
npm run deploy:devnet  # or deploy:testnet, deploy:mainnet
```

### Continuous Deployment

All platforms support continuous deployment. When you push changes to your repository, your application will be automatically rebuilt and deployed.