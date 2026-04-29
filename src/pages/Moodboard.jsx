import { useState, useRef, useMemo } from 'react';
import { Plus, X, Trash2, ZoomIn, Upload, Loader2, Images } from 'lucide-react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { storage } from '../services/firebase.js';
import { useDashboard } from '../hooks/useDashboard.jsx';
import { addMoodItem, removeMoodItem } from '../services/collections/mood.js';
import Modal from '../components/Modal.jsx';

// ─── Constantes ───────────────────────────────────────────────────────────────

const PALETA_MARCA = [
  { hex: '#c4a0a0', nombre: 'Rosa viejo'    },
  { hex: '#dfc5c5', nombre: 'Rosa claro'    },
  { hex: '#a3aa8e', nombre: 'Verde seco'    },
  { hex: '#c5cbaf', nombre: 'Verde claro'   },
  { hex: '#f5efe6', nombre: 'Beige cálido'  },
  { hex: '#ede4d8', nombre: 'Beige medio'   },
  { hex: '#e2d5c5', nombre: 'Beige oscuro'  },
  { hex: '#5a4a42', nombre: 'Texto'         },
  { hex: '#8a7a72', nombre: 'Texto suave'   },
  { hex: '#faf7f2', nombre: 'Blanco cálido' },
];

const TAGS_SUGERIDOS = [
  'inspiración', 'colores', 'poses', 'packaging',
  'tipografía', 'texturas', 'lifestyle', 'skincare', 'editorial',
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ url, titulo, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-texto/80 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={url}
          alt={titulo || 'Imagen'}
          className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
        />
        {titulo && (
          <p className="mt-3 text-center font-body text-sm text-blanco/80">{titulo}</p>
        )}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-blanco text-texto rounded-full p-1.5 shadow-lg hover:bg-beige-1 transition-colors">
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ─── Image card ───────────────────────────────────────────────────────────────

function ImageCard({ item, onDelete, onZoom }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-beige-2 aspect-square group cursor-pointer"
      onClick={() => onZoom(item)}>
      <img
        src={item.url}
        alt={item.titulo || 'Imagen'}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-texto/40 flex flex-col justify-between p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex justify-end gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onZoom(item); }}
            className="bg-blanco/90 text-texto rounded-lg p-1.5 hover:bg-blanco transition-colors">
            <ZoomIn size={13} strokeWidth={2} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="bg-blanco/90 text-texto rounded-lg p-1.5 hover:bg-blanco transition-colors">
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </div>

        {(item.titulo || (item.tags ?? []).length > 0) && (
          <div>
            {item.titulo && (
              <p className="font-body text-xs text-blanco font-medium leading-tight mb-1 line-clamp-2">
                {item.titulo}
              </p>
            )}
            {(item.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.map((t) => (
                  <span key={t} className="bg-blanco/20 text-blanco font-body text-[9px] px-1.5 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Modal nueva imagen ───────────────────────────────────────────────────────

function AddImageModal({ open, onClose, onSave }) {
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [titulo,    setTitulo]    = useState('');
  const [tags,      setTags]      = useState([]);
  const [tagInput,  setTagInput]  = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const reset = () => {
    setFile(null); setPreview(null); setTitulo(''); setTags([]); setTagInput('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const addTag = (tag) => {
    const t = tag.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const handleTagKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
  };

  const handleSave = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const id   = uuid();
      const ext  = file.name.split('.').pop();
      const sRef = storageRef(storage, `moodboard/${id}.${ext}`);
      await uploadBytes(sRef, file);
      const url  = await getDownloadURL(sRef);
      await onSave({ tipo: 'imagen', url, titulo: titulo.trim(), tags });
      reset();
      onClose();
    } catch (err) {
      console.error('[Moodboard] upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Nueva imagen">
      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        className={[
          'relative cursor-pointer rounded-2xl border-2 border-dashed transition-colors mb-4 overflow-hidden',
          preview ? 'border-transparent' : 'border-beige-3 hover:border-rosa-viejo',
        ].join(' ')}
        style={{ minHeight: 180 }}>
        {preview ? (
          <img src={preview} alt="preview" className="w-full object-cover rounded-2xl" style={{ maxHeight: 260 }} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-texto-suave gap-2">
            <Upload size={24} strokeWidth={1.5} />
            <p className="font-body text-sm">Arrastrá una imagen o hacé click</p>
          </div>
        )}
        {preview && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
            className="absolute top-2 right-2 bg-texto/60 text-blanco rounded-full p-1 hover:bg-texto transition-colors">
            <X size={13} />
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleFile(e.target.files[0])} />

      <input
        type="text" placeholder="Título (opcional)" value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full border border-beige-2 rounded-xl px-3 py-2.5 font-body text-sm text-texto placeholder:text-texto-suave focus:outline-none focus:border-rosa-viejo bg-blanco mb-3" />

      {/* Tags */}
      <div className="mb-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((t) => (
              <span key={t} className="flex items-center gap-1 bg-beige-2 text-texto font-body text-xs px-2 py-0.5 rounded-full">
                {t}
                <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="text-texto-suave hover:text-texto">
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          type="text" placeholder="Agregar etiqueta + Enter..."
          value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKey}
          className="w-full border border-beige-2 rounded-xl px-3 py-2.5 font-body text-sm text-texto placeholder:text-texto-suave focus:outline-none focus:border-rosa-viejo bg-blanco mb-2" />
        <div className="flex flex-wrap gap-1">
          {TAGS_SUGERIDOS.filter((t) => !tags.includes(t)).map((t) => (
            <button key={t} onClick={() => addTag(t)}
              className="font-body text-xs text-texto-suave border border-beige-2 px-2 py-0.5 rounded-full hover:border-rosa-viejo hover:text-texto transition-colors">
              + {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleClose}
          className="flex-1 font-body text-sm border border-beige-2 text-texto py-2.5 rounded-xl hover:bg-beige-1 transition-colors">
          Cancelar
        </button>
        <button onClick={handleSave} disabled={!file || uploading}
          className="flex-1 font-body text-sm bg-rosa-viejo text-blanco py-2.5 rounded-xl hover:bg-rosa-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {uploading
            ? <><Loader2 size={15} className="animate-spin" /> Subiendo…</>
            : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Moodboard() {
  const { dashboard, update } = useDashboard();

  const [lightbox,     setLightbox]     = useState(null);
  const [showAddImage, setShowAddImage] = useState(false);
  const [copiedHex,    setCopiedHex]    = useState(null);

  const items = useMemo(
    () => (dashboard.mood ?? []).filter((m) => m.tipo === 'imagen'),
    [dashboard.mood],
  );

  const handleSaveImage = async (item) => {
    await update((d) => addMoodItem(d, item));
  };

  const handleDelete = (id) => {
    update((d) => removeMoodItem(d, id));
  };

  const handleCopyBrand = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="px-6 md:px-10 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <h1 className="font-display text-3xl md:text-4xl text-texto">Moodboard</h1>
        <button
          onClick={() => setShowAddImage(true)}
          className="flex items-center gap-1.5 font-body text-sm bg-rosa-viejo text-blanco px-4 py-2 rounded-xl hover:bg-rosa-hover transition-colors">
          <Plus size={15} strokeWidth={2} />
          Nueva imagen
        </button>
      </div>

      {/* Paleta de marca */}
      <div className="bg-blanco border border-beige-2 rounded-2xl p-5 mb-8">
        <p className="font-body text-xs text-texto-suave font-medium uppercase tracking-wide mb-4">
          Paleta de marca — click para copiar hex
        </p>
        <div className="flex flex-wrap gap-4">
          {PALETA_MARCA.map(({ hex, nombre }) => {
            const copied = copiedHex === hex;
            return (
              <button
                key={hex}
                onClick={() => handleCopyBrand(hex)}
                className="flex flex-col items-center gap-1.5 group">
                <div
                  className="w-12 h-12 rounded-xl border border-beige-2 shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-body text-[9px] text-texto text-center leading-tight">
                  {nombre}
                </span>
                <span className={`font-body text-[9px] text-center leading-none uppercase transition-colors ${copied ? 'text-verde-hover font-medium' : 'text-texto-suave'}`}>
                  {copied ? '✓ copiado' : hex}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Imágenes */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-body text-xs text-texto-suave font-medium uppercase tracking-wide">
          Imágenes de referencia
          {items.length > 0 && <span className="ml-2 normal-case font-normal">({items.length})</span>}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-texto-suave gap-3">
          <div className="w-14 h-14 rounded-2xl bg-beige-2 flex items-center justify-center">
            <Images size={24} strokeWidth={1.25} />
          </div>
          <p className="font-body text-sm">Todavía no hay imágenes. ¡Subí tu primera referencia!</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <ImageCard item={item} onDelete={handleDelete} onZoom={setLightbox} />
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox url={lightbox.url} titulo={lightbox.titulo} onClose={() => setLightbox(null)} />
      )}

      <AddImageModal
        open={showAddImage}
        onClose={() => setShowAddImage(false)}
        onSave={handleSaveImage}
      />
    </div>
  );
}
