import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { NETWORK } from './config';

export class WalletManager {
  private static instance: WalletManager;
  private wallet: MartianWallet;
  private _isConnected: boolean = false;
  private _address: string = '';

  private constructor() {
    this.wallet = new MartianWallet();
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.wallet.connect();
      const account = await this.wallet.account();
      this._address = account.address;
      this._isConnected = true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.wallet.disconnect();
      this._address = '';
      this._isConnected = false;
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

  public getWallet(): MartianWallet {
    return this.wallet;
  }
}