/**
 * @module Recuerdos
 * @description Muestra una entrada aleatoria del pasado como recuerdo.
 * Solo considera entradas con más de 7 días de antigüedad y que
 * tengan al menos una gratitud escrita.
 * Depende de: Almacenamiento, fechas, interfaz.
 */
const Recuerdos = (() => {
  const DIAS_MINIMOS_DE_ANTIGUEDAD = 7;

  function obtenerEntradasAntiguas() {
    const todasLasEntradas = Almacenamiento.leerTodasLasEntradas();
    const hoy = new Date();

    return Object.entries(todasLasEntradas).filter(([fecha, entrada]) => {
      const [anio, mes, dia] = fecha.split('-').map(Number);
      const fechaEntrada     = new Date(anio, mes - 1, dia);
      const diasTranscurridos = (hoy - fechaEntrada) / (1000 * 60 * 60 * 24);
      const tieneGratitudes  = (entrada.gratitudes || []).some(Boolean);
      return diasTranscurridos >= DIAS_MINIMOS_DE_ANTIGUEDAD && tieneGratitudes;
    });
  }

  function mostrar() {
    const entradasAntiguas = obtenerEntradasAntiguas();

    if (!entradasAntiguas.length) {
      ocultarElemento('tarjeta-recuerdo');
      return;
    }

    const [fecha, entrada] = elementoAleatorio(entradasAntiguas);
    const gratitudesConTexto = (entrada.gratitudes || []).filter(Boolean);

    mostrarElemento('tarjeta-recuerdo');
    document.getElementById('fecha-recuerdo').textContent =
      formatearFecha(fecha).split(',')[0];
    document.getElementById('animo-recuerdo').textContent =
      entrada.animo ? ESTADOS_ANIMO[entrada.animo - 1]?.emoji : '';
    document.getElementById('gratitudes-recuerdo').innerHTML =
      gratitudesConTexto.map(texto => `<li>${texto}</li>`).join('');
    document.getElementById('nota-recuerdo').textContent =
      entrada.nota ? `"${entrada.nota}"` : '';
  }

  return { mostrar };
})();
