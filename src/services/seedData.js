// Datos de ejemplo para la DEMO pública anonimizada.
// No representan a ninguna clienta real: marca ficticia "Estudio Demo".
// Se cargan la primera vez en localStorage y el visitante puede editarlos libremente.

const hoy = new Date();
const iso = (offsetDays) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};
const mesActual = () => {
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${meses[hoy.getMonth()]}-${hoy.getFullYear()}`;
};

export const SEED_DASHBOARD = {
  weeklyFocus: [
    { id: 'wf1', semana: 1, mes: mesActual().split('-')[0], año: hoy.getFullYear(), texto: 'Reforzar autoridad de marca con contenido educativo' },
  ],

  monthlyPlan: {
    themeCentral: 'Construcción de comunidad y confianza',
    weeks: {
      s1: { objetivo: 'Generar autoridad', tema: 'Mitos y verdades del rubro' },
      s2: { objetivo: 'Conectar', tema: 'Detrás de escena del día a día' },
      s3: { objetivo: 'Educar', tema: 'Tips prácticos y aplicables' },
      s4: { objetivo: 'Convertir', tema: 'Casos, testimonios y cierre del mes' },
    },
  },

  stories: [
    { id: 's1', mes: mesActual(), semana: 1, dia: 'L', categoria: 'Día a día', texto: 'Arranque de semana: mostrando el espacio de trabajo', tipo: 'Foto + texto', estado: 'idea' },
    { id: 's2', mes: mesActual(), semana: 1, dia: 'Mi', categoria: 'Interacción', texto: 'Encuesta: ¿qué tema querés ver esta semana?', tipo: 'Encuesta', estado: 'listo' },
    { id: 's3', mes: mesActual(), semana: 2, dia: 'V', categoria: 'Educativo', texto: 'Tip rápido en formato story', tipo: 'Video', estado: 'idea' },
  ],

  encuestas: [
    { id: 'e1', pregunta: '¿Cuál es tu mayor desafío con las redes?', opcionA: 'Falta de tiempo', opcionB: 'No sé qué publicar', tema: 'comunidad', createdAt: iso(-5) },
    { id: 'e2', pregunta: '¿Preferís reels o carruseles?', opcionA: 'Reels', opcionB: 'Carruseles', tema: 'formato', createdAt: iso(-2) },
  ],

  carruseles: [
    { id: 'c1', titulo: '5 errores comunes al empezar en redes', semana: 1, categoria: 'Educativo', estado: 'listo', storiesIntro: 'Story del lunes anticipa el tema', notas: 'Slide 1: Hook\nSlide 2-4: errores\nSlide 5: CTA', createdAt: iso(-3) },
  ],

  content: [
    { id: 'ct1', createdAt: iso(-1), title: 'Mitos y verdades de tu industria', excerpt: 'Carrusel desmitificando creencias comunes del rubro.', category: 'educacional', type: 'carrusel', status: 'publicado', date: iso(-1), tags: ['autoridad','educación'], cta: '', portada: '', notasSlides: 'Slide 1: Hook\nSlide 2: Mito\nSlide 3: Verdad\nSlide 4: CTA', imagenes: [], reelData: null },
    { id: 'ct2', createdAt: iso(0), title: 'Detrás de escena: un día de trabajo', excerpt: 'Reel mostrando el proceso real, sin filtros.', category: 'reel', type: 'reel', status: 'listo', date: iso(2), tags: ['cercanía'], cta: '', portada: '', notasSlides: '', imagenes: [], reelData: { concepto: 'Plano del proceso, close-ups', audio: 'Tendencia del mes', textoSuperpuesto: 'Un día conmigo', apareceFlora: 'Sí', estadoProduccion: 'grabado' } },
    { id: 'ct3', createdAt: iso(0), title: '3 tips para mejorar tu perfil', excerpt: 'Post estático con consejos rápidos.', category: 'informativo', type: 'post', status: 'borrador', date: iso(5), tags: ['tips'], cta: '', portada: '', notasSlides: '', imagenes: [], reelData: null },
    { id: 'ct4', createdAt: iso(0), title: 'Reservá tu lugar este mes', excerpt: 'Contenido de conversión con llamado a la acción.', category: 'conversión', type: 'post', status: 'idea', date: iso(8), tags: ['venta'], cta: 'Escribinos por DM para reservar', portada: '', notasSlides: '', imagenes: [], reelData: null },
  ],

  ideas: {
    frases: [
      { id: 'f1', favorita: true, createdAt: iso(-4), text: 'Tu marca no compite por atención, compite por confianza.', uso: 'caption', tag: 'autoridad' },
      { id: 'f2', favorita: false, createdAt: iso(-2), text: 'Mostrar el proceso es tan valioso como mostrar el resultado.', uso: 'story', tag: 'cercanía' },
    ],
    reflexiones: [
      { id: 'r1', fecha: iso(-3), createdAt: iso(-3), text: 'Los contenidos educativos generaron más guardados que los promocionales este mes.', tag: 'aprendizaje' },
    ],
    referencias: [
      { id: 'rf1', createdAt: iso(-6), nombre: '@cuenta_referencia', link: 'https://instagram.com/', queLePaso: 'Buen uso de carruseles educativos con diseño limpio.', comoAdaptar: 'Adaptar el formato a nuestra paleta y tono.' },
    ],
    temasFuturos: [
      { id: 't1', promovida: false, createdAt: iso(-5), idea: 'Serie de stories con preguntas frecuentes', formato: 'serie stories', prioridad: 'alta', mesTentativo: 'próximo mes' },
      { id: 't2', promovida: false, createdAt: iso(-1), idea: 'Reel mostrando un antes y después', formato: 'reel', prioridad: 'media', mesTentativo: '' },
    ],
    pipeline: {
      ideas: [
        { id: 'p1', createdAt: iso(-2), text: 'Carrusel sobre tendencias del rubro' },
        { id: 'p2', createdAt: iso(-1), text: 'Colaboración con otra cuenta del nicho' },
      ],
      proceso: [
        { id: 'p3', createdAt: iso(-3), text: 'Reel de detrás de escena (grabando)' },
      ],
      publicado: [
        { id: 'p4', createdAt: iso(-7), text: 'Post de presentación de la marca' },
      ],
    },
  },

  mood: [],
};
