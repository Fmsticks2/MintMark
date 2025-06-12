
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Award, FileText } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletManager } from '@/blockchain/wallet';
import { mintPOAP } from '@/blockchain/mint';
import { toast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const [isMinting, setIsMinting] = useState(false);
  const { account, connected: isAptosConnected } = useWallet();
  const walletManager = WalletManager.getInstance();

  const handleMint = async () => {
    if (!isAptosConnected || !account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setIsMinting(true);
    try {
      // Define POAP parameters with new interface
      const poapParams = {
        participant: account.address?.toString() || '',
        eventId: 1, // Demo event ID - in real app this would come from props or context
        eventCreator: account.address?.toString() || '' // Demo - would be actual event creator
      };
      
      const result = await mintPOAP(poapParams);
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
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Enterprise
          <span className="text-green-400"> Blockchain</span>
          <br />Certification Platform
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Empower your organization with secure, verifiable digital certificates on the blockchain. Issue, manage, and verify professional certifications with enterprise-grade security.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            asChild
          >
            <Link to="/dashboard">
              <Award className="mr-2 h-4 w-4" />
              Get Started
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white px-8 py-3"
            asChild
          >
            <Link to="/template-builder">
              <FileText className="mr-2 h-4 w-4" />
              View Templates
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
