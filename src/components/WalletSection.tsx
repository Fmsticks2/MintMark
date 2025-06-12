// Define WalletName type locally since it's no longer exported from wallet-adapter-react v6.1.0
type WalletName = string;

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useContractService } from '../hooks/useContractService';
import { toast } from './ui/use-toast';

// Extend Window interface for wallet detection
declare global {
  interface Window {
    aptos?: any;        // Petra wallet
    martian?: any;      // Martian wallet
    pontem?: any;       // Pontem wallet
  }
}

export function WalletSection() {
  const [isMinting, setIsMinting] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [isCheckingWallets, setIsCheckingWallets] = useState(true);
  
  // Aptos wallet hooks
  const { connect: connectAptos, disconnect: disconnectAptos, account, connected: isAptosConnected, wallet: aptosWallet } = useWallet();

  // Contract service hook
  const { activeChainType, mintPOAP, isLoading, error } = useContractService();

  // Check for available wallets on component mount
  useEffect(() => {
    const checkAvailableWallets = () => {
      const wallets: string[] = [];
      
      // Check for Petra wallet
      if (typeof window !== 'undefined' && window.aptos) {
        wallets.push('Petra');
      }
      
      // Check for Martian wallet
      if (typeof window !== 'undefined' && (window as any).martian) {
        wallets.push('Martian');
      }
      
      // Check for Pontem wallet
      if (typeof window !== 'undefined' && (window as any).pontem) {
        wallets.push('Pontem');
      }
      
      setAvailableWallets(wallets);
      setIsCheckingWallets(false);
      
      console.log('Available wallets detected:', wallets);
      
      // Auto-connect if only one wallet is available and user isn't connected
      if (wallets.length === 1 && !isAptosConnected) {
        console.log(`Auto-connecting to ${wallets[0]} wallet...`);
        setTimeout(() => {
          handleConnectAptos(wallets[0]);
        }, 500); // Small delay to ensure UI is ready
      }
    };
    
    // Check immediately
    checkAvailableWallets();
    
    // Also check after a short delay in case wallets load asynchronously
    const timer = setTimeout(checkAvailableWallets, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle Aptos wallet connection
  const handleConnectAptos = async (walletName: string) => {
    try {
      console.log(`Attempting to connect to ${walletName}...`);
      
      if (aptosWallet?.name === walletName && isAptosConnected) {
        toast({
          title: 'Already Connected',
          description: `Already connected to ${walletName}`,
        });
        return;
      }

      if (isAptosConnected) {
        console.log('Disconnecting existing wallet...');
        await disconnectAptos();
      }

      // Check if the specific wallet is installed
      if (typeof window !== 'undefined') {
        let walletAvailable = false;
        
        switch (walletName) {
          case 'Petra':
            walletAvailable = !!window.aptos;
            break;
          case 'Martian':
            walletAvailable = !!(window as any).martian;
            break;
          case 'Pontem':
            walletAvailable = !!(window as any).pontem;
            break;
        }
        
        if (!walletAvailable) {
          toast({
            title: 'Wallet Not Found',
            description: `${walletName} wallet is not installed. Please install it from the browser extension store.`,
            variant: 'destructive',
          });
          return;
        }
      }

      // Connect to the wallet
      await connectAptos(walletName);
      
      // Wait a moment for connection to establish
      setTimeout(() => {
        if (isAptosConnected && account) {
          toast({
            title: 'Wallet Connected',
            description: `Connected to ${account.address}`,
          });
        }
      }, 1000);
      
    } catch (error) {
      console.error('Connection error:', error);
      
      let errorMessage = 'Failed to connect wallet';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific error messages
        if (error.message.includes('User rejected')) {
          errorMessage = 'Connection was rejected by user';
        } else if (error.message.includes('not installed')) {
          errorMessage = 'Wallet is not installed';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network connection issue. Please check your internet connection.';
        }
      }
      
      toast({
        title: 'Connection Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  /**
   * Connect to a wallet
   */
  const handleConnectWallet = async (walletName: string) => {
    try {
      // Check if wallet is installed
      if (!isCheckingWallets) {
        let walletAvailable = false;
        
        switch(walletName.toLowerCase()) {
          case 'petra':
            walletAvailable = typeof window !== 'undefined' && !!window.aptos;
            break;
          case 'martian':
            walletAvailable = typeof window !== 'undefined' && !!(window as any).martian;
            break;
          case 'pontem':
            walletAvailable = typeof window !== 'undefined' && !!(window as any).pontem;
            break;
        }
        
        if (!walletAvailable) {
          toast({
            title: 'Wallet Not Found',
            description: `${walletName} wallet is not installed. Please install it from the browser extension store.`,
            variant: 'destructive',
          });
          return;
        }
      }

      console.log('Connecting to wallet...');
      // Use walletName directly as string
      await connectAptos(walletName);
      
      // Wait a moment for connection to establish
      setTimeout(() => {
        if (isAptosConnected && account) {
          toast({
            title: 'Wallet Connected',
            description: `Connected to ${account.address}`,
          });
        }
      }, 1000);
      
    } catch (error) {
      console.error('Connection error:', error);
      
      let errorMessage = 'Failed to connect wallet';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more specific error messages
        if (error.message.includes('User rejected')) {
          errorMessage = 'Connection was rejected by user';
        } else if (error.message.includes('not installed')) {
          errorMessage = 'Petra wallet is not installed';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network connection issue. Please check your internet connection.';
        }
      }
      
      toast({
        title: 'Connection Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      if (isAptosConnected) {
        await disconnectAptos();
      }
      
      toast({
        title: 'Wallet Disconnected',
        description: 'Successfully disconnected wallet',
      });
    } catch (error) {
      toast({
        title: 'Disconnection Failed',
        description: error instanceof Error ? error.message : 'Failed to disconnect wallet',
        variant: 'destructive',
      });
    }
  };

  // Handle POAP minting
  const handleMint = async () => {
    setIsMinting(true);
    try {
      // Example POAP parameters - these would come from a form or props in a real app
      const result = await mintPOAP({
        participant: account.address?.toString() || '',
        eventId: 1, // Demo event ID
        eventCreator: account.address?.toString() || '' // Demo event creator
      });
      
      if (result.success) {
        toast({
          title: 'POAP Minted!',
          description: `Transaction hash: ${result.hash}`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Minting Failed',
        description: error instanceof Error ? error.message : 'Failed to mint POAP',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  };

  // Determine if any wallet is connected
  const isConnected = isAptosConnected;

  // Get the connected address
  const connectedAddress = isAptosConnected ? account?.address?.toString() : null;

  // Get the wallet name
  const walletName = isAptosConnected ? aptosWallet?.name : 'No Wallet';

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg border">
      <h2 className="text-2xl font-bold">Wallet Connection</h2>
      
      {isConnected && connectedAddress ? (
        <>
          <p className="text-sm text-gray-500">
            Connected: {connectedAddress}
          </p>
          <p className="text-sm text-gray-500">
            Using: {walletName}
          </p>
          <p className="text-sm text-gray-500">
            Chain Type: Aptos
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </Button>
            <Button
              onClick={handleMint}
              disabled={isMinting || isLoading}
            >
              {isMinting || isLoading ? 'Processing...' : 'Mint POAP'}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          {isCheckingWallets ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Detecting wallets...</span>
            </div>
          ) : availableWallets.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Available Aptos Wallets</h3>
              <div className="flex flex-wrap gap-2">
                {availableWallets.map((wallet) => (
                  <Button
                    key={wallet}
                    variant="outline"
                    onClick={() => handleConnectAptos(wallet)}
                    className="flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {wallet} Wallet
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                ✓ {availableWallets.length} wallet{availableWallets.length > 1 ? 's' : ''} detected
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center text-center">
              <div className="text-yellow-600">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">No Wallets Detected</h3>
              <p className="text-sm text-gray-500 max-w-md">
                No Aptos wallets found. Please install one of the following:
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <a 
                  href="https://petra.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  📱 Petra Wallet (Recommended)
                </a>
                <a 
                  href="https://martianwallet.xyz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  🚀 Martian Wallet
                </a>
                <a 
                  href="https://pontem.network/pontem-wallet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  🌊 Pontem Wallet
                </a>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                🔄 Refresh After Installation
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}