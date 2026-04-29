import { useState } from 'react';
import { Plus, Star, Trash2, Pencil } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { addFrase, updateFrase, removeFrase } from '../../services/collections/ideas.js';

export default function Frases() {
  const { dashboard, update } = useDashboard();
  const [filtro, setFiltro]   = useState('all');
  const [adding, setAdding]   = useState(false);
  const [draft, setDraft]     = useState({ text: '', uso: '', tag: '' });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ text: '', uso: '', tag: '' });

  const items = (dashboard.ideas?.frases ?? [])
    .filter((f) => filtro === 'fav' ? f.favorita : true);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!draft.text.trim()) return;
    update((d) => addFrase(d, draft));
    setDraft({ text: '', uso: '', tag: '' });
    setAdding(false);
  };

  const startEdit = (f) => {
    setEditingId(f.id);
    setEditDraft({ text: f.text, uso: f.uso ?? '', tag: f.tag ?? '' });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editDraft.text.trim()) return;
    update((d) => updateFrase(d, editingId, editDraft));
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5">
          {[{ k: 'all', l: 'Todas' }, { k: 'fav', l: 'Favoritas' }].map(({ k, l }) => (
            <button key={k} onClick={() => setFiltro(k)}
              className={['font-body text-sm px-3.5 py-1.5 rounded-full transition-colors',
                filtro === k ? 'bg-rosa-viejo text-blanco font-medium' : 'bg-blanco border border-beige-2 text-texto hover:border-rosa-viejo'].join(' ')}>
              {l}
            </button>
          ))}
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} strokeWidth={2} /> Nueva frase
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-blanco border border-rosa-claro rounded-2xl p-4 flex flex-col gap-3">
          <textarea className="textarea-flora" rows={2} value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
            placeholder="Frase, idea, observación…" autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <input className="input-flora" value={draft.uso}
              onChange={(e) => setDraft({ ...draft, uso: e.target.value })}
              placeholder="Uso posible (caption, story, bio…)" />
            <input className="input-flora" value={draft.tag}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              placeholder="Etiqueta (piel, hábitos…)" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setAdding(false); setDraft({ text: '', uso: '', tag: '' }); }} className="btn-ghost">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="font-body text-sm text-texto-suave py-8 text-center">Sin frases todavía</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((f) => {
            if (editingId === f.id) {
              return (
                <form key={f.id} onSubmit={handleUpdate}
                  className="bg-blanco border border-rosa-claro rounded-2xl px-5 py-4 flex flex-col gap-3">
                  <textarea className="textarea-flora" rows={2} value={editDraft.text} autoFocus
                    onChange={(e) => setEditDraft({ ...editDraft, text: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-flora" value={editDraft.uso}
                      onChange={(e) => setEditDraft({ ...editDraft, uso: e.target.value })}
                      placeholder="Uso posible (caption, story, bio…)" />
                    <input className="input-flora" value={editDraft.tag}
                      onChange={(e) => setEditDraft({ ...editDraft, tag: e.target.value })}
                      placeholder="Etiqueta (piel, hábitos…)" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setEditingId(null)} className="btn-ghost">Cancelar</button>
                    <button type="submit" className="btn-primary">Guardar</button>
                  </div>
                </form>
              );
            }

            return (
              <div key={f.id} className="bg-blanco border border-beige-2 rounded-2xl px-5 py-4 flex items-start gap-3">
                <button
                  onClick={() => update((d) => updateFrase(d, f.id, { favorita: !f.favorita }))}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${f.favorita ? 'text-rosa-viejo bg-rosa-claro' : 'text-texto-suave hover:text-rosa-viejo'}`}
                >
                  <Star size={15} strokeWidth={1.75} fill={f.favorita ? 'currentColor' : 'none'} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-texto leading-snug">{f.text}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {f.uso && <span className="font-body text-[11px] bg-beige-1 text-texto px-2 py-0.5 rounded-full">{f.uso}</span>}
                    {f.tag && <span className="font-body text-[11px] bg-rosa-claro text-texto px-2 py-0.5 rounded-full">{f.tag}</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => startEdit(f)} className="text-texto-suave hover:text-texto p-1 transition-colors">
                    <Pencil size={13} strokeWidth={1.75} />
                  </button>
                  <button onClick={() => update((d) => removeFrase(d, f.id))}
                    className="text-texto-suave hover:text-rosa-hover p-1 transition-colors">
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
