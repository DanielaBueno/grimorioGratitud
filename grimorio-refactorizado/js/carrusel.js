/**
 * @module Carrusel
 * @description Construye el carrusel horizontal de días en la vista "Hoy".
 * Muestra los últimos 60 días con su estado de ánimo y resalta el día actual.
 * Depende de: Almacenamiento, fechas, interfaz.
 */
const Carrusel = (() => {
  const TOTAL_DIAS_A_MOSTRAR  = 60;
  const NOMBRES_DIAS_SEMANA   = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  function construir() {
    const todasLasEntradas = Almacenamiento.leerTodasLasEntradas();
    const hoyTexto         = fechaComoTexto();
    const pista            = document.getElementById('pista-carrusel');

    const dias = generarUltimosDias(TOTAL_DIAS_A_MOSTRAR);

    pista.innerHTML = dias.map(textoFecha => {
      const entrada  = todasLasEntradas[textoFecha];
      const esHoy    = textoFecha === hoyTexto;
      const [, , dia] = textoFecha.split('-');
      const diaSemana = new Date(...textoFecha.split('-').map((v, i) => i === 1 ? +v - 1 : +v)).getDay();
      const emojiAnimo = entrada?.animo ? ESTADOS_ANIMO[entrada.animo - 1]?.emoji : '';

      return `
        <div class="dia-carrusel${entrada ? ' tiene-entrada' : ''}${esHoy ? ' es-hoy' : ''}"
             onclick="modalEdicionDia.abrir('${textoFecha}')"
             title="${formatearFecha(textoFecha)}"
             role="button"
             aria-label="${formatearFecha(textoFecha)}">
          <span class="nombre-dia-carrusel">${NOMBRES_DIAS_SEMANA[diaSemana]}</span>
          <span class="numero-dia-carrusel">${+dia}</span>
          <span class="animo-dia-carrusel">${emojiAnimo}</span>
        </div>
      `;
    }).join('');

    // Desplazar hasta el día actual
    setTimeout(() => {
      const diaActual = pista.querySelector('.es-hoy');
      diaActual?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 100);
  }

  return { construir };
})();
