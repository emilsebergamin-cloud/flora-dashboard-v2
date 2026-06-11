// ── MODO DEMO ──────────────────────────────────────────────────────────────
// Versión autónoma: NO se conecta a Firebase. Los datos viven en localStorage
// del navegador del visitante, partiendo de datos ficticios de ejemplo.
// Así la demo es pública, anonimizada y sin riesgo de exponer datos reales.

import { SEED_DASHBOARD } from './seedData.js';

const STORAGE_KEY = 'demo_dashboard_v1';

export const DEFAULT_DASHBOARD = {
  weeklyFocus: [],

  monthlyPlan: {
    themeCentral: '',
    weeks: {
      s1: { objetivo: '', tema: '' },
      s2: { objetivo: '', tema: '' },
      s3: { objetivo: '', tema: '' },
      s4: { objetivo: '', tema: '' },
    },
  },

  stories: [],
  encuestas: [],
  carruseles: [],

  content: [],

  ideas: {
    frases: [],
    reflexiones: [],
    referencias: [],
    temasFuturos: [],
    pipeline: {
      ideas: [],
      proceso: [],
      publicado: [],
    },
  },

  mood: [],
};

function mergeWithDefaults(data) {
  return {
    ...DEFAULT_DASHBOARD,
    ...data,
    weeklyFocus: Array.isArray(data.weeklyFocus) ? data.weeklyFocus : [],
    monthlyPlan: {
      ...DEFAULT_DASHBOARD.monthlyPlan,
      ...(data.monthlyPlan ?? {}),
      weeks: {
        ...DEFAULT_DASHBOARD.monthlyPlan.weeks,
        ...(data.monthlyPlan?.weeks ?? {}),
      },
    },
    ideas: {
      ...DEFAULT_DASHBOARD.ideas,
      ...(data.ideas ?? {}),
      pipeline: {
        ...DEFAULT_DASHBOARD.ideas.pipeline,
        ...(data.ideas?.pipeline ?? {}),
      },
    },
    mood: Array.isArray(data.mood) ? data.mood : [],
  };
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return mergeWithDefaults(JSON.parse(raw));
  } catch (err) {
    console.warn('[demo] no se pudo leer localStorage', err);
  }
  // Primera visita: sembrar datos de ejemplo
  const seeded = mergeWithDefaults(SEED_DASHBOARD);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded)); } catch { /* ignore */ }
  return seeded;
}

export async function loadDashboard() {
  return readStorage();
}

export async function saveDashboard(data) {
  const { updatedAt: _skip, ...clean } = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
}

// API compatible con la versión Firebase: llama onChange una vez con los datos
// y devuelve una función de desuscripción (no-op en modo demo).
export function subscribeDashboard(onChange, _onError) {
  try {
    onChange(readStorage());
  } catch (err) {
    if (_onError) _onError(err);
  }
  return () => {};
}
