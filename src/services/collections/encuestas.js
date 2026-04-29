import { v4 as uuid } from 'uuid';

export function addEncuesta(dashboard, item) {
  return {
    ...dashboard,
    encuestas: [
      { id: uuid(), usada: false, favorita: false, createdAt: new Date().toISOString(), ...item },
      ...(dashboard.encuestas ?? []),
    ],
  };
}

export function updateEncuesta(dashboard, id, patch) {
  return {
    ...dashboard,
    encuestas: (dashboard.encuestas ?? []).map((e) => (e.id === id ? { ...e, ...patch } : e)),
  };
}

export function removeEncuesta(dashboard, id) {
  return { ...dashboard, encuestas: (dashboard.encuestas ?? []).filter((e) => e.id !== id) };
}

export function listEncuestas(dashboard, filters = {}) {
  let items = [...(dashboard.encuestas ?? [])];
  if (filters.favorita !== undefined) items = items.filter((e) => e.favorita === filters.favorita);
  if (filters.noUsada)               items = items.filter((e) => !e.usada);
  return items.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}
