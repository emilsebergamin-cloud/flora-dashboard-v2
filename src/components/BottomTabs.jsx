import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  ImagePlay,
  Lightbulb,
  CalendarDays,
  Palette,
} from 'lucide-react';

const TABS = [
  { to: '/',            label: 'Inicio',      Icon: LayoutDashboard },
  { to: '/estrategia',  label: 'Estrategia',  Icon: Target          },
  { to: '/contenido',   label: 'Contenido',   Icon: ImagePlay       },
  { to: '/ideas',       label: 'Ideas',       Icon: Lightbulb       },
  { to: '/calendario',  label: 'Calendario',  Icon: CalendarDays    },
  { to: '/moodboard',   label: 'Moodboard',   Icon: Palette         },
];

export default function BottomTabs() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-blanco border-t border-beige-2 flex pb-[env(safe-area-inset-bottom)] z-50">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            [
              'flex-1 flex flex-col items-center justify-center py-2 gap-1 text-[10px] font-body transition-colors',
              isActive ? 'text-rosa-hover' : 'text-texto-suave',
            ].join(' ')
          }
        >
          <Icon size={20} strokeWidth={1.75} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
