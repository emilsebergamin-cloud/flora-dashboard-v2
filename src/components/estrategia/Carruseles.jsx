import { useState } from 'react';
import { Plus, Pencil, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { addCarrusel, updateCarrusel, removeCarrusel, listCarruseles } from '../../services/collections/carruseles.js';
import CarruselModal from './CarruselModal.jsx';

const STATUS_STYLES = {
  'idea':          'bg-beige-2 text-texto',
  'en producción': 'bg-rosa-claro text-rosa-hover',
  'listo':         'bg-verde-claro text-verde-hover',
  'publicado':     'bg-verde-seco text-blanco',
};

const SEMANA_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 1, label: 'S1' },
  { value: 2, label: 'S2' },
  { value: 3, label: 'S3' },
  { value: 4, label: 'S4' },
];

function CarruselCard({ item, onEdit }) {
  return (
    <div className="bg-blanco border border-beige-2 rounded-2xl overflow-hidden hover:border-beige-3 hover:shadow-sm transition-all">
      {/* Slides preview */}
      {item.imagenes?.length > 0 ? (
        <div className="flex gap-1 overflow-x-auto p-3 pb-0">
          {item.imagenes.map((url, i) => (
            <div key={i} className="relative shrink-0">
              <img src={url} alt={`s${i+1}`} className="w-16 h-16 object-cover rounded-xl" />
              <span className="absolute bottom-1 left-1 bg-texto/60 text-blanco text-[9px] rounded px-1">{i+1}</span>
            </div>
          ))}
        </div>
      ) : item.portada ? (
        <img src={item.portada} alt={item.titulo} className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-24 bg-beige-1 flex items-center justify-center">
          <ChevronRight size={24} className="text-beige-3" />
        </div>
      )}

      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-body text-sm text-texto font-medium leading-snug">{item.titulo}</p>
          <button onClick={() => onEdit(item)} className="text-texto-suave hover:text-texto p-1 shrink-0 transition-colors">
            <Pencil size={14} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="font-body text-[11px] font-medium px-2 py-0.5 rounded-full bg-beige-1 text-texto">S{item.semana}</span>
          <span className="font-body text-[11px] font-medium px-2 py-0.5 rounded-full bg-beige-2 text-texto">{item.categoria}</span>
          <span className={`font-body text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[item.estado] ?? STATUS_STYLES.idea}`}>
            {item.estado}
          </span>
        </div>

        {item.notasSlides && (
          <p className="font-body text-xs text-texto-suave line-clamp-2">{item.notasSlides}</p>
        )}
      </div>
    </div>
  );
}

export default function Carruseles() {
  const { dashboard, update } = useDashboard();
  const [semanaFilter, setSemanaFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filters = semanaFilter !== 'all' ? { semana: semanaFilter } : {};
  const items = listCarruseles(dashboard, filters);

  const openNew  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setModalOpen(true); };
  const close    = () => { setModalOpen(false); setEditing(null); };

  const handleSave = (data) => {
    if (editing?.id) update((d) => updateCarrusel(d, editing.id, data));
    else             update((d) => addCarrusel(d, data));
    close();
  };

  const handleDelete = (id) => {
    update((d) => removeCarrusel(d, id));
    close();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {SEMANA_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSemanaFilter(value)}
              className={[
                'font-body text-sm px-3.5 py-1.5 rounded-full transition-colors',
                semanaFilter === value ? 'bg-rosa-viejo text-blanco font-medium' : 'bg-blanco border border-beige-2 text-texto hover:border-rosa-viejo',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={14} strokeWidth={2} /> Nuevo carrusel
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="font-body text-texto-suave mb-4">Sin carruseles{semanaFilter !== 'all' ? ` en S${semanaFilter}` : ''}</p>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={14} strokeWidth={2} /> Crear el primero
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <CarruselCard key={item.id} item={item} onEdit={openEdit} />
          ))}
        </div>
      )}

      <CarruselModal open={modalOpen} onClose={close} onSave={handleSave} onDelete={handleDelete} initial={editing} />
    </div>
  );
}
