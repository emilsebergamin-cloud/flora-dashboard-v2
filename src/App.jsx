import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, DASHBOARD_DOC_PATH } from './services/firebase.js';

import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';
import Estrategia from './pages/Estrategia.jsx';
import Contenido from './pages/Contenido.jsx';
import Ideas from './pages/Ideas.jsx';
import Calendario from './pages/Calendario.jsx';
import Moodboard from './pages/Moodboard.jsx';

export default function App() {
  const [syncStatus, setSyncStatus] = useState('syncing');

  useEffect(() => {
    const ref = doc(db, DASHBOARD_DOC_PATH.collection, DASHBOARD_DOC_PATH.doc);
    const unsub = onSnapshot(
      ref,
      () => setSyncStatus('synced'),
      (err) => {
        console.error('[firebase]', err);
        setSyncStatus('error');
      },
    );
    return unsub;
  }, []);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
