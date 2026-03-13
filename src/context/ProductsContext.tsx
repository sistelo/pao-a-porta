import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  photo: string; // emoji or data URL
  availableDays: string[]; // day IDs: 'seg','ter','qua','qui','sex','sab','dom'
}

interface ProductsContextType {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, p: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (fromIndex: number, toIndex: number) => void;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

const ALL_DAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Pão d\'Água', price: 0.25, description: 'Pão leve e estaladiço.', photo: '🥖', availableDays: ALL_DAYS },
  { id: '2', name: 'Croissant', price: 1.20, description: 'Croissant de manteiga, folhado.', photo: '🥐', availableDays: ['sab', 'dom'] },
  { id: '3', name: 'Broa de Avintes', price: 1.50, description: 'Broa tradicional de milho.', photo: '🍞', availableDays: ALL_DAYS },
  { id: '4', name: 'Regueifa', price: 1.20, description: 'Pão doce tradicional do Minho.', photo: '🥨', availableDays: ['dom'] },
  { id: '5', name: 'Pastel de Nata', price: 1.00, description: 'Pastel de nata cremoso.', photo: '🥧', availableDays: ['sab', 'dom'] },
  { id: '6', name: 'Panquecas', price: 2.50, description: 'Panquecas fofas com mel.', photo: '🥞', availableDays: ['sab', 'dom'] },
  { id: '7', name: 'Sumo Natural', price: 2.00, description: 'Sumo de laranja natural.', photo: '🧃', availableDays: ['sab', 'dom'] },
];

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (p: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...p, id: Date.now().toString() }]);
  };

  const updateProduct = (id: string, p: Omit<Product, 'id'>) => {
    setProducts(prev => prev.map(prod => prod.id === id ? { ...p, id } : prod));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
  };

  const reorderProducts = (fromIndex: number, toIndex: number) => {
    setProducts(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, reorderProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
};

export const DAY_LABELS: Record<string, string> = {
  seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom'
};
export const ALL_DAY_IDS = ALL_DAYS;
