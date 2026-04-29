import { useState } from 'react';
import PlanTematico from '../components/estrategia/PlanTematico.jsx';
import Stories from '../components/estrategia/Stories.jsx';
import Carruseles from '../components/estrategia/Carruseles.jsx';
import BancoEncuestas from '../components/estrategia/BancoEncuestas.jsx';

const TABS = [
  { key: 'stories',    label: 'Stories'           },
  { key: 'encuestas',  label: 'Banco de encuestas' },
  { key: 'plan',       label: 'Plan temático'      },
  { key: 'carruseles', label: 'Carruseles'         },
];

export default function Estrategia() {
  const [tab, setTab] = useState('stories');

  return (
    <div className="px-6 md:px-10 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-texto mb-6">Estrategia Mensual</h1>

      {/* Tabs — una sola fila scrolleable */}
      <div className="flex gap-1 border-b border-beige-2 mb-8 overflow-x-auto overflow-y-hidden">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'font-body text-sm px-4 py-2.5 border-b-2 -mb-px whitespace-nowrap transition-colors shrink-0',
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
      {tab === 'encuestas'  && <BancoEncuestas />}
      {tab === 'plan'       && <PlanTematico />}
      {tab === 'carruseles' && <Carruseles />}
    </div>
  );
}
