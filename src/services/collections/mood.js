import { v4 as uuid } from 'uuid';

export function addMood(dashboard, item) {
  return {
    ...dashboard,
    mood: [{ id: uuid(), createdAt: new Date().toISOString(), ...item }, ...dashboard.mood],
  };
}

export function updateMood(dashboard, id, patch) {
  return {
    ...dashboard,
    mood: dashboard.mood.map((m) => (m.id === id ? { ...m, ...patch } : m)),
  };
}

export function removeMood(dashboard, id) {
  return { ...dashboard, mood: dashboard.mood.filter((m) => m.id !== id) };
}
