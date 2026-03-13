import { createContext, useContext, useState, type ReactNode } from 'react';
import { useSettings } from './SettingsContext';

export type DeliveryStatus = 'pending' | 'delivered';

export interface OrderItem {
  name: string;
  qty: number;
}

export interface DeliveryOrder {
  id: string;
  apartment: string;
  customerName: string;
  phoneNumber: string;
  items: OrderItem[];
  status: DeliveryStatus;
  deliveredAt?: string;
}

interface DeliveryContextType {
  deliveries: DeliveryOrder[];
  markAsDelivered: (orderId: string) => void;
}

const MOCK_DELIVERIES_DATA: DeliveryOrder[] = [
  { 
    id: '1', 
    apartment: '1º A', 
    customerName: 'Maria Silva', 
    phoneNumber: '+351912345678',
    items: [{ name: 'Pão', qty: 2 }], 
    status: 'pending' 
  },
  { 
    id: '2', 
    apartment: '1º B', 
    customerName: 'Carlos Santos', 
    phoneNumber: '+351912345679',
    items: [{ name: 'Pão', qty: 2 }, { name: 'Croissant', qty: 1 }], 
    status: 'pending' 
  },
  { 
    id: '3', 
    apartment: '2º A', 
    customerName: 'Ana Pereira', 
    phoneNumber: '+351912345680',
    items: [{ name: 'Regueifa', qty: 1 }], 
    status: 'pending' 
  },
  { 
    id: '4', 
    apartment: '3º B', 
    customerName: 'João Oliveira', 
    phoneNumber: '+351912345681',
    items: [{ name: 'Pão', qty: 2 }, { name: 'Croissant', qty: 1 }], 
    status: 'pending' 
  },
  { 
    id: '5', 
    apartment: '4º C', 
    customerName: 'Beatriz Costa', 
    phoneNumber: '+351912345682',
    items: [{ name: 'Pão', qty: 4 }], 
    status: 'pending' 
  },
];

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>(MOCK_DELIVERIES_DATA);
  const { whatsappTemplate } = useSettings();

  const markAsDelivered = (orderId: string) => {
    const now = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    
    setDeliveries(prev => prev.map(order => {
      if (order.id === orderId) {
        // Simulate WhatsApp Sending using template
        const message = whatsappTemplate.replace('{time}', now);
        console.log(`[WhatsApp API] Sending to ${order.phoneNumber}:`);
        console.log(message);
        
        return { ...order, status: 'delivered' as const, deliveredAt: now };
      }
      return order;
    }));
  };

  return (
    <DeliveryContext.Provider value={{ deliveries, markAsDelivered }}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDeliveries = () => {
  const context = useContext(DeliveryContext);
  if (!context) throw new Error('useDeliveries must be used within a DeliveryProvider');
  return context;
};
