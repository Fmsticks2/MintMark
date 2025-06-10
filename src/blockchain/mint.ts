import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { WalletManager } from './wallet';
import {
  CONTRACT_ADDRESS,
  MODULE_NAME,
  FUNCTIONS,
  PROVIDER,
  TRANSACTION_TIMEOUT,
  TRANSACTION_POLLING_INTERVAL,
  ERROR_MESSAGES,
  PLATFORM_CONFIG
} from './config';

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
  data?: Record<string, unknown>;
}

interface EventParams {
  name: string;
  description: string;
  uri: string;
  maxSupply: number;
}

interface POAPParams {
  collectionAddr: string;
  tokenName: string;
  tokenDescription: string;
  tokenUri: string;
}

class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionError';
  }
}

async function waitForTransaction(hash: string): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < TRANSACTION_TIMEOUT) {
    try {
      const txn = await PROVIDER.getTransactionByHash({ transactionHash: hash });
      if (txn && txn.type === 'user_transaction') {
        if ((txn as any).success) return;
        throw new TransactionError(ERROR_MESSAGES.TRANSACTION_FAILED);
      }
      await new Promise(resolve => setTimeout(resolve, TRANSACTION_POLLING_INTERVAL));
    } catch (error) {
      if (error instanceof TransactionError) throw error;
      // Transaction might not be available yet, continue polling
      await new Promise(resolve => setTimeout(resolve, TRANSACTION_POLLING_INTERVAL));
    }
  }
  throw new Error('Transaction timeout');
}

async function executeTransaction(payload: any): Promise<TransactionResult> {
  try {
    const walletManager = WalletManager.getInstance();
    
    if (!walletManager.isConnected) {
      throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
    }

    const wallet = walletManager.getWallet();
    const transaction = await wallet.signAndSubmitTransaction(payload);
    await waitForTransaction(transaction.hash);

    return {
      success: true,
      hash: transaction.hash
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.TRANSACTION_FAILED
    };
  }
}

export async function initializePlatform(): Promise<TransactionResult> {
  const payload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${FUNCTIONS.INITIALIZE_PLATFORM}`,
    type_arguments: [],
    arguments: [
      PLATFORM_CONFIG.MINTING_FEE,
      PLATFORM_CONFIG.ROYALTY_PERCENTAGE,
      PLATFORM_CONFIG.PREMIUM_THRESHOLD,
      PLATFORM_CONFIG.REWARD_RATE
    ]
  };
  return executeTransaction(payload);
}

export async function createEvent(params: EventParams): Promise<TransactionResult> {
  const payload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${FUNCTIONS.CREATE_EVENT}`,
    type_arguments: [],
    arguments: [
      params.name,
      params.description,
      params.uri,
      params.maxSupply
    ]
  };
  return executeTransaction(payload);
}

export async function mintPOAP(params: POAPParams): Promise<TransactionResult> {
  const payload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${FUNCTIONS.MINT_POAP}`,
    type_arguments: [],
    arguments: [
      params.collectionAddr,
      params.tokenName,
      params.tokenDescription,
      params.tokenUri
    ]
  };
  return executeTransaction(payload);
}

export async function getPlatformConfig(): Promise<TransactionResult> {
  try {
    const resource = await PROVIDER.getAccountResource({
      accountAddress: CONTRACT_ADDRESS,
      resourceType: `${CONTRACT_ADDRESS}::${MODULE_NAME}::PlatformConfig`
    });
    return {
      success: true,
      data: resource.data
    };
  } catch (error) {
    console.error('Failed to get platform config:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.NETWORK_ERROR
    };
  }
}

export async function getGUITokenInfo(): Promise<TransactionResult> {
  try {
    const resource = await PROVIDER.getAccountResource({
      accountAddress: CONTRACT_ADDRESS,
      resourceType: `${CONTRACT_ADDRESS}::${MODULE_NAME}::GUIToken`
    });
    return {
      success: true,
      data: resource.data
    };
  } catch (error) {
    console.error('Failed to get GUI token info:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.NETWORK_ERROR
    };
  }
}