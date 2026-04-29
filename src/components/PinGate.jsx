import { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';

// PIN definido en variable de entorno VITE_PIN (Vercel → Settings → Env vars).
// Si no está configurado, la puerta está abierta (modo desarrollo).
const PIN      = import.meta.env.VITE_PIN ?? '';
const AUTH_KEY = 'flora_auth_v1';

// Token derivado del PIN — si el PIN cambia, los dispositivos quedan desautorizados.
const makeToken = (p) => btoa(`flora:${p}`);

function isAuthenticated() {
  if (!PIN) return true;
  return localStorage.getItem(AUTH_KEY) === makeToken(PIN);
}

// Filas del teclado: null = celda vacía
const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [null, '0', '⌫'],
];

export default function PinGate({ children }) {
  const [authed, setAuthed] = useState(() => isAuthenticated());
  const [digits, setDigits] = useState([]);
  const [error,  setError]  = useState(false);
  const [shake,  setShake]  = useState(false);

  const press = useCallback((k) => {
    if (k === '⌫') {
      setDigits((d) => d.slice(0, -1));
      setError(false);
      return;
    }
    setDigits((prev) => prev.length < 4 ? [...prev, k] : prev);
  }, []);

  // Auto-submit al completar 4 dígitos
  useEffect(() => {
    if (digits.length !== 4) return;
    if (digits.join('') === PIN) {
      localStorage.setItem(AUTH_KEY, makeToken(PIN));
      setAuthed(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => { setDigits([]); setShake(false); }, 600);
    }
  }, [digits]);

  // Soporte de teclado físico
  useEffect(() => {
    if (authed) return;
    const handler = (e) => {
      if (e.key >= '0' && e.key <= '9') press(e.key);
      if (e.key === 'Backspace') press('⌫');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [authed, press]);

  if (authed) return children;

  return (
    <div className="min-h-screen bg-crema flex flex-col items-center justify-center px-6 select-none">

      {/* Encabezado */}
      <p className="font-display text-4xl text-texto mb-1">Flora Studio</p>
      <p className="font-body text-sm text-texto-suave mb-10">Ingresá tu PIN para continuar</p>

      {/* Indicadores de 4 puntos */}
      <div className={`flex gap-5 mb-10 ${shake ? 'animate-shake' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={[
              'w-3.5 h-3.5 rounded-full border-2 transition-all duration-150',
              digits.length > i
                ? error
                  ? 'bg-rosa-hover border-rosa-hover scale-110'
                  : 'bg-rosa-viejo border-rosa-viejo scale-110'
                : 'bg-transparent border-beige-3',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="flex flex-col gap-3">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-3">
            {row.map((k, ci) =>
              k === null ? (
                <div key={ci} className="w-20 h-20" />
              ) : (
                <button
                  key={k}
                  onClick={() => press(k)}
                  className={[
                    'w-20 h-20 rounded-2xl font-body text-xl font-medium',
                    'transition-all active:scale-90 flex items-center justify-center',
                    k === '⌫'
                      ? 'bg-beige-2 text-texto-suave hover:bg-beige-3'
                      : 'bg-blanco border border-beige-2 text-texto hover:bg-beige-1 shadow-sm',
                  ].join(' ')}
                >
                  {k === '⌫'
                    ? <Delete size={20} strokeWidth={1.75} />
                    : k}
                </button>
              )
            )}
          </div>
        ))}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="font-body text-sm text-rosa-hover mt-8 animate-fade-in">
          PIN incorrecto — intentá de nuevo
        </p>
      )}
    </div>
  );
}
