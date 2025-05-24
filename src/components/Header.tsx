
import React from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-400 rounded-sm"></div>
            <span className="text-xl font-bold text-white">MintMark</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Connect Wallet
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
