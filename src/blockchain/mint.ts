import { Types } from 'aptos';
import { WalletManager } from './wallet';
import { CONTRACT_ADDRESS, MODULE_NAME, FUNCTION_NAME, PROVIDER } from './config';

export interface MintResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export async function mintPOAP(): Promise<MintResult> {
  try {
    const walletManager = WalletManager.getInstance();
    
    if (!walletManager.isConnected) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    const wallet = walletManager.getWallet();
    
    const payload: Types.TransactionPayload = {
      type: 'entry_function_payload',
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${FUNCTION_NAME}`,
      type_arguments: [],
      arguments: []
    };

    const transaction = await wallet.signAndSubmitTransaction(payload);
    await PROVIDER.waitForTransaction(transaction.hash);

    return {
      success: true,
      hash: transaction.hash
    };
  } catch (error) {
    console.error('Failed to mint POAP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}