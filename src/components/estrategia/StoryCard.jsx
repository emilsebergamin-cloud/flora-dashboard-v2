import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ESTADOS = ['idea', 'lista', 'publicada'];
const STATUS_STYLES = {
  idea:      'bg-beige-2 text-texto',
  lista:     'bg-verde-claro text-verde-hover',
  publicada: 'bg-verde-seco text-blanco',
};
const CATEGORIAS = ['Flora cotidiana', 'Flora trabaja', 'Flora estudia', 'Flora hábitos', 'Flora informa', 'Interacción'];
const TIPOS = ['Foto + texto', 'Video (manos/proceso)', 'Texto solo', 'Encuesta', 'Cajita de preguntas', 'Dato disruptivo', 'Anticipo de contenido'];

export default function StoryCard({ story, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const set = (field, val) => onUpdate(story.id, { [field]: val });

  return (
    <div className={`bg-blanco border rounded-2xl overflow-hidden transition-colors ${story.estado === 'publicada' ? 'border-verde-seco/60' : 'border-beige-2'}`}>
      {/* Header siempre visible */}
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="font-body text-xs text-texto-suave font-medium mt-0.5 shrink-0 w-4 text-center">
          {story.numero ?? ''}
        </span>
        <div className="flex-1 min-w-0">
          <textarea
            className="w-full bg-transparent font-body text-sm text-texto placeholder-texto-suave resize-none focus:outline-none leading-snug"
            rows={2}
            value={story.texto ?? ''}
            onChange={(e) => set('texto', e.target.value)}
            placeholder="Texto o idea de la story…"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            className="font-body text-[11px] font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none"
            style={{ background: 'transparent' }}
            value={story.estado ?? 'idea'}
            onChange={(e) => set('estado', e.target.value)}
          >
            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <span className={`font-body text-[11px] font-medium px-2 py-0.5 rounded-full pointer-events-none ${STATUS_STYLES[story.estado] ?? STATUS_STYLES.idea}`}>
            {story.estado ?? 'idea'}
          </span>
          <button onClick={() => setExpanded((v) => !v)} className="text-texto-suave hover:text-texto p-1">
            {expanded ? <ChevronUp size={14} strokeWidth={2} /> : <ChevronDown size={14} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Campos expandibles */}
      {expanded && (
        <div className="border-t border-beige-2 px-4 py-3 flex flex-col gap-3 bg-beige-1/40">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-texto font-medium mb-1 block">Categoría</label>
              <select className="input-flora text-xs py-1.5" value={story.categoria ?? ''} onChange={(e) => set('categoria', e.target.value)}>
                <option value="">— elegir —</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-texto font-medium mb-1 block">Tipo</label>
              <select className="input-flora text-xs py-1.5" value={story.tipo ?? ''} onChange={(e) => set('tipo', e.target.value)}>
                <option value="">— elegir —</option>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => onDelete(story.id)} className="flex items-center gap-1.5 font-body text-xs text-rosa-hover hover:underline">
              <Trash2 size={12} strokeWidth={2} /> Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
