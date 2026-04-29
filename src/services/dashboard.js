import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, DASHBOARD_DOC_PATH } from './firebase.js';

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

function dashboardRef() {
  return doc(db, DASHBOARD_DOC_PATH.collection, DASHBOARD_DOC_PATH.doc);
}

function mergeWithDefaults(data) {
  return {
    ...DEFAULT_DASHBOARD,
    ...data,
    // Si Firestore tiene weeklyFocus como string (dato viejo), se descarta y arranca vacío.
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
  };
}

export async function loadDashboard() {
  const snap = await getDoc(dashboardRef());
  if (!snap.exists()) return { ...DEFAULT_DASHBOARD };
  return mergeWithDefaults(snap.data());
}

export async function saveDashboard(data) {
  const { updatedAt: _skip, ...clean } = data;
  await setDoc(dashboardRef(), { ...clean, updatedAt: serverTimestamp() }, { merge: true });
}

export function subscribeDashboard(onChange, onError) {
  return onSnapshot(
    dashboardRef(),
    (snap) => {
      if (snap.exists()) {
        onChange(mergeWithDefaults(snap.data()));
      } else {
        onChange({ ...DEFAULT_DASHBOARD });
      }
    },
    onError,
  );
}
