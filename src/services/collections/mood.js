import { v4 as uuid } from 'uuid';

export function addMoodItem(dashboard, item) {
  return {
    ...dashboard,
    mood: [{ id: uuid(), createdAt: new Date().toISOString(), ...item }, ...(dashboard.mood ?? [])],
  };
}

export function updateMoodItem(dashboard, id, patch) {
  return {
    ...dashboard,
    mood: (dashboard.mood ?? []).map((m) => (m.id === id ? { ...m, ...patch } : m)),
  };
}

export function removeMoodItem(dashboard, id) {
  return { ...dashboard, mood: (dashboard.mood ?? []).filter((m) => m.id !== id) };
}
