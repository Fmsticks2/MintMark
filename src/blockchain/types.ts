/**
 * Shared types for blockchain services
 * This file helps prevent circular dependencies between modules
 */

export enum ChainType {
  APTOS = 'aptos'
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
  data?: any;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: string;
}

export interface TokenBalance {
  balance: string;
  decimals: number;
}

export interface WalletInfo {
  address: string;
  chainType: ChainType;
  isConnected: boolean;
}