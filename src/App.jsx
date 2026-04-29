import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, DASHBOARD_DOC_PATH } from './services/firebase.js';

export default function App() {
  const [firebaseStatus, setFirebaseStatus] = useState('connecting');

  useEffect(() => {
    let cancelled = false;
    const ref = doc(db, DASHBOARD_DOC_PATH.collection, DASHBOARD_DOC_PATH.doc);
    getDoc(ref)
      .then((snap) => {
        if (cancelled) return;
        setFirebaseStatus(snap.exists() ? 'connected' : 'connected-empty');
      })
      .catch((err) => {
        console.error('[firebase] connection error', err);
        if (!cancelled) setFirebaseStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const statusLabel = {
    connecting: 'Conectando con Firebase...',
    connected: 'Firebase conectado · documento encontrado',
    'connected-empty': 'Firebase conectado · documento aún no existe',
    error: 'Error al conectar con Firebase (revisar consola)',
  }[firebaseStatus];

  const statusColor = {
    connecting: 'bg-beige-3',
    connected: 'bg-verde-seco',
    'connected-empty': 'bg-verde-claro',
    error: 'bg-rosa-hover',
  }[firebaseStatus];

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-texto-suave mb-4">
          Flora Studio
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-texto mb-4">
          Fundación lista ✿
        </h1>
        <p className="font-body text-texto-suave mb-10">
          Vite + React + Tailwind + Firebase corriendo. Próximo paso: layout y rutas.
        </p>

        <div className="inline-flex items-center gap-3 bg-blanco border border-beige-2 rounded-2xl px-5 py-3 shadow-sm">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${statusColor}`} />
          <span className="font-body text-sm text-texto">{statusLabel}</span>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-2 max-w-sm mx-auto">
          {[
            { name: 'rosa-viejo', cls: 'bg-rosa-viejo' },
            { name: 'rosa-claro', cls: 'bg-rosa-claro' },
            { name: 'verde-seco', cls: 'bg-verde-seco' },
            { name: 'verde-claro', cls: 'bg-verde-claro' },
            { name: 'beige-2', cls: 'bg-beige-2' },
            { name: 'beige-3', cls: 'bg-beige-3' },
          ].map((c) => (
            <div
              key={c.name}
              className={`${c.cls} rounded-xl h-12 flex items-end justify-center pb-1 text-[10px] font-body text-texto/70`}
            >
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
