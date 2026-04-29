import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider, useDashboard } from './hooks/useDashboard.jsx';

import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';
import Estrategia from './pages/Estrategia.jsx';
import Contenido from './pages/Contenido.jsx';
import Ideas from './pages/Ideas.jsx';
import Calendario from './pages/Calendario.jsx';
import Moodboard from './pages/Moodboard.jsx';

function AppRoutes() {
  const { syncStatus } = useDashboard();
  return (
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
