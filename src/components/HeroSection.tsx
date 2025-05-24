
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
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
        >
          Connect Wallet
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
