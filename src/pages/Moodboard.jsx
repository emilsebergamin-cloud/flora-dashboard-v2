import { useState, useRef, useMemo } from 'react';
import { Plus, X, Trash2, ZoomIn, Upload, Loader2, Palette } from 'lucide-react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { storage } from '../services/firebase.js';
import { useDashboard } from '../hooks/useDashboard.jsx';
import { addMoodItem, removeMoodItem } from '../services/collections/mood.js';
import Modal from '../components/Modal.jsx';

// ─── Constantes ───────────────────────────────────────────────────────────────

const PALETA_MARCA = [
  { hex: '#c4a0a0', nombre: 'Rosa viejo' },
  { hex: '#dfc5c5', nombre: 'Rosa claro' },
  { hex: '#a3aa8e', nombre: 'Verde seco' },
  { hex: '#c5cbaf', nombre: 'Verde claro' },
  { hex: '#f5efe6', nombre: 'Beige cálido' },
  { hex: '#ede4d8', nombre: 'Beige medio' },
  { hex: '#e2d5c5', nombre: 'Beige oscuro' },
  { hex: '#5a4a42', nombre: 'Texto' },
  { hex: '#8a7a72', nombre: 'Texto suave' },
  { hex: '#faf7f2', nombre: 'Blanco cálido' },
];

const FILTROS = [
  { key: 'todos',   label: 'Todos'     },
  { key: 'imagen',  label: 'Imágenes'  },
  { key: 'paleta',  label: 'Paletas'   },
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

// ─── Cards ────────────────────────────────────────────────────────────────────

function ImageCard({ item, onDelete, onZoom }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-beige-2 aspect-square group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onZoom(item)}>
      <img
        src={item.url}
        alt={item.titulo || 'Imagen'}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className={`absolute inset-0 bg-texto/40 flex flex-col justify-between p-2.5 transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
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

function PaletteCard({ item, onDelete }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (hex, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="bg-blanco border border-beige-2 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="font-body text-sm text-texto font-medium leading-snug">{item.nombre || 'Paleta'}</p>
        <button
          onClick={() => onDelete(item.id)}
          className="text-texto-suave hover:text-texto p-1 transition-colors shrink-0">
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Swatches */}
      <div className="flex gap-1.5 flex-wrap">
        {(item.colores ?? []).map((hex, i) => (
          <button
            key={i}
            onClick={(e) => handleCopy(hex, e)}
            title={copied === hex ? '¡Copiado!' : hex}
            className="flex flex-col items-center gap-1 group">
            <div
              className="w-9 h-9 rounded-xl border border-beige-2 shadow-sm transition-transform group-hover:scale-110"
              style={{ backgroundColor: hex }}
            />
            <span className="font-body text-[8px] text-texto-suave uppercase leading-none">
              {copied === hex ? '✓' : hex.slice(1)}
            </span>
          </button>
        ))}
      </div>

      {item.notas && (
        <p className="font-body text-xs text-texto-suave leading-relaxed">{item.notas}</p>
      )}
    </div>
  );
}

// ─── Modal Imagen ─────────────────────────────────────────────────────────────

function AddImageModal({ open, onClose, onSave }) {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [titulo, setTitulo]   = useState('');
  const [tags, setTags]       = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const reset = () => {
    setFile(null); setPreview(null); setTitulo('');
    setTags([]); setTagInput('');
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
      <input
        ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleFile(e.target.files[0])} />

      {/* Título */}
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

// ─── Modal Paleta ─────────────────────────────────────────────────────────────

function AddPaletteModal({ open, onClose, onSave }) {
  const [nombre, setNombre] = useState('');
  const [colores, setColores] = useState(['#c4a0a0', '#dfc5c5', '#a3aa8e']);
  const [notas, setNotas]   = useState('');

  const reset = () => { setNombre(''); setColores(['#c4a0a0', '#dfc5c5', '#a3aa8e']); setNotas(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleSave = async () => {
    await onSave({ tipo: 'paleta', nombre: nombre.trim() || 'Sin nombre', colores, notas: notas.trim() });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Nueva paleta">
      <input
        type="text" placeholder="Nombre de la paleta" value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border border-beige-2 rounded-xl px-3 py-2.5 font-body text-sm text-texto placeholder:text-texto-suave focus:outline-none focus:border-rosa-viejo bg-blanco mb-4" />

      <p className="font-body text-xs text-texto-suave mb-2 font-medium">Colores</p>
      <div className="flex flex-wrap gap-3 mb-4">
        {colores.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="relative">
              <input
                type="color" value={c}
                onChange={(e) => setColores((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                className="w-10 h-10 rounded-xl cursor-pointer border border-beige-2 p-0.5 bg-blanco" />
              {colores.length > 2 && (
                <button
                  onClick={() => setColores((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 bg-texto text-blanco rounded-full w-4 h-4 flex items-center justify-center hover:bg-rosa-hover transition-colors">
                  <X size={8} />
                </button>
              )}
            </div>
            <span className="font-body text-[9px] text-texto-suave uppercase">{c.slice(1)}</span>
          </div>
        ))}
        {colores.length < 8 && (
          <button
            onClick={() => setColores((prev) => [...prev, '#ede4d8'])}
            className="w-10 h-10 rounded-xl border-2 border-dashed border-beige-3 hover:border-rosa-viejo text-texto-suave hover:text-texto transition-colors flex items-center justify-center">
            <Plus size={16} />
          </button>
        )}
      </div>

      <textarea
        placeholder="Notas (opcional)" value={notas}
        onChange={(e) => setNotas(e.target.value)} rows={2}
        className="w-full border border-beige-2 rounded-xl px-3 py-2.5 font-body text-sm text-texto placeholder:text-texto-suave focus:outline-none focus:border-rosa-viejo bg-blanco resize-none mb-4" />

      <div className="flex gap-2">
        <button onClick={handleClose}
          className="flex-1 font-body text-sm border border-beige-2 text-texto py-2.5 rounded-xl hover:bg-beige-1 transition-colors">
          Cancelar
        </button>
        <button onClick={handleSave}
          className="flex-1 font-body text-sm bg-rosa-viejo text-blanco py-2.5 rounded-xl hover:bg-rosa-hover transition-colors">
          Guardar
        </button>
      </div>
    </Modal>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Moodboard() {
  const { dashboard, update } = useDashboard();

  const [filtro,       setFiltro]       = useState('todos');
  const [lightbox,     setLightbox]     = useState(null);
  const [showAddImage, setShowAddImage] = useState(false);
  const [showAddPalette, setShowAddPalette] = useState(false);
  const [copiedHex,    setCopiedHex]    = useState(null);

  const items = useMemo(() => {
    const all = dashboard.mood ?? [];
    if (filtro === 'todos')   return all;
    return all.filter((m) => m.tipo === filtro);
  }, [dashboard.mood, filtro]);

  const handleSaveImage = async (item) => {
    await update((d) => addMoodItem(d, item));
  };

  const handleSavePalette = async (item) => {
    await update((d) => addMoodItem(d, item));
  };

  const handleDelete = (id) => {
    update((d) => removeMoodItem(d, id));
  };

  const handleCopyBrand = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1200);
  };

  return (
    <div className="px-6 md:px-10 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <h1 className="font-display text-3xl md:text-4xl text-texto">Moodboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddPalette(true)}
            className="flex items-center gap-1.5 font-body text-sm border border-beige-2 text-texto px-4 py-2 rounded-xl hover:bg-beige-1 transition-colors">
            <Palette size={15} strokeWidth={1.75} />
            <span>Nueva paleta</span>
          </button>
          <button
            onClick={() => setShowAddImage(true)}
            className="flex items-center gap-1.5 font-body text-sm bg-rosa-viejo text-blanco px-4 py-2 rounded-xl hover:bg-rosa-hover transition-colors">
            <Plus size={15} strokeWidth={2} />
            <span>Nueva imagen</span>
          </button>
        </div>
      </div>

      {/* Paleta de marca */}
      <div className="bg-blanco border border-beige-2 rounded-2xl p-5 mb-8">
        <p className="font-body text-xs text-texto-suave font-medium uppercase tracking-wide mb-3">
          Paleta de marca
        </p>
        <div className="flex flex-wrap gap-3">
          {PALETA_MARCA.map(({ hex, nombre }) => (
            <button
              key={hex}
              onClick={() => handleCopyBrand(hex)}
              title={copiedHex === hex ? '¡Copiado!' : `Copiar ${hex}`}
              className="flex flex-col items-center gap-1.5 group">
              <div
                className="w-10 h-10 rounded-xl border border-beige-2 shadow-sm transition-transform group-hover:scale-110"
                style={{ backgroundColor: hex }}
              />
              <span className="font-body text-[9px] text-texto-suave text-center leading-tight">
                {copiedHex === hex ? '✓' : nombre}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {FILTROS.map(({ key, label }) => (
          <button key={key} onClick={() => setFiltro(key)}
            className={[
              'font-body text-sm px-3.5 py-1.5 rounded-full transition-colors',
              filtro === key
                ? 'bg-rosa-viejo text-blanco font-medium'
                : 'bg-blanco border border-beige-2 text-texto hover:border-rosa-viejo',
            ].join(' ')}>
            {label}
          </button>
        ))}
        {items.length > 0 && (
          <span className="font-body text-sm text-texto-suave self-center ml-1">
            {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
          </span>
        )}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-texto-suave gap-3">
          <div className="w-14 h-14 rounded-2xl bg-beige-2 flex items-center justify-center">
            <Palette size={24} strokeWidth={1.25} />
          </div>
          <p className="font-body text-sm">
            {filtro === 'todos'
              ? 'Todavía no hay nada acá. ¡Subí tu primera imagen!'
              : filtro === 'imagen'
              ? 'No hay imágenes aún.'
              : 'No hay paletas aún.'}
          </p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {items.map((item) =>
            item.tipo === 'imagen' ? (
              <div key={item.id} className="break-inside-avoid">
                <ImageCard
                  item={item}
                  onDelete={handleDelete}
                  onZoom={setLightbox}
                />
              </div>
            ) : (
              <div key={item.id} className="break-inside-avoid">
                <PaletteCard item={item} onDelete={handleDelete} />
              </div>
            ),
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          url={lightbox.url}
          titulo={lightbox.titulo}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Modals */}
      <AddImageModal
        open={showAddImage}
        onClose={() => setShowAddImage(false)}
        onSave={handleSaveImage}
      />
      <AddPaletteModal
        open={showAddPalette}
        onClose={() => setShowAddPalette(false)}
        onSave={handleSavePalette}
      />
    </div>
  );
}
