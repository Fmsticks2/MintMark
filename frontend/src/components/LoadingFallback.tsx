import React from 'react';
import { Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingFallbackProps {
  type?: 'page' | 'component' | 'wallet' | 'network';
  message?: string;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  type = 'page',
  message,
  error,
  onRetry,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return error ? <WifiOff className="h-8 w-8 text-red-500" /> : <Wifi className="h-8 w-8 text-blue-500" />;
      case 'wallet':
        return <Loader2 className="h-8 w-8 animate-spin text-purple-500" />;
      default:
        return error ? <AlertCircle className="h-8 w-8 text-red-500" /> : <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
    }
  };

  const getDefaultMessage = () => {
    if (error) return 'Something went wrong';
    
    switch (type) {
      case 'wallet':
        return 'Connecting to wallet...';
      case 'network':
        return 'Connecting to network...';
      case 'component':
        return 'Loading component...';
      default:
        return 'Loading...';
    }
  };

  const containerClass = type === 'page' 
    ? 'min-h-screen bg-gray-900 flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {message || getDefaultMessage()}
        </h3>
        
        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}
        
        {!error && type !== 'wallet' && (
          <p className="text-gray-400 text-sm mb-4">
            Please wait while we load the content...
          </p>
        )}
        
        {error && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        )}
        
        {/* Loading animation dots */}
        {!error && (
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Specialized loading components
export const PageLoadingFallback: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingFallback type="page" message={message} />
);

export const ComponentLoadingFallback: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingFallback type="component" message={message} />
);

export const WalletLoadingFallback: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingFallback type="wallet" message={message} />
);

export const NetworkLoadingFallback: React.FC<{ message?: string; error?: string; onRetry?: () => void }> = ({ message, error, onRetry }) => (
  <LoadingFallback type="network" message={message} error={error} onRetry={onRetry} />
);

export default LoadingFallback;