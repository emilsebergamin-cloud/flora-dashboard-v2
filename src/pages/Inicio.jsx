import { useEffect, useState } from 'react';
import { Flower2 } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard.jsx';
import { getGreeting, getDateString, getDailyQuote } from '../utils/greeting.js';

export default function Inicio() {
  const { dashboard } = useDashboard();
  const [greeting, setGreeting] = useState(getGreeting());

  const contentCount = dashboard.content?.length ?? 0;

  // Actualiza el saludo si cambia la hora (cada minuto)
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-full px-6 md:px-10 py-10 max-w-4xl">
      {/* Saludo */}
      <h1 className="font-display text-4xl md:text-5xl text-texto mb-1 flex items-center gap-3">
        {greeting} <em>Flora</em>
        <Flower2 size={32} strokeWidth={1.25} className="text-rosa-viejo" />
      </h1>
      <p className="font-body text-sm text-texto-suave mb-10">
        {getDateString(contentCount)}
      </p>

      {/* Frase del día */}
      <blockquote className="border-l-4 border-rosa-viejo pl-5 py-1 mb-12">
        <p className="font-display italic text-xl md:text-2xl text-texto leading-snug">
          "{getDailyQuote()}"
        </p>
      </blockquote>

      {/* Métricas placeholder — se completan en Paso 4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Posts este mes', 'En borrador', 'Stories semana', 'Ideas en pipeline'].map((label) => (
          <div key={label} className="bg-blanco border border-beige-2 rounded-2xl px-4 py-5">
            <p className="font-body text-xs text-texto-suave mb-1">{label}</p>
            <p className="font-display text-3xl text-texto">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
