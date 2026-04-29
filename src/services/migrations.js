/**
 * Migraciones de esquema — se ejecutan una vez al cargar el dashboard.
 * Cada migración es idempotente: si los datos ya tienen el formato correcto
 * no modifica nada y devuelve `{ data, changed: false }`.
 */

const MESES_ES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre',
];

function mesLabel(date) {
  return `${MESES_ES[date.getMonth()]}-${date.getFullYear()}`;
}

/**
 * M1 — Stories sin mes/año
 * Antes de esta migración, las stories no tenían campo `mes` ni `año`.
 * Sin esos campos no aparecen en el Calendario.
 * Derivamos el mes desde `createdAt` si existe; si no, usamos el mes actual.
 */
function migrateStoriesMes(data) {
  const stories = data.stories ?? [];
  let changed = false;

  const migrated = stories.map((s) => {
    if (s.mes && s.año) return s;
    const date = s.createdAt ? new Date(s.createdAt) : new Date();
    changed = true;
    return { ...s, mes: mesLabel(date), año: date.getFullYear() };
  });

  return { data: changed ? { ...data, stories: migrated } : data, changed };
}

/**
 * M2 — weeklyFocus como string (formato viejo)
 * Ya manejado en mergeWithDefaults, pero por seguridad lo normalizamos aquí también.
 */
function migrateWeeklyFocus(data) {
  if (Array.isArray(data.weeklyFocus)) return { data, changed: false };
  return { data: { ...data, weeklyFocus: [] }, changed: true };
}

/**
 * Corre todas las migraciones en orden.
 * Devuelve { data, changed } — `changed: true` si alguna migración modificó datos.
 */
export function runMigrations(data) {
  let current = data;
  let anyChanged = false;

  for (const migrate of [migrateWeeklyFocus, migrateStoriesMes]) {
    const { data: next, changed } = migrate(current);
    current = next;
    if (changed) anyChanged = true;
  }

  return { data: current, changed: anyChanged };
}
