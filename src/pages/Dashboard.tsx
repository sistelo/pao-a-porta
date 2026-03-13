import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Coffee, PauseCircle, Edit, PlusCircle, CheckCircle, Wallet, ArrowUpCircle, History, Lock as LockIcon, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useCutoff } from '../hooks/useCutoff';
import { useSettings } from '../context/SettingsContext';
import { useNextCharge } from '../hooks/useNextCharge';
import { TrendingDown, AlertTriangle } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { balance } = useWallet();
  const { cutoffMessage, countdownMessage, isTomorrowLocked } = useCutoff();
  const { isBakeryClosed } = useSettings();
  const nextCharge = useNextCharge();
  const { lowBalanceTemplate } = useSettings();

  const isLowBalance = nextCharge.isInsufficient && nextCharge.amount > 0;

  // Simulate automatic WhatsApp notification
  useEffect(() => {
    if (isLowBalance) {
      const message = lowBalanceTemplate
        .replace('{name}', 'João')
        .replace('{date}', nextCharge.dateLabel)
        .replace('{link}', window.location.origin + '/wallet');
      
      console.log('--- SIMULATED WHATSAPP NOTIFICATION ---');
      console.log('To: +351 912 345 681');
      console.log(message);
      console.log('---------------------------------------');
    }
  }, [isLowBalance, lowBalanceTemplate, nextCharge.dateLabel]);

  const nextDelivery = {
    day: 'Amanhã – Terça-feira',
    items: ['2 Pães', '1 Croissant'],
  };

  const upcomingWeek = [
    { date: 'Qua, 14', items: '2 Pães', status: 'active' },
    { date: 'Qui, 15', items: 'Pausado', status: 'paused' },
    { date: 'Sex, 16', items: '2 Pães', status: 'active' },
    { date: 'Sáb, 17', items: '2 Pães, 2 Croissants', status: 'active' },
    { date: 'Dom, 18', items: '1 Regueifa', status: 'active' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-0">Bom dia, João! 🌞</h2>
          <p className="text-sm">Apartamento 3B</p>
        </div>
      </div>

      {isBakeryClosed && (
        <div 
          className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-pulse"
          style={{ backgroundColor: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030' }}
        >
          <Coffee size={24} />
          <div>
            <p className="font-bold text-sm m-0">Padaria Temporariamente Fechada</p>
            <p className="text-xs m-0">Estamos em período de descanso/férias. As entregas serão retomadas brevemente.</p>
          </div>
        </div>
      )}

      {/* Cutoff Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 mb-2">
          <AlertCircle size={18} className="text-blue-500" />
          <p className="text-xs text-blue-700 font-medium m-0">{cutoffMessage}</p>
        </div>
        
        {countdownMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-100 animate-pulse">
            <Clock size={18} className="text-orange-500" />
            <p className="text-xs text-orange-700 font-bold m-0">{countdownMessage}</p>
          </div>
        )}
      </div>

      {/* Wallet Balance Card */}
      <Card 
        className="mb-6" 
        style={{ 
          padding: '1rem',
          border: isLowBalance ? '2px solid #FCA5A5' : '1px solid var(--border-color)',
          backgroundColor: isLowBalance ? '#FFF5F5' : 'var(--bg-card)',
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="btn-icon" 
              style={{ backgroundColor: isLowBalance ? '#FEE2E2' : 'var(--primary-orange-light)' }}
            >
              <Wallet size={20} color={isLowBalance ? '#DC2626' : 'var(--primary-orange)'} />
            </div>
            <div>
              <p className="text-xs text-muted m-0 font-medium">Saldo disponível</p>
              <p 
                className="font-bold text-2xl m-0" 
                style={{ color: isLowBalance ? '#DC2626' : 'var(--primary-orange)', lineHeight: 1.1 }}
              >
                {balance.toFixed(2).replace('.', ',')}€
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem', gap: '6px' }}
              onClick={() => navigate('/wallet')}
            >
              <ArrowUpCircle size={16} />
              Carregar
            </button>
            <button
              className="btn btn-secondary"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem', gap: '6px' }}
              onClick={() => navigate('/wallet')}
            >
              <History size={16} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: isLowBalance ? '#FEE2E2' : 'var(--border-color)', margin: '0 0 12px' }} />

        {/* Next charge row */}
        {nextCharge.amount > 0 ? (
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} color={isLowBalance ? '#DC2626' : 'var(--text-muted)'} />
                <div>
                  <p className="text-xs font-medium m-0" style={{ color: 'var(--text-muted)' }}>
                    Próxima cobrança
                  </p>
                  <p className="text-xs m-0" style={{ color: 'var(--text-light)' }}>
                    Entrega: {nextCharge.dateLabel}
                  </p>
                </div>
              </div>
              <p
                className="font-bold m-0"
                style={{
                  fontSize: '1.15rem',
                  color: isLowBalance ? '#DC2626' : 'var(--text-main)',
                }}
              >
                {nextCharge.amount.toFixed(2).replace('.', ',')}€
              </p>
            </div>

            {/* Itemised breakdown */}
            <div style={{ margin: '8px 0 0 24px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {nextCharge.items.map((item, i) => (
                <p key={i} className="text-[10px] m-0" style={{ color: 'var(--text-muted)' }}>
                  {item.qty}× {item.name} — {item.unitPrice.toFixed(2).replace('.', ',')}€/und
                </p>
              ))}
            </div>

            {/* Low balance warning */}
            {isLowBalance && (
              <div
                className="flex items-center gap-2 mt-3 p-3 rounded-xl"
                style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}
              >
                <AlertTriangle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p className="text-xs font-bold m-0" style={{ color: '#DC2626' }}>
                    Saldo insuficiente
                  </p>
                  <p className="text-[10px] m-0" style={{ color: '#B91C1C' }}>
                    Faltam {(nextCharge.amount - balance).toFixed(2).replace('.', ',')}€. Carregue antes do corte das {nextCharge.isTomorrowLocked ? 'próximas' : 'esta'} entregas.
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.78rem', flexShrink: 0, backgroundColor: '#DC2626' }}
                  onClick={() => navigate('/wallet')}
                >
                  Carregar
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs m-0" style={{ color: 'var(--text-light)' }}>
            Sem entregas agendadas para amanhã.
          </p>
        )}
      </Card>

      <h3 className="text-lg font-bold mb-3">Próxima Entrega</h3>
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="btn-icon">
            <Coffee size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-0">{nextDelivery.day}</h4>
            <p className="text-sm m-0" style={{ color: 'var(--status-active)' }}>
              Entrega prevista às 07:00
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          {nextDelivery.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button 
            className="btn btn-primary" 
            disabled={isTomorrowLocked || isBakeryClosed}
            onClick={() => navigate('/extras')}
            style={{ opacity: (isTomorrowLocked || isBakeryClosed) ? 0.6 : 1 }}
          >
            {isTomorrowLocked ? <LockIcon size={18} /> : <PlusCircle size={18} />}
            Adicionar extra
          </button>
          <button 
            className="btn btn-secondary" 
            disabled={isTomorrowLocked || isBakeryClosed}
            onClick={() => navigate('/plan')}
            style={{ opacity: (isTomorrowLocked || isBakeryClosed) ? 0.6 : 1 }}
          >
            <Edit size={18} />
            Editar plano
          </button>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold m-0">Sua Semana</h3>
        <button className="btn-icon" onClick={() => navigate('/calendar')}>
          <ArrowUpCircle size={20} className="rotate-90" />
        </button>
      </div>
      
      <div className="flex flex-col gap-3 mb-8">
        {upcomingWeek.map((day, i) => (
          <Card key={i} style={{ padding: '0.75rem 1rem' }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted m-0 font-medium">{day.date}</p>
                <p className={`font-bold m-0 ${day.status === 'paused' ? 'text-muted' : ''}`}>
                  {day.items}
                </p>
              </div>
              {day.status === 'paused' ? (
                <PauseCircle size={20} className="text-muted" />
              ) : (
                <CheckCircle size={20} style={{ color: 'var(--status-active)' }} />
              )}
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
};
