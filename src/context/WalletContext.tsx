import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number; // positive = top-up, negative = deduction
  balance: number; // balance after transaction
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  topUp: (amount: number, description: string) => void;
  deduct: (amount: number, description: string) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2026-03-13', description: 'Carregamento via MBWAY', amount: 20.00, balance: 20.00 },
  { id: '2', date: '2026-03-11', description: 'Domingo – Regueifa', amount: -1.20, balance: 18.80 },
  { id: '3', date: '2026-03-10', description: 'Sábado – 2 Croissants', amount: -2.40, balance: 17.40 },
  { id: '4', date: '2026-03-09', description: 'Sexta – 2 Pães d\'Água', amount: -0.50, balance: 16.90 },
  { id: '5', date: '2026-03-08', description: 'Quinta – 2 Pães d\'Água', amount: -0.50, balance: 16.40 },
  { id: '6', date: '2026-03-07', description: 'Quarta – 2 Pães d\'Água', amount: -0.50, balance: 15.90 },
  { id: '7', date: '2026-03-06', description: 'Terça – 2 Pães d\'Água', amount: -0.50, balance: 15.40 },
  { id: '8', date: '2026-03-05', description: 'Segunda – 2 Pães d\'Água', amount: -0.50, balance: 14.90 },
  { id: '9', date: '2026-03-04', description: 'Domingo – Regueifa', amount: -1.20, balance: 13.70 },
  { id: '10', date: '2026-03-03', description: 'Sábado – 2 Croissants', amount: -2.40, balance: 12.40 },
];

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(12.40);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const topUp = (amount: number, description: string) => {
    const newBalance = parseFloat((balance + amount).toFixed(2));
    const tx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount,
      balance: newBalance,
    };
    setBalance(newBalance);
    setTransactions(prev => [tx, ...prev]);
  };

  const deduct = (amount: number, description: string) => {
    const newBalance = parseFloat((balance - amount).toFixed(2));
    const tx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount: -amount,
      balance: newBalance,
    };
    setBalance(newBalance);
    setTransactions(prev => [tx, ...prev]);
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, topUp, deduct }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
};
