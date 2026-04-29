export function updateMonthlyPlan(dashboard, patch) {
  return {
    ...dashboard,
    monthlyPlan: { ...dashboard.monthlyPlan, ...patch },
  };
}

// weeklyFocus es un array de { semana, mes, año, texto }.
// Hace upsert: actualiza si ya existe la combinación semana+mes, si no agrega al principio.
export function updateWeeklyFocus(dashboard, { semana, mes, año, texto }) {
  const current = Array.isArray(dashboard.weeklyFocus) ? dashboard.weeklyFocus : [];
  const idx = current.findIndex((f) => f.semana === semana && f.mes === mes);
  const entry = { semana, mes, año, texto };
  const next = idx >= 0
    ? current.map((f, i) => (i === idx ? entry : f))
    : [entry, ...current];
  return { ...dashboard, weeklyFocus: next };
}
