import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { User, MapPin, Phone, Save, CheckCircle } from 'lucide-react';

export const ProfilePage = () => {
  // Mocking user details for now as we don't have a UserContext yet
  // In a real app, this would come from an auth/user context
  const [name, setName] = useState('João Silva');
  const [address, setAddress] = useState('Rua de Cedofeita, 123');
  const [apartment, setApartment] = useState('3º B');
  const [phone, setPhone] = useState('912 345 678');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-white)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">O Meu Perfil</h2>
        <p className="text-sm text-muted">Gere as tuas informações de contacto e entrega.</p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-muted mb-1 block uppercase flex items-center gap-1">
              <User size={12} /> Nome Completo
            </label>
            <input 
              style={inputStyle} 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="O seu nome"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted mb-1 block uppercase flex items-center gap-1">
              <MapPin size={12} /> Morada
            </label>
            <input 
              style={inputStyle} 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="Rua, número, etc."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted mb-1 block uppercase flex items-center gap-1">
              <MapPin size={12} /> Apartamento / Fração
            </label>
            <input 
              style={inputStyle} 
              value={apartment} 
              onChange={e => setApartment(e.target.value)} 
              placeholder="Ex: 2º Esq, 3º B..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted mb-1 block uppercase flex items-center gap-1">
              <Phone size={12} /> Telemóvel (WhatsApp)
            </label>
            <input 
              style={inputStyle} 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="9xx xxx xxx"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" style={{ height: '50px' }}>
            {saved ? (
              <span className="flex items-center gap-2 justify-center">
                <CheckCircle size={20} /> Guardado!
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Save size={20} /> Guardar Alterações
              </span>
            )}
          </button>
        </form>
      </Card>

      <div className="mt-8 pt-6 border-t border-dashed" style={{ borderColor: 'var(--border-color)' }}>
        <p className="text-xs text-muted text-center">
          Pão à Porta v1.2.0 • Proteção de Dados
        </p>
      </div>
    </Layout>
  );
};
