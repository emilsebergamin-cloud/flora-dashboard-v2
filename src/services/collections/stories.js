import { v4 as uuid } from 'uuid';

const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function mesLabel(date = new Date()) {
  return `${MESES_ES[date.getMonth()]}-${date.getFullYear()}`;
}

export function addStory(dashboard, item) {
  const now = new Date();
  return {
    ...dashboard,
    stories: [
      {
        id: uuid(),
        mes: mesLabel(now),
        año: now.getFullYear(),
        createdAt: now.toISOString(),
        ...item,
      },
      ...(dashboard.stories ?? []),
    ],
  };
}

export function updateStory(dashboard, id, patch) {
  return {
    ...dashboard,
    stories: (dashboard.stories ?? []).map((s) => (s.id === id ? { ...s, ...patch } : s)),
  };
}

export function removeStory(dashboard, id) {
  return { ...dashboard, stories: (dashboard.stories ?? []).filter((s) => s.id !== id) };
}

export function listStories(dashboard, filters = {}) {
  let items = [...(dashboard.stories ?? [])];
  if (filters.semana) items = items.filter((s) => s.semana === filters.semana);
  if (filters.mes)    items = items.filter((s) => s.mes === filters.mes);
  if (filters.dia)    items = items.filter((s) => s.dia === filters.dia);
  if (filters.estado) items = items.filter((s) => s.estado === filters.estado);
  return items.sort((a, b) => {
    if (a.semana !== b.semana) return a.semana - b.semana;
    const DIAS = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
    return DIAS.indexOf(a.dia) - DIAS.indexOf(b.dia);
  });
}
