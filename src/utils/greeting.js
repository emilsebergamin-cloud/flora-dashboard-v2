export const dailyQuotes = [
  "El trabajo se hace cuando no tenés ganas. Esa es la única regla.",
  "Empezar mal es mejor que no empezar.",
  "La inspiración llega trabajando, no esperando.",
  "Hacer algo todos los días, aunque sea poco, vence a hacer mucho de vez en cuando.",
  "Lo que parece talento casi siempre es horas acumuladas.",
  "Mostrar lo que hacés es parte del trabajo, no algo que viene después.",
  "La constancia no es glamorosa pero es lo único que construye.",
  "Confiar en el proceso significa seguir cuando no ves resultados.",
  "La calidad sale de la cantidad. Primero hacé muchos, después hacé buenos.",
  "Terminar algo mediocre te enseña más que pensar algo perfecto.",
  "Lo que postergás hoy lo vas a tener que hacer igual, pero peor.",
  "Tener disciplina es elegir lo que querés mucho por sobre lo que querés ahora.",
  "Cada cosa que hacés con cuidado entrena el ojo para la próxima.",
  "El bloqueo creativo casi siempre es miedo disfrazado.",
  "Los oficios se construyen en silencio, no en feed.",
  "La rutina aburrida es la que sostiene el trabajo bueno.",
  "Empezá antes de sentirte lista. La sensación llega después.",
  "Hacer es pensar. No al revés.",
  "Lo que no medís se diluye. Lo que registrás, se acumula.",
  "Tu mejor versión profesional aparece después de muchas versiones intermedias.",
  "Compararte con quien empezó hace 10 años no tiene sentido. Compararte con vos de hace 6 meses, sí.",
  "Editar es donde el trabajo realmente sucede.",
  "La excelencia es un hábito, no un evento.",
  "Hacer poco y bien es más rentable que hacer mucho y a medias.",
  "El cliente nota cuando hay oficio detrás, aunque no sepa nombrarlo.",
  "Los proyectos no se terminan, se abandonan en un momento bueno.",
  "Si esperás motivación, vas a esperar para siempre. Sentate y empezá.",
  "El profesional aparece, el amateur espera condiciones perfectas.",
  "Cada cosa que entregás es una muestra de cómo trabajás.",
  "Lo que hacés cuando nadie mira es exactamente lo que hacés siempre.",
];

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Buen día';
  if (h >= 12 && h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getDateString(contentCount = null) {
  const d = new Date();
  const base = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
  if (contentCount === null) return base;
  const label = contentCount === 1 ? 'contenido cargado' : 'contenidos cargados';
  return `${base} — ${contentCount} ${label}`;
}

// Rota una frase por día (misma frase todo el día, cambia a medianoche)
export function getDailyQuote() {
  const dayIndex = Math.floor(Date.now() / 86_400_000) % dailyQuotes.length;
  return dailyQuotes[dayIndex];
}
