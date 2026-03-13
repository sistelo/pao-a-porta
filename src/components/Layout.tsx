import { type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  List,
  Calendar as CalendarIcon,
  User,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
  showNav?: boolean;
}

export const Layout = ({ children, showBack, showNav = true }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { appName, logo } = useSettings();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <Home size={22} />, label: 'Início', path: '/dashboard' },
    { icon: <List size={22} />, label: 'Plano', path: '/plan' },
    { icon: <CalendarIcon size={22} />, label: 'Calendário', path: '/calendar' },
    { icon: <User size={22} />, label: 'Perfil', path: '/profile' },
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'var(--bg-white)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showBack && (
            <button className="btn-icon" onClick={() => navigate(-1)}>
              <ChevronLeft size={22} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {logo && <img src={logo} alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />}
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--primary-orange)' }}>
              {appName}
            </h1>
          </div>
        </div>
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', backgroundColor: 'var(--primary-orange-light)',
              color: 'var(--primary-orange-hover)', padding: '3px 9px', borderRadius: '20px'
            }}>
              {currentUser.role}
            </span>
            <button
              className="btn-icon"
              onClick={handleLogout}
              title="Terminar Sessão"
              style={{ width: 36, height: 36 }}
            >
              <LogOut size={17} color="var(--text-muted)" />
            </button>
          </div>
        )}
      </header>

      {/* Scrollable Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', paddingBottom: '12px' }}>
        {children}
      </main>

      {/* Bottom Navigation — always visible inside the shell */}
      {showNav && (
        <nav style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '6px 0 8px',
          background: 'var(--bg-white)',
          borderTop: '1px solid var(--border-color)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          flexShrink: 0,
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '6px 4px',
                  color: isActive ? 'var(--primary-orange)' : 'var(--text-muted)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                }}
              >
                {item.icon}
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
