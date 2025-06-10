// Types import removed - using newer @aptos-labs/ts-sdk structure
import { WalletManager } from './wallet';
import { ChainType, TransactionResult, TokenInfo, TokenBalance } from './types';
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

export interface ContractTransactionResult extends TransactionResult {
  data?: Record<string, unknown>;
}

export interface EventParams {
  name: string;
  description: string;
  uri: string;
  maxSupply: number;
}

export interface POAPParams {
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

/**
 * ContractService class to handle interactions with Aptos smart contracts
 */
export class ContractService {
  private static instance: ContractService;
  private walletManager: WalletManager;

  private constructor() {
    this.walletManager = WalletManager.getInstance();
  }

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  /**
   * Detects the active chain type based on connected wallets
   */
  public detectChainType(): ChainType | null {
    return this.walletManager.activeChainType;
  }

  /**
   * Waits for an Aptos transaction to complete
   */
  private async waitForAptosTransaction(hash: string): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < TRANSACTION_TIMEOUT) {
      try {
        const txn = await PROVIDER.getTransactionByHash({ transactionHash: hash });
        if (txn.type === 'user_transaction') {
          if ((txn as any).success) return;
          throw new TransactionError(ERROR_MESSAGES.TRANSACTION_FAILED);
        }
        await new Promise(resolve => setTimeout(resolve, TRANSACTION_POLLING_INTERVAL));
      } catch (error) {
        if (error instanceof TransactionError) throw error;
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
    }
    throw new Error('Transaction timeout');
  }

  /**
   * Executes a transaction on the Aptos blockchain
   */
  private async executeAptosTransaction(payload: any): Promise<TransactionResult> {
    try {
      if (!this.walletManager.isAptosConnected) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      }

      const wallet = this.walletManager.getAptosWallet();
      const transaction = await wallet.signAndSubmitTransaction(payload);
      await this.waitForAptosTransaction(transaction.hash);

      return {
        success: true,
        hash: transaction.hash
      };
    } catch (error) {
      console.error('Aptos transaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.TRANSACTION_FAILED
      };
    }
  }



  /**
   * Initializes the platform
   */
  public async initializePlatform(): Promise<TransactionResult> {
    // Get the active chain type
    const activeChainType = this.detectChainType();

    if (activeChainType === ChainType.APTOS) {
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
      return this.executeAptosTransaction(payload);
    } else {
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_NOT_CONNECTED
      };
    }
  }

  /**
   * Creates a new event
   */
  public async createEvent(params: EventParams): Promise<TransactionResult> {
    // Get the active chain type
    const activeChainType = this.detectChainType();

    if (activeChainType === ChainType.APTOS) {
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
      return this.executeAptosTransaction(payload);
    } else {
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_NOT_CONNECTED
      };
    }
  }

  /**
   * Mints a POAP token
   */
  public async mintPOAP(params: POAPParams): Promise<TransactionResult> {
    // Get the active chain type
    const activeChainType = this.detectChainType();

    if (activeChainType === ChainType.APTOS) {
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
      return this.executeAptosTransaction(payload);
    } else {
      return {
        success: false,
        error: ERROR_MESSAGES.WALLET_NOT_CONNECTED
      };
    }
  }

  /**
   * Gets platform configuration
   */
  public async getPlatformConfig(): Promise<TransactionResult> {
    try {
      // Get platform configuration from Aptos contract
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

  /**
   * Gets GUI token information
   */
  public async getGUITokenInfo(): Promise<TransactionResult> {
    try {
      // Get GUI token information from Aptos contract
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
}

// Note: Singleton instance should be created lazily to avoid circular dependency issues
// Use ContractService.getInstance() instead of a pre-exported instance