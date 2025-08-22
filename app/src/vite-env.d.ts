/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIDNIGHT_RPC_URL: string
  readonly VITE_MIDNIGHT_NETWORK_ID: string
  readonly VITE_PROOF_PROVIDER_URL: string
  readonly VITE_JOB_BOARD_CONTRACT_ADDRESS: string
  readonly VITE_MIDNIGHT_NETWORK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    midnight?: MidnightWalletAPI;
  }
}

// Midnight wallet API interface
interface MidnightWalletAPI {
  request(args: { method: string; params?: any[] }): Promise<any>;
  signTransaction(transaction: any): Promise<any>;
  isConnected(): boolean;
  getAccount(): Promise<string>;
}

export {};
