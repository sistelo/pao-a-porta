import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { QuantitySelector } from '../components/QuantitySelector';
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCutoff } from '../hooks/useCutoff';
import { LockedOrderMessage } from '../components/LockedOrderMessage';

const PRODUCTS = [
  { id: 'pao', name: 'Pão d\'Água', price: 0.25, image: '🥖' },
  { id: 'croissant', name: 'Croissant', price: 1.20, image: '🥐' },
  { id: 'broa', name: 'Broa de Avintes', price: 1.50, image: '🍞' },
  { id: 'regueifa', name: 'Regueifa', price: 1.20, image: '🥨' },
  { id: 'nata', name: 'Pastel de Nata', price: 1.00, image: '🥧' },
  { id: 'panquecas', name: 'Panquecas', price: 2.50, image: '🥞' },
  { id: 'sumo', name: 'Sumo Natural', price: 2.00, image: '🧃' }
];

const DAYS = [
  { id: 'seg', label: 'Segunda', advice: '' },
  { id: 'ter', label: 'Terça', advice: '' },
  { id: 'qua', label: 'Quarta', advice: '' },
  { id: 'qui', label: 'Quinta', advice: '' },
  { id: 'sex', label: 'Sexta', advice: '' },
  { id: 'sab', label: 'Sábado', advice: 'Ideais para fim de semana' },
  { id: 'dom', label: 'Domingo', advice: 'Tradicional: Regueifa' }
];

export const CustomPlanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isTomorrowLocked, tomorrowDayId, nextEditableDateLabel } = useCutoff();
  const templatePlan = (location.state as { plan?: Record<string, Record<string, number>> } | null)?.plan;
  // State: Record<dayId, Record<productId, quantity>>
  const [plan, setPlan] = useState<Record<string, Record<string, number>>>(templatePlan ?? {});
  const [expandedDay, setExpandedDay] = useState<string | null>(templatePlan ? Object.keys(templatePlan)[0] ?? 'seg' : 'seg');

  const handleQuantityChange = (dayId: string, productId: string, qty: number) => {
    if (isTomorrowLocked && dayId === tomorrowDayId) return;
    setPlan(prev => ({
      ...prev,
      [dayId]: {
        ...(prev[dayId] || {}),
        [productId]: qty
      }
    }));
  };

  // Calculate monthly total (approx 4 weeks)
  let weeklyTotal = 0;
  Object.keys(plan).forEach(dayId => {
    Object.keys(plan[dayId]).forEach(productId => {
      const qty = plan[dayId][productId];
      const product = PRODUCTS.find(p => p.id === productId);
      if (product && qty > 0) {
        weeklyTotal += product.price * qty;
      }
    });
  });
  
  const monthlyTotal = weeklyTotal * 4;

  const toggleDay = (dayId: string) => {
    setExpandedDay(expandedDay === dayId ? null : dayId);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Personalizar plano</h2>
        <p className="text-sm">Adicione os seus produtos favoritos por dia da semana.</p>
      </div>

      <div className="flex flex-col gap-3 mb-24">
        {DAYS.map(day => {
          const isExpanded = expandedDay === day.id;
          
          // Calculate day summary
          const dayItems = plan[day.id] || {};
          let selectedCount = 0;
          let dayTotal = 0;
          Object.entries(dayItems).forEach(([productId, qty]) => {
            selectedCount += qty;
            const product = PRODUCTS.find(p => p.id === productId);
            if (product) dayTotal += product.price * qty;
          });

          return (
            <Card key={day.id} className="mb-0" style={{ padding: '0', overflow: 'hidden' }}>
              <div 
                className="flex justify-between items-center" 
                style={{ 
                  padding: '1rem', 
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? 'var(--bg-cream)' : 'transparent',
                  borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none'
                }}
                onClick={() => toggleDay(day.id)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg mb-0">{day.label}</h3>
                    {day.advice && <span className="text-xs text-muted">({day.advice})</span>}
                  </div>
                  {selectedCount > 0 ? (
                    <p className="text-sm m-0 font-medium" style={{ color: 'var(--primary-orange)' }}>
                      {selectedCount} item(ns) selecionado(s) • {dayTotal.toFixed(2)}€
                    </p>
                  ) : (
                    <p className="text-sm m-0 text-muted">Sem produtos previstos</p>
                  )}
                </div>
                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
              
              {isExpanded && (
                <div style={{ padding: '1rem' }}>
                  {isTomorrowLocked && day.id === tomorrowDayId ? (
                    <LockedOrderMessage nextDateLabel={nextEditableDateLabel} />
                  ) : (
                    <div className="flex flex-col gap-4">
                      {PRODUCTS.map(product => {
                        const qty = (plan[day.id] && plan[day.id][product.id]) || 0;
                        return (
                          <div key={product.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--bg-cream)' }}>
                            <div className="flex items-center gap-3">
                              <div 
                                style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  backgroundColor: 'var(--primary-orange-light)', 
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.5rem'
                                }}
                              >
                                {product.image}
                              </div>
                              <div>
                                <p className="font-bold m-0">{product.name}</p>
                                <p className="text-sm text-muted m-0">{product.price.toFixed(2)}€ / unid.</p>
                              </div>
                            </div>
                            
                            <div style={{ minWidth: '120px' }}>
                              <QuantitySelector 
                                quantity={qty}
                                onChange={(newQty) => handleQuantityChange(day.id, product.id, newQty)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Sticky Bottom Summary/CTA */}
      <div 
        style={{
          position: 'fixed',
          bottom: '80px', // Above mobile nav
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-white)',
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20
        }}
      >
        <div>
          <p className="text-sm font-medium text-muted m-0">Total estimado</p>
          <div className="flex items-end gap-1">
            <p className="font-bold text-2xl m-0" style={{ color: 'var(--primary-orange)', lineHeight: 1 }}>
              {monthlyTotal.toFixed(2)}€
            </p>
            <p className="text-sm text-muted m-0" style={{ paddingBottom: '2px' }}>/ mês</p>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ width: 'auto', padding: '12px 24px' }}
          onClick={() => navigate('/dashboard')}
        >
          <ShoppingCart size={20} />
          <span>Subscrever</span>
        </button>
      </div>
    </Layout>
  );
};
