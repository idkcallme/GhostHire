import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import midnightClient from '../services/midnightClient';

// Define wallet info interface locally since it's not exported from midnightClient
interface MidnightWalletInfo {
  address: string;
  balance: number;
  connected: boolean;
}

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: number | null;
  isConnecting: boolean;
  networkStatus?: {
    connected: boolean;
    networkId: string;
    blockHeight?: number;
    nodeVersion?: string;
  };
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshNetworkStatus: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<{
    connected: boolean;
    networkId: string;
    blockHeight?: number;
    nodeVersion?: string;
  }>();

  const connect = async () => {
    setIsConnecting(true);
    
    try {
      console.log('🔗 Connecting to Midnight wallet...');
      
      // Use Midnight client to connect
      const walletInfo: MidnightWalletInfo = await midnightClient.connectWallet();
      
      // Get network status
      const networkStatus = await midnightClient.getNetworkStatus();
      
      setIsConnected(walletInfo.connected);
      setAddress(walletInfo.address);
      setBalance(walletInfo.balance);
      setNetworkStatus(networkStatus);
      
      // Store in localStorage for persistence
      localStorage.setItem('ghosthire-wallet-connected', 'true');
      localStorage.setItem('ghosthire-wallet-address', walletInfo.address);
      localStorage.setItem('ghosthire-wallet-balance', walletInfo.balance.toString());
      
      console.log('✅ Connected to Midnight wallet:', walletInfo.address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await midnightClient.disconnectWallet();
      
      setIsConnected(false);
      setAddress(null);
      setBalance(null);
      setNetworkStatus(undefined);
      
      // Clear persisted connection
      localStorage.removeItem('ghosthire-wallet-connected');
      localStorage.removeItem('ghosthire-wallet-address');
      localStorage.removeItem('ghosthire-wallet-balance');
      
      console.log('🔌 Disconnected from Midnight wallet');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const refreshNetworkStatus = async () => {
    try {
      const status = await midnightClient.getNetworkStatus();
      setNetworkStatus(status);
    } catch (error) {
      console.error('Failed to refresh network status:', error);
    }
  };

  useEffect(() => {
    // Check for existing connection on mount
    const wasConnected = localStorage.getItem('ghosthire-wallet-connected');
    const savedAddress = localStorage.getItem('ghosthire-wallet-address');
    const savedBalance = localStorage.getItem('ghosthire-wallet-balance');
    
    if (wasConnected && savedAddress) {
      setIsConnected(true);
      setAddress(savedAddress);
      if (savedBalance) {
        setBalance(parseInt(savedBalance));
      }
      
      // Refresh network status
      refreshNetworkStatus();
    }
  }, []);

  // Periodically refresh network status when connected
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshNetworkStatus, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const value: WalletContextType = {
    isConnected,
    address,
    balance,
    isConnecting,
    networkStatus,
    connect,
    disconnect,
    refreshNetworkStatus,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};