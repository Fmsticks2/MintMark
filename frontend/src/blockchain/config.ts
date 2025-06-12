import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Network Configuration
export const NETWORK = import.meta.env.VITE_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : 
  import.meta.env.VITE_APTOS_NETWORK === 'testnet' ? Network.TESTNET : Network.DEVNET;
export const NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com/v1";
const aptosConfig = new AptosConfig({ network: NETWORK });
export const PROVIDER = new Aptos(aptosConfig);

// Contract Configuration
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x69a158813efb20d7f134294ae114184cf6a12269a52106cb5e1d471e4761e4db";
export const MODULE_NAME = import.meta.env.VITE_MODULE_NAME || "platform";

// Platform Functions
export const PLATFORM_FUNCTIONS = {
  INITIALIZE_PLATFORM: 'initialize_platform',
  INITIALIZE_EVENT_PRICING: 'initialize_event_pricing',
  REGISTER_ORGANIZATION: 'register_organization',
  CREATE_EVENT: 'create_event',
  MINT_POAP: 'mint_poap',
  ADD_PARTICIPANT: 'add_participant',
  GET_PLATFORM_CONFIG: 'get_platform_config',
  GET_GUI_TOKEN_INFO: 'get_gui_token_info',
  GET_EVENT_PRICING: 'get_event_pricing',
  GET_EVENT: 'get_event',
} as const;

// Platform Configuration
export const PLATFORM_CONFIG = {
  MINTING_FEE: 100, // GUI tokens
  ROYALTY_PERCENTAGE: 5, // 5%
  PREMIUM_THRESHOLD: 1000, // GUI tokens
  REWARD_RATE: 50, // GUI tokens
  
  // Organization Event Creation Pricing (in USD)
  EVENT_PRICING: {
    INDIVIDUAL: 0,
    SMALL_ORG: 25,
    ENTERPRISE: 100,
    POAP_ADDON: 15
  },
  
  // Subscription Pricing (updated to $10)
  SUBSCRIPTION_PRICING: {
    STARTER: 0,
    PROFESSIONAL: 10, // Updated from $79 to $10
    ENTERPRISE: 199
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: "Insufficient GUI token balance",
  UNAUTHORIZED: "Unauthorized operation",
  COLLECTION_NOT_INITIALIZED: "Collection not initialized",
  TOKEN_ALREADY_MINTED: "Token already minted",
  INVALID_FEE: "Invalid fee percentage",
  TRANSACTION_FAILED: "Transaction failed",
  NETWORK_ERROR: "Network error",
  WALLET_NOT_CONNECTED: "Wallet not connected"
} as const;

// Transaction Monitoring
export const TRANSACTION_TIMEOUT = 30000; // 30 seconds
export const TRANSACTION_POLLING_INTERVAL = 1000; // 1 second