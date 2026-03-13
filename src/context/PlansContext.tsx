import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Plan {
  id: string;
  title: string;
  price: string;
  badge?: string;
  features: string[];
  template: Record<string, Record<string, number>> | null;
}

interface PlansContextType {
  plans: Plan[];
  addPlan: (p: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, p: Omit<Plan, 'id'>) => void;
  deletePlan: (id: string) => void;
  reorderPlans: (fromIndex: number, toIndex: number) => void;
}

const PlansContext = createContext<PlansContextType | null>(null);

const INITIAL_PLANS: Plan[] = [
  { id: '1', title: 'Plano Clássico', price: '12€/mês', features: ['Segunda a Sexta', '2 pães por dia'], template: null },
  { id: '2', title: 'Plano Pequeno-Almoço', price: '18€/mês', features: ['Segunda a Sexta: 2 pães', 'Sábado: 2 croissants', 'Domingo: 1 regueifa'], template: null },
  { id: '3', title: 'Plano Família', price: '28€/mês', features: ['Segunda a Sexta: 4 pães', 'Sábado: 4 croissants', 'Domingo: 1 regueifa grande'], template: null },
  { id: '4', title: 'Plano Brunch', price: '~9€/sem', badge: 'Fim de semana', features: ['Sábado: 2 Panquecas, 2 Croissants', 'Domingo: 2 Sumos naturais, 2 Pães'], template: { sab: { panquecas: 2, croissant: 2 }, dom: { sumo: 2, pao: 2 } } },
];

export const PlansProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);

  const addPlan = (p: Omit<Plan, 'id'>) =>
    setPlans(prev => [...prev, { ...p, id: Date.now().toString() }]);

  const updatePlan = (id: string, p: Omit<Plan, 'id'>) =>
    setPlans(prev => prev.map(plan => plan.id === id ? { ...p, id } : plan));

  const deletePlan = (id: string) =>
    setPlans(prev => prev.filter(plan => plan.id !== id));

  const reorderPlans = (fromIndex: number, toIndex: number) =>
    setPlans(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

  return (
    <PlansContext.Provider value={{ plans, addPlan, updatePlan, deletePlan, reorderPlans }}>
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = () => {
  const ctx = useContext(PlansContext);
  if (!ctx) throw new Error('usePlans must be used within a PlansProvider');
  return ctx;
};
