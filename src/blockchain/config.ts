import { Network, Aptos, AptosConfig } from "@aptos-labs/ts-sdk";

// Network Configuration
export const NETWORK = import.meta.env.VITE_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.TESTNET;
export const NODE_URL = import.meta.env.VITE_APTOS_NODE_URL || "https://fullnode.testnet.aptoslabs.com/v1";
const aptosConfig = new AptosConfig({ network: NETWORK });
export const PROVIDER = new Aptos(aptosConfig);

// Contract Configuration
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x1";
export const MODULE_NAME = "platform";

// Platform Functions
export const FUNCTIONS = {
  INITIALIZE_PLATFORM: "initialize_platform",
  CREATE_EVENT: "create_event",
  MINT_POAP: "mint_poap",
  GET_PLATFORM_CONFIG: "get_platform_config",
  GET_GUI_TOKEN_INFO: "get_gui_token_info"
} as const;

// Platform Configuration
export const PLATFORM_CONFIG = {
  MINTING_FEE: 100, // GUI tokens
  ROYALTY_PERCENTAGE: 5, // 5%
  PREMIUM_THRESHOLD: 1000, // GUI tokens
  REWARD_RATE: 50 // GUI tokens
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