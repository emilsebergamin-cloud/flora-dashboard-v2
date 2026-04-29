import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarDays, ChevronDown } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard.jsx';
import { getGreeting, getDateString, getDailyQuote } from '../utils/greeting.js';
import { addContent } from '../services/collections/content.js';
import { addStory } from '../services/collections/stories.js';
import { addFrase } from '../services/collections/ideas.js';
import { updateWeeklyFocus } from '../services/collections/monthlyPlan.js';
import Modal from '../components/Modal.jsx';

// ─── Helpers de fecha ─────────────────────────────────────────────────────────

const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function semanaActual() {
  const d = new Date().getDate();
  if (d <= 7) return 1;
  if (d <= 14) return 2;
  if (d <= 21) return 3;
  return 4;
}

function mesActual() {
  const hoy = new Date();
  return `${MESES_ES[hoy.getMonth()]}-${hoy.getFullYear()}`;
}

function añoActual() {
  return new Date().getFullYear();
}

function esEsteMes(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const hoy = new Date();
  return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
}

function mesNum(label) {
  const [nombre] = (label ?? '').split('-');
  const idx = MESES_ES.indexOf(nombre);
  return idx >= 0 ? idx : 0;
}

// ─── Sub-componentes de modales de alta rápida ───────────────────────────────

function NuevoPostModal({ open, onClose }) {
  const { update } = useDashboard();
  const [form, setForm] = useState({ title: '', category: 'orgánico', type: 'post', status: 'idea' });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await update((d) => addContent(d, { ...form, tags: [], cta: '', portada: '', reelData: null }));
    setForm({ title: '', category: 'orgánico', type: 'post', status: 'idea' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo post">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Título</label>
          <input className="input-flora" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ej: Mitos del masaje facial" autoFocus />
        </div>
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
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Estado</label>
          <select className="input-flora" value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="idea">Idea</option>
            <option value="borrador">Borrador</option>
            <option value="listo">Listo</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" className="btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>
  );
}

function NuevaStoryModal({ open, onClose }) {
  const { update } = useDashboard();
  const [form, setForm] = useState({ semana: semanaActual(), dia: 'L', categoria: 'Flora cotidiana', texto: '', tipo: 'Foto + texto', estado: 'idea' });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.texto.trim()) return;
    await update((d) => addStory(d, form)); // addStory inyecta mes/año automáticamente
    setForm({ semana: semanaActual(), dia: 'L', categoria: 'Flora cotidiana', texto: '', tipo: 'Foto + texto', estado: 'idea' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nueva story">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Semana</label>
            <select className="input-flora" value={form.semana} onChange={(e) => set('semana', Number(e.target.value))}>
              {[1, 2, 3, 4].map((s) => <option key={s} value={s}>Semana {s}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Día</label>
            <select className="input-flora" value={form.dia} onChange={(e) => set('dia', e.target.value)}>
              {['L', 'M', 'Mi', 'J', 'V', 'S', 'D'].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Categoría</label>
          <select className="input-flora" value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
            {['Flora cotidiana', 'Flora trabaja', 'Flora estudia', 'Flora hábitos', 'Flora informa', 'Interacción'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Texto o idea</label>
          <textarea className="textarea-flora" rows={3} value={form.texto} onChange={(e) => set('texto', e.target.value)} placeholder="¿De qué trata esta story?" autoFocus />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" className="btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>
  );
}

function NuevaIdeaModal({ open, onClose }) {
  const { update } = useDashboard();
  const [form, setForm] = useState({ text: '', uso: '', tag: '' });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    await update((d) => addFrase(d, form));
    setForm({ text: '', uso: '', tag: '' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nueva idea">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-body text-xs text-texto font-medium mb-1.5 block">Frase o idea</label>
          <textarea className="textarea-flora" rows={3} value={form.text} onChange={(e) => set('text', e.target.value)} placeholder="Ej: Tu piel no es un problema a resolver" autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Uso posible</label>
            <input className="input-flora" value={form.uso} onChange={(e) => set('uso', e.target.value)} placeholder="caption, story, bio…" />
          </div>
          <div>
            <label className="font-body text-xs text-texto font-medium mb-1.5 block">Etiqueta</label>
            <input className="input-flora" value={form.tag} onChange={(e) => set('tag', e.target.value)} placeholder="piel, hábitos…" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" className="btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Inicio() {
  const { dashboard, update } = useDashboard();
  const navigate = useNavigate();
  const [greeting, setGreeting]     = useState(getGreeting());
  const [modal, setModal]           = useState(null);
  const [focus, setFocus]           = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const focusTimer = useRef(null);

  const semana    = semanaActual();
  const mes       = mesActual();
  const año       = añoActual();
  const mesNombre = MESES_ES[new Date().getMonth()];

  const contentCount = dashboard.content?.length ?? 0;

  // Sincroniza el foco de la semana actual desde el array en Firestore
  useEffect(() => {
    const arr = Array.isArray(dashboard.weeklyFocus) ? dashboard.weeklyFocus : [];
    const current = arr.find((f) => f.semana === semana && f.mes === mes);
    setFocus(current?.texto ?? '');
  }, [dashboard.weeklyFocus, semana, mes]);

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Guarda con debounce de 800ms
  const handleFocusChange = (val) => {
    setFocus(val);
    clearTimeout(focusTimer.current);
    focusTimer.current = setTimeout(() => {
      update((d) => updateWeeklyFocus(d, { semana, mes, año, texto: val }));
    }, 800);
  };

  // ── Métricas ──────────────────────────────────────────────────────────────
  const content  = dashboard.content ?? [];
  const stories  = dashboard.stories ?? [];
  const pipeline = dashboard.ideas?.pipeline ?? {};

  const postsEsteMes  = content.filter((c) => c.status === 'publicado' && esEsteMes(c.date)).length;
  const enBorrador    = content.filter((c) => c.status === 'borrador').length;
  // Filtra por semana + mes + año para no mezclar meses distintos
  const storiesSemana = stories.filter((s) => s.estado === 'lista' && s.semana === semana && s.mes === mes).length;
  const ideasPipeline = (pipeline.ideas?.length ?? 0) + (pipeline.proceso?.length ?? 0);

  const proximaPublicacion = content
    .filter((c) => c.status === 'listo' && c.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] ?? null;

  const metrics = [
    { label: 'Posts este mes',      value: postsEsteMes,  color: 'text-rosa-viejo' },
    { label: 'En borrador',         value: enBorrador,    color: 'text-texto'      },
    { label: 'Stories esta semana', value: storiesSemana, color: 'text-verde-seco' },
    { label: 'Ideas en proceso',    value: ideasPipeline, color: 'text-texto'      },
  ];

  // ── Foco de la semana ─────────────────────────────────────────────────────
  const focusHistory = Array.isArray(dashboard.weeklyFocus) ? dashboard.weeklyFocus : [];
  const focusAnterior = focusHistory
    .filter((f) => !(f.semana === semana && f.mes === mes) && f.texto?.trim())
    .sort((a, b) => {
      if ((b.año ?? 0) !== (a.año ?? 0)) return (b.año ?? 0) - (a.año ?? 0);
      if (mesNum(b.mes) !== mesNum(a.mes)) return mesNum(b.mes) - mesNum(a.mes);
      return b.semana - a.semana;
    });

  const objetivoSemana = dashboard.monthlyPlan?.weeks?.[`s${semana}`]?.objetivo?.trim() ?? '';

  return (
    <div className="px-6 md:px-10 py-10 max-w-4xl">

      {/* Saludo */}
      <h1 className="font-display text-4xl md:text-5xl text-texto mb-1">
        {greeting} <em>Flora</em>
      </h1>
      <p className="font-body text-sm text-texto mb-8">
        {getDateString(contentCount)}
      </p>

      {/* Frase del día */}
      <blockquote className="border-l-4 border-rosa-viejo pl-5 py-1 mb-10">
        <p className="font-display italic text-xl md:text-2xl text-texto leading-snug">
          "{getDailyQuote()}"
        </p>
      </blockquote>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {metrics.map(({ label, value, color }) => (
          <div key={label} className="bg-blanco border border-beige-2 rounded-2xl px-4 py-5">
            <p className="font-body text-xs text-texto font-medium mb-1">{label}</p>
            <p className={`font-display text-3xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Próxima publicación */}
      {proximaPublicacion && (
        <div className="bg-blanco border border-beige-2 rounded-2xl px-5 py-4 mb-10 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-verde-claro flex items-center justify-center shrink-0">
            <CalendarDays size={16} strokeWidth={1.75} className="text-verde-hover" />
          </div>
          <div className="min-w-0">
            <p className="font-body text-xs text-texto-suave font-medium mb-0.5">Próxima publicación</p>
            <p className="font-body text-sm text-texto font-medium truncate">{proximaPublicacion.title}</p>
            <p className="font-body text-xs text-texto-suave font-medium">{proximaPublicacion.date} · {proximaPublicacion.type}</p>
          </div>
        </div>
      )}

      {/* Accesos rápidos */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button onClick={() => setModal('story')} className="flex items-center gap-2 bg-blanco border border-beige-2 hover:border-rosa-viejo hover:bg-beige-1 rounded-xl px-4 py-2.5 font-body text-sm text-texto transition-colors">
          <Plus size={14} strokeWidth={2} className="text-rosa-viejo" />
          Nueva story
        </button>
        <button onClick={() => setModal('idea')} className="flex items-center gap-2 bg-blanco border border-beige-2 hover:border-rosa-viejo hover:bg-beige-1 rounded-xl px-4 py-2.5 font-body text-sm text-texto transition-colors">
          <Plus size={14} strokeWidth={2} className="text-rosa-viejo" />
          Nueva idea
        </button>
        <button onClick={() => setModal('post')} className="flex items-center gap-2 bg-blanco border border-beige-2 hover:border-rosa-viejo hover:bg-beige-1 rounded-xl px-4 py-2.5 font-body text-sm text-texto transition-colors">
          <Plus size={14} strokeWidth={2} className="text-rosa-viejo" />
          Nuevo post
        </button>
        <button onClick={() => navigate('/calendario')} className="flex items-center gap-2 bg-blanco border border-beige-2 hover:border-verde-seco hover:bg-beige-1 rounded-xl px-4 py-2.5 font-body text-sm text-texto transition-colors">
          <CalendarDays size={14} strokeWidth={1.75} className="text-verde-seco" />
          Ver calendario
        </button>
      </div>

      {/* Foco de la semana */}
      <div className="border-l-4 border-rosa-viejo bg-beige-1 rounded-r-2xl px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-body text-xs text-texto font-semibold uppercase tracking-widest">
            Foco de la semana
          </p>
          <p className="font-body text-xs text-texto-suave">
            Semana {semana} · {mesNombre}
          </p>
        </div>

        {objetivoSemana && (
          <p className="font-body text-xs text-texto-suave italic mb-2 leading-snug">
            Objetivo del plan: "{objetivoSemana}"
          </p>
        )}

        <textarea
          className="w-full bg-transparent font-body font-medium text-base text-texto placeholder-texto-suave resize-none focus:outline-none"
          rows={2}
          value={focus}
          onChange={(e) => handleFocusChange(e.target.value)}
          placeholder="¿En qué te enfocás esta semana específicamente?"
        />

        {focusAnterior.length > 0 && (
          <div className="mt-3 pt-3 border-t border-beige-2">
            <button
              onClick={() => setHistoryOpen((v) => !v)}
              className="flex items-center gap-1 font-body text-xs text-texto-suave hover:text-texto transition-colors"
            >
              <ChevronDown
                size={12}
                strokeWidth={2}
                className={`transition-transform ${historyOpen ? 'rotate-180' : ''}`}
              />
              Historial ({focusAnterior.length} {focusAnterior.length === 1 ? 'entrada' : 'entradas'})
            </button>

            {historyOpen && (
              <div className="flex flex-col gap-2.5 mt-3">
                {focusAnterior.map((f, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="font-body text-[11px] text-texto-suave shrink-0 mt-0.5">
                      S{f.semana} {f.mes}
                    </span>
                    <p className="font-body text-xs text-texto-suave leading-snug">{f.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modales */}
      <NuevoPostModal  open={modal === 'post'}  onClose={() => setModal(null)} />
      <NuevaStoryModal open={modal === 'story'} onClose={() => setModal(null)} />
      <NuevaIdeaModal  open={modal === 'idea'}  onClose={() => setModal(null)} />
    </div>
  );
}
