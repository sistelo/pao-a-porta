import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const { appName, logo } = useSettings();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Email ou password incorretos.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-cream)',
    fontSize: '1rem', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '1rem',
      backgroundColor: 'var(--bg-cream)'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-white)',
        padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', backgroundColor: 'var(--primary-orange-light)',
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden'
          }}>
            {logo ? (
              <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <LogIn size={32} color="var(--primary-orange)" />
            )}
          </div>
          <h1 className="text-2xl font-bold m-0 text-center" style={{ color: 'var(--primary-orange)' }}>
            {appName}
          </h1>
          <p className="text-muted text-sm mt-2">Faça login para continuar</p>
        </div>

        {error && (
          <div style={{
            padding: '10px', backgroundColor: '#ffebe6', color: '#DE350B',
            borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold text-muted mb-1 block">Email</label>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="exemplo@pao.pt"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-muted mb-1 block">Password</label>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2" style={{ padding: '14px' }}>
            Entrar
          </button>
        </form>

        <div className="mt-6 p-4 rounded-lg bg-orange-50 border border-orange-100 text-xs text-muted">
          <p className="font-bold mb-1">Contas de demonstração (password: 123)</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Admin: admin@pao.pt</li>
            <li>Padeiro: padeiro@pao.pt</li>
            <li>Entregador: entregador@pao.pt</li>
            <li>Cliente: joao@pao.pt</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
