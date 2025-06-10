
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WalletManager } from '@/blockchain/wallet';
import { toast } from '@/components/ui/use-toast';

export const Header = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const walletManager = WalletManager.getInstance();

  const handleWalletAction = async () => {
    if (walletManager.isConnected) {
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
    } else {
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
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-400 rounded-sm"></div>
            <span className="text-xl font-bold text-white">MintMark</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/template-builder" className="text-gray-300 hover:text-white transition-colors">
              Templates
            </Link>
            <Link to="/recipient-management" className="text-gray-300 hover:text-white transition-colors">
              Recipients
            </Link>
            <Link to="/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <Link to="/explore-events" className="text-gray-300 hover:text-white transition-colors">
              Explore Events
            </Link>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={handleWalletAction}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : walletManager.isConnected ? `${walletManager.address.slice(0, 6)}...${walletManager.address.slice(-4)}` : 'Connect Wallet'}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
