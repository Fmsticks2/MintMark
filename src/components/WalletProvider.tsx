import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { FewchaWallet } from 'fewcha-plugin-wallet-adapter';
import { PontemWallet } from '@pontem/wallet-adapter-plugin';
import { RiseWallet } from '@rise-wallet/wallet-adapter';
import { MSafeWalletAdapter } from 'msafe-plugin-wallet-adapter';
import { PropsWithChildren } from 'react';

const wallets = [
  new MartianWallet(),
  new PetraWallet(),
  new FewchaWallet(),
  new PontemWallet(),
  new RiseWallet(),
  new MSafeWalletAdapter(),
];

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={false}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}