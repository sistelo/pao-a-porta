import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { CheckCircle, Truck, MessageSquare } from 'lucide-react';
import { useDeliveries, type DeliveryOrder } from '../context/DeliveryContext';

export const DeliveryPersonPage = () => {
  const { deliveries, markAsDelivered } = useDeliveries();
  const [showNotification, setShowNotification] = useState<DeliveryOrder | null>(null);

  // Parse apartment numbers for sorting (e.g., "1º A" -> [1, 'A'])
  const sortDeliveries = (a: DeliveryOrder, b: DeliveryOrder) => {
    return a.apartment.localeCompare(b.apartment, undefined, { numeric: true, sensitivity: 'base' });
  };

  const sortedDeliveries = [...deliveries].sort(sortDeliveries);

  const handleDeliver = (order: DeliveryOrder) => {
    markAsDelivered(order.id);
    setShowNotification(order);
    setTimeout(() => setShowNotification(null), 4000);
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Modo Entregas</h2>
          <p className="text-sm text-muted">Lista de entregas do edifício</p>
        </div>
        <div className="btn-icon" style={{ backgroundColor: 'var(--primary-orange-light)' }}>
          <Truck size={24} color="var(--primary-orange)" />
        </div>
      </div>

      {showNotification && (
        <div 
          className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] z-50 animate-bounce"
          style={{ 
            backgroundColor: '#25D366', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <MessageSquare size={20} />
          <div>
            <p className="text-xs font-bold uppercase m-0">WhatsApp Enviado</p>
            <p className="text-sm m-0">Notificação para {showNotification.customerName} ({showNotification.apartment})</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-24">
        {sortedDeliveries.map(order => (
          <Card 
            key={order.id} 
            className="mb-0" 
            style={{ 
              borderLeft: order.status === 'delivered' ? '4px solid #25D366' : '4px solid #ccc',
              opacity: order.status === 'delivered' ? 0.8 : 1
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--bg-cream)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                >
                  {order.apartment}
                </div>
                <div>
                  <h4 className="font-bold mb-0">{order.customerName}</h4>
                  <p className="text-xs text-muted m-0">{order.phoneNumber}</p>
                </div>
              </div>
              {order.status === 'delivered' && (
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#e6fcf0', color: '#25D366' }}>
                  Entregue às {order.deliveredAt}
                </span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4" style={{ backgroundColor: 'var(--bg-cream)', border: '1px dashed var(--border-color)' }}>
              <p className="text-xs font-bold text-muted uppercase mb-2">Encomenda:</p>
              <ul className="text-sm m-0 p-0" style={{ listStyle: 'none' }}>
                {order.items.map((item, idx) => (
                  <li key={idx} className="font-medium">
                    {item.qty}x {item.name}
                  </li>
                ))}
              </ul>
            </div>

            {order.status === 'pending' ? (
              <button 
                className="btn btn-primary w-full"
                onClick={() => handleDeliver(order)}
                style={{ backgroundColor: '#25D366' }}
              >
                <CheckCircle size={20} />
                Marcar como entregue
              </button>
            ) : (
              <button className="btn btn-secondary w-full" disabled>
                <CheckCircle size={20} />
                Concluído
              </button>
            )}
          </Card>
        ))}
      </div>
    </Layout>
  );
};
