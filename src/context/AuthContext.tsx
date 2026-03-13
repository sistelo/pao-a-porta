import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'Admin' | 'Customer' | 'Delivery' | 'Baker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  apt?: string;
  password?: string; // Only for mock logic
}

const INITIAL_USERS: User[] = [
  { id: 'admin1', name: 'Administrador', email: 'admin@pao.pt', role: 'Admin', password: '123' },
  { id: 'baker1', name: 'Padeiro João', email: 'padeiro@pao.pt', role: 'Baker', password: '123' },
  { id: 'delivery1', name: 'Entregador Rui', email: 'entregador@pao.pt', role: 'Delivery', password: '123' },
  { id: 'u1', name: 'João', email: 'joao@pao.pt', apt: '3º B', role: 'Customer', password: '123' },
  { id: 'u2', name: 'Maria', email: 'maria@pao.pt', apt: '1º A', role: 'Customer', password: '123' },
  { id: 'u3', name: 'Carlos', email: 'carlos@pao.pt', apt: '2º B', role: 'Customer', password: '123' },
  { id: 'u4', name: 'Ana', email: 'ana@pao.pt', apt: '4º C', role: 'Customer', password: '123' },
  { id: 'u5', name: 'Rui Cliente', email: 'rui@pao.pt', apt: '5º D', role: 'Customer', password: '123' },
];

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updateUserRole: (id: string, role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const updateUserRole = (id: string, role: Role) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
