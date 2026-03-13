import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export const useCutoff = () => {
  const { cutoffTime } = useSettings();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);
  
  // Cutoff is today at the specified time
  const cutoffDate = new Date(now);
  cutoffDate.setHours(cutoffHour, cutoffMinute, 0, 0);

  const isTomorrowLocked = now > cutoffDate;

  const getCountdownMessage = () => {
    const diffMs = cutoffDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs > 0 && diffMs <= 3 * 60 * 60 * 1000) { // Show countdown if within 3 hours
      return `Alterações para amanhã fecham em ${diffHours}h ${diffMins}m.`;
    }
    return null;
  };

  const cutoffMessage = `Alterações até às ${cutoffTime} para entregas do dia seguinte.`;
  const nextEditableDateLabel = isTomorrowLocked ? 'depois de amanhã' : 'amanhã';
  
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const tomorrowDayId = days[tomorrow.getDay()];

  return {
    isTomorrowLocked,
    cutoffMessage,
    countdownMessage: getCountdownMessage(),
    nextEditableDateLabel,
    cutoffTime,
    tomorrowDayId
  };
};
