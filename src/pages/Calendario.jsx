import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard.jsx';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIAS_LABEL = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];

// getDay() → 0=Dom, 1=Lun … 6=Sáb
// Columna en grilla base-Lunes: Lun→0, Mar→1 … Dom→6
const DOW_TO_COL = [6, 0, 1, 2, 3, 4, 5];

// dia (L/M/Mi/J/V/S/D) → getDay()
const DIA_TO_DOW = { L: 1, M: 2, Mi: 3, J: 4, V: 5, S: 6, D: 0 };

function buildCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const startCol = DOW_TO_COL[first.getDay()];
  const days = Array(startCol).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

// Parsea "YYYY-MM-DD" como fecha LOCAL para evitar desfase de timezone UTC.
function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Devuelve el día del mes al que corresponde semana+dia.
function storyDayInMonth(semana, dia, year, month) {
  const targetDow = DIA_TO_DOW[dia];
  const startDay  = (semana - 1) * 7 + 1;
  for (let d = startDay; d < startDay + 7; d++) {
    if (d > 31) return null;
    const date = new Date(year, month, d);
    if (date.getMonth() !== month) return null;
    if (date.getDay() === targetDow) return d;
  }
  return null;
}

// ─── Estilos por tipo ─────────────────────────────────────────────────────────

const TIPO_STYLES = {
  post:     { bg: 'bg-rosa-claro',  text: 'text-texto',  label: 'Post'     },
  carrusel: { bg: 'bg-beige-3',     text: 'text-texto',  label: 'Carrusel' },
  reel:     { bg: 'bg-verde-claro', text: 'text-texto',  label: 'Reel'     },
  story:    { bg: 'bg-rosa-viejo',  text: 'text-blanco', label: 'Story'    },
};

function chipStyle(tipo) {
  return TIPO_STYLES[tipo] ?? TIPO_STYLES.post;
}

const FILTROS = [
  { key: 'todos',    label: 'Todos'      },
  { key: 'story',    label: 'Stories'    },
  { key: 'post',     label: 'Posts'      },
  { key: 'carrusel', label: 'Carruseles' },
  { key: 'reel',     label: 'Reels'      },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Calendario() {
  const { dashboard } = useDashboard();
  const hoy = new Date();

  const [year,  setYear]    = useState(hoy.getFullYear());
  const [month, setMonth]   = useState(hoy.getMonth());
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const days = useMemo(() => buildCalendarDays(year, month), [year, month]);

  // Agrupa todos los ítems del mes por día (número 1-31)
  const itemsByDay = useMemo(() => {
    const map = {};
    const add = (day, item) => {
      if (!day) return;
      if (!map[day]) map[day] = [];
      map[day].push(item);
    };

    // Contenido con fecha ISO ("YYYY-MM-DD")
    (dashboard.content ?? []).forEach((item) => {
      if (!item.date) return;
      const d = parseLocalDate(item.date);
      if (d.getFullYear() !== year || d.getMonth() !== month) return;
      add(d.getDate(), {
        _tipo:   item.type ?? 'post',
        _label:  item.title,
        _status: item.status,
        ...item,
      });
    });

    // Stories del mes (usan semana+dia, sin fecha exacta)
    const mesStr = `${MESES_ES[month]}-${year}`;
    (dashboard.stories ?? [])
      .filter((s) => s.mes === mesStr)
      .forEach((s) => {
        const day = storyDayInMonth(s.semana, s.dia, year, month);
        add(day, {
          _tipo:   'story',
          _label:  s.texto || '—',
          _status: s.estado,
          ...s,
        });
      });

    return map;
  }, [dashboard.content, dashboard.stories, year, month]);

  const isCurrentMonth = year === hoy.getFullYear() && month === hoy.getMonth();
  const todayDay = hoy.getDate();

  return (
    <div className="px-6 md:px-10 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-texto mb-6">Calendario</h1>

      {/* Navegación de mes */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <div className="flex items-center gap-1">
          <button onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-beige-1 transition-colors text-texto-suave hover:text-texto">
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <h2 className="font-display text-2xl text-texto capitalize w-52 text-center select-none">
            {MESES_ES[month]} {year}
          </h2>
          <button onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-beige-1 transition-colors text-texto-suave hover:text-texto">
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>
        {!isCurrentMonth && (
          <button
            onClick={() => { setYear(hoy.getFullYear()); setMonth(hoy.getMonth()); }}
            className="font-body text-sm text-texto-suave hover:text-texto px-3 py-1.5 rounded-lg hover:bg-beige-1 transition-colors">
            Hoy
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {FILTROS.map(({ key, label }) => (
          <button key={key} onClick={() => setFiltro(key)}
            className={['font-body text-sm px-3.5 py-1.5 rounded-full transition-colors',
              filtro === key
                ? 'bg-rosa-viejo text-blanco font-medium'
                : 'bg-blanco border border-beige-2 text-texto hover:border-rosa-viejo',
            ].join(' ')}>
            {label}
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 flex-wrap mb-5">
        {Object.entries(TIPO_STYLES).map(([tipo, { bg, label }]) => (
          <div key={tipo} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${bg}`} />
            <span className="font-body text-xs text-texto-suave">{label}</span>
          </div>
        ))}
      </div>

      {/* Grilla calendario */}
      <div className="bg-blanco border border-beige-2 rounded-2xl overflow-hidden">

        {/* Header días de la semana */}
        <div className="grid grid-cols-7 border-b border-beige-2 bg-beige-1/50">
          {DIAS_LABEL.map((d, i) => (
            <div key={d}
              className={`py-1.5 sm:py-2 text-center font-body text-[10px] sm:text-xs text-texto-suave font-medium ${i < 6 ? 'border-r border-beige-2' : ''}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Celdas de días */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const col       = i % 7;
            const isLastCol = col === 6;
            const allItems  = day ? (itemsByDay[day] ?? []) : [];
            const items     = filtro === 'todos' ? allItems : allItems.filter((it) => it._tipo === filtro);
            const isToday   = isCurrentMonth && day === todayDay;

            const hasItems = items.length > 0;

            return (
              <div key={i}
                className={[
                  'min-h-[60px] sm:min-h-[100px] p-1 sm:p-1.5 border-b border-beige-2 transition-colors',
                  isLastCol ? '' : 'border-r border-beige-2',
                  !day                    ? 'bg-beige-1/20' :
                  hasItems && !isToday    ? 'bg-beige-1/50' : '',
                ].join(' ')}>

                {day && (
                  <>
                    <div className="flex justify-end mb-1">
                      <span className={[
                        'font-body text-[10px] sm:text-[11px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full',
                        isToday
                          ? 'bg-rosa-viejo text-blanco font-semibold'
                          : hasItems
                          ? 'text-texto font-semibold'
                          : 'text-texto-suave',
                      ].join(' ')}>
                        {day}
                      </span>
                    </div>

                    {/* Mobile: puntos de color */}
                    <div className="flex flex-wrap gap-1 sm:hidden">
                      {items.slice(0, 3).map((item, j) => {
                        const { bg } = chipStyle(item._tipo);
                        return (
                          <button key={j} onClick={() => setSelected(item)}
                            className={`w-2.5 h-2.5 rounded-sm ${bg} hover:opacity-75 transition-opacity`} />
                        );
                      })}
                      {items.length > 3 && (
                        <button
                          onClick={() => setSelected({ _tipo: '__more', _day: day, _items: items })}
                          className="font-body text-[8px] leading-none text-texto-suave hover:text-texto transition-colors">
                          +{items.length - 3}
                        </button>
                      )}
                    </div>

                    {/* Desktop: chips con texto */}
                    <div className="hidden sm:flex flex-col gap-1">
                      {items.slice(0, 3).map((item, j) => {
                        const { bg, text } = chipStyle(item._tipo);
                        return (
                          <button key={j}
                            onClick={() => setSelected(item)}
                            className={`w-full text-left font-body text-[11px] font-medium px-2 py-[3px] rounded-md truncate leading-tight ${bg} ${text} hover:opacity-80 transition-opacity`}>
                            {item._label}
                          </button>
                        );
                      })}
                      {items.length > 3 && (
                        <button
                          onClick={() => setSelected({ _tipo: '__more', _day: day, _items: items })}
                          className="font-body text-[10px] text-texto-suave hover:text-texto pl-1 text-left transition-colors">
                          +{items.length - 3} más
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel de detalle al hacer click en un chip */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-4 bg-texto/20 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div
            className="bg-blanco border border-beige-2 rounded-t-2xl md:rounded-2xl w-full max-w-sm shadow-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>

            {/* Drag handle (solo mobile) */}
            <div className="md:hidden flex justify-center pt-2 pb-1 shrink-0">
              <span className="w-10 h-1 rounded-full bg-beige-3" />
            </div>

            {/* Header sticky */}
            <div className="flex items-start justify-between px-5 pt-3 pb-3 shrink-0 border-b border-beige-2">
              {selected._tipo === '__more' ? (
                <p className="font-body text-sm text-texto font-medium">
                  {selected._day} {MESES_ES[month]} — todos los ítems
                </p>
              ) : (
                <span className={`font-body text-[11px] font-medium px-2 py-0.5 rounded-full ${chipStyle(selected._tipo).bg} ${chipStyle(selected._tipo).text}`}>
                  {chipStyle(selected._tipo).label}
                </span>
              )}
              <button onClick={() => setSelected(null)}
                className="text-texto-suave hover:text-texto p-1 transition-colors ml-2 shrink-0">
                <X size={15} strokeWidth={2} />
              </button>
            </div>

            {/* Body scrolleable */}
            <div className="px-5 py-4 overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom))]">
              {/* Vista "más items" del día */}
              {selected._tipo === '__more' ? (
                <div className="flex flex-col gap-2">
                  {selected._items.map((item, i) => {
                    const { bg, text, label } = chipStyle(item._tipo);
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`font-body text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${bg} ${text}`}>
                          {label}
                        </span>
                        <p className="font-body text-xs text-texto leading-snug">{item._label}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Detalle individual */
                <div className="flex flex-col gap-1.5">
                  <p className="font-body text-sm text-texto font-medium leading-snug">{selected._label}</p>
                  {selected.category && (
                    <p className="font-body text-xs text-texto-suave">Categoría: {selected.category}</p>
                  )}
                  {(selected.status || selected.estado) && (
                    <p className="font-body text-xs text-texto-suave">
                      Estado: {selected.status ?? selected.estado}
                    </p>
                  )}
                  {selected.date && (
                    <p className="font-body text-xs text-texto-suave">{selected.date}</p>
                  )}
                  {selected.mes && (
                    <p className="font-body text-xs text-texto-suave">
                      S{selected.semana} · {selected.dia} · {selected.mes}
                    </p>
                  )}
                  {selected.excerpt && (
                    <p className="font-body text-xs text-texto-suave mt-1 leading-relaxed">
                      {selected.excerpt}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
