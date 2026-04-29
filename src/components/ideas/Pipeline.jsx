import { useState } from 'react';
import { Plus, ArrowRight, Trash2 } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { addPipelineItem, movePipeline, removePipelineItem } from '../../services/collections/ideas.js';

const COLUMNS = [
  { key: 'ideas',     label: 'Ideas',      color: 'border-rosa-claro'  },
  { key: 'proceso',   label: 'En proceso', color: 'border-beige-3'     },
  { key: 'publicado', label: 'Publicado',  color: 'border-verde-claro' },
];

const NEXT = { ideas: 'proceso', proceso: 'publicado' };

export default function Pipeline() {
  const { dashboard, update } = useDashboard();
  const [adding, setAdding]   = useState(null);
  const [draft, setDraft]     = useState('');

  const pipeline = dashboard.ideas?.pipeline ?? { ideas: [], proceso: [], publicado: [] };

  const handleAdd = (col) => {
    if (!draft.trim()) { setAdding(null); return; }
    update((d) => addPipelineItem(d, col, { text: draft.trim() }));
    setDraft('');
    setAdding(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(({ key, label, color }) => (
        <div key={key} className={`bg-beige-1/50 border-t-2 ${color} rounded-2xl p-3 flex flex-col gap-2 min-h-[200px]`}>
          <div className="flex items-center justify-between px-1 mb-1">
            <p className="font-body text-sm text-texto font-semibold">{label}</p>
            <span className="font-body text-xs text-texto-suave font-medium">{pipeline[key]?.length ?? 0}</span>
          </div>

          {(pipeline[key] ?? []).map((item) => (
            <div key={item.id} className="bg-blanco border border-beige-2 rounded-xl px-3 py-2.5 flex items-start gap-2 group">
              <p className="flex-1 font-body text-sm text-texto leading-snug min-w-0 break-words">{item.text}</p>
              <div className="flex flex-col gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {NEXT[key] && (
                  <button
                    onClick={() => update((d) => movePipeline(d, item.id, key, NEXT[key]))}
                    title={`Mover a ${COLUMNS.find((c) => c.key === NEXT[key]).label}`}
                    className="text-texto-suave hover:text-verde-hover p-0.5 transition-colors"
                  >
                    <ArrowRight size={13} strokeWidth={2} />
                  </button>
                )}
                <button
                  onClick={() => update((d) => removePipelineItem(d, key, item.id))}
                  className="text-texto-suave hover:text-rosa-hover p-0.5 transition-colors"
                >
                  <Trash2 size={12} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          ))}

          {adding === key ? (
            <form onSubmit={(e) => { e.preventDefault(); handleAdd(key); }}
              className="flex gap-1">
              <input
                autoFocus
                className="input-flora text-xs py-2"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => handleAdd(key)}
                placeholder="Idea…"
              />
            </form>
          ) : (
            <button onClick={() => { setAdding(key); setDraft(''); }}
              className="flex items-center gap-1.5 font-body text-xs text-texto-suave hover:text-texto px-2 py-1.5 rounded-lg hover:bg-beige-1 transition-colors w-fit">
              <Plus size={12} strokeWidth={2} /> Agregar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
