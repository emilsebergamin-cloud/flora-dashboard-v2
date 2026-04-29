import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import Modal from '../Modal.jsx';
import { uploadImage } from '../../services/storage.js';

const EMPTY = {
  titulo: '', semana: 1, categoria: 'educacional',
  storiesIntro: '', estado: 'idea', notasSlides: '',
  imagenes: [], portada: '',
};

export default function CarruselModal({ open, onClose, onSave, onDelete, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [uploadingSlides, setUploadingSlides] = useState(false);
  const portadaRef = useRef(null);
  const slidesRef  = useRef(null);

  useEffect(() => {
    if (!open) return;
    setForm(initial ? { ...EMPTY, ...initial, imagenes: initial.imagenes ?? [] } : EMPTY);
  }, [open, initial]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handlePortada = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { set('portada', await uploadImage(file, `carruseles/${Date.now()}`)); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSlides = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingSlides(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f, `carruseles/${Date.now()}/slides`)));
      set('imagenes', [...form.imagenes, ...urls]);
    } finally { setUploadingSlides(false); e.target.value = ''; }
  };

  const removeSlide = (i) => set('imagenes', form.imagenes.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onSave(form);
  };

  const isEdit = Boolean(initial?.id);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar carrusel' : 'Nuevo carrusel'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Título *</label>
          <input className="input-flora" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Ej: Tu cara tiene 43 músculos" autoFocus />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Semana</label>
            <select className="input-flora" value={form.semana} onChange={(e) => set('semana', Number(e.target.value))}>
              {[1,2,3,4].map((s) => <option key={s} value={s}>Semana {s}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Categoría</label>
            <select className="input-flora" value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
              {['educacional','informativo','inspiracional','orgánico','conversión'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Estado</label>
          <select className="input-flora" value={form.estado} onChange={(e) => set('estado', e.target.value)}>
            {['idea','en producción','listo','publicado'].map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Stories de introducción</label>
          <input className="input-flora" value={form.storiesIntro} onChange={(e) => set('storiesIntro', e.target.value)} placeholder="Ej: Story del lunes S2 prepara el tema" />
        </div>

        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Notas por slide</label>
          <textarea
            className="textarea-flora"
            rows={4}
            value={form.notasSlides}
            onChange={(e) => set('notasSlides', e.target.value)}
            placeholder={"Slide 1: Hook — dato sorprendente\nSlide 2: Desarrollo…\nSlide 3: CTA"}
          />
        </div>

        {/* Portada */}
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Portada</label>
          {form.portada ? (
            <div className="relative inline-block">
              <img src={form.portada} alt="portada" className="w-24 h-24 object-cover rounded-xl border border-beige-2" />
              <button type="button" onClick={() => set('portada', '')} className="absolute -top-2 -right-2 bg-blanco border border-beige-2 rounded-full p-0.5 hover:bg-rosa-claro transition-colors">
                <X size={12} strokeWidth={2} className="text-texto" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => portadaRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 border border-dashed border-beige-3 hover:border-rosa-viejo rounded-xl px-4 py-3 font-body text-sm text-texto-suave hover:text-texto transition-colors">
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} strokeWidth={1.75} />}
              {uploading ? 'Subiendo…' : 'Subir portada'}
            </button>
          )}
          <input ref={portadaRef} type="file" accept="image/*" className="hidden" onChange={handlePortada} />
        </div>

        {/* Slides */}
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Imágenes del carrusel</label>
          {form.imagenes.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
              {form.imagenes.map((url, i) => (
                <div key={i} className="relative shrink-0">
                  <img src={url} alt={`slide-${i+1}`} className="w-20 h-20 object-cover rounded-xl border border-beige-2" />
                  <button type="button" onClick={() => removeSlide(i)} className="absolute -top-2 -right-2 bg-blanco border border-beige-2 rounded-full p-0.5 hover:bg-rosa-claro transition-colors">
                    <X size={11} strokeWidth={2} className="text-texto" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-texto/60 text-blanco text-[9px] font-medium rounded px-1">{i+1}</span>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => slidesRef.current?.click()} disabled={uploadingSlides}
            className="flex items-center gap-2 border border-dashed border-beige-3 hover:border-rosa-viejo rounded-xl px-4 py-3 font-body text-sm text-texto-suave hover:text-texto transition-colors">
            {uploadingSlides ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} strokeWidth={1.75} />}
            {uploadingSlides ? 'Subiendo…' : 'Subir imágenes'}
          </button>
          <input ref={slidesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSlides} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-beige-2">
          {isEdit ? (
            <button type="button" onClick={() => onDelete(initial.id)} className="font-body text-xs text-rosa-hover hover:underline">Eliminar</button>
          ) : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" className="btn-primary">{isEdit ? 'Guardar cambios' : 'Crear'}</button>
          </div>
        </div>

      </form>
    </Modal>
  );
}
