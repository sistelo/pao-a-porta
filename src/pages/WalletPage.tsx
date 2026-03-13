import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { useWallet } from '../context/WalletContext';
import { Wallet, ArrowUpCircle, Store, History, CheckCircle } from 'lucide-react';

const PRESET_AMOUNTS = [5, 10, 20];

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

export const WalletPage = () => {
  const { balance, transactions, topUp } = useWallet();
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<number | null>(null);

  const handleTopUp = (amount: number) => {
    if (!amount || amount <= 0) return;
    setProcessing(true);
    setSuccess(null);
    // Simulate payment processing
    setTimeout(() => {
      topUp(amount, `Carregamento via MBWAY – ${amount.toFixed(2)}€`);
      setProcessing(false);
      setSuccess(amount);
      setCustomAmount('');
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  };

  const handleCustomTopUp = () => {
    const amount = parseFloat(customAmount.replace(',', '.'));
    if (!isNaN(amount) && amount > 0) handleTopUp(amount);
  };

  return (
    <Layout>
      {/* Balance Card */}
      <Card className="mb-6" style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-hover) 100%)', border: 'none', color: '#fff' }}>
        <div className="flex items-center gap-3 mb-3">
          <Wallet size={24} color="#fff" />
          <span className="font-bold text-lg" style={{ color: '#fff', opacity: 0.9 }}>Saldo disponível</span>
        </div>
        <p className="font-bold m-0" style={{ fontSize: '2.5rem', color: '#fff', lineHeight: 1 }}>
          {balance.toFixed(2).replace('.', ',')}€
        </p>
      </Card>

      {/* MBWAY Top-up */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="btn-icon" style={{ backgroundColor: 'var(--primary-orange-light)' }}>
            <ArrowUpCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-0">Carregar via MBWAY</h3>
            <p className="text-sm text-muted m-0">Pagamento instantâneo</p>
          </div>
        </div>

        {success !== null && (
          <div className="flex items-center gap-2 mb-4" style={{ backgroundColor: 'var(--status-active-bg, #e6f9ec)', padding: '0.75rem', borderRadius: '8px' }}>
            <CheckCircle size={18} color="var(--status-active)" />
            <span className="font-medium text-sm" style={{ color: 'var(--status-active)' }}>
              {success.toFixed(2).replace('.', ',')}€ adicionados com sucesso!
            </span>
          </div>
        )}

        <div className="flex gap-3 mb-4">
          {PRESET_AMOUNTS.map(amount => (
            <button
              key={amount}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '12px 8px', fontSize: '1rem', fontWeight: 'bold', opacity: processing ? 0.7 : 1 }}
              onClick={() => handleTopUp(amount)}
              disabled={processing}
            >
              {amount}€
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="number"
              placeholder="Outro valor (€)"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              disabled={processing}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-color)',
                fontSize: '1rem',
                backgroundColor: 'var(--bg-cream)',
                color: 'var(--text-main)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '12px 20px', opacity: processing ? 0.7 : 1 }}
            onClick={handleCustomTopUp}
            disabled={processing}
          >
            {processing ? 'A processar…' : 'Carregar'}
          </button>
        </div>
      </Card>

      {/* Bakery Top-up Info */}
      <Card className="mb-6" style={{ backgroundColor: 'var(--bg-cream)', border: '1.5px dashed var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="btn-icon" style={{ backgroundColor: 'var(--bg-white)' }}>
            <Store size={20} />
          </div>
          <h3 className="font-bold text-lg mb-0">Carregar na padaria</h3>
        </div>
        <p className="text-sm text-muted m-0">
          Pode entregar dinheiro diretamente na padaria. O saldo será atualizado pela equipa no momento do pagamento.
        </p>
      </Card>

      {/* Transaction History */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <History size={20} />
          <h3 className="font-bold text-lg mb-0">Histórico de transações</h3>
        </div>

        <div className="flex flex-col gap-2">
          {transactions.map(tx => (
            <div
              key={tx.id}
              className="card mb-0 flex justify-between items-center"
              style={{ padding: '0.875rem 1rem' }}
            >
              <div>
                <p className="font-medium m-0" style={{ fontSize: '0.95rem' }}>{tx.description}</p>
                <p className="text-xs text-muted m-0 mt-1">
                  {formatDate(tx.date)} · Saldo restante: {tx.balance.toFixed(2).replace('.', ',')}€
                </p>
              </div>
              <span
                className="font-bold"
                style={{
                  color: tx.amount >= 0 ? 'var(--status-active)' : 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  marginLeft: '1rem'
                }}
              >
                {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2).replace('.', ',')}€
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
