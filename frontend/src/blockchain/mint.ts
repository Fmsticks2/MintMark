import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { WalletManager } from './wallet';
import {
  CONTRACT_ADDRESS,
  MODULE_NAME,
  PLATFORM_FUNCTIONS,
  PROVIDER,
  TRANSACTION_TIMEOUT,
  TRANSACTION_POLLING_INTERVAL,
  ERROR_MESSAGES,
  PLATFORM_CONFIG
} from './config';
import { EventParams, POAPParams, TransactionResult } from './types';



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
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${PLATFORM_FUNCTIONS.INITIALIZE_PLATFORM}`,
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

export async function initializeEventPricing(): Promise<TransactionResult> {
  const payload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${PLATFORM_FUNCTIONS.INITIALIZE_EVENT_PRICING}`,
    type_arguments: [],
    arguments: [
          PLATFORM_CONFIG.EVENT_PRICING.INDIVIDUAL,
          PLATFORM_CONFIG.EVENT_PRICING.SMALL_ORG,
          PLATFORM_CONFIG.EVENT_PRICING.ENTERPRISE,
          PLATFORM_CONFIG.EVENT_PRICING.POAP_ADDON
        ]
  };
  return executeTransaction(payload);
}

export async function createEvent(params: EventParams): Promise<TransactionResult> {
  const payload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${PLATFORM_FUNCTIONS.CREATE_EVENT}`,
    type_arguments: [],
    arguments: [
      params.creator,
      params.name,
      params.organizationType,
      params.poapEnabled,
      params.maxAttendees,
      params.eventDate
    ]
  };
  return executeTransaction(payload);
}

export async function addParticipant(eventId: number, participant: string): Promise<TransactionResult> {
  const payload = {
    type: 'entry_function_payload',
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${PLATFORM_FUNCTIONS.ADD_PARTICIPANT}`,
    type_arguments: [],
    arguments: [eventId, participant]
  };
  return executeTransaction(payload);
}

export async function mintPOAP(params: POAPParams): Promise<TransactionResult> {
  const payload = {
    type: "entry_function_payload",
    function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${PLATFORM_FUNCTIONS.MINT_POAP}`,
    type_arguments: [],
    arguments: [params.participant, params.eventId, params.eventCreator]
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