import { useEffect, useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import Modal from './Modal.jsx';
import { uploadImage } from '../services/storage.js';

const EMPTY = {
  title: '', excerpt: '', category: 'orgánico', type: 'post',
  status: 'idea', date: '', tags: '',
  cta: '',
  reelData: { concepto: '', audio: '', textoSuperpuesto: '', apareceFlora: 'No', estadoProduccion: 'idea' },
  notasSlides: '', imagenes: [],
  portada: '',
};

function AutoTextarea({ value, onChange, placeholder, rows = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      className="textarea-flora"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{ overflow: 'hidden' }}
    />
  );
}

export default function ContentModal({ open, onClose, onSave, onDelete, initial }) {
  const [form, setForm]       = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [uploadingSlides, setUploadingSlides] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const portadaRef  = useRef(null);
  const slidesRef   = useRef(null);

  // Carga datos al abrir (nuevo o editar)
  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        ...EMPTY,
        ...initial,
        tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags ?? ''),
        reelData: { ...EMPTY.reelData, ...(initial.reelData ?? {}) },
        notasSlides: initial.notasSlides ?? '',
        imagenes: initial.imagenes ?? [],
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, initial]);

  const set     = (k, v)    => setForm((p) => ({ ...p, [k]: v }));
  const setReel = (k, v)    => setForm((p) => ({ ...p, reelData: { ...p.reelData, [k]: v } }));

  const isReel      = form.category === 'reel' || form.type === 'reel';
  const isCarrusel  = form.type === 'carrusel';
  const isConversion = form.category === 'conversión';

  // Upload portada
  const handlePortada = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadImage(file, `content/${Date.now()}`);
      set('portada', url);
    } catch {
      setUploadError('No se pudo subir la imagen. Intentá de nuevo.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Upload slides del carrusel
  const handleSlides = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingSlides(true);
    setUploadError('');
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f, `content/${Date.now()}/slides`)));
      set('imagenes', [...form.imagenes, ...urls]);
    } catch {
      setUploadError('No se pudieron subir las imágenes. Intentá de nuevo.');
    } finally {
      setUploadingSlides(false);
      e.target.value = '';
    }
  };

  const removeSlide = (idx) => set('imagenes', form.imagenes.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const tagsArr = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({
      ...form,
      tags: tagsArr,
      reelData: isReel ? form.reelData : null,
    });
  };

  const isEdit = Boolean(initial?.id);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar contenido' : 'Nuevo contenido'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Título */}
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Título *</label>
          <input className="input-flora" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ej: Mitos del masaje facial" autoFocus />
        </div>

        {/* Descripción */}
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Descripción / idea</label>
          <AutoTextarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="De qué trata, ángulo, enfoque…" />
        </div>

        {/* Categoría + Tipo */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Categoría</label>
            <select className="input-flora" value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="orgánico">Orgánico</option>
              <option value="educacional">Educacional</option>
              <option value="informativo">Informativo</option>
              <option value="inspiracional">Inspiracional</option>
              <option value="conversión">Conversión</option>
              <option value="reel">Reel</option>
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Formato</label>
            <select className="input-flora" value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="post">Post estático</option>
              <option value="carrusel">Carrusel</option>
              <option value="reel">Reel</option>
              <option value="story">Story</option>
            </select>
          </div>
        </div>

        {/* Estado + Fecha */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Estado</label>
            <select className="input-flora" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="idea">Idea</option>
              <option value="borrador">Borrador</option>
              <option value="listo">Listo</option>
              <option value="publicado">Publicado</option>
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Fecha de publicación</label>
            <input className="input-flora" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Tags (separados por coma)</label>
          <input className="input-flora" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="autoridad, piel, hábitos" />
        </div>

        {/* Portada */}
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Imagen de portada</label>
          {form.portada ? (
            <div className="relative inline-block">
              <img src={form.portada} alt="portada" className="w-24 h-24 object-cover rounded-xl border border-beige-2" />
              <button
                type="button"
                onClick={() => set('portada', '')}
                className="absolute -top-2 -right-2 bg-blanco border border-beige-2 rounded-full p-0.5 hover:bg-rosa-claro transition-colors"
              >
                <X size={12} strokeWidth={2} className="text-texto" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => portadaRef.current?.click()}
              className="flex items-center gap-2 border border-dashed border-beige-3 hover:border-rosa-viejo rounded-xl px-4 py-3 font-body text-sm text-texto-suave hover:text-texto transition-colors"
              disabled={uploading}
            >
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} strokeWidth={1.75} />}
              {uploading ? 'Subiendo…' : 'Subir portada'}
            </button>
          )}
          <input ref={portadaRef} type="file" accept="image/*" className="hidden" onChange={handlePortada} />
        </div>

        {/* ── Campos extra: conversión ── */}
        {isConversion && (
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">CTA</label>
            <input className="input-flora" value={form.cta} onChange={(e) => set('cta', e.target.value)} placeholder="Ej: Reservá tu sesión en el link de bio" />
          </div>
        )}

        {/* ── Campos extra: reel ── */}
        {isReel && (
          <div className="flex flex-col gap-3 border-t border-beige-2 pt-4">
            <p className="font-body text-xs text-texto font-semibold uppercase tracking-widest">Detalles del reel</p>
            <div>
              <label className="font-body text-xs text-texto font-medium mb-1.5 block">Concepto (qué se ve en pantalla)</label>
              <AutoTextarea value={form.reelData.concepto} onChange={(e) => setReel('concepto', e.target.value)} placeholder="Manos trabajando, close-up, etc." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-texto font-medium mb-1.5 block">Audio / música</label>
                <input className="input-flora" value={form.reelData.audio} onChange={(e) => setReel('audio', e.target.value)} placeholder="Nombre o descripción" />
              </div>
              <div>
                <label className="font-body text-xs text-texto font-medium mb-1.5 block">Texto superpuesto</label>
                <input className="input-flora" value={form.reelData.textoSuperpuesto} onChange={(e) => setReel('textoSuperpuesto', e.target.value)} placeholder="Caption on screen" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-texto font-medium mb-1.5 block">¿Aparece en cámara?</label>
                <select className="input-flora" value={form.reelData.apareceFlora} onChange={(e) => setReel('apareceFlora', e.target.value)}>
                  <option>Sí</option><option>No</option><option>Solo manos</option>
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-texto font-medium mb-1.5 block">Estado de producción</label>
                <select className="input-flora" value={form.reelData.estadoProduccion} onChange={(e) => setReel('estadoProduccion', e.target.value)}>
                  <option value="idea">Idea</option>
                  <option value="guion">Guion</option>
                  <option value="grabado">Grabado</option>
                  <option value="editado">Editado</option>
                  <option value="publicado">Publicado</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Campos extra: carrusel ── */}
        {isCarrusel && (
          <div className="flex flex-col gap-3 border-t border-beige-2 pt-4">
            <p className="font-body text-xs text-texto font-semibold uppercase tracking-widest">Slides del carrusel</p>
            <div>
              <label className="font-body text-xs text-texto font-medium mb-1.5 block">Notas por slide</label>
              <AutoTextarea
                value={form.notasSlides}
                onChange={(e) => set('notasSlides', e.target.value)}
                placeholder={'Slide 1: Hook…\nSlide 2: Desarrollo…\nSlide 3: CTA…'}
                rows={3}
              />
            </div>
            {/* Miniaturas */}
            {form.imagenes.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {form.imagenes.map((url, i) => (
                  <div key={i} className="relative shrink-0">
                    <img src={url} alt={`slide-${i + 1}`} className="w-20 h-20 object-cover rounded-xl border border-beige-2" />
                    <button
                      type="button"
                      onClick={() => removeSlide(i)}
                      className="absolute -top-2 -right-2 bg-blanco border border-beige-2 rounded-full p-0.5 hover:bg-rosa-claro transition-colors"
                    >
                      <X size={11} strokeWidth={2} className="text-texto" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => slidesRef.current?.click()}
              className="flex items-center gap-2 border border-dashed border-beige-3 hover:border-rosa-viejo rounded-xl px-4 py-3 font-body text-sm text-texto-suave hover:text-texto transition-colors"
              disabled={uploadingSlides}
            >
              {uploadingSlides ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} strokeWidth={1.75} />}
              {uploadingSlides ? 'Subiendo…' : 'Subir imágenes del carrusel'}
            </button>
            <input ref={slidesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSlides} />
          </div>
        )}

        {uploadError && (
          <p className="font-body text-xs text-rosa-hover">{uploadError}</p>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2 border-t border-beige-2">
          {isEdit ? (
            <button type="button" onClick={() => onDelete(initial.id)} className="font-body text-xs text-rosa-hover hover:underline">
              Eliminar
            </button>
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
