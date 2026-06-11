import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider, useDashboard } from './hooks/useDashboard.jsx';
import Layout from './components/Layout.jsx';

const Inicio     = lazy(() => import('./pages/Inicio.jsx'));
const Estrategia = lazy(() => import('./pages/Estrategia.jsx'));
const Contenido  = lazy(() => import('./pages/Contenido.jsx'));
const Ideas      = lazy(() => import('./pages/Ideas.jsx'));
const Calendario = lazy(() => import('./pages/Calendario.jsx'));
const Moodboard  = lazy(() => import('./pages/Moodboard.jsx'));

function AppRoutes() {
  const { syncStatus } = useDashboard();
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout syncStatus={syncStatus} />}>
          <Route index element={<Inicio />} />
          <Route path="estrategia" element={<Estrategia />} />
          <Route path="contenido" element={<Contenido />} />
          <Route path="ideas" element={<Ideas />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="moodboard" element={<Moodboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DashboardProvider>
        <AppRoutes />
      </DashboardProvider>
    </BrowserRouter>
  );
}
