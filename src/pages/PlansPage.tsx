import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Check, Edit3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlans } from '../context/PlansContext';

export const PlansPage = () => {
  const navigate = useNavigate();
  const { plans } = usePlans();

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Construa o seu plano</h2>
        <p className="text-sm">Personalize os seus dias e pães favoritos.</p>
      </div>

      <div className="mb-8">
        <Card className="mb-0" style={{ backgroundColor: 'var(--primary-orange-light)', border: 'none' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-lg mb-0">Criar o meu plano</h4>
              <p className="text-sm m-0" style={{ color: 'var(--primary-orange-hover)' }}>Total flexibilidade</p>
            </div>
            <div className="btn-icon" style={{ backgroundColor: 'var(--bg-white)', color: 'var(--primary-orange-hover)' }}>
              <Edit3 size={24} />
            </div>
          </div>
          <button 
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => navigate('/custom-plan')}
          >
            Personalizar plano
          </button>
        </Card>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-4">Sugestões de planos</h3>
        <div className="flex flex-col gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="mb-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg mb-0">{plan.title}</h3>
                  {plan.badge && (
                    <span className="text-xs font-bold" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange-hover)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                      {plan.badge}
                    </span>
                  )}
                </div>
                <span className="font-bold text-xl" style={{ color: 'var(--primary-orange)' }}>
                  {plan.price}
                </span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }} className="flex flex-col gap-2">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm font-medium">
                    <Check size={16} color="var(--status-active)" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.template ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/custom-plan', { state: { plan: plan.template } })}
                >
                  <Sparkles size={16} />
                  Usar este plano
                </button>
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Escolher plano
                </button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};
