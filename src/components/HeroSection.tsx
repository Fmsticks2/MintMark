
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WalletManager } from '@/blockchain/wallet';
import { mintPOAP } from '@/blockchain/mint';
import { toast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const [isMinting, setIsMinting] = useState(false);
  const walletManager = WalletManager.getInstance();

  const handleMint = async () => {
    if (!walletManager.isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="text-center z-10 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Mint Your <span className="text-green-400">POAP NFT</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Proof you showed up. One click away.
        </p>
        
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/25"
          onClick={handleMint}
          disabled={isMinting || !walletManager.isConnected}
        >
          {isMinting ? 'Minting...' : 'Mint POAP'}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
