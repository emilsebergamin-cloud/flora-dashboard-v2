import { useState } from 'react';
import PlanTematico from '../components/estrategia/PlanTematico.jsx';
import Stories from '../components/estrategia/Stories.jsx';
import Carruseles from '../components/estrategia/Carruseles.jsx';

const TABS = [
  { key: 'stories',   label: 'Stories'       },
  { key: 'plan',      label: 'Plan temático'  },
  { key: 'carruseles',label: 'Carruseles'     },
];

export default function Estrategia() {
  const [tab, setTab] = useState('stories');

  return (
    <div className="px-6 md:px-10 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-texto mb-6">Estrategia Mensual</h1>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-beige-2 mb-8">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'font-body text-sm px-5 py-2.5 border-b-2 -mb-px transition-colors',
              tab === key
                ? 'border-rosa-viejo text-texto font-medium'
                : 'border-transparent text-texto-suave hover:text-texto',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'stories'    && <Stories />}
      {tab === 'plan'       && <PlanTematico />}
      {tab === 'carruseles' && <Carruseles />}
    </div>
  );
}
