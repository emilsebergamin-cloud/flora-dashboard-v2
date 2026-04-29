import { useRef, useState } from 'react';
import { Plus, Trash2, ImagePlus, Loader2, ExternalLink, X } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { addReferencia, updateReferencia, removeReferencia } from '../../services/collections/ideas.js';
import { uploadImage } from '../../services/storage.js';
import Modal from '../Modal.jsx';

const EMPTY = { nombre: '', link: '', imagen: '', queLePaso: '', comoAdaptar: '' };

function ReferenciaModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try { set('imagen', await uploadImage(file, `references/${Date.now()}`)); }
    catch { setUploadError('No se pudo subir la imagen. Intentá de nuevo.'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Editar referencia' : 'Nueva referencia'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Nombre o cuenta *</label>
          <input className="input-flora" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="@skinbymila" autoFocus />
        </div>
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Link / URL</label>
          <input className="input-flora" value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://instagram.com/…" />
        </div>
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Screenshot</label>
          {form.imagen ? (
            <div className="relative inline-block">
              <img src={form.imagen} alt="ref" className="w-32 h-32 object-cover rounded-xl border border-beige-2" />
              <button type="button" onClick={() => set('imagen', '')} className="absolute -top-2 -right-2 bg-blanco border border-beige-2 rounded-full p-0.5 hover:bg-rosa-claro transition-colors">
                <X size={12} strokeWidth={2} className="text-texto" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 border border-dashed border-beige-3 hover:border-rosa-viejo rounded-xl px-4 py-3 font-body text-sm text-texto-suave hover:text-texto transition-colors">
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} strokeWidth={1.75} />}
              {uploading ? 'Subiendo…' : 'Subir imagen'}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Qué le gustó</label>
          <textarea className="textarea-flora" rows={2} value={form.queLePaso}
            onChange={(e) => set('queLePaso', e.target.value)} placeholder="El uso del color, el tono, la composición…" />
        </div>
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Cómo lo adaptaría</label>
          <textarea className="textarea-flora" rows={2} value={form.comoAdaptar}
            onChange={(e) => set('comoAdaptar', e.target.value)} placeholder="A mi tono, a mi voz, a mi paleta…" />
        </div>
        {uploadError && (
          <p className="font-body text-xs text-rosa-hover">{uploadError}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" className="btn-primary">{initial ? 'Guardar' : 'Crear'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function Referencias() {
  const { dashboard, update } = useDashboard();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const items = dashboard.ideas?.referencias ?? [];

  const handleSave = (data) => {
    if (editing?.id) update((d) => updateReferencia(d, editing.id, data));
    else             update((d) => addReferencia(d, data));
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={14} strokeWidth={2} /> Nueva referencia
        </button>
      </div>

      {items.length === 0 ? (
        <p className="font-body text-sm text-texto-suave py-8 text-center">Sin referencias todavía</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <div key={r.id} onClick={() => { setEditing(r); setModalOpen(true); }}
              className="bg-blanco border border-beige-2 rounded-2xl overflow-hidden cursor-pointer hover:border-beige-3 hover:shadow-sm transition-all">
              {r.imagen ? (
                <img src={r.imagen} alt={r.nombre} className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] bg-beige-1 flex items-center justify-center">
                  <ImagePlus size={28} className="text-beige-3" strokeWidth={1.5} />
                </div>
              )}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-body text-sm text-texto font-medium truncate">{r.nombre}</p>
                  <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {r.link && (
                      <a href={r.link} target="_blank" rel="noreferrer" className="text-texto-suave hover:text-texto p-1 transition-colors">
                        <ExternalLink size={13} strokeWidth={1.75} />
                      </a>
                    )}
                    <button onClick={() => update((d) => removeReferencia(d, r.id))}
                      className="text-texto-suave hover:text-rosa-hover p-1 transition-colors">
                      <Trash2 size={13} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
                {r.queLePaso && <p className="font-body text-xs text-texto-suave mt-1 line-clamp-2">{r.queLePaso}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <ReferenciaModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
