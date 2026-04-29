# Flora Dashboard v2 — Plan completo para Claude Code

## Contexto
Dashboard de gestión de contenido para Instagram, para una profesional de masajes faciales y dermocoaching.
- **App actual**: flora-dashboard-two.vercel.app (HTML single-file + Firebase Firestore)
- **Objetivo**: Reescritura completa en React + Firebase con todas las funcionalidades del brief
- **Principio clave**: Incluir TODAS las features del brief pero con implementaciones simples y elegantes. No recortar funcionalidad, simplificar la complejidad técnica.

---

## Stack
- **React** (Vite) con React Router para navegación entre solapas
- **Firebase Firestore** (proyecto existente: `flora-dashboard-117ce`)
- **Firebase Storage** (para imágenes — portadas de carruseles, referencias visuales, moodboard)
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones suaves
- **html2pdf.js** para exportar PDFs por sección
- **Deploy**: Vercel (misma URL: flora-dashboard-two.vercel.app)

---

## Paleta y tipografía (mantener la identidad actual)
```css
--rosa-viejo: #c4a0a0
--rosa-claro: #dfc5c5
--rosa-hover: #b8908f
--verde-seco: #a3aa8e
--verde-claro: #c5cbaf
--verde-hover: #8f966e
--beige-1: #f5efe6
--beige-2: #ede4d8
--beige-3: #e2d5c5
--crema: #faf7f2
--texto: #5a4a42
--texto-suave: #8a7a72
--blanco: #fffcf8

Tipografías: Cormorant Garamond (display/headings) + Outfit (body/UI)
```

---

## Firebase (proyecto existente, NO crear nuevo)
```js
const firebaseConfig = {
  apiKey: "AIzaSyBlZbljf0nXmFrS8pT9Hhmqb9RmAl4mir4",
  authDomain: "flora-dashboard-117ce.firebaseapp.com",
  projectId: "flora-dashboard-117ce",
  storageBucket: "flora-dashboard-117ce.firebasestorage.app",
  messagingSenderId: "1025407296939",
  appId: "1:1025407296939:web:7e9180e145dd40c92e5eee"
};
// Colección Firestore: dashboards/flora
// Storage: carpeta images/
// Reglas: abiertas (allow read, write: if true)
// IMPORTANTE: Hacer backup de los datos actuales antes de migrar
```

---

## Arquitectura de navegación (6 solapas)

```
Flora Studio
├── INICIO — panel de control general
├── ESTRATEGIA MENSUAL — plan temático + stories + carruseles
├── CONTENIDO — archivo de piezas por categoría + preview feed
├── IDEAS — frases, reflexiones, banco encuestas, referencias, backlog
├── CALENDARIO — vista mensual auto-generada desde contenido publicado
└── MOODBOARD — referencias visuales y estéticas
```

En desktop: sidebar izquierdo con las 6 solapas (como el dashboard actual).
En mobile: tabs horizontales en la parte inferior (tipo app nativa) o menú hamburguesa.

---

## SOLAPA 1: INICIO

Panel de control. Lo primero que Flora ve. Tiene que dar una foto clara del estado de todo en 5 segundos.

### Saludo dinámico (ya existe, mantener exacto)
- Buen día / Buenas tardes / Buenas noches Flora ✿
- Día de la semana + fecha completa
- Frase motivacional rotativa (30 frases sobre oficio/disciplina ya hardcodeadas)

### Métricas rápidas (tarjetas resumen)
Se calculan automáticamente leyendo data de las otras secciones:
- **Posts publicados este mes** → `content.filter(c => c.status === 'published' && esEsteMes(c.date)).length`
- **En borrador** → `content.filter(c => c.status === 'draft').length`
- **Stories programadas esta semana** → `stories.filter(s => s.status === 'lista' && esEstaSemana(s.semana)).length`
- **Ideas en pipeline** → `ideas.pipeline.ideas.length + ideas.pipeline.proceso.length`
- **Próxima publicación** → card con status "ready" y fecha más cercana, mostrar título + fecha + tipo

### Accesos rápidos (NUEVO)
Fila de botones debajo de métricas:
- `+ Nueva story` → abre modal de nueva story
- `+ Nueva idea` → abre modal de nueva idea
- `+ Nuevo post` → abre modal de nuevo contenido
- `Ver calendario` → navega a solapa Calendario

### Recordatorio semanal (NUEVO)
Bloque editable destacado:
- Textarea donde Flora escribe el foco de la semana
- Ejemplo: "Semana 2 · Tema: Hábitos y piel · Carrusel pendiente de producción"
- Se guarda en Firestore como campo `weeklyFocus`
- Estilo: card con borde izquierdo rosa viejo, fondo beige, Cormorant itálica

### Nota para Claude Code
Todas las métricas son de lectura. No se cargan desde acá. Son cálculos en tiempo real sobre los datos de las otras secciones.

---

## SOLAPA 2: ESTRATEGIA MENSUAL

El corazón de la planificación. 3 sub-tabs horizontales dentro de la solapa:

```
Stories | Plan temático | Carruseles
```

### Sub-tab: Stories
Vista con filtro por semana: pills `S1 / S2 / S3 / S4` (NO sub-subsolapas, un solo componente con filtro).

Dentro de cada semana: los días L a S. Cada story es una card editable.

**Campos de cada story:**
```
- Día de publicación (L / M / Mi / J / V / S)
- Número de story (orden dentro del día, ej: 1, 2, 3)
- Categoría: Flora cotidiana | Flora trabaja | Flora estudia | Flora hábitos | Flora informa | Interacción
- Texto o idea de la story
- Tipo: Encuesta | Cajita de preguntas | Texto solo | Foto + texto | Video (manos/proceso) | Dato disruptivo | Anticipo de contenido
- Estado: Idea | Lista | Publicada
```

**Flujo automático:** cuando Flora marca una story como "Publicada", se archiva automáticamente en el Calendario con su fecha.

### Sub-tab: Banco de encuestas (dentro de Stories)
Listado filtrable (NO drag & drop). Cards con:
```
- Pregunta
- Opción A
- Opción B
- Tema (tag)
- Usada (toggle sí/no)
- Favorita (toggle estrella)
```
Flora puede marcar una encuesta como favorita y filtrar por "favoritas" o "no usadas".

### Sub-tab: Plan temático mensual
Un bloque simple con:
- **Tema central del mes**: 1 textarea libre. Ej: "Mes 1 — Quién soy y por qué importa mi mirada sobre la piel"
- **Objetivo por semana**: 4 campos de texto corto, uno por semana
  - S1: "generar curiosidad"
  - S2: "educar"
  - S3: "mostrar el trabajo"
  - S4: "convertir"
- **Tema específico por semana**: 4 campos de texto. Ej: S1 "Quién soy", S2 "Hábitos y piel"

Todo se guarda como un objeto simple en Firestore. Editable con click.

### Sub-tab: Carruseles planificados
Cada carrusel es una card independiente con:
```
- Título del carrusel
- Semana de publicación (S1/S2/S3/S4)
- Categoría temática
- Stories de introducción (campo de texto libre donde Flora escribe cuáles — NO sistema de linking)
- Estado: Idea | En producción | Listo | Publicado
- Notas por slide (1 textarea donde escribe "Slide 1: ..., Slide 2: ..., Slide 3: ..." en texto libre)
- Imágenes del carrusel (upload múltiple — Firebase Storage)
```

**Imágenes del carrusel:**
- Botón "Subir imágenes" que permite seleccionar 1 o más archivos
- Se muestran como miniaturas horizontales tipo slide, simulando el carrusel de Instagram
- Flora puede swipear/scrollear para ver cómo quedaría
- También puede subir solo la portada (1 imagen) si todavía no tiene todas
- Las imágenes se suben a Firebase Storage en `images/carousels/{id}/`

---

## SOLAPA 3: CONTENIDO

Todo el contenido ya pensado o en producción, organizado por categoría.

### Barra de filtros por categoría
Pills horizontales clickeables:
- **Todo** (default)
- **Orgánico** — vida real, rituales, detrás de escena
- **Educacional** — carruseles que enseñan
- **Informativo** — datos, mitos vs realidad, stats
- **Inspiracional** — reflexiones, emociones, lo que genera DMs emotivos (NUEVA)
- **Conversión** — venta de servicios, CTAs, objeciones (NUEVA)
- **Reels** — con campos de producción propios

### Cards de contenido
**Campos base (todos los tipos):**
```
- Título (obligatorio)
- Descripción / texto de la idea
- Categoría (orgánico | educacional | informativo | inspiracional | conversión | reel)
- Tipo de formato (carrusel | reel | story | post estático)
- Estado (idea | borrador | listo | publicado)
- Fecha de publicación (date picker o texto libre)
- Tags (separados por coma)
- Imagen de portada (upload 1 imagen — Firebase Storage)
```

**Campos extra si categoría = conversión:**
```
- CTA (texto del botón o link a usar)
```

**Campos extra si categoría = reel:**
```
- Concepto (qué se ve en pantalla)
- Audio / música
- Texto superpuesto
- ¿Aparece Flora en cámara? (Sí | No | Solo manos)
- Estado de producción (idea | guion | grabado | editado | publicado)
```

**Campos extra si tipo = carrusel:**
```
- Notas por slide (textarea)
- Imágenes del carrusel (upload múltiple)
```

### Preview de feed de Instagram (NUEVO)
Una sub-vista dentro de Contenido (toggle o tab "Vista Feed"):
- Grilla de 3 columnas simulando el feed de Instagram
- Muestra las portadas de los contenidos que tienen imagen subida
- Orden cronológico inverso (más reciente arriba a la izquierda)
- Solo muestra contenidos con status "listo" o "publicado" que tengan imagen
- Click en una miniatura abre la card completa
- Permite ver de un vistazo si la estética del feed es coherente

### Export PDF por sección (mantener)
Botón "↓ PDF" que genera brief de contenido filtrado por categoría activa.

---

## SOLAPA 4: IDEAS

El caos creativo organizado. 5 sub-tabs horizontales:

```
Frases | Reflexiones | Banco encuestas | Referencias | Temas futuros
```

### Tab: Frases y textos
```
- Frase (texto libre)
- Uso posible (story, carrusel, caption, bio...)
- Etiqueta temática (tag corto)
- Favorita (toggle estrella)
```

### Tab: Reflexiones y aprendizajes
Cards tipo diario con textarea más grande:
```
- Texto libre
- Fecha (auto-fecha al crear, editable)
- Etiqueta
```

### Tab: Banco de encuestas
(También accesible desde Estrategia > Stories)
```
- Pregunta
- Opción A
- Opción B
- Tema (tag)
- Usada (toggle sí/no)
- Favorita (toggle estrella)
```
Filtros: Todas | Favoritas | No usadas

### Tab: Referencias e inspiración
```
- Nombre o cuenta
- Link o URL
- Screenshot / imagen (upload a Firebase Storage)
- Qué le gustó
- Cómo lo adaptaría a su tono
```

### Tab: Temas para próximos meses (backlog)
```
- Idea / tema
- Formato posible (carrusel, reel, serie stories, post)
- Prioridad (alta ⚡ | media 💡 | baja)
- Mes tentativo
```
**Botón "Promover a contenido"** → crea una card nueva en solapa Contenido con título, formato y tags pre-llenados. La card original en Temas se marca como "promovida".

### Pipeline kanban (mantener el que ya existe)
3 columnas: Ideas → En proceso → Publicado
Con flecha → para mover entre columnas.

---

## SOLAPA 5: CALENDARIO

Vista de calendario real. Se genera automáticamente desde los contenidos y stories marcados como publicados.

### Vista mensual
- Grilla 7 columnas (L M Mi J V S D) × semanas del mes
- Cada celda muestra los contenidos publicados ese día como chips de color
- Código de colores:
  - 🟤 Stories (rosa viejo)
  - 🟢 Carrusel (verde seco)
  - 🔵 Reel (celeste/azul suave)
  - 🟡 Post estático (beige/arena)
  - 🟣 Interacción/encuesta (lila suave)
- Click en un chip → abre detalle del contenido en modal
- Click en un día vacío → muestra "Sin publicaciones" (no permite crear desde acá)

### Navegación
- Flechas ← → para cambiar de mes
- Botón "Hoy" para volver al mes actual
- Navegar a meses anteriores funciona como archivo histórico (misma vista, meses pasados)

### Filtros
- Pills de toggle por tipo de contenido para mostrar/ocultar tipos específicos

### Flujo automático
El calendario NO tiene carga manual. Se alimenta de:
1. Contenidos con status "publicado" + campo `date` → aparecen en el día correspondiente
2. Stories con status "publicada" + campo `semana` + `dia` → se calculan al día correspondiente

### Nota para Claude Code
El calendario es un componente de LECTURA. No tiene botones de crear ni editar. Solo muestra, filtra y permite clickear para ver detalle. Todo se carga desde las otras secciones.

---

## SOLAPA 6: MOODBOARD

Referencias visuales y estéticas. Ya existe parcialmente.

### Grilla visual
- Cards con imagen o color de paleta
- Upload de imagen (Firebase Storage, carpeta `images/moodboard/`)
- Campos: Nombre/label + imagen o paleta
- Hover muestra botón de eliminar
- Click abre lightbox (imagen grande)

### Paletas predefinidas (mantener las actuales)
Rosa viejo, Verde seco, Beige, Luz cálida, Orgánico

---

## Sistema de imágenes (Firebase Storage)

### Estructura de carpetas en Storage
```
images/
├── content/{contentId}/       → portada y slides de carrusel
├── moodboard/{moodId}/        → imágenes del moodboard
├── references/{refId}/        → screenshots de cuentas de referencia
└── stories/{storyId}/         → (futuro, si se agregan imágenes a stories)
```

### Flujo de upload
1. Flora toca "Subir imagen" en un modal
2. Selecciona archivo del dispositivo (input type="file" accept="image/*")
3. La imagen se sube a Firebase Storage
4. Se guarda la URL pública en Firestore dentro del documento correspondiente
5. Se muestra la miniatura inmediatamente

### Compresión
Antes de subir, comprimir la imagen del lado del cliente a max 1200px de ancho y calidad 80% (canvas resize). Esto evita que Flora suba fotos de 5MB del celular y se consuma el storage.

---

## Estructura de datos en Firestore

Un solo documento: `dashboards/flora`

```json
{
  "weeklyFocus": "Semana 2 · Tema: Hábitos y piel",

  "monthlyPlan": {
    "themeCentral": "Quién soy y por qué importa mi mirada sobre la piel",
    "weeks": {
      "s1": { "objetivo": "generar curiosidad", "tema": "Quién soy" },
      "s2": { "objetivo": "educar", "tema": "Hábitos y piel" },
      "s3": { "objetivo": "mostrar el trabajo", "tema": "Las manos que sanan" },
      "s4": { "objetivo": "convertir", "tema": "La sesión" }
    }
  },

  "stories": [
    {
      "id": "uuid",
      "semana": 1,
      "dia": "L",
      "numero": 1,
      "categoria": "Flora cotidiana",
      "texto": "Ritual matutino antes de la primera sesión",
      "tipo": "Foto + texto",
      "estado": "lista"
    }
  ],

  "encuestas": [
    {
      "id": "uuid",
      "pregunta": "¿Usás protector solar todos los días?",
      "opcionA": "Sí, siempre",
      "opcionB": "A veces me olvido",
      "tema": "hábitos",
      "usada": false,
      "favorita": true
    }
  ],

  "carruseles": [
    {
      "id": "uuid",
      "titulo": "Tu cara tiene 43 músculos",
      "semana": 2,
      "categoria": "educacional",
      "storiesIntro": "Story del lunes S2 prepara el tema",
      "estado": "listo",
      "notasSlides": "Slide 1: Hook — dato del sistema nervioso\nSlide 2: La antena...",
      "imagenes": ["https://storage.url/img1.jpg", "https://storage.url/img2.jpg"],
      "portada": "https://storage.url/cover.jpg"
    }
  ],

  "content": [
    {
      "id": "uuid",
      "title": "Mitos del masaje facial",
      "excerpt": "Desmitificar...",
      "category": "informativo",
      "type": "post",
      "status": "idea",
      "date": "",
      "tags": ["mitos", "autoridad"],
      "cta": "",
      "portada": "",
      "reelData": null,
      "createdAt": "2026-04-10T..."
    }
  ],

  "ideas": {
    "frases": [
      { "id": "uuid", "text": "Tu piel no es un problema a resolver", "uso": "caption", "tag": "piel", "favorita": true }
    ],
    "reflexiones": [
      { "id": "uuid", "text": "Hoy una clienta me dijo...", "fecha": "2026-04-15", "tag": "sesión" }
    ],
    "referencias": [
      { "id": "uuid", "nombre": "@skinbymila", "link": "url", "imagen": "url", "queLePaso": "...", "comoAdaptar": "..." }
    ],
    "temasFuturos": [
      { "id": "uuid", "idea": "Serie sobre bruxismo", "formato": "carrusel", "prioridad": "alta", "mesTentativo": "mayo", "promovida": false }
    ],
    "pipeline": {
      "ideas": [],
      "proceso": [],
      "publicado": []
    }
  },

  "mood": [
    { "id": "uuid", "label": "Tonos piel", "image": "", "palette": "rosa" }
  ],

  "updatedAt": "2026-04-16T..."
}
```

---

## Orden de implementación

```
FASE 1 — FUNDACIÓN
  Paso 1:  Setup proyecto React + Vite + Tailwind + Firebase + Storage
  Paso 2:  Layout: sidebar desktop + tabs mobile + routing 6 solapas
  Paso 3:  Firebase service layer (funciones de read/write/upload reutilizables)

FASE 2 — SOLAPAS CORE
  Paso 4:  INICIO (saludo, métricas auto, frase del día, accesos rápidos, recordatorio semanal)
  Paso 5:  CONTENIDO (cards con categorías, filtros, modales CRUD, campos reel/carrusel, upload imágenes)
  Paso 6:  CONTENIDO - Preview Feed (grilla 3 columnas simulando feed IG)

FASE 3 — PLANIFICACIÓN
  Paso 7:  ESTRATEGIA MENSUAL - Plan temático (tema mes + objetivos semana)
  Paso 8:  ESTRATEGIA MENSUAL - Stories (cards por semana con filtro S1-S4, campos específicos)
  Paso 9:  ESTRATEGIA MENSUAL - Banco de encuestas
  Paso 10: ESTRATEGIA MENSUAL - Carruseles planificados (con upload de slides)

FASE 4 — IDEAS Y ORGANIZACIÓN
  Paso 11: IDEAS - 5 tabs (frases, reflexiones, banco encuestas, referencias con upload, temas futuros)
  Paso 12: IDEAS - Pipeline kanban (migrar el existente)
  Paso 13: IDEAS - Botón "promover a contenido"

FASE 5 — CALENDARIO Y VISUAL
  Paso 14: CALENDARIO (vista mensual, color-coded, auto-alimentado, filtros, navegación meses)
  Paso 15: MOODBOARD (migrar + mejorar upload de imágenes con lightbox)

FASE 6 — PULIDO
  Paso 16: Export PDF por sección (contenido, ideas, calendario)
  Paso 17: Responsive final + testing mobile
  Paso 18: Migración de datos actuales de Firestore al nuevo schema
  Paso 19: Deploy a Vercel (misma URL: flora-dashboard-two.vercel.app)
```

---

## Principios de simplificación aplicados

Cada feature del brief original está incluida, pero implementada de forma simple:

| Feature del brief | Implementación simplificada |
|---|---|
| Stories con 4 sub-subsolapas por semana | Una sola vista con filtro pills S1/S2/S3/S4 |
| Banco de encuestas con drag & drop | Listado filtrable con toggles usada/favorita |
| Plan temático mensual complejo | Un bloque con 1 textarea + 4 campos por semana |
| Carruseles como proyectos con sistema de slides | Cards normales con textarea "notas por slide" + upload múltiple de imágenes |
| Calendario doble vista (mensual + semanal) | Solo vista mensual, navegar a meses anteriores funciona como archivo |
| Archivo histórico separado | Es el mismo calendario navegando a meses pasados |
| Flujos automáticos entre secciones | Filter/map en el render del calendario sobre contenido con status "published" |
| Referencias cruzadas stories ↔ carruseles | Campo de texto libre "stories de intro" en la card del carrusel |
| Preview de feed de Instagram | Grilla 3 columnas con portadas de contenidos que tienen imagen |

---

## Notas para Claude Code

1. Este es un proyecto React NUEVO. No es una modificación del HTML actual.
2. La paleta, tipografías y estética se mantienen EXACTAS. No cambiar identidad visual.
3. Firebase ya existe con datos. Hacer backup del doc actual antes de migrar.
4. Cada solapa es una ruta de React Router (`/`, `/estrategia`, `/contenido`, `/ideas`, `/calendario`, `/moodboard`).
5. Los modales usan la estética actual: fondo blur rgba + backdrop-filter, border-radius 24px, inputs beige.
6. La frase del día y el saludo dinámico se mantienen exactamente como están (30 frases hardcodeadas).
7. Las imágenes se comprimen client-side antes de subir a Storage (max 1200px ancho, 80% quality).
8. El sidebar muestra indicador de sincronización (puntito verde = sincronizado con Firebase).
9. Todas las listas son ordenables por fecha de creación (más reciente primero).
10. Los campos de texto largo (notas por slide, reflexiones, descripción) usan textarea autoexpandible.
