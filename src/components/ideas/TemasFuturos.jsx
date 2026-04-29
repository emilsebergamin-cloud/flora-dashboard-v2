import { useState } from 'react';
import { Plus, Trash2, ArrowUpRight, Check, Zap, Equal, Minus, Pencil } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { addTemaFuturo, updateTemaFuturo, removeTemaFuturo } from '../../services/collections/ideas.js';
import { addContent } from '../../services/collections/content.js';

const PRIORIDADES = [
  { value: 'alta',  label: 'Alta',  Icon: Zap,   cls: 'bg-rosa-claro text-texto'  },
  { value: 'media', label: 'Media', Icon: Equal,  cls: 'bg-verde-claro text-texto' },
  { value: 'baja',  label: 'Baja',  Icon: Minus,  cls: 'bg-beige-2 text-texto'     },
];

const FORMATOS = ['carrusel', 'reel', 'serie stories', 'post'];

const EMPTY = { idea: '', formato: 'carrusel', prioridad: 'media', mesTentativo: '' };

export default function TemasFuturos() {
  const { dashboard, update } = useDashboard();
  const [adding, setAdding]     = useState(false);
  const [draft, setDraft]       = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(EMPTY);

  const items = (dashboard.ideas?.temasFuturos ?? []).slice().sort((a, b) => {
    const order = { alta: 0, media: 1, baja: 2 };
    return (order[a.prioridad] ?? 9) - (order[b.prioridad] ?? 9);
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!draft.idea.trim()) return;
    update((d) => addTemaFuturo(d, draft));
    setDraft(EMPTY);
    setAdding(false);
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditDraft({ idea: t.idea, formato: t.formato, prioridad: t.prioridad, mesTentativo: t.mesTentativo ?? '' });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editDraft.idea.trim()) return;
    update((d) => updateTemaFuturo(d, editingId, editDraft));
    setEditingId(null);
  };

  const pasarAContenido = (tema) => {
    update((d) => {
      const withContent = addContent(d, {
        title: tema.idea,
        excerpt: '',
        category: tema.formato === 'reel' ? 'reel' : 'orgánico',
        type: tema.formato === 'serie stories' ? 'story' : tema.formato,
        status: 'idea',
        date: '',
        tags: tema.mesTentativo ? [tema.mesTentativo] : [],
        cta: '',
        portada: '',
        reelData: tema.formato === 'reel' ? { concepto: '', audio: '', textoSuperpuesto: '', apareceFlora: 'No', estadoProduccion: 'idea' } : null,
      });
      return updateTemaFuturo(withContent, tema.id, { promovida: true });
    });
  };

  const FormFields = ({ values, set }) => (
    <>
      <textarea className="textarea-flora" rows={2} value={values.idea} autoFocus
        onChange={(e) => set({ ...values, idea: e.target.value })}
        placeholder="Idea o tema futuro" />
      <div className="grid grid-cols-3 gap-3">
        <select className="input-flora" value={values.formato} onChange={(e) => set({ ...values, formato: e.target.value })}>
          {FORMATOS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select className="input-flora" value={values.prioridad} onChange={(e) => set({ ...values, prioridad: e.target.value })}>
          {PRIORIDADES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <input className="input-flora" value={values.mesTentativo}
          onChange={(e) => set({ ...values, mesTentativo: e.target.value })}
          placeholder="Mes tentativo" />
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        {!adding && (
          <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
            <Plus size={14} strokeWidth={2} /> Nuevo tema
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-blanco border border-rosa-claro rounded-2xl p-4 flex flex-col gap-3">
          <FormFields values={draft} set={setDraft} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAdding(false)} className="btn-ghost">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="font-body text-sm text-texto-suave py-8 text-center">Sin temas futuros</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((t) => {
            const prio = PRIORIDADES.find((p) => p.value === t.prioridad) ?? PRIORIDADES[1];

            if (editingId === t.id) {
              return (
                <form key={t.id} onSubmit={handleUpdate}
                  className="bg-blanco border border-rosa-claro rounded-2xl px-5 py-4 flex flex-col gap-3">
                  <FormFields values={editDraft} set={setEditDraft} />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setEditingId(null)} className="btn-ghost">Cancelar</button>
                    <button type="submit" className="btn-primary">Guardar</button>
                  </div>
                </form>
              );
            }

            return (
              <div key={t.id} className={`bg-blanco border rounded-2xl px-5 py-4 flex items-start gap-3 transition-opacity ${t.promovida ? 'opacity-60 border-verde-seco/40' : 'border-beige-2'}`}>
                <span className={`font-body text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${prio.cls}`}>
                  <prio.Icon size={10} strokeWidth={2.5} />{prio.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-texto leading-snug">{t.idea}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="font-body text-[11px] bg-beige-1 text-texto px-2 py-0.5 rounded-full">{t.formato}</span>
                    {t.mesTentativo && <span className="font-body text-[11px] bg-beige-1 text-texto px-2 py-0.5 rounded-full">{t.mesTentativo}</span>}
                    {t.promovida && <span className="font-body text-[11px] bg-verde-claro text-texto px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={11} strokeWidth={2.5} /> en contenido</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 items-center">
                  {!t.promovida && (
                    <button onClick={() => pasarAContenido(t)} title="Pasar a Contenido"
                      className="flex items-center gap-1 font-body text-xs text-verde-hover hover:bg-verde-claro px-2 py-1.5 rounded-lg transition-colors">
                      <ArrowUpRight size={13} strokeWidth={2} /> Pasar a Contenido
                    </button>
                  )}
                  <button onClick={() => startEdit(t)} className="text-texto-suave hover:text-texto p-1.5 transition-colors">
                    <Pencil size={13} strokeWidth={1.75} />
                  </button>
                  <button onClick={() => update((d) => removeTemaFuturo(d, t.id))}
                    className="text-texto-suave hover:text-rosa-hover p-1.5 transition-colors">
                    <Trash2 size={13} strokeWidth={1.75} />
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
