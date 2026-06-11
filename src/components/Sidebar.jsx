import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  ImagePlay,
  Lightbulb,
  CalendarDays,
  Palette,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',            label: 'Inicio',             Icon: LayoutDashboard },
  { to: '/estrategia',  label: 'Estrategia Mensual', Icon: Target          },
  { to: '/contenido',   label: 'Contenido',          Icon: ImagePlay       },
  { to: '/ideas',       label: 'Ideas',              Icon: Lightbulb       },
  { to: '/calendario',  label: 'Calendario',         Icon: CalendarDays    },
  { to: '/moodboard',   label: 'Moodboard',          Icon: Palette         },
];

export default function Sidebar({ syncStatus }) {
  const syncDot = {
    synced:  'bg-verde-seco',
    syncing: 'bg-rosa-viejo animate-pulse',
    offline: 'bg-rosa-hover',
    error:   'bg-rosa-hover',
  }[syncStatus] ?? 'bg-beige-3';

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 min-h-screen bg-blanco border-r border-beige-2">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-beige-2">
        <span className="font-display text-2xl text-texto">Gestión RRSS</span>
        <span
          className={`ml-auto w-2 h-2 rounded-full ${syncDot}`}
          title={syncStatus === 'synced' ? 'Sincronizado' : 'Sincronizando…'}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-colors',
                isActive
                  ? 'bg-rosa-claro text-rosa-hover font-medium'
                  : 'text-texto-suave hover:bg-beige-1 hover:text-texto',
              ].join(' ')
            }
          >
            <Icon size={16} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-beige-2">
        <p className="font-body text-xs text-texto-suave tracking-wide">Demo · Gestión de redes</p>
      </div>
    </aside>
  );
}
