import { useState } from 'react';
import { Package } from 'lucide-react';
import { Card } from '../components/Card';
import { useDeliveries } from '../context/DeliveryContext';
import { DAY_LABELS, ALL_DAY_IDS } from '../context/ProductsContext';

export const BakerPage = () => {
  const { deliveries } = useDeliveries();
  const [selectedDay, setSelectedDay] = useState('seg');
  
  const dayLabel = DAY_LABELS[selectedDay as keyof typeof DAY_LABELS] ?? '';

  const productionSummary = deliveries.reduce((acc, curr) => {
    curr.items.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.qty;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 bg-gray-50 min-h-screen pb-24">
      <div className="mb-5">
        <h2 className="text-2xl font-bold mb-1">Painel do Padeiro</h2>
        <p className="text-sm text-muted">Resumo de produção diária.</p>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          {ALL_DAY_IDS.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              style={{
                padding: '8px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
                backgroundColor: selectedDay === d ? 'var(--primary-orange)' : 'var(--bg-cream)',
                color: selectedDay === d ? '#fff' : 'var(--text-main)'
              }}
            >
              {DAY_LABELS[d as keyof typeof DAY_LABELS].split('-')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <Card className="mb-6" style={{ backgroundColor: 'var(--primary-orange-light)', border: 'none' }}>
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Package size={18} /> Produção – {dayLabel}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(productionSummary).length > 0 ? (
            Object.entries(productionSummary).map(([name, qty]) => (
              <div key={name} className="flex flex-col mb-2">
                <span className="text-3xl font-bold" style={{ color: 'var(--primary-orange)' }}>{qty}</span>
                <span className="text-sm font-medium text-muted uppercase">{name}s</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted m-0 col-span-2">Sem encomendas para este dia.</p>
          )}
        </div>
      </Card>
    </div>
  );
};
