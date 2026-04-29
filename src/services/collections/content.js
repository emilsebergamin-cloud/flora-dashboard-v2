import { v4 as uuid } from 'uuid';

export function addContent(dashboard, item) {
  return {
    ...dashboard,
    content: [
      { id: uuid(), createdAt: new Date().toISOString(), ...item },
      ...(dashboard.content ?? []),
    ],
  };
}

export function updateContent(dashboard, id, patch) {
  return {
    ...dashboard,
    content: (dashboard.content ?? []).map((c) => (c.id === id ? { ...c, ...patch } : c)),
  };
}

export function removeContent(dashboard, id) {
  return { ...dashboard, content: (dashboard.content ?? []).filter((c) => c.id !== id) };
}

export function listContent(dashboard, filters = {}) {
  let items = [...(dashboard.content ?? [])];
  if (filters.category) items = items.filter((c) => c.category === filters.category);
  if (filters.status)   items = items.filter((c) => c.status === filters.status);
  if (filters.type)     items = items.filter((c) => c.type === filters.type);
  return items.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}
