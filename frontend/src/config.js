// API configuration for different environments
const API_URLS = {
  development: 'http://localhost:3000',
  production: import.meta.env.VITE_API_URL || 'https://mintmark-backend.onrender.com',
  test: 'http://localhost:3000'
};

// Current environment
const ENV = import.meta.env.MODE || 'development';

// Export configuration
export const config = {
  apiUrl: API_URLS[ENV],
  appName: import.meta.env.VITE_APP_NAME || 'Mintmark',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Decentralized POAP Platform on Aptos',
  aptos: {
    network: import.meta.env.VITE_APTOS_NETWORK || 'devnet',
    nodeUrl: import.meta.env.VITE_APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com/v1',
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
    moduleName: import.meta.env.VITE_MODULE_NAME || 'platform'
  }
};

// API endpoints
export const endpoints = {
  health: `${config.apiUrl}/health`,
  config: `${config.apiUrl}/api/config`,
  deploy: `${config.apiUrl}/api/deploy`
};