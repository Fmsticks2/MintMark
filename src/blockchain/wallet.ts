import { AptosWalletAdapter, NetworkName, WalletName } from '@aptos-labs/wallet-adapter-react';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { NETWORK } from './config';

export class WalletManager {
  private static instance: WalletManager;
  private martianWallet: MartianWallet;
  private petraWallet: PetraWallet;
  private activeWallet?: MartianWallet | PetraWallet;
  private _isConnected: boolean = false;
  private _address: string = '';

  private constructor() {
    this.martianWallet = new MartianWallet();
    this.petraWallet = new PetraWallet();
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  public async connect(walletName: 'petra' | 'martian' = 'martian'): Promise<void> {
    try {
      this.activeWallet = walletName === 'petra' ? this.petraWallet : this.martianWallet;
      
      if (!this.activeWallet) {
        throw new Error('No wallet selected');
      }

      await this.activeWallet.connect();
      const account = await this.activeWallet.account();
      if (!account) {
        throw new Error('No account found after connection');
      }

      this._address = account.address;
      this._isConnected = true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      this._isConnected = false;
      this._address = '';
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.activeWallet && this._isConnected) {
        await this.activeWallet.disconnect();
        this._address = '';
        this._isConnected = false;
        this.activeWallet = undefined;
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public get address(): string {
    return this._address;
  }

  public getWallet(): MartianWallet | PetraWallet | undefined {
    return this.activeWallet;
  }
}