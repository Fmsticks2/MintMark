import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PropsWithChildren } from 'react';
import { Network } from '@aptos-labs/ts-sdk';

// Configure supported Aptos wallets - Using only Petra for now
// Petra is officially supported in the Aptos Wallet Adapter
const supportedWallets = ['Petra'] as const;

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      optInWallets={supportedWallets}  // Line 12 - No errors
      autoConnect={true}
      dappConfig={{
        network: Network.TESTNET
      }}
      onError={(error) => {
        console.error('Wallet connection error:', error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}