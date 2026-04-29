import { useState } from 'react';
import { Plus, Star, Check } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { addEncuesta, updateEncuesta, removeEncuesta, listEncuestas } from '../../services/collections/encuestas.js';
import Modal from '../Modal.jsx';

const FILTROS = [
  { key: 'all',      label: 'Todas'     },
  { key: 'favorita', label: 'Favoritas' },
  { key: 'noUsada',  label: 'No usadas' },
];

function EncuestaModal({ open, onClose, onSave, initial }) {
  const empty = { pregunta: '', opcionA: '', opcionB: '', tema: '' };
  const [form, setForm] = useState(initial ?? empty);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pregunta.trim()) return;
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Editar encuesta' : 'Nueva encuesta'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Pregunta *</label>
          <input className="input-flora" value={form.pregunta} onChange={(e) => set('pregunta', e.target.value)} placeholder="¿Usás protector solar todos los días?" autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Opción A</label>
            <input className="input-flora" value={form.opcionA} onChange={(e) => set('opcionA', e.target.value)} placeholder="Sí, siempre" />
          </div>
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Opción B</label>
            <input className="input-flora" value={form.opcionB} onChange={(e) => set('opcionB', e.target.value)} placeholder="A veces me olvido" />
          </div>
        </div>
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Tema</label>
          <input className="input-flora" value={form.tema} onChange={(e) => set('tema', e.target.value)} placeholder="hábitos, piel, rutina…" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" className="btn-primary">{initial ? 'Guardar' : 'Crear'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function BancoEncuestas() {
  const { dashboard, update } = useDashboard();
  const [filtro, setFiltro] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filters = filtro === 'favorita' ? { favorita: true } : filtro === 'noUsada' ? { noUsada: true } : {};
  const items = listEncuestas(dashboard, filters);

  const handleSave = (data) => {
    if (editing?.id) {
      update((d) => updateEncuesta(d, editing.id, data));
    } else {
      update((d) => addEncuesta(d, data));
    }
    setModalOpen(false);
    setEditing(null);
  };

  const toggle = (id, field) => {
    const item = dashboard.encuestas.find((e) => e.id === id);
    if (item) update((d) => updateEncuesta(d, id, { [field]: !item[field] }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5">
          {FILTROS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              className={[
                'font-body text-sm px-3.5 py-1.5 rounded-full transition-colors',
                filtro === key ? 'bg-rosa-viejo text-blanco font-medium' : 'bg-blanco border border-beige-2 text-texto hover:border-rosa-viejo',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={14} strokeWidth={2} /> Nueva encuesta
        </button>
      </div>

      {/* Lista */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="font-body text-texto-suave mb-4">Sin encuestas{filtro !== 'all' ? ' en este filtro' : ''}</p>
          <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={14} strokeWidth={2} /> Agregar
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((enc) => (
            <div
              key={enc.id}
              className={`bg-blanco border rounded-2xl px-5 py-4 flex gap-4 items-start cursor-pointer hover:border-beige-3 transition-colors ${enc.usada ? 'opacity-60' : 'border-beige-2'}`}
              onClick={() => { setEditing(enc); setModalOpen(true); }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-texto font-medium mb-2">{enc.pregunta}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="font-body text-xs bg-beige-1 text-texto px-2.5 py-1 rounded-full">A: {enc.opcionA}</span>
                  <span className="font-body text-xs bg-beige-1 text-texto px-2.5 py-1 rounded-full">B: {enc.opcionB}</span>
                  {enc.tema && <span className="font-body text-xs bg-rosa-claro text-texto px-2.5 py-1 rounded-full">{enc.tema}</span>}
                </div>
              </div>
              <div className="flex gap-2 items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggle(enc.id, 'favorita')}
                  className={`p-1.5 rounded-lg transition-colors ${enc.favorita ? 'text-rosa-viejo bg-rosa-claro' : 'text-texto-suave hover:text-rosa-viejo'}`}
                  title="Favorita"
                >
                  <Star size={15} strokeWidth={1.75} fill={enc.favorita ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => toggle(enc.id, 'usada')}
                  className={`p-1.5 rounded-lg transition-colors ${enc.usada ? 'text-verde-hover bg-verde-claro' : 'text-texto-suave hover:text-verde-hover'}`}
                  title="Marcar como usada"
                >
                  <Check size={15} strokeWidth={2} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); update((d) => removeEncuesta(d, enc.id)); }}
                  className="font-body text-xs text-rosa-hover hover:underline ml-1"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EncuestaModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
