/**
 * @module Logros
 * @description Gestiona el sistema de gamificación del Grimorio.
 * Calcula el nivel actual, verifica logros nuevos y renderiza la vista de logros.
 * Depende de: Almacenamiento, fechas, interfaz, configuracion.
 */
const Logros = (() => {

  function calcularEstadisticasParaLogros() {
    const todasLasEntradas = Almacenamiento.leerTodasLasEntradas();
    return {
      totalEntradas:       Object.keys(todasLasEntradas).length,
      rachaActual:         calcularRachaConsecutiva(todasLasEntradas),
      totalCartas:         Almacenamiento.leerCartas().length,
      mejorRachaRadiante:  calcularMejorRachaRadiante(todasLasEntradas),
    };
  }

  function obtenerNivelActual(totalEntradas) {
    return NIVELES.find(n => totalEntradas >= n.desde && totalEntradas <= n.hasta) || NIVELES[0];
  }

  function verificar() {
    const estadisticas   = calcularEstadisticasParaLogros();
    const desbloqueados  = Almacenamiento.leerLogrosDesbloqueados();
    let huboCambios      = false;

    DEFINICION_LOGROS.forEach(logro => {
      if (!desbloqueados[logro.id] && logro.cumplida(estadisticas)) {
        desbloqueados[logro.id] = fechaComoTexto();
        huboCambios = true;
        mostrarTostada(`🏆 Logro desbloqueado: ${logro.nombre}`);
      }
    });

    if (huboCambios) {
      Almacenamiento.guardarLogrosDesbloqueados(desbloqueados);
    }
  }

  function renderizar() {
    const { totalEntradas } = calcularEstadisticasParaLogros();
    const nivelActual       = obtenerNivelActual(totalEntradas);
    const siguienteNivel    = NIVELES[NIVELES.indexOf(nivelActual) + 1];
    const porcentaje        = siguienteNivel
      ? Math.round((totalEntradas - nivelActual.desde) / (siguienteNivel.desde - nivelActual.desde) * 100)
      : 100;
    const desbloqueados     = Almacenamiento.leerLogrosDesbloqueados();

    // Nivel
    document.getElementById('banner-nivel').innerHTML = `
      <div class="insignia-nivel">${nivelActual.emoji}</div>
      <div class="nombre-nivel">${nivelActual.nombre.toUpperCase()}</div>
      <div class="subtitulo-nivel">${totalEntradas} entrada${totalEntradas === 1 ? '' : 's'} en el grimorio</div>
      <div class="barra-nivel-contenedor">
        <div class="barra-nivel-relleno" style="width:${porcentaje}%"></div>
      </div>
      <div class="etiqueta-progreso-nivel">
        ${siguienteNivel
          ? `${totalEntradas}/${siguienteNivel.desde} hacia ${siguienteNivel.nombre}`
          : 'Nivel máximo alcanzado ✨'}
      </div>
    `;

    // Logros
    document.getElementById('grilla-logros').innerHTML = DEFINICION_LOGROS.map(logro => {
      const estaDesbloqueado = !!desbloqueados[logro.id];
      return `
        <div class="logro${estaDesbloqueado ? ' desbloqueado' : ''}">
          <div class="logro-emoji">${logro.emoji}</div>
          <div class="logro-nombre">${logro.nombre}</div>
          <div class="logro-descripcion">${logro.descripcion}</div>
          ${estaDesbloqueado
            ? `<div class="logro-fecha">Desbloqueado ${formatearFecha(desbloqueados[logro.id]).split(',')[0]}</div>`
            : ''}
        </div>
      `;
    }).join('');
  }

  return { verificar, renderizar };
})();
