import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    // Mock wallet connection for demo purposes
    const mockAddress = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setAddress(mockAddress);
    setIsConnected(true);
    
    // Store in localStorage for persistence
    localStorage.setItem('ghosthire-wallet-connected', 'true');
    localStorage.setItem('ghosthire-wallet-address', mockAddress);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    localStorage.removeItem('ghosthire-wallet-connected');
    localStorage.removeItem('ghosthire-wallet-address');
  };

  useEffect(() => {
    // Check for existing connection on mount
    const wasConnected = localStorage.getItem('ghosthire-wallet-connected');
    const savedAddress = localStorage.getItem('ghosthire-wallet-address');
    
    if (wasConnected && savedAddress) {
      setIsConnected(true);
      setAddress(savedAddress);
    }
  }, []);

  const value: WalletContextType = {
    isConnected,
    address,
    connect,
    disconnect,
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
