import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsContextType {
  cutoffTime: string;
  whatsappTemplate: string;
  lowBalanceTemplate: string;
  isBakeryClosed: boolean;
  appName: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  updateCutoffTime: (time: string) => void;
  updateWhatsappTemplate: (template: string) => void;
  updateLowBalanceTemplate: (template: string) => void;
  toggleBakeryStatus: () => void;
  updateBranding: (branding: Partial<{ appName: string; logo: string | null; primaryColor: string; secondaryColor: string; backgroundColor: string }>) => void;
}

const DEFAULT_WHATSAPP_TEMPLATE = `🌞 Bom dia!
O seu pão acabou de ser entregue à sua porta.

Entrega: {time}

Obrigado por usar Pão à Porta 🥖`;

const DEFAULT_LOW_BALANCE_TEMPLATE = `Olá {name}! 😊
O saldo da sua conta Pão à Porta é insuficiente para a entrega de {date}.

Por favor carregue a sua carteira para garantir o seu pão fresco pela manhã: {link}

Obrigado! 🥖`;

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [cutoffTime, setCutoffTime] = useState('22:00');
  const [whatsappTemplate, setWhatsappTemplate] = useState(DEFAULT_WHATSAPP_TEMPLATE);
  const [lowBalanceTemplate, setLowBalanceTemplate] = useState(DEFAULT_LOW_BALANCE_TEMPLATE);
  const [isBakeryClosed, setIsBakeryClosed] = useState(false);
  
  // Branding State
  const [appName, setAppName] = useState('Pão à Porta');
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#E67E22'); // Warm Orange
  const [secondaryColor, setSecondaryColor] = useState('#8B4513'); // Soft Brown (Saddle Brown)
  const [backgroundColor, setBackgroundColor] = useState('#FDFBF7'); // Cream

  const updateCutoffTime = (time: string) => setCutoffTime(time);
  const updateWhatsappTemplate = (template: string) => setWhatsappTemplate(template);
  const updateLowBalanceTemplate = (template: string) => setLowBalanceTemplate(template);
  const toggleBakeryStatus = () => setIsBakeryClosed(prev => !prev);

  const updateBranding = (branding: Partial<{ appName: string; logo: string | null; primaryColor: string; secondaryColor: string; backgroundColor: string }>) => {
    if (branding.appName !== undefined) setAppName(branding.appName);
    if (branding.logo !== undefined) setLogo(branding.logo);
    if (branding.primaryColor !== undefined) setPrimaryColor(branding.primaryColor);
    if (branding.secondaryColor !== undefined) setSecondaryColor(branding.secondaryColor);
    if (branding.backgroundColor !== undefined) setBackgroundColor(branding.backgroundColor);
  };

  // Inject CSS Variables for global theming
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-orange', primaryColor);
    // Darken primary for hover
    const darken = (col: string, amt: number) => {
      let usePound = false;
      if (col[0] === "#") { col = col.slice(1); usePound = true; }
      let num = parseInt(col, 16);
      let r = (num >> 16) + amt; if (r > 255) r = 255; else if (r < 0) r = 0;
      let b = ((num >> 8) & 0x00FF) + amt; if (b > 255) b = 255; else if (b < 0) b = 0;
      let g = (num & 0x0000FF) + amt; if (g > 255) g = 255; else if (g < 0) g = 0;
      return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    };
    root.style.setProperty('--primary-orange-hover', darken(primaryColor, -20));
    root.style.setProperty('--primary-orange-light', primaryColor + '20'); // 12% opacity
    root.style.setProperty('--text-main', secondaryColor);
    root.style.setProperty('--bg-cream', backgroundColor);
  }, [primaryColor, secondaryColor, backgroundColor]);

  // Update browser title
  useEffect(() => {
    document.title = appName + ' - Pão Fresco à Porta';
  }, [appName]);

  return (
    <SettingsContext.Provider value={{ 
      cutoffTime, 
      whatsappTemplate, 
      lowBalanceTemplate,
      isBakeryClosed,
      appName,
      logo,
      primaryColor,
      secondaryColor,
      backgroundColor,
      updateCutoffTime, 
      updateWhatsappTemplate,
      updateLowBalanceTemplate,
      toggleBakeryStatus,
      updateBranding
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
};
