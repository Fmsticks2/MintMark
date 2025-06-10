import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { ContractService, ContractTransactionResult, EventParams, POAPParams } from '../blockchain/ContractService';
import { ChainType, TransactionResult } from '../blockchain/types';
import { WalletManager } from '../blockchain/wallet';

/**
 * Hook for interacting with blockchain contracts across different chains
 */
export function useContractService() {
  const [activeChainType, setActiveChainType] = useState<ChainType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Aptos wallet hook
  const { connected: isAptosConnected } = useWallet();

  // Get wallet manager instance
  const walletManager = WalletManager.getInstance();

  // Update wallet manager and detect active chain type whenever wallet connection changes
  useEffect(() => {
    // Get the active chain type from the wallet manager
    const chainType = ContractService.getInstance().detectChainType();
    setActiveChainType(chainType);
  }, [isAptosConnected, walletManager]);

  /**
   * Initialize the platform
   */
  const initializePlatform = async (): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getInstance().initializePlatform();
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new event
   */
  const createEvent = async (params: EventParams): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getInstance().createEvent(params);
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mint a POAP token
   */
  const mintPOAP = async (params: POAPParams): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getInstance().mintPOAP(params);
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get platform configuration
   */
  const getPlatformConfig = async (): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getInstance().getPlatformConfig();
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get GUI token information
   */
  const getGUITokenInfo = async (): Promise<TransactionResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getInstance().getGUITokenInfo();
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeChainType,
    isLoading,
    error,
    initializePlatform,
    createEvent,
    mintPOAP,
    getPlatformConfig,
    getGUITokenInfo
  };
}