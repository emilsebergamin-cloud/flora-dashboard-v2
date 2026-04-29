import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { addStory, updateStory, removeStory, listStories } from '../../services/collections/stories.js';
import StoryCard from './StoryCard.jsx';
import BancoEncuestas from './BancoEncuestas.jsx';

const DIAS = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
const DIA_LABELS = { L: 'Lunes', M: 'Martes', Mi: 'Miércoles', J: 'Jueves', V: 'Viernes', S: 'Sábado', D: 'Domingo' };

// Semana activa por defecto según el día del mes
function semanaActual() {
  const d = new Date().getDate();
  if (d <= 7) return 1;
  if (d <= 14) return 2;
  if (d <= 21) return 3;
  return 4;
}

export default function Stories() {
  const { dashboard, update } = useDashboard();
  const [semana, setSemana] = useState(semanaActual());
  const [subTab, setSubTab] = useState('stories'); // 'stories' | 'encuestas'

  const storiesSemana = listStories(dashboard, { semana });

  const byDay = DIAS.reduce((acc, d) => {
    acc[d] = storiesSemana.filter((s) => s.dia === d).sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0));
    return acc;
  }, {});

  const handleAdd = (dia) => {
    const existentes = byDay[dia];
    const numero = existentes.length + 1;
    update((d) => addStory(d, { semana, dia, numero, texto: '', categoria: '', tipo: '', estado: 'idea' }));
  };

  const handleUpdate = (id, patch) => {
    update((d) => updateStory(d, id, patch));
  };

  const handleDelete = (id) => {
    update((d) => removeStory(d, id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-nav: stories / encuestas */}
      <div className="flex gap-1 border-b border-beige-2 pb-0">
        {[{ key: 'stories', label: 'Stories' }, { key: 'encuestas', label: 'Banco de encuestas' }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={[
              'font-body text-sm px-4 py-2 border-b-2 -mb-px transition-colors',
              subTab === key ? 'border-rosa-viejo text-texto font-medium' : 'border-transparent text-texto-suave hover:text-texto',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'encuestas' ? (
        <BancoEncuestas />
      ) : (
        <>
          {/* Pills semana */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSemana(s)}
                className={[
                  'font-body text-sm px-4 py-1.5 rounded-full transition-colors',
                  semana === s
                    ? 'bg-rosa-viejo text-blanco font-medium'
                    : 'bg-blanco border border-beige-2 text-texto hover:border-rosa-viejo',
                ].join(' ')}
              >
                S{s}
              </button>
            ))}
          </div>

          {/* Días */}
          <div className="flex flex-col gap-6">
            {DIAS.map((dia) => (
              <div key={dia}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body text-sm text-texto font-semibold">{DIA_LABELS[dia]}</p>
                  <button
                    onClick={() => handleAdd(dia)}
                    className="flex items-center gap-1 font-body text-xs text-texto-suave hover:text-rosa-hover transition-colors"
                  >
                    <Plus size={12} strokeWidth={2} /> Agregar
                  </button>
                </div>

                {byDay[dia].length === 0 ? (
                  <div className="border border-dashed border-beige-3 rounded-2xl px-4 py-3 text-center">
                    <p className="font-body text-xs text-texto-suave">Sin stories — <button onClick={() => handleAdd(dia)} className="underline hover:text-texto">agregar</button></p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {byDay[dia].map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
