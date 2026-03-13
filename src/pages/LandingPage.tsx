import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CalendarCheck, DoorClosed, CheckCircle2 } from 'lucide-react';
import { Layout } from '../components/Layout';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Layout showNav={false}>
      {/* Hero Section */}
      <section className="text-center" style={{ padding: '2rem 1rem 1rem' }}>
        <h1 className="text-2xl font-bold mb-4" style={{ lineHeight: 1.2 }}>
          Pão fresco à sua porta todas as manhãs
        </h1>
        <p className="mb-6 text-lg">
          Escolha o seu plano e receba pão acabado de fazer diretamente na sua porta.
        </p>

        {/* Illustration Placeholder - will be updated with generated image */}
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '300px', 
            height: '250px', 
            margin: '0 auto 2rem',
            backgroundColor: 'var(--primary-orange-light)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <img 
            src="/bakery_door_bag.png" 
            alt="Pão pendurado na porta" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // Fallback to Icon if image doesn't exist yet
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as any).parentElement.innerHTML = '<div style="color: var(--primary-orange)"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>';
            }}
          />
        </div>

        <button 
          className="btn btn-primary text-lg" 
          onClick={() => navigate('/custom-plan')}
          style={{ padding: '16px 32px' }}
        >
          Escolher plano
        </button>
      </section>

      {/* How It Works */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-center mb-6">Como funciona?</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 card mb-0">
            <div className="btn-icon" style={{ backgroundColor: 'var(--primary-orange-light)' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-bold mb-0">1. Escolha o seu plano</h3>
              <p className="text-sm m-0">Planos flexíveis adaptados à sua família.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 card mb-0">
            <div className="btn-icon" style={{ backgroundColor: 'var(--primary-orange-light)' }}>
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold mb-0">2. Personalize os dias</h3>
              <p className="text-sm m-0">Decida quando recebe e o que recebe.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 card mb-0">
            <div className="btn-icon" style={{ backgroundColor: 'var(--primary-orange-light)' }}>
              <DoorClosed size={20} />
            </div>
            <div>
              <h3 className="font-bold mb-0">3. Receba à sua porta</h3>
              <p className="text-sm m-0">Acorde com pão fresco todas as manhãs!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mt-8 mb-8" style={{ backgroundColor: 'var(--bg-white)', padding: '2rem 1rem', borderRadius: 'var(--radius-lg)' }}>
        <h2 className="text-xl font-bold text-center mb-6">Porquê Pão à Porta?</h2>
        <ul style={{ listStyle: 'none', padding: 0 }} className="flex flex-col gap-3">
          {[
            'Sem filas na padaria',
            'Pão sempre fresco',
            'Entrega garantida no seu prédio',
            'Cancelar ou pausar quando quiser'
          ].map((benefit, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckCircle2 size={24} color="var(--status-active)" />
              <span className="font-medium">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};
