import { useState } from 'react';
import Frases from '../components/ideas/Frases.jsx';
import Reflexiones from '../components/ideas/Reflexiones.jsx';
import Referencias from '../components/ideas/Referencias.jsx';
import TemasFuturos from '../components/ideas/TemasFuturos.jsx';
import Pipeline from '../components/ideas/Pipeline.jsx';
import BancoEncuestas from '../components/estrategia/BancoEncuestas.jsx';

const TABS = [
  { key: 'frases',       label: 'Frases'           },
  { key: 'reflexiones',  label: 'Reflexiones'      },
  { key: 'encuestas',    label: 'Banco de encuestas' },
  { key: 'referencias',  label: 'Referencias'      },
  { key: 'temas',        label: 'Temas futuros'    },
];

export default function Ideas() {
  const [tab, setTab] = useState('frases');

  return (
    <div className="px-6 md:px-10 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-texto mb-6">Ideas</h1>

      {/* Pipeline kanban arriba */}
      <section className="mb-10">
        <p className="font-body text-xs text-texto font-semibold uppercase tracking-widest mb-3">Pipeline</p>
        <Pipeline />
      </section>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-beige-2 mb-8 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'font-body text-sm px-4 py-2.5 border-b-2 -mb-px whitespace-nowrap transition-colors',
              tab === key
                ? 'border-rosa-viejo text-texto font-medium'
                : 'border-transparent text-texto-suave hover:text-texto',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'frases'      && <Frases />}
      {tab === 'reflexiones' && <Reflexiones />}
      {tab === 'encuestas'   && <BancoEncuestas />}
      {tab === 'referencias' && <Referencias />}
      {tab === 'temas'       && <TemasFuturos />}
    </div>
  );
}
