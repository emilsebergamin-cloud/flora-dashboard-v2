import { useState } from 'react';
import { Plus, Download, LayoutGrid, Grid3x3 } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard.jsx';
import { addContent, updateContent, removeContent, listContent } from '../services/collections/content.js';
import ContentCard from '../components/ContentCard.jsx';
import ContentModal from '../components/ContentModal.jsx';
import { exportPDF, buildContenidoHTML } from '../utils/exportPDF.js';

const FILTERS = [
  { value: 'all',          label: 'Todo'         },
  { value: 'orgánico',     label: 'Orgánico'     },
  { value: 'educacional',  label: 'Educacional'  },
  { value: 'informativo',  label: 'Informativo'  },
  { value: 'inspiracional',label: 'Inspiracional'},
  { value: 'conversión',   label: 'Conversión'   },
  { value: 'reel',         label: 'Reels'        },
];

const STATUS_ORDER = { publicado: 0, listo: 1, borrador: 2, idea: 3 };

// ── Vista Feed (Paso 6) ──────────────────────────────────────────────────────
function FeedPreview({ items, onEdit }) {
  const withImage = items.filter((c) => c.portada && (c.status === 'listo' || c.status === 'publicado'));

  if (!withImage.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-body text-texto-suave mb-1">Sin imágenes para mostrar</p>
        <p className="font-body text-xs text-texto-suave">Subí portadas a los contenidos en estado "listo" o "publicado"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {withImage.map((item) => (
        <button
          key={item.id}
          onClick={() => onEdit(item)}
          className="aspect-square overflow-hidden group relative"
        >
          <img src={item.portada} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-texto/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
            <p className="font-body text-[11px] text-blanco font-medium line-clamp-2 text-left">{item.title}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function Contenido() {
  const { dashboard, update } = useDashboard();
  const [filter, setFilter]   = useState('all');
  const [view, setView]       = useState('cards'); // 'cards' | 'feed'
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const allItems = listContent(dashboard, filter !== 'all' ? { category: filter } : {});
  const sorted   = [...allItems].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) || (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

  const openNew  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSave = async (data) => {
    if (editing?.id) {
      await update((d) => updateContent(d, editing.id, data));
    } else {
      await update((d) => addContent(d, data));
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    await update((d) => removeContent(d, deleteConfirm));
    setDeleteConfirm(null);
    closeModal();
  };

  const handlePDF = async () => {
    const label = FILTERS.find((f) => f.value === filter)?.label ?? 'Todo';
    await exportPDF(buildContenidoHTML(sorted, label), `flora-contenido-${filter}.pdf`);
  };

  return (
    <div className="px-6 md:px-10 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl md:text-4xl text-texto">Contenido</h1>
        <div className="flex items-center gap-2">
          <button onClick={handlePDF} className="flex items-center gap-1.5 btn-ghost text-xs px-3 py-2">
            <Download size={14} strokeWidth={1.75} /> PDF
          </button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={15} strokeWidth={2} /> Nuevo
          </button>
        </div>
      </div>

      {/* Filtros + Toggle vista */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={[
                'font-body text-sm px-3.5 py-1.5 rounded-full transition-colors',
                filter === value
                  ? 'bg-rosa-viejo text-blanco font-medium'
                  : 'bg-blanco border border-beige-2 text-texto hover:border-rosa-viejo',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-beige-1 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setView('cards')}
            className={['p-2 rounded-lg transition-colors', view === 'cards' ? 'bg-blanco shadow-sm text-texto' : 'text-texto-suave hover:text-texto'].join(' ')}
          >
            <LayoutGrid size={16} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setView('feed')}
            className={['p-2 rounded-lg transition-colors', view === 'feed' ? 'bg-blanco shadow-sm text-texto' : 'text-texto-suave hover:text-texto'].join(' ')}
          >
            <Grid3x3 size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Contenido */}
      {view === 'feed' ? (
        <FeedPreview items={sorted} onEdit={openEdit} />
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-body text-texto-suave mb-4">Todavía no hay contenido{filter !== 'all' ? ` en "${FILTERS.find(f=>f.value===filter)?.label}"` : ''}</p>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={15} strokeWidth={2} /> Crear el primero
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map((item) => (
            <ContentCard key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal CRUD */}
      <ContentModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
        initial={editing}
      />

      {/* Confirm delete */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-texto/30 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 bg-blanco rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <p className="font-body text-texto font-medium mb-1">¿Eliminar este contenido?</p>
            <p className="font-body text-sm text-texto-suave mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost">Cancelar</button>
              <button onClick={confirmDelete} className="font-body text-sm font-medium px-5 py-2.5 rounded-xl bg-rosa-hover text-blanco hover:bg-rosa-viejo transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
