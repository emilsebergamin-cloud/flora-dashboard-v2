import { v4 as uuid } from 'uuid';

export function addCarrusel(dashboard, item) {
  return {
    ...dashboard,
    carruseles: [
      { id: uuid(), imagenes: [], createdAt: new Date().toISOString(), ...item },
      ...(dashboard.carruseles ?? []),
    ],
  };
}

export function updateCarrusel(dashboard, id, patch) {
  return {
    ...dashboard,
    carruseles: (dashboard.carruseles ?? []).map((c) => (c.id === id ? { ...c, ...patch } : c)),
  };
}

export function removeCarrusel(dashboard, id) {
  return { ...dashboard, carruseles: (dashboard.carruseles ?? []).filter((c) => c.id !== id) };
}

export function listCarruseles(dashboard, filters = {}) {
  let items = [...(dashboard.carruseles ?? [])];
  if (filters.semana) items = items.filter((c) => c.semana === filters.semana);
  if (filters.estado) items = items.filter((c) => c.estado === filters.estado);
  return items.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}
