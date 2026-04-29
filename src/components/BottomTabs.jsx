import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/',           label: 'Inicio',      icon: '✦' },
  { to: '/estrategia', label: 'Estrategia',  icon: '◈' },
  { to: '/contenido',  label: 'Contenido',   icon: '◉' },
  { to: '/ideas',      label: 'Ideas',       icon: '◇' },
  { to: '/calendario', label: 'Calendario',  icon: '▦' },
  { to: '/moodboard',  label: 'Moodboard',   icon: '◫' },
];

export default function BottomTabs() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-blanco border-t border-beige-2 flex pb-[env(safe-area-inset-bottom)] z-50">
      {TABS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            [
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-body transition-colors',
              isActive ? 'text-rosa-hover' : 'text-texto-suave',
            ].join(' ')
          }
        >
          <span className="text-lg leading-none">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
