import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { PlusCircle, ShoppingBag, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCutoff } from '../hooks/useCutoff';
import { LockedOrderMessage } from '../components/LockedOrderMessage';

const EXTRAS = [
  { id: 'croissant', name: 'Croissant Manteiga', price: 1.20 },
  { id: 'nata', name: 'Pastel de Nata', price: 1.00 },
  { id: 'bola', name: 'Bola de Berlim', price: 1.40 },
  { id: 'sumo', name: 'Sumo de Laranja Natural', price: 2.50 },
  { id: 'leite', name: 'Meio Litro de Leite', price: 0.90 }
];

export const ExtrasPage = () => {
  const navigate = useNavigate();
  const [added, setAdded] = useState<Set<string>>(new Set());
  const { isTomorrowLocked, nextEditableDateLabel } = useCutoff();

  const handleAdd = (id: string) => {
    if (isTomorrowLocked) return;
    setAdded(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Adicionar Extras</h2>
        <p className="text-sm">Mime-se amanhã com algo especial.</p>
      </div>

      {isTomorrowLocked ? (
        <LockedOrderMessage nextDateLabel={nextEditableDateLabel} />
      ) : (
        <>
          <Card className="mb-8" style={{ backgroundColor: 'var(--primary-orange-light)', border: 'none' }}>
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag size={20} color="var(--primary-orange-hover)" />
              <h3 className="font-bold text-lg mb-0" style={{ color: 'var(--primary-orange-hover)' }}>
                Entrega de Amanhã
              </h3>
            </div>
            <p className="text-sm m-0 font-medium">Já tem: 2 Pães, 1 Croissant</p>
            
            {added.size > 0 && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(230, 126, 34, 0.2)' }}>
                <p className="text-sm font-bold m-0 mb-2">Extras a adicionar:</p>
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }} className="text-sm">
                  {Array.from(added).map(id => {
                    const item = EXTRAS.find(e => e.id === id);
                    return item ? <li key={id}>{item.name}</li> : null;
                  })}
                </ul>
              </div>
            )}
          </Card>

          <div className="flex flex-col gap-3 mb-8">
            {EXTRAS.map(extra => {
              const isAdded = added.has(extra.id);
              return (
                <Card key={extra.id} className="mb-0 flex justify-between items-center" style={{ padding: '0.75rem 1rem' }}>
                  <div>
                    <p className="font-bold mb-0">{extra.name}</p>
                    <p className="text-sm text-muted m-0">{extra.price.toFixed(2)}€</p>
                  </div>
                  <button 
                    className={`btn-icon ${isAdded ? 'added' : ''}`}
                    onClick={() => handleAdd(extra.id)}
                    disabled={isAdded}
                    style={{
                      backgroundColor: isAdded ? 'var(--status-active-bg)' : 'var(--bg-cream)',
                      color: isAdded ? 'var(--status-active)' : 'var(--primary-orange)',
                      border: isAdded ? 'none' : '1px solid var(--border-color)'
                    }}
                  >
                    {isAdded ? <CheckCircle size={20} /> : <PlusCircle size={20} />}
                  </button>
                </Card>
              );
            })}
          </div>
          
          {added.size > 0 && (
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Confirmar e Pagar
            </button>
          )}
        </>
      )}
    </Layout>
  );
};
