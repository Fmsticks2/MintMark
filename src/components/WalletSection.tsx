import React, { useState } from 'react';
import { Button } from './ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useContractService } from '../hooks/useContractService';
import { toast } from './ui/use-toast';

export function WalletSection() {
  const [isMinting, setIsMinting] = useState(false);
  
  // Aptos wallet hooks
  const { connect: connectAptos, disconnect: disconnectAptos, account, connected: isAptosConnected, wallet: aptosWallet } = useWallet();

  // Contract service hook
  const { activeChainType, mintPOAP, isLoading, error } = useContractService();

  // Handle Aptos wallet connection
  const handleConnectAptos = async (walletName: string) => {
    try {
      if (aptosWallet?.name === walletName && isAptosConnected) {
        toast({
          title: 'Already Connected',
          description: `Already connected to ${walletName}`,
        });
        return;
      }

      if (isAptosConnected) {
        await disconnectAptos();
      }

      await connectAptos(walletName);
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${account?.address}`,
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
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
                onClick={() => handleConnectAptos('Martian')}
              >
                Martian Wallet
              </Button>

            </div>
          </div>
          

        </div>
      )}
    </div>
  );
}