import React, { useState } from 'react';
import { Button } from './ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { mintPOAP } from '../blockchain/mint';
import { toast } from './ui/use-toast';

export function WalletSection() {
  const [isMinting, setIsMinting] = useState(false);
  const { connect, disconnect, account, connected, wallet } = useWallet();

  const handleConnect = async (walletName: string) => {
    try {
      if (wallet?.name === walletName && connected) {
        toast({
          title: 'Already Connected',
          description: `Already connected to ${walletName}`,
        });
        return;
      }

      if (connected) {
        await disconnect();
      }

      await connect(walletName);
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

  const handleDisconnect = async () => {
    try {
      await disconnect();
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
      
      {connected && account ? (
        <>
          <p className="text-sm text-gray-500">
            Connected: {account.address}
          </p>
          <p className="text-sm text-gray-500">
            Using: {wallet?.name}
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
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => handleConnect('Martian')}
            >
              Martian Wallet
            </Button>
            <Button
              variant="outline"
              onClick={() => handleConnect('Petra')}
            >
              Petra Wallet
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}