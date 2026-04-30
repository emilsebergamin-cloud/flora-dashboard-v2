import { useEffect, useRef, useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import { updateMonthlyPlan } from '../../services/collections/monthlyPlan.js';

const SEMANAS = [
  { key: 's1', label: 'Semana 1' },
  { key: 's2', label: 'Semana 2' },
  { key: 's3', label: 'Semana 3' },
  { key: 's4', label: 'Semana 4' },
];

function useDebounce(fn, delay = 700) {
  const timer = useRef(null);
  return (...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  };
}

export default function PlanTematico() {
  const { dashboard, update } = useDashboard();
  const plan = dashboard.monthlyPlan ?? {};

  const [themeCentral, setThemeCentral] = useState('');
  const [weeks, setWeeks] = useState({ s1: { objetivo: '', tema: '' }, s2: { objetivo: '', tema: '' }, s3: { objetivo: '', tema: '' }, s4: { objetivo: '', tema: '' } });

  useEffect(() => {
    setThemeCentral(plan.themeCentral ?? '');
    setWeeks({
      s1: { objetivo: plan.weeks?.s1?.objetivo ?? '', tema: plan.weeks?.s1?.tema ?? '' },
      s2: { objetivo: plan.weeks?.s2?.objetivo ?? '', tema: plan.weeks?.s2?.tema ?? '' },
      s3: { objetivo: plan.weeks?.s3?.objetivo ?? '', tema: plan.weeks?.s3?.tema ?? '' },
      s4: { objetivo: plan.weeks?.s4?.objetivo ?? '', tema: plan.weeks?.s4?.tema ?? '' },
    });
  }, [dashboard.monthlyPlan]);

  const save = useDebounce((newTheme, newWeeks) => {
    update((d) => updateMonthlyPlan(d, { themeCentral: newTheme, weeks: newWeeks }));
  });

  const handleTheme = (val) => {
    setThemeCentral(val);
    save(val, weeks);
  };

  const handleWeek = (key, field, val) => {
    const updated = { ...weeks, [key]: { ...weeks[key], [field]: val } };
    setWeeks(updated);
    save(themeCentral, updated);
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl">

      {/* Tema central */}
      <div>
        <label className="font-body text-xs text-texto font-semibold uppercase tracking-widest mb-2 block">
          Tema central del mes
        </label>
        <textarea
          className="textarea-flora font-body text-base"
          rows={2}
          value={themeCentral}
          onChange={(e) => handleTheme(e.target.value)}
          placeholder="Ej: Mes 1 — Quién soy y por qué importa mi mirada sobre la piel"
        />
      </div>

      {/* Objetivos y temas por semana */}
      <div>
        <p className="font-body text-xs text-texto font-semibold uppercase tracking-widest mb-4">
          Por semana
        </p>
        <div className="flex flex-col gap-4">
          {SEMANAS.map(({ key, label }) => (
            <div key={key} className="bg-blanco border border-beige-2 rounded-2xl px-5 py-4">
              <p className="font-body text-sm text-texto font-medium mb-3">{label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs text-texto font-medium mb-1.5 block">Objetivo</label>
                  <input
                    className="input-flora"
                    value={weeks[key].objetivo}
                    onChange={(e) => handleWeek(key, 'objetivo', e.target.value)}
                    placeholder="Ej: generar curiosidad"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-texto font-medium mb-1.5 block">Tema específico</label>
                  <input
                    className="input-flora"
                    value={weeks[key].tema}
                    onChange={(e) => handleWeek(key, 'tema', e.target.value)}
                    placeholder="Ej: Quién soy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
