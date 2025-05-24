import { Network, Provider } from "aptos";

export const NETWORK = import.meta.env.VITE_APTOS_NETWORK === 'mainnet' ? Network.MAINNET : Network.DEVNET;
export const NODE_URL = import.meta.env.VITE_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
export const PROVIDER = new Provider(NETWORK);

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x1";
export const MODULE_NAME = import.meta.env.VITE_MODULE_NAME || "mintmark";
export const FUNCTION_NAME = import.meta.env.VITE_FUNCTION_NAME || "mint";