import { Pencil, Trash2 } from 'lucide-react';

const CATEGORY_STYLES = {
  'orgánico':      'bg-beige-2 text-texto',
  'educacional':   'bg-verde-claro text-verde-hover',
  'informativo':   'bg-rosa-claro text-rosa-hover',
  'inspiracional': 'bg-rosa-claro text-rosa-hover',
  'conversión':    'bg-verde-claro text-verde-hover',
  'reel':          'bg-beige-3 text-texto',
};

const STATUS_STYLES = {
  'idea':      'bg-beige-2 text-texto',
  'borrador':  'bg-rosa-claro text-rosa-hover',
  'listo':     'bg-verde-claro text-verde-hover',
  'publicado': 'bg-verde-seco text-blanco',
};

const TYPE_LABELS = {
  post: 'Post', carrusel: 'Carrusel', reel: 'Reel', story: 'Story',
};

export default function ContentCard({ item, onEdit, onDelete }) {
  const catStyle    = CATEGORY_STYLES[item.category] ?? 'bg-beige-2 text-texto';
  const statusStyle = STATUS_STYLES[item.status]     ?? 'bg-beige-2 text-texto';

  return (
    <div className="group bg-blanco border border-beige-2 rounded-2xl overflow-hidden flex flex-col hover:border-beige-3 hover:shadow-sm transition-all">
      {/* Portada */}
      <div className="relative aspect-[4/3] bg-beige-1 overflow-hidden">
        {item.portada ? (
          <img src={item.portada} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-3xl ${catStyle}`}>
            {item.category === 'reel' ? '▶' : item.category === 'educacional' ? '◈' : '◉'}
          </div>
        )}
        {/* Acciones hover */}
        <div className="absolute inset-0 bg-texto/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(item)}
            className="bg-blanco rounded-xl p-2 hover:bg-beige-1 transition-colors"
          >
            <Pencil size={15} strokeWidth={1.75} className="text-texto" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="bg-blanco rounded-xl p-2 hover:bg-rosa-claro transition-colors"
          >
            <Trash2 size={15} strokeWidth={1.75} className="text-rosa-hover" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex flex-col gap-2 flex-1">
        <p className="font-body text-sm text-texto font-medium leading-snug line-clamp-2">
          {item.title}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          <span className={`font-body text-[11px] font-medium px-2 py-0.5 rounded-full ${catStyle}`}>
            {item.category}
          </span>
          {item.type && (
            <span className="font-body text-[11px] font-medium px-2 py-0.5 rounded-full bg-beige-1 text-texto">
              {TYPE_LABELS[item.type] ?? item.type}
            </span>
          )}
          <span className={`font-body text-[11px] font-medium px-2 py-0.5 rounded-full ml-auto ${statusStyle}`}>
            {item.status}
          </span>
        </div>

        {item.date && (
          <p className="font-body text-xs text-texto-suave">{item.date}</p>
        )}
      </div>
    </div>
  );
}
