import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Lock, ArrowRight, Calendar } from 'lucide-react';

export const LockedOrderMessage = ({ nextDateLabel }: { nextDateLabel: string }) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6" style={{ border: '2px dashed var(--primary-orange)', backgroundColor: 'var(--primary-orange-light)' }}>
      <div className="flex flex-col items-center text-center p-4">
        <div className="btn-icon mb-4" style={{ backgroundColor: 'white', color: 'var(--primary-orange)' }}>
          <Lock size={24} />
        </div>
        <h4 className="font-bold text-lg mb-2">
          Alterações para a entrega de amanhã já estão fechadas.
        </h4>
        <p className="text-sm text-muted mb-6">
          Pode modificar entregas a partir de {nextDateLabel}.
        </p>
        
        <div className="flex flex-col gap-3 w-100" style={{ width: '100%' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            <Calendar size={18} />
            Ver próximas entregas
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/custom-plan')}
          >
            <ArrowRight size={18} />
            Editar plano futuro
          </button>
        </div>
      </div>
    </Card>
  );
};
