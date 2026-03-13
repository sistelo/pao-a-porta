import { useMemo } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useDeliveries } from '../context/DeliveryContext';
import { useWallet } from '../context/WalletContext';
import { useCutoff } from './useCutoff';

// Maps delivery item names (from DeliveryContext) to product names (from ProductsContext)
// This handles partial / shorthand matches (e.g. "Pão" → "Pão d'Água")
const matchProductByName = (itemName: string, products: ReturnType<typeof useProducts>['products']) => {
  const lower = itemName.toLowerCase().trim();
  return products.find(p => p.name.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase().split(' ')[0]));
};

const PT_WEEKDAY_SHORT: Record<number, string> = {
  0: 'Domingo', 1: 'Segunda-feira', 2: 'Terça-feira',
  3: 'Quarta-feira', 4: 'Quinta-feira', 5: 'Sexta-feira', 6: 'Sábado',
};

export interface NextCharge {
  amount: number;            // total €
  dateLabel: string;         // e.g. "Amanhã (Terça-feira)"
  isoDate: string;           // YYYY-MM-DD
  items: { name: string; qty: number; unitPrice: number; total: number }[];
  isInsufficient: boolean;   // balance < amount
  isTomorrowLocked: boolean; // past cutoff
}

/**
 * Computes the next delivery charge for the current logged-in customer.
 * 
 * Because user plan/custom schedule isn't fully wired to a real subscription model yet,
 * this hook reads from the delivery orders (DeliveryContext) and matches "João Oliveira"
 * (customer at 3º B) as the representative customer. In a real app you'd use
 * the currentUser's ID to find their order.
 */
export const useNextCharge = (): NextCharge => {
  const { products } = useProducts();
  const { deliveries } = useDeliveries();
  const { balance } = useWallet();
  const { isTomorrowLocked } = useCutoff();

  return useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekdayName = PT_WEEKDAY_SHORT[tomorrow.getDay()];
    const dateLabel = `Amanhã (${weekdayName})`;
    const isoDate = tomorrow.toISOString().split('T')[0];

    // Find customer's delivery order — João Oliveira / 3º B
    // In a real app this would be: deliveries.find(d => d.customerId === currentUser.id)
    const myOrder = deliveries.find(d =>
      d.customerName === 'João Oliveira' || d.apartment === '3º B'
    );

    if (!myOrder || myOrder.status === 'delivered') {
      return {
        amount: 0,
        dateLabel,
        isoDate,
        items: [],
        isInsufficient: false,
        isTomorrowLocked,
      };
    }

    // Compute line items with prices
    const items = myOrder.items.map(orderItem => {
      const product = matchProductByName(orderItem.name, products);
      const unitPrice = product?.price ?? 0;
      return {
        name: product?.name ?? orderItem.name,
        qty: orderItem.qty,
        unitPrice,
        total: parseFloat((unitPrice * orderItem.qty).toFixed(2)),
      };
    });

    const amount = parseFloat(items.reduce((sum, i) => sum + i.total, 0).toFixed(2));

    return {
      amount,
      dateLabel,
      isoDate,
      items,
      isInsufficient: balance < amount,
      isTomorrowLocked,
    };
  }, [products, deliveries, balance, isTomorrowLocked]);
};
