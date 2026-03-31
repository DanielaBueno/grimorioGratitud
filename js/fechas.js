/**
 * @module fechas
 * @description Utilidades puras para manejo de fechas.
 * Estas funciones no tienen efectos secundarios ni acceden al DOM.
 * Son candidatas ideales para pruebas unitarias.
 */

/**
 * Convierte una fecha en texto con formato YYYY-MM-DD.
 * @param {Date} fecha - La fecha a convertir (por defecto, hoy)
 */
function fechaComoTexto(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes  = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia  = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/**
 * Formatea un texto YYYY-MM-DD como fecha legible en español colombiano.
 * @param {string} textoFecha - Fecha en formato YYYY-MM-DD
 */
function formatearFecha(textoFecha) {
  const [anio, mes, dia] = textoFecha.split('-').map(Number);
  return new Date(anio, mes - 1, dia)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
}

/**
 * Genera un arreglo de textos de fechas desde hace N días hasta hoy.
 * @param {number} cantidad - Número de días a generar
 */
function generarUltimosDias(cantidad = 30) {
  return Array.from({ length: cantidad }, (_, indice) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - (cantidad - 1 - indice));
    return fechaComoTexto(fecha);
  });
}

/**
 * Calcula cuántos días consecutivos hay registrados hasta hoy.
 * @param {object} todasLasEntradas - Mapa de fecha → entrada
 */
function calcularRachaConsecutiva(todasLasEntradas) {
  let racha = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i++) {
    const clave = fechaComoTexto(cursor);
    if (todasLasEntradas[clave]) {
      racha++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return racha;
}

/**
 * Calcula la racha más larga de días con ánimo 'Radiante' (valor 5).
 * @param {object} todasLasEntradas - Mapa de fecha → entrada
 */
function calcularMejorRachaRadiante(todasLasEntradas) {
  const fechasOrdenadas = Object.keys(todasLasEntradas).sort();
  let rachaActual = 0;
  let mejorRacha  = 0;
  fechasOrdenadas.forEach(fecha => {
    if (todasLasEntradas[fecha]?.animo === 5) {
      rachaActual++;
      mejorRacha = Math.max(mejorRacha, rachaActual);
    } else {
      rachaActual = 0;
    }
  });
  return mejorRacha;
}

/**
 * Devuelve un elemento aleatorio de una lista.
 * @param {Array} lista
 */
function elementoAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}
