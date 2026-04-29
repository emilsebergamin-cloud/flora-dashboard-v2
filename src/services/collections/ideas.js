import { v4 as uuid } from 'uuid';

// --- Frases ---
export function addFrase(dashboard, item) {
  const entry = { id: uuid(), favorita: false, createdAt: new Date().toISOString(), ...item };
  return { ...dashboard, ideas: { ...dashboard.ideas, frases: [entry, ...dashboard.ideas.frases] } };
}
export function updateFrase(dashboard, id, patch) {
  return { ...dashboard, ideas: { ...dashboard.ideas, frases: dashboard.ideas.frases.map((f) => (f.id === id ? { ...f, ...patch } : f)) } };
}
export function removeFrase(dashboard, id) {
  return { ...dashboard, ideas: { ...dashboard.ideas, frases: dashboard.ideas.frases.filter((f) => f.id !== id) } };
}

// --- Reflexiones ---
export function addReflexion(dashboard, item) {
  const entry = { id: uuid(), fecha: new Date().toISOString().slice(0, 10), createdAt: new Date().toISOString(), ...item };
  return { ...dashboard, ideas: { ...dashboard.ideas, reflexiones: [entry, ...dashboard.ideas.reflexiones] } };
}
export function updateReflexion(dashboard, id, patch) {
  return { ...dashboard, ideas: { ...dashboard.ideas, reflexiones: dashboard.ideas.reflexiones.map((r) => (r.id === id ? { ...r, ...patch } : r)) } };
}
export function removeReflexion(dashboard, id) {
  return { ...dashboard, ideas: { ...dashboard.ideas, reflexiones: dashboard.ideas.reflexiones.filter((r) => r.id !== id) } };
}

// --- Referencias ---
export function addReferencia(dashboard, item) {
  const entry = { id: uuid(), createdAt: new Date().toISOString(), ...item };
  return { ...dashboard, ideas: { ...dashboard.ideas, referencias: [entry, ...dashboard.ideas.referencias] } };
}
export function updateReferencia(dashboard, id, patch) {
  return { ...dashboard, ideas: { ...dashboard.ideas, referencias: dashboard.ideas.referencias.map((r) => (r.id === id ? { ...r, ...patch } : r)) } };
}
export function removeReferencia(dashboard, id) {
  return { ...dashboard, ideas: { ...dashboard.ideas, referencias: dashboard.ideas.referencias.filter((r) => r.id !== id) } };
}

// --- Temas futuros ---
export function addTemaFuturo(dashboard, item) {
  const entry = { id: uuid(), promovida: false, createdAt: new Date().toISOString(), ...item };
  return { ...dashboard, ideas: { ...dashboard.ideas, temasFuturos: [entry, ...dashboard.ideas.temasFuturos] } };
}
export function updateTemaFuturo(dashboard, id, patch) {
  return { ...dashboard, ideas: { ...dashboard.ideas, temasFuturos: dashboard.ideas.temasFuturos.map((t) => (t.id === id ? { ...t, ...patch } : t)) } };
}
export function removeTemaFuturo(dashboard, id) {
  return { ...dashboard, ideas: { ...dashboard.ideas, temasFuturos: dashboard.ideas.temasFuturos.filter((t) => t.id !== id) } };
}

// --- Pipeline kanban ---
export function movePipeline(dashboard, id, fromCol, toCol) {
  const pipeline = { ...dashboard.ideas.pipeline };
  const item = pipeline[fromCol]?.find((i) => i.id === id);
  if (!item) return dashboard;
  return {
    ...dashboard,
    ideas: {
      ...dashboard.ideas,
      pipeline: {
        ...pipeline,
        [fromCol]: pipeline[fromCol].filter((i) => i.id !== id),
        [toCol]: [item, ...(pipeline[toCol] ?? [])],
      },
    },
  };
}
export function addPipelineItem(dashboard, col, item) {
  const entry = { id: uuid(), createdAt: new Date().toISOString(), ...item };
  return {
    ...dashboard,
    ideas: {
      ...dashboard.ideas,
      pipeline: {
        ...dashboard.ideas.pipeline,
        [col]: [entry, ...(dashboard.ideas.pipeline[col] ?? [])],
      },
    },
  };
}
export function removePipelineItem(dashboard, col, id) {
  return {
    ...dashboard,
    ideas: {
      ...dashboard.ideas,
      pipeline: {
        ...dashboard.ideas.pipeline,
        [col]: dashboard.ideas.pipeline[col].filter((i) => i.id !== id),
      },
    },
  };
}
