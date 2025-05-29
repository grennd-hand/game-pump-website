import {
  BaseMessageSignerWalletAdapter,
  WalletReadyState,
  WalletName,
  WalletConnectionError,
  WalletDisconnectedError,
  WalletError,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletPublicKeyError,
  WalletSignMessageError,
  WalletSignTransactionError,
} from '@solana/wallet-adapter-base';
import { PublicKey, Transaction } from '@solana/web3.js';

interface TokenPocketWallet {
  isTokenPocket?: boolean;
  solana?: {
    isTokenPocket?: boolean;
    connect(): Promise<{ publicKey: string }>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
    publicKey?: { toString(): string };
    isConnected?: boolean;
  };
}

interface TokenPocketWindow extends Window {
  tokenpocket?: TokenPocketWallet;
}

declare const window: TokenPocketWindow;

export interface TokenPocketWalletAdapterConfig {}

export const TokenPocketWalletName = 'TokenPocket' as WalletName<'TokenPocket'>;

export class TokenPocketWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = TokenPocketWalletName;
  url = 'https://www.tokenpocket.pro/';
  icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNTEyIDBDMjI5LjIzIDAgMCAyMjkuMjMgMCA1MTJDMCA3OTQuNzcgMjI5LjIzIDEwMjQgNTEyIDEwMjRDNzk0Ljc3IDEwMjQgMTAyNCA3OTQuNzcgMTAyNCA1MTJDMTI0IDIyOS4yMyA3OTQuNzcgMCA1MTIgMFoiIGZpbGw9IiMyOTgwRkYiLz4KPHBhdGggZD0iTTUxMiA5NjBDMjY0LjU4IDk2MCA2NCAyNTkuNDIgNjQgNTEyQzY0IDI2NC41OCAyNjQuNTggNjQgNTEyIDY0Qzc1OS40MiA2NCA5NjAgMjY0LjU4IDk2MCA1MTJDOTY0IDc1OS40MiA3NTkuNDIgOTYwIDUxMiA5NjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
  readonly supportedTransactionVersions = null;

  private _connecting: boolean;
  private _wallet: TokenPocketWallet['solana'] | null;
  private _publicKey: PublicKey | null;
  private _readyState: WalletReadyState =
    typeof window === 'undefined'
      ? WalletReadyState.Unsupported
      : WalletReadyState.Loadable;

  constructor(config: TokenPocketWalletAdapterConfig = {}) {
    super();
    this._connecting = false;
    this._wallet = null;
    this._publicKey = null;

    if (typeof window !== 'undefined' && window.tokenpocket?.solana) {
      this._wallet = window.tokenpocket.solana;
      this._readyState = WalletReadyState.Installed;
    }
  }

  get publicKey() {
    return this._publicKey;
  }

  get connecting() {
    return this._connecting;
  }

  get connected() {
    return !!this._wallet?.isConnected;
  }

  get readyState() {
    return this._readyState;
  }

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      if (this._readyState !== WalletReadyState.Installed) throw new WalletNotReadyError();

      this._connecting = true;

      const wallet = window.tokenpocket?.solana;
      if (!wallet) throw new WalletConnectionError('TokenPocket wallet not found');

      try {
        const response = await wallet.connect();
        this._wallet = wallet;
        this._publicKey = new PublicKey(response.publicKey);
      } catch (error: any) {
        throw new WalletConnectionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    if (wallet) {
      this._wallet = null;
      this._publicKey = null;

      try {
        await wallet.disconnect();
      } catch (error: any) {
        this.emit('error', new WalletDisconnectedError(error?.message, error));
      }
    }

    this.emit('disconnect');
  }

  async signTransaction<T extends Transaction>(transaction: T): Promise<T> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        return (await wallet.signTransaction(transaction)) as T;
      } catch (error: any) {
        throw new WalletSignTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signAllTransactions<T extends Transaction>(transactions: T[]): Promise<T[]> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        return (await wallet.signAllTransactions(transactions)) as T[];
      } catch (error: any) {
        throw new WalletSignTransactionError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    try {
      const wallet = this._wallet;
      if (!wallet) throw new WalletNotConnectedError();

      try {
        const { signature } = await wallet.signMessage(message);
        return signature;
      } catch (error: any) {
        throw new WalletSignMessageError(error?.message, error);
      }
    } catch (error: any) {
      this.emit('error', error);
      throw error;
    }
  }
}

export default TokenPocketWalletAdapter; 