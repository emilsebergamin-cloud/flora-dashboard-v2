import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { addReflexion, updateReflexion, removeReflexion } from '../../services/collections/ideas.js';

export default function Reflexiones() {
  const { dashboard, update } = useDashboard();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ text: '', tag: '', fecha: new Date().toISOString().slice(0, 10) });

  const items = [...(dashboard.ideas?.reflexiones ?? [])]
    .sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!draft.text.trim()) return;
    update((d) => addReflexion(d, draft));
    setDraft({ text: '', tag: '', fecha: new Date().toISOString().slice(0, 10) });
    setAdding(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        {!adding && (
          <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} strokeWidth={2} /> Nueva reflexión
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-blanco border border-rosa-claro rounded-2xl p-5 flex flex-col gap-3">
          <textarea className="textarea-flora" rows={5} value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
            placeholder="¿Qué pasó hoy? ¿Qué aprendiste? ¿Qué te dijo una clienta?…" autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" className="input-flora" value={draft.fecha}
              onChange={(e) => setDraft({ ...draft, fecha: e.target.value })} />
            <input className="input-flora" value={draft.tag}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              placeholder="Etiqueta (sesión, formación, vida…)" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAdding(false)} className="btn-ghost">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="font-body text-sm text-texto-suave py-8 text-center">Sin reflexiones todavía</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((r) => (
            <article key={r.id} className="bg-blanco border border-beige-2 rounded-2xl px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body text-xs text-texto-suave font-medium">{r.fecha}</p>
                <button onClick={() => update((d) => removeReflexion(d, r.id))}
                  className="text-texto-suave hover:text-rosa-hover p-1 transition-colors">
                  <Trash2 size={13} strokeWidth={1.75} />
                </button>
              </div>
              <p className="font-body text-sm text-texto leading-relaxed whitespace-pre-wrap">{r.text}</p>
              {r.tag && <span className="inline-block mt-3 font-body text-[11px] bg-rosa-claro text-rosa-hover px-2 py-0.5 rounded-full">{r.tag}</span>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
