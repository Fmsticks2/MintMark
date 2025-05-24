import React, { useState } from 'react';
import { Button } from './ui/button';
import { WalletManager } from '../blockchain/wallet';
import { mintPOAP } from '../blockchain/mint';
import { toast } from './ui/use-toast';

export function WalletSection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const walletManager = WalletManager.getInstance();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await walletManager.connect();
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${walletManager.address}`,
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await walletManager.disconnect();
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

  const handleMint = async () => {
    setIsMinting(true);
    try {
      const result = await mintPOAP();
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

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg border">
      <h2 className="text-2xl font-bold">Wallet Connection</h2>
      
      {walletManager.isConnected ? (
        <>
          <p className="text-sm text-gray-500">
            Connected: {walletManager.address}
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
              disabled={isMinting}
            >
              {isMinting ? 'Minting...' : 'Mint POAP'}
            </Button>
          </div>
        </>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}