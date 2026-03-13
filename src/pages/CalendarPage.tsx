import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Calendar as CalendarIcon, PauseCircle, PlayCircle, Lock } from 'lucide-react';
import { useCutoff } from '../hooks/useCutoff';

export const CalendarPage = () => {
  const { isTomorrowLocked } = useCutoff();
  // Mock dates for current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0 instead of Sunday being 0
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  // Track paused dates (Set of date strings like '2024-05-15')
  const [pausedDates, setPausedDates] = useState<Set<string>>(new Set());

  const toggleDate = (day: number) => {
    const dateStr = `${year}-${month}-${day}`;
    // Don't allow toggling past dates
    if (day < today.getDate()) return;

    // Block tomorrow if locked
    if (isTomorrowLocked && day === today.getDate() + 1) return;

    setPausedDates(prev => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
      }
      return next;
    });
  };

  const pauseThisWeek = () => {
    const next = new Set(pausedDates);
    for (let i = 0; i < 7; i++) {
       const d = today.getDate() + i;
       if (d <= daysInMonth) next.add(`${year}-${month}-${d}`);
    }
    setPausedDates(next);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Calendário de Entregas</h2>
        <p className="text-sm">Selecione os dias em que não deseja receber pão.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ padding: '2px' }}>
        <button 
          className="btn btn-secondary flex-shrink-0 text-sm" 
          onClick={pauseThisWeek}
          style={{ padding: '8px 16px' }}
        >
          <PauseCircle size={16} />
          Pausar próxima semana
        </button>
      </div>

      <Card className="mb-6" style={{ padding: '1rem' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg mb-0 capitalize">
            {today.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
          </h3>
          <CalendarIcon size={20} color="var(--primary-orange)" />
        </div>

        {/* Days Header */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '4px', 
          marginBottom: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '6px'
        }}>
          {/* Empty slots for start of month */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isPast = day < today.getDate() && month === today.getMonth();
            const isToday = day === today.getDate() && month === today.getMonth();
            
            const dateStr = `${year}-${month}-${day}`;
            const isPaused = pausedDates.has(dateStr);
            
            // Determine styles based on state
            let bg = 'var(--status-active-bg)';
            let color = 'var(--status-active)';
            let border = 'none';

            if (isPast) {
              bg = 'transparent';
              color = 'var(--text-light)';
            } else if (isPaused) {
              bg = 'var(--status-paused-bg)';
              color = 'var(--text-muted)';
            }
            
            if (isToday) {
              border = '2px solid var(--primary-orange)';
            }

            const isTomorrow = day === today.getDate() + 1 && month === today.getMonth();
            const isLocked = isTomorrowLocked && isTomorrow;

            return (
              <button
                key={day}
                onClick={() => toggleDate(day)}
                disabled={isPast || isLocked}
                style={{
                  aspectRatio: '1',
                  borderRadius: '12px',
                  backgroundColor: bg,
                  color: color,
                  border: border,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  cursor: (isPast || isLocked) ? 'default' : 'pointer',
                  position: 'relative'
                }}
              >
                {day}
                {isLocked && (
                  <div style={{ position: 'absolute', top: -2, right: -2, backgroundColor: 'white', borderRadius: '50%', padding: '2px' }}>
                    <Lock size={10} color="var(--primary-orange)" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex justify-between mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: 'var(--status-active-bg)' }} />
            <span>Ativo</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: 'var(--status-paused-bg)' }} />
            <span>Pausado</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-2">
          <PlayCircle size={20} color="var(--primary-orange)" />
          <h4 className="font-bold mb-0">Retomar Entregas</h4>
        </div>
        <p className="text-sm mb-4">Se pausou por engano, pode retomar todas as entregas canceladas.</p>
        <button 
          className="btn btn-outline text-sm"
          onClick={() => setPausedDates(new Set())}
        >
          Retomar tudo
        </button>
      </Card>
    </Layout>
  );
};
