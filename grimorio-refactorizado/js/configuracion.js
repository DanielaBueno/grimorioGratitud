/**
 * @module configuracion
 * @description Constantes globales de la aplicación.
 * Centraliza todos los datos estáticos: estados de ánimo, actividades,
 * prompts, logros y niveles. Ningún otro módulo debe definir estos datos.
 */

const ESTADOS_ANIMO = [
  { emoji: '🌑', etiqueta: 'Muy baja', valor: 1 },
  { emoji: '🌒', etiqueta: 'Baja',     valor: 2 },
  { emoji: '🌓', etiqueta: 'Neutral',  valor: 3 },
  { emoji: '🌔', etiqueta: 'Bien',     valor: 4 },
  { emoji: '🌕', etiqueta: 'Radiante', valor: 5 },
];

const ACTIVIDADES = [
  { id: 'programar',  emoji: '💻',  etiqueta: 'Programar'  },
  { id: 'caminar',    emoji: '🚶‍♀️', etiqueta: 'Caminar'    },
  { id: 'ejercicio',  emoji: '🏋️‍♀️', etiqueta: 'Ejercicio'  },
  { id: 'escribir',   emoji: '✍️',  etiqueta: 'Escribir'   },
  { id: 'dibujar',    emoji: '🎨',  etiqueta: 'Dibujar'    },
  { id: 'leer',       emoji: '📖',  etiqueta: 'Leer'       },
  { id: 'cocinar',    emoji: '🍳',  etiqueta: 'Cocinar'    },
  { id: 'meditar',    emoji: '🧘‍♀️', etiqueta: 'Meditar'    },
  { id: 'musica',     emoji: '🎵',  etiqueta: 'Música'     },
  { id: 'descansar',  emoji: '🛌',  etiqueta: 'Descansar'  },
  { id: 'amistades',  emoji: '🫂',  etiqueta: 'Amistades'  },
  { id: 'naturaleza', emoji: '🌿',  etiqueta: 'Naturaleza' },
];

const PROMPTS_NORMALES = [
  '¿Qué pequeño momento de hoy merece ser recordado?',
  '¿Qué persona o cosa te dio energía hoy?',
  '¿Qué aprendiste hoy, aunque haya sido difícil?',
  '¿Qué parte de ti misma aprecias hoy?',
  '¿Qué belleza encontraste en algo ordinario?',
  '¿Qué te dio paz, aunque sea por un instante?',
  '¿De qué te sientes orgullosa esta semana?',
  '¿Qué desafío superaste hoy?',
  '¿Qué cosa sencilla disfrutaste profundamente?',
  '¿Quién estuvo ahí para ti, silenciosamente?',
  '¿Qué magia encontraste en lo cotidiano hoy?',
  '¿Qué parte de la naturaleza te recordó que sigues viva?',
];

const PROMPTS_DIA_DIFICIL = [
  'Hoy puede ser pesado. Eso también es válido. 🤍 ¿Hubo aunque sea un momento de respiro?',
  'Los días difíciles también nos enseñan algo sobre nosotras. ¿Qué necesitaste hoy?',
  'No tienes que sentirte bien para estar aquí. Solo escribe lo que puedas. 🌙',
  'Incluso en los días grises, algo pequeño sostiene. ¿Qué fue ese algo hoy?',
  'Estás aquí, escribiendo. Eso ya es mucho. 🌿',
];

const MENSAJES_CELEBRACION = [
  { emoji: '✨', texto: 'Cada entrada es un acto de amor propio. Bien hecho, preciosa.' },
  { emoji: '🌿', texto: 'Tu gratitud florece aunque el día haya sido difícil.' },
  { emoji: '🌕', texto: 'Has sellado otro día en el grimorio. Sigue brillando.' },
  { emoji: '💫', texto: 'Las palabras que escribiste hoy tienen su propia magia.' },
  { emoji: '🌸', texto: 'Qué hermoso que te hayas tomado este momento para ti.' },
];

const DEFINICION_LOGROS = [
  {
    id: 'primera-semilla',
    emoji: '🌱',
    nombre: 'Primera semilla',
    descripcion: 'Escribe tu primera entrada',
    cumplida: ({ totalEntradas }) => totalEntradas >= 1,
  },
  {
    id: 'siete-dias',
    emoji: '🌿',
    nombre: '7 días',
    descripcion: '7 días consecutivos de gratitud',
    cumplida: ({ rachaActual }) => rachaActual >= 7,
  },
  {
    id: 'veintiun-dias',
    emoji: '🌷',
    nombre: '21 días',
    descripcion: '21 días consecutivos',
    cumplida: ({ rachaActual }) => rachaActual >= 21,
  },
  {
    id: 'un-mes',
    emoji: '🌺',
    nombre: 'Un mes',
    descripcion: '30 entradas totales',
    cumplida: ({ totalEntradas }) => totalEntradas >= 30,
  },
  {
    id: 'cincuenta-entradas',
    emoji: '🌻',
    nombre: '50 entradas',
    descripcion: 'Has llenado 50 páginas',
    cumplida: ({ totalEntradas }) => totalEntradas >= 50,
  },
  {
    id: 'cien-entradas',
    emoji: '🌟',
    nombre: '100 entradas',
    descripcion: 'Un grimorio florecido',
    cumplida: ({ totalEntradas }) => totalEntradas >= 100,
  },
  {
    id: 'primera-carta',
    emoji: '💌',
    nombre: 'Carta enviada',
    descripcion: 'Escribe tu primera carta',
    cumplida: ({ totalCartas }) => totalCartas >= 1,
  },
  {
    id: 'luna-llena',
    emoji: '🌕',
    nombre: 'Luna llena',
    descripcion: 'Registra 5 días radiantes seguidos',
    cumplida: ({ mejorRachaRadiante }) => mejorRachaRadiante >= 5,
  },
];

const NIVELES = [
  { desde: 0,   hasta: 4,   nombre: 'Semilla',        emoji: '🌱' },
  { desde: 5,   hasta: 14,  nombre: 'Brote',          emoji: '🌿' },
  { desde: 15,  hasta: 29,  nombre: 'Flor',           emoji: '🌸' },
  { desde: 30,  hasta: 59,  nombre: 'Árbol',          emoji: '🌳' },
  { desde: 60,  hasta: 99,  nombre: 'Jardín',         emoji: '🌺' },
  { desde: 100, hasta: 999, nombre: 'Grimorio Pleno',  emoji: '🌟' },
];

const COLORES_GRAFICAS = ['#5a7d5c', '#c8a84b', '#c8758a', '#7a9d7c', '#b0a07a', '#8a7d5c'];
