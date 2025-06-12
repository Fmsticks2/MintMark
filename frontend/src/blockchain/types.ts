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
  balance: TokenBalance[];
  chainType: ChainType;
}

// Event-related interfaces
export interface EventParams {
  creator: string;
  name: string;
  organizationType: number; // 0=individual, 1=small_org, 2=enterprise
  poapEnabled: boolean;
  maxAttendees: number;
  eventDate: number; // timestamp
}

export interface POAPParams {
  participant: string;
  eventId: number;
  eventCreator: string;
}

export interface EventPricing {
  individualFee: number;
  smallOrgFee: number;
  enterpriseFee: number;
  poapAddonFee: number;
}

export interface EventData {
  id: number;
  name: string;
  organizer: string;
  organizationType: number;
  poapEnabled: boolean;
  maxAttendees: number;
  createdAt: number;
  eventDate: number;
  totalFeePaid: number;
  participants: string[];
}



// Contract transaction result interface
export interface ContractTransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  message: string;
}

export interface Organization {
  id: number;
  name: string;
  admin: string;
  isVerified: boolean;
  createdAt: number;
  templateCount: number;
  certificatesIssued: number;
  certificatesRevoked: number;
}

export interface PlatformConfig {
  mintingFee: number;
  royaltyPercentage: number;
  premiumThreshold: number;
  rewardRate: number;
  isInitialized: boolean;
}

// Organization types enum
export enum OrganizationType {
  INDIVIDUAL = 0,
  SMALL_ORG = 1,
  ENTERPRISE = 2
}

// Error codes from smart contract
export enum ContractErrorCodes {
  EINSUFFICIENT_GUI_BALANCE = 1,
  EPLATFORM_ALREADY_INITIALIZED = 2,
  EPLATFORM_NOT_INITIALIZED = 3,
  EINVALID_PREMIUM_THRESHOLD = 4,
  EINVALID_ROYALTY_PERCENTAGE = 5,
  EUNAUTHORIZED_ORGANIZATION = 6,
  ECERTIFICATE_TEMPLATE_NOT_FOUND = 7,
  ERECIPIENT_ALREADY_CERTIFIED = 8,
  EINVALID_CERTIFICATE_STATUS = 9,
  EPOAP_NOT_ENABLED = 10,
  EINVALID_EVENT_ID = 11,
  EPARTICIPANT_NOT_REGISTERED = 12,
  EPRICING_ALREADY_INITIALIZED = 13,
  EINVALID_ORGANIZATION_TYPE = 14
}