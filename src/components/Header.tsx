
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WalletManager } from '@/blockchain/wallet';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const walletManager = WalletManager.getInstance();

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/template-builder', label: 'Templates' },
    { path: '/recipient-management', label: 'Recipients' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/explore-events', label: 'Explore Events' },
  ];

  const isActivePage = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "relative px-3 py-2 rounded-lg transition-all duration-300";
    if (isActivePage(path)) {
      return `${baseClasses} text-white bg-green-500/20 shadow-lg shadow-green-500/25 border border-green-500/30`;
    }
    return `${baseClasses} text-gray-300 hover:text-white hover:bg-gray-800/50`;
  };

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
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-300 to-green-500 rounded-lg shadow-lg"></div>
              <span className="text-xl font-bold text-white">MintMark</span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={item.path} 
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActivePage(item.path)
                      ? 'text-white bg-green-500/20 shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {item.label}
                  {isActivePage(item.path) && (
                    <motion.div
                      className="absolute inset-0 bg-green-500/20 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            
            {/* Wallet Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ml-4"
                onClick={handleWalletAction}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : walletManager.isConnected ? `${walletManager.address.slice(0, 6)}...${walletManager.address.slice(-4)}` : 'Connect Wallet'}
              </Button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`lg:hidden overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } transition-all duration-300 ease-in-out`}
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
        >
          <nav className="pt-4 pb-2 space-y-2">
            {navigationItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActivePage(item.path)
                      ? 'text-white bg-green-500/20 shadow-lg border-l-4 border-green-500'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            
            {/* Mobile Wallet Button */}
            <motion.div
              className="pt-4"
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 shadow-lg"
                onClick={handleWalletAction}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : walletManager.isConnected ? `${walletManager.address.slice(0, 6)}...${walletManager.address.slice(-4)}` : 'Connect Wallet'}
              </Button>
            </motion.div>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
};
