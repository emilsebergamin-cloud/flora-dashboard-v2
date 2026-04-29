# Guía de uso — Flora Dashboard v2

Esta guía explica cómo funciona cada sección y cómo aprovecharla al máximo. Pensá el dashboard como tu "estudio de contenido" personal: planificás, registrás ideas, agendás, y ves todo conectado.

---

## 1. Inicio

Es la pantalla de bienvenida. Lo que vas a ver:

- **Saludo personalizado** según la hora del día (Buen día / Buenas tardes / Buenas noches).
- **Frase del día**: una frase motivacional que rota automáticamente cada día.
- **4 tarjetas de métricas** (panorama rápido):
  - **Posts este mes**: cantidad de contenido publicado en el mes en curso.
  - **En borrador**: contenido con estado "borrador" (sin importar el mes).
  - **Stories esta semana**: stories listas para publicar de la semana actual del mes actual.
  - **Ideas en proceso**: suma de ideas en columnas "Ideas" y "En proceso" del kanban.
- **Próxima publicación**: la próxima card de Contenido en estado "listo" con fecha cargada, ordenada por la fecha más cercana.
- **Accesos rápidos**: Nueva story · Nueva idea · Nuevo post · Ver calendario.
- **Foco de la semana**: tu intención semanal (ver detalle abajo).

### Foco de la semana — cómo funciona

- Arriba a la derecha siempre vas a ver **"Semana X · mes"** (calculado automáticamente: días 1-7 = S1, 8-14 = S2, 15-21 = S3, 22+ = S4).
- Si tenés cargado un objetivo en el Plan temático para esa semana (en Estrategia mensual), aparece en itálica como contexto: *Objetivo del plan: "..."*.
- Escribís libremente tu foco y se guarda solo (debounce de 0,8 segundos).
- **Historial**: cuando empezás una semana nueva, el textarea aparece vacío. Los focos anteriores quedan archivados en un panel colapsable abajo. Los podés revisar en cualquier momento, ordenados por más reciente primero.

---

## 2. Estrategia mensual

Tres sub-pestañas:

### Stories
- Pills S1, S2, S3, S4 para elegir semana.
- Filas por día (Lunes a Domingo).
- Cada story tiene: texto, categoría (Flora cotidiana, trabaja, estudia, hábitos, informa, Interacción), tipo (Foto+texto, Video, Encuesta, etc.) y estado (idea / lista / publicada).
- **Las stories nuevas guardan automáticamente el mes y año** en que se crearon. Esto las ancla al calendario real.

### Banco de encuestas
- Repositorio de encuestas con pregunta, opciones A/B y tema.
- Filtros: Todas / Favoritas / No usadas.
- Marcá favorita (estrella) o usada (tilde).
- Esta misma sección también está disponible en **Ideas** (es el mismo banco, no se duplica).

### Plan temático mensual
- Tema central del mes.
- Objetivos y temas por semana (S1-S4). Estos objetivos son los que aparecen como contexto en el "Foco de la semana" del Inicio.

### Carruseles
- Grid de carruseles con preview de slides.
- Filtro por semana (S1-S4 + Todas).
- Modal de edición con: título, semana, categoría, estado, notas, portada y subida múltiple de slides numerados.

---

## 3. Contenido

Todo el contenido publicable: posts, reels, carruseles, stories.

- **Filtros por categoría**: Todos / Orgánico / Educacional / Informativo / Inspiracional / Conversión / Reel.
- **Vista**: Cards (grid) o Feed (lista).
- **Cada card tiene**: título, categoría (color), formato, estado (idea / borrador / listo / publicado), fecha, portada.
- **Modal de edición** con campos condicionales:
  - **Conversión**: agrega campo CTA (call to action).
  - **Reel**: agrega concepto, audio, texto superpuesto, "aparece Flora", estado de producción.
  - **Carrusel**: notas por slide + subida múltiple de imágenes.
- **Export PDF**: botón para exportar todo el contenido a PDF.
- **El campo "fecha" es lo que conecta el contenido con el Calendario.** Si no cargás fecha, no aparece en el calendario.

---

## 4. Ideas

Pipeline kanban arriba + 5 sub-pestañas.

### Ideas en proceso (kanban)
- 3 columnas: **Ideas** (rosa claro) → **En proceso** (beige) → **Publicado** (verde).
- Click "Agregar" en cualquier columna para crear un ítem.
- Flecha → mueve un ítem a la columna siguiente.

### Frases
- Frases sueltas que pueden servir para captions, stories, bio.
- Marcá favoritas con la estrella.
- Filtro: Todas / Favoritas.
- Botón ✏️ para **editar inline** (la card se transforma en formulario).

### Reflexiones
- Diario de reflexiones con fecha y etiqueta (ej: sesión, formación, vida).
- Ordenadas por fecha (más recientes primero).
- Editables inline con el lápiz.

### Banco de encuestas
- Lo mismo que en Estrategia mensual → Banco de encuestas (es el mismo repositorio).

### Referencias
- Cuentas o referencias visuales con screenshot, link, qué te gustó y cómo lo adaptarías.
- Click en la card abre el modal de edición.

### Temas futuros
- Backlog de temas con prioridad (Alta ⚡ / Media = / Baja –) y mes tentativo.
- Botón **"Pasar a Contenido"**: convierte el tema en una card de Contenido (en estado "idea"). El tema queda marcado como "en contenido" pero no desaparece.
- Editable inline con el lápiz.

---

## 5. Calendario

Vista mensual auto-generada con todo lo programado.

### La grilla
- 7 columnas: Lunes (L) a Domingo (D).
- Filas: las semanas del mes (4-6 según el mes).
- El número del día va arriba a la derecha de cada celda.
- **El día de hoy** aparece con un círculo rosa-viejo.
- Días del mes anterior/siguiente aparecen vacíos con fondo sutil.

### Los chips (no son bullets, son rectángulos de color)
Cada ítem programado aparece como un chip pequeño con:
- **Color por tipo**: rosa claro = post · beige = carrusel · verde claro = reel · rosa oscuro = story.
- **Texto truncado**: si el título es largo, se corta con "...".
- **Hasta 3 chips por día**. Si hay más, aparece **"+N más"** que muestra todo en un panel.

### Qué aparece en el calendario

| Tipo de ítem | Aparece si… |
|---|---|
| Post / Reel / Carrusel | Tiene **fecha** cargada (campo "Fecha" en su card de Contenido) |
| Story | Tiene `mes`, `semana` y `día` (las creadas desde ahora ya los tienen) |
| Frases / reflexiones / ideas / referencias / temas futuros | **No aparecen** — no son contenido programado |

### Cómo se ubican las stories en el calendario
Las stories no tienen fecha exacta; tienen Semana (1-4) y día (L-D). El sistema convierte automáticamente:
- **S1** = días 1 al 7 del mes.
- **S2** = días 8 al 14.
- **S3** = días 15 al 21.
- **S4** = días 22 hasta fin de mes.

Dentro de ese rango, busca el día de la semana que corresponde. Por ejemplo, una story en *S2, día Mi (miércoles), abril 2026* → el sistema encuentra el primer miércoles entre los días 8-14 (que es el 8 de abril) y ahí pone el chip.

### Acciones
- **Click en un chip**: abre un panel con el detalle (título, categoría, estado, fecha, resumen).
- **Click en "+N más"**: abre la lista completa de ítems del día.
- **Click fuera del panel**: lo cierra.

### Filtros (pills arriba)
- **Todos / Stories / Posts / Carruseles / Reels**: filtran qué chips se muestran. La grilla no cambia, solo los chips desaparecen/aparecen.

### Navegación de meses
- Flechas **← →** cambian de mes. La grilla se regenera para cada mes (cuántos días tiene, qué día de la semana arranca).
- Si te alejás del mes actual, aparece un botón **"Hoy"** que te lleva de vuelta.
- Podés navegar a meses pasados o futuros sin límite.

---

## 6. Moodboard

(Próximamente — Fase 5 Paso 15)

Grid visual de imágenes de inspiración, paletas de color y referencias estéticas.

---

## Tips de uso para sacarle todo

1. **Cargá fecha siempre que tengas el día decidido**: es lo que hace que el contenido aparezca en el Calendario. Si todavía no sabés cuándo, dejala vacía y se queda en Contenido sin programar.

2. **El Foco de la semana es tu brújula**: usalo para definir tu intención semanal. Si tenés cargado el objetivo del plan temático, ya viene con ese contexto.

3. **El kanban de Ideas es el flujo natural**: idea suelta → en proceso (la estás trabajando) → publicado. Una idea en "publicado" del kanban no es lo mismo que un post "publicado" en Contenido — el kanban es solo de planificación, el estado real lo lleva la card en Contenido.

4. **Promover temas futuros**: cuando un tema futuro está maduro y querés convertirlo en publicación concreta, "Pasar a Contenido" crea la card automáticamente con título, formato y mes. Después le agregás fecha exacta y aparece en el calendario.

5. **Las encuestas se comparten**: el banco está en Estrategia y en Ideas. Es el mismo. No las dupliques.

6. **Iconos universales**:
   - ⭐ estrella = favorita
   - ✏️ lápiz = editar
   - 🗑️ basurita = eliminar
   - ✓ tilde = marcar como hecho/usado
   - ↗️ flecha diagonal = pasar/promover

7. **Sincronización**: todo se guarda en Firestore en tiempo real. El puntito verde en la esquina del sidebar significa que está todo sincronizado. Si parpadea = guardando. Rojo = error de conexión.

8. **El historial del Foco de la semana es valioso**: revisá tus focos de semanas pasadas para ver cómo evolucionó tu intención y qué patrones aparecen.
