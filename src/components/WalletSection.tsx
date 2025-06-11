import React, { useState } from 'react';
import { Button } from './ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useContractService } from '../hooks/useContractService';
import { toast } from './ui/use-toast';

// Extend Window interface for Petra wallet
declare global {
  interface Window {
    aptos?: any;
  }
}

export function WalletSection() {
  const [isMinting, setIsMinting] = useState(false);
  
  // Aptos wallet hooks
  const { connect: connectAptos, disconnect: disconnectAptos, account, connected: isAptosConnected, wallet: aptosWallet } = useWallet();

  // Contract service hook
  const { activeChainType, mintPOAP, isLoading, error } = useContractService();

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

      // Check if wallet is installed
      if (typeof window !== 'undefined' && walletName === 'Petra') {
        if (!window.aptos) {
          toast({
            title: 'Wallet Not Found',
            description: 'Petra wallet is not installed. Please install it from the Chrome Web Store.',
            variant: 'destructive',
          });
          return;
        }
      }

      console.log('Connecting to wallet...');
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
        collectionAddr: '0x1',
        tokenName: 'Example POAP',
        tokenDescription: 'This is an example POAP token',
        tokenUri: 'https://example.com/token.json'
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
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Aptos Wallets</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => handleConnectAptos('Petra')}
              >
                Petra Wallet
              </Button>
            </div>
          </div>
          

        </div>
      )}
    </div>
  );
}