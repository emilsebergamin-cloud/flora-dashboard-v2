import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeDashboard, saveDashboard, DEFAULT_DASHBOARD } from '../services/dashboard.js';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [dashboard, setDashboard] = useState(DEFAULT_DASHBOARD);
  const [loading, setLoading]     = useState(true);
  const [syncStatus, setSyncStatus] = useState('syncing');

  useEffect(() => {
    const unsub = subscribeDashboard(
      (data) => {
        setDashboard(data);
        setLoading(false);
        setSyncStatus('synced');
      },
      (err) => {
        console.error('[useDashboard]', err);
        setLoading(false);
        setSyncStatus('error');
      },
    );
    return unsub;
  }, []);

  // Optimistic update: aplica la mutación localmente y persiste en Firestore.
  // Si el save falla, revierte el estado.
  async function update(mutator) {
    const prev = dashboard;
    let next;
    try {
      next = mutator(dashboard);
    } catch (err) {
      console.error('[useDashboard] mutator failed', err);
      setSyncStatus('error');
      return;
    }
    setDashboard(next);
    setSyncStatus('syncing');
    try {
      await saveDashboard(next);
      setSyncStatus('synced');
    } catch (err) {
      console.error('[useDashboard] save failed', err);
      setDashboard(prev);
      setSyncStatus('error');
    }
  }

  return (
    <DashboardContext.Provider value={{ dashboard, loading, syncStatus, update }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside <DashboardProvider>');
  return ctx;
}
