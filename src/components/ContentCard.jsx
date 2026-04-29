import { Pencil, Trash2 } from 'lucide-react';

const CATEGORY_STYLES = {
  'orgánico':      'bg-beige-2 text-texto',
  'educacional':   'bg-verde-claro text-texto',
  'informativo':   'bg-rosa-claro text-texto',
  'inspiracional': 'bg-rosa-claro text-texto',
  'conversión':    'bg-verde-claro text-texto',
  'reel':          'bg-beige-3 text-texto',
};

const STATUS_STYLES = {
  'idea':      'bg-beige-2 text-texto',
  'borrador':  'bg-rosa-claro text-texto',
  'listo':     'bg-verde-claro text-texto',
  'publicado': 'bg-verde-seco text-blanco',
};

const TYPE_LABELS = {
  post: 'Post', carrusel: 'Carrusel', reel: 'Reel', story: 'Story',
};

export default function ContentCard({ item, onEdit, onDelete }) {
  const catStyle    = CATEGORY_STYLES[item.category] ?? 'bg-beige-2 text-texto';
  const statusStyle = STATUS_STYLES[item.status]     ?? 'bg-beige-2 text-texto';

  return (
    <div
      className="group bg-blanco border border-beige-2 rounded-2xl overflow-hidden flex flex-col hover:border-beige-3 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onEdit(item)}>

      {/* Portada */}
      <div className="relative aspect-[4/3] bg-beige-1 overflow-hidden">
        {item.portada ? (
          <img src={item.portada} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-3xl ${catStyle}`}>
            {item.category === 'reel' ? '▶' : item.category === 'educacional' ? '◈' : '◉'}
          </div>
        )}
        {/* Botones de acción: siempre visibles en mobile, en hover en desktop */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            className="bg-blanco/90 rounded-lg p-1.5 hover:bg-blanco transition-colors shadow-sm">
            <Pencil size={13} strokeWidth={1.75} className="text-texto" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="bg-blanco/90 rounded-lg p-1.5 hover:bg-rosa-claro transition-colors shadow-sm">
            <Trash2 size={13} strokeWidth={1.75} className="text-rosa-hover" />
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
