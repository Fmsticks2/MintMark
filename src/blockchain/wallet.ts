import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { NETWORK } from './config';
import { ChainType } from './types';

type AptosWallet = MartianWallet | PetraWallet;

export class WalletManager {
  private static instance: WalletManager;
  private aptosWallets: Map<string, AptosWallet>;
  private activeAptosWallet?: AptosWallet;
  private _isAptosConnected: boolean = false;
  private _aptosAddress: string = '';
  private _activeChainType: ChainType | null = null;

  private constructor() {
    this.aptosWallets = new Map<string, AptosWallet>([
      ['martian', new MartianWallet()],
      ['petra', new PetraWallet()]
    ]);
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  /**
   * Connect to an Aptos wallet
   */
  public async connectAptos(walletName: string = 'martian'): Promise<void> {
    try {
      this.activeAptosWallet = this.aptosWallets.get(walletName);
      
      if (!this.activeAptosWallet) {
        throw new Error('No wallet selected');
      }

      await this.activeAptosWallet.connect();
      const account = await this.activeAptosWallet.account();
      if (!account) {
        throw new Error('No account found after connection');
      }

      this._aptosAddress = account.address;
      this._isAptosConnected = true;
      this._activeChainType = ChainType.APTOS;
    } catch (error) {
      console.error('Failed to connect Aptos wallet:', error);
      this._isAptosConnected = false;
      this._aptosAddress = '';
      this._activeChainType = null;
      throw error;
    }
  }

  /**
   * Disconnect from Aptos wallet
   */
  public async disconnectAptos(): Promise<void> {
    try {
      if (this.activeAptosWallet && this._isAptosConnected) {
        await this.activeAptosWallet.disconnect();
        this._aptosAddress = '';
        this._isAptosConnected = false;
        this.activeAptosWallet = undefined;
        if (this._activeChainType === ChainType.APTOS) {
          this._activeChainType = null;
        }
      }
    } catch (error) {
      console.error('Failed to disconnect Aptos wallet:', error);
      throw error;
    }
  }



  /**
   * Get active chain type
   */
  public get activeChainType(): ChainType | null {
    return this._activeChainType;
  }

  /**
   * Check if Aptos wallet is connected
   */
  public get isAptosConnected(): boolean {
    return this._isAptosConnected;
  }

  /**
   * Get Aptos wallet address
   */
  public get aptosAddress(): string {
    return this._aptosAddress;
  }

  /**
   * Get active Aptos wallet
   */
  public getAptosWallet(): AptosWallet | undefined {
    return this.activeAptosWallet;
  }

  // Legacy compatibility methods
  public get isConnected(): boolean {
    return this._isAptosConnected;
  }

  public get address(): string {
    return this._aptosAddress;
  }

  public getWallet(): AptosWallet | undefined {
    return this.activeAptosWallet;
  }

  /**
   * Legacy connect method - defaults to martian wallet
   */
  public async connect(walletName: string = 'martian'): Promise<void> {
    return this.connectAptos(walletName);
  }

  /**
   * Legacy disconnect method
   */
  public async disconnect(): Promise<void> {
    return this.disconnectAptos();
  }
}