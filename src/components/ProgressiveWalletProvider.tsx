import React, { createContext, useContext, useState, useCallback, ReactNode, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';

// Lazy load wallet providers to reduce initial bundle size
const WalletProvider = lazy(() => import('./WalletProvider').then(module => ({ default: module.WalletProvider })));
const MultiWalletProvider = lazy(() => import('./MultiWalletProvider').then(module => ({ default: module.MultiWalletProvider })));

interface WalletContextType {
  isWalletEnabled: boolean;
  enableWallet: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a ProgressiveWalletProvider');
  }
  return context;
};

interface ProgressiveWalletProviderProps {
  children: ReactNode;
}

// Loading component for wallet initialization
const WalletLoadingFallback = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-3">
      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      <span className="text-white">Initializing wallet services...</span>
    </div>
  </div>
);

export const ProgressiveWalletProvider: React.FC<ProgressiveWalletProviderProps> = ({ children }) => {
  const [isWalletEnabled, setIsWalletEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const enableWallet = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate wallet initialization delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsWalletEnabled(true);
    setIsLoading(false);
  }, []);

  const contextValue: WalletContextType = {
    isWalletEnabled,
    enableWallet,
    isLoading
  };

  if (isWalletEnabled) {
    return (
      <WalletContext.Provider value={contextValue}>
        <Suspense fallback={<WalletLoadingFallback />}>
          <WalletProvider>
            <MultiWalletProvider>
              {children}
            </MultiWalletProvider>
          </WalletProvider>
        </Suspense>
      </WalletContext.Provider>
    );
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Component to trigger wallet loading
export const WalletTrigger: React.FC<{ className?: string }> = ({ className }) => {
  const { enableWallet, isLoading, isWalletEnabled } = useWallet();

  if (isWalletEnabled) {
    return null;
  }

  return (
    <Button
      onClick={enableWallet}
      disabled={isLoading}
      className={className}
      variant="outline"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Wallet...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Enable Wallet
        </>
      )}
    </Button>
  );
};

export default ProgressiveWalletProvider;