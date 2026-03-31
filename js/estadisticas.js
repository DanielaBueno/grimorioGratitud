/**
 * @module Estadisticas
 * @description Gestiona la vista "Luna" con todas las visualizaciones.
 * Renderiza la línea de vida emocional, el mapa de calor tipo GitHub,
 * la gráfica de rosquilla de actividades y la distribución de ánimos.
 * Depende de: Almacenamiento, fechas, interfaz, configuracion.
 */
const Estadisticas = (() => {
  // Rango de días seleccionado por la usuaria (7, 30 o 'todo')
  let rangoActual = 7;

  // ── Cálculo de rango ─────────────────────────────────────

  function obtenerDiasDeRango() {
    const todasLasEntradas = Almacenamiento.leerTodasLasEntradas();
    if (rangoActual === 'todo') {
      const fechas = Object.keys(todasLasEntradas).sort();
      return fechas.length ? fechas : [fechaComoTexto()];
    }
    return generarUltimosDias(rangoActual);
  }

  function cambiarRango(nuevoRango) {
    rangoActual = nuevoRango;
    document.querySelectorAll('.boton-rango').forEach(boton => {
      boton.classList.toggle('activo', boton.dataset.rango == nuevoRango);
    });
    renderizar();
  }

  // ── Tarjetas resumen ─────────────────────────────────────

  function renderizarTarjetasResumen(todasLasEntradas, entradasConAnimo) {
    const totalEntradas = Object.keys(todasLasEntradas).length;
    const racha         = calcularRachaConsecutiva(todasLasEntradas);
    const promedioAnimo = entradasConAnimo.length
      ? entradasConAnimo.reduce((suma, [, e]) => suma + e.animo, 0) / entradasConAnimo.length
      : 0;
    const emojiPromedio = ESTADOS_ANIMO.find(e => e.valor === Math.round(promedioAnimo))?.emoji || '🌙';

    const svgHoja  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dorado)" stroke-width="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
    const svgLuna  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-dorado)" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    const svgLlama = `<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-dorado)"><path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-1 .23-1.97.75-2.71 1.32-2.12 1.65-3.09 4.4-2.46 7.01.07.28.15.57.15.86 0 .55-.24 1.04-.62 1.38-.42.37-.96.52-1.48.43C5.56 13 5 11.6 5 10c0-.37.05-.74.12-1.1C3.82 10.34 3 12.3 3 14.52 3 18.63 6.4 22 10.53 22c4.13 0 7.47-3.37 7.47-7.53 0-1.65-.5-3.17-1.34-4.27z"/></svg>`;

    document.getElementById('tarjetas-resumen').innerHTML = `
      <div class="tarjeta-stat"><div class="icono-stat">${svgLlama}</div><div class="valor-stat">${racha}</div><div class="etiqueta-stat">Racha</div></div>
      <div class="tarjeta-stat"><div class="icono-stat">${svgHoja}</div><div class="valor-stat">${totalEntradas}</div><div class="etiqueta-stat">Total</div></div>
      <div class="tarjeta-stat"><div class="icono-stat">${svgLuna}</div><div class="valor-stat">${emojiPromedio}</div><div class="etiqueta-stat">Luna media</div></div>
    `;
  }

  // ── Línea de vida emocional ──────────────────────────────

  function renderizarLineaDeVida(diasDeRango, todasLasEntradas) {
    const ANCHO = 400, ALTO = 80, RELLENO = 16;

    const puntos = diasDeRango
      .map((fecha, indice) => {
        const entrada = todasLasEntradas[fecha];
        const animo   = entrada?.animo ?? null;
        const x = diasDeRango.length > 1
          ? RELLENO + (indice / (diasDeRango.length - 1)) * (ANCHO - RELLENO * 2)
          : ANCHO / 2;
        const y = animo !== null
          ? ALTO - RELLENO - ((animo - 1) / 4) * (ALTO - RELLENO * 2)
          : null;
        return { x, y, animo, fecha };
      })
      .filter(punto => punto.y !== null);

    if (puntos.length < 2) {
      document.getElementById('svg-linea-vida').innerHTML =
        `<text x="200" y="45" text-anchor="middle" fill="rgba(122,112,88,0.5)" font-size="12" font-style="italic" font-family="EB Garamond, serif">Escribe más entradas para ver tu línea de vida</text>`;
      document.getElementById('etiqueta-inicio-linea').textContent = '';
      return;
    }

    const curva = construirCurvaBezier(puntos);
    const areaRellena = `${curva} L${puntos[puntos.length - 1].x.toFixed(1)},${ALTO} L${puntos[0].x.toFixed(1)},${ALTO} Z`;

    const etiquetasEje = ESTADOS_ANIMO.map(estado => {
      const y = ALTO - RELLENO - ((estado.valor - 1) / 4) * (ALTO - RELLENO * 2);
      return `<text x="2" y="${(y + 4).toFixed(1)}" fill="rgba(122,112,88,0.4)" font-size="8">${estado.emoji}</text>`;
    }).join('');

    const puntosSVG = puntos.map(punto => {
      const color = punto.animo >= 4 ? '#5a7d5c' : punto.animo <= 2 ? '#c8758a' : '#c8a84b';
      return `<circle cx="${punto.x.toFixed(1)}" cy="${punto.y.toFixed(1)}" r="3" fill="${color}" opacity="0.8">
        <title>${formatearFecha(punto.fecha)}: ${ESTADOS_ANIMO[punto.animo - 1]?.etiqueta}</title>
      </circle>`;
    }).join('');

    document.getElementById('svg-linea-vida').innerHTML = `
      <defs>
        <linearGradient id="gradienteVida" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(90,125,92,0.25)"/>
          <stop offset="100%" stop-color="rgba(90,125,92,0.02)"/>
        </linearGradient>
      </defs>
      ${etiquetasEje}
      <path d="${areaRellena}" fill="url(#gradienteVida)"/>
      <path d="${curva}" fill="none" stroke="rgba(90,125,92,0.7)" stroke-width="1.5" stroke-linejoin="round"/>
      ${puntosSVG}
    `;
    document.getElementById('etiqueta-inicio-linea').textContent =
      formatearFecha(diasDeRango[0]).split(',')[0];
  }

  function construirCurvaBezier(puntos) {
    let curva = `M${puntos[0].x.toFixed(1)},${puntos[0].y.toFixed(1)}`;
    for (let i = 1; i < puntos.length; i++) {
      const puntoControlX = (puntos[i - 1].x + puntos[i].x) / 2;
      curva += ` C${puntoControlX.toFixed(1)},${puntos[i - 1].y.toFixed(1)} ${puntoControlX.toFixed(1)},${puntos[i].y.toFixed(1)} ${puntos[i].x.toFixed(1)},${puntos[i].y.toFixed(1)}`;
    }
    return curva;
  }

  // ── Mapa de calor tipo GitHub ────────────────────────────

  function renderizarMapaDeCalor(todasLasEntradas) {
    const SEMANAS     = 18;
    const TOTAL_DIAS  = SEMANAS * 7;
    const hoy         = new Date();
    const hoyTexto    = fechaComoTexto();

    const celdas = Array.from({ length: TOTAL_DIAS }, (_, indice) => {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - (TOTAL_DIAS - 1 - indice));
      const textoFecha = fechaComoTexto(fecha);
      return { textoFecha, entrada: todasLasEntradas[textoFecha], fecha };
    });

    // Etiquetas de mes
    let mesAnterior = -1;
    const etiquetasMes = [];
    for (let semana = 0; semana < SEMANAS; semana++) {
      const primeraDelaSemana = celdas[semana * 7];
      if (primeraDelaSemana) {
        const mes = primeraDelaSemana.fecha.getMonth();
        etiquetasMes.push(
          mes !== mesAnterior
            ? primeraDelaSemana.fecha.toLocaleDateString('es-CO', { month: 'short' })
            : ''
        );
        mesAnterior = mes;
      }
    }
    document.getElementById('etiquetas-meses-mapa').innerHTML =
      etiquetasMes.map(m => `<span style="min-width:17px;display:inline-block;font-size:9px">${m}</span>`).join('');

    // Celdas
    document.getElementById('grilla-mapa-calor').innerHTML = celdas.map(({ textoFecha, entrada }) => {
      const animo      = entrada?.animo || 0;
      const tieneEntrada = !!entrada;
      const nivel      = !tieneEntrada ? 0 : animo >= 5 ? 4 : animo >= 4 ? 3 : animo >= 3 ? 2 : 1;
      const esHoy      = textoFecha === hoyTexto;
      const titulo     = `${formatearFecha(textoFecha)}${tieneEntrada ? ' · ' + (ESTADOS_ANIMO[animo - 1]?.etiqueta || '') : ''}`;
      return `<div class="celda-mapa nivel-${nivel}${esHoy ? ' es-hoy' : ''}" title="${titulo}" onclick="modalEdicionDia.abrir('${textoFecha}')" role="button" aria-label="${titulo}"></div>`;
    }).join('');

    // Mensaje de racha
    const racha = calcularRachaConsecutiva(todasLasEntradas);
    document.getElementById('mensaje-racha').textContent = racha > 0
      ? `🌿 ${racha} ${racha === 1 ? 'día consecutivo' : 'días consecutivos'} — sigue floreciendo`
      : 'Comienza hoy tu racha 🌱';
  }

  // ── Distribución de ánimos ───────────────────────────────

  function renderizarDistribucionDeAnimos(entradasConAnimo) {
    if (!entradasConAnimo.length) {
      ocultarElemento('tarjeta-distribucion-animos');
      return;
    }
    mostrarElemento('tarjeta-distribucion-animos');

    document.getElementById('distribucion-animos').innerHTML = [...ESTADOS_ANIMO].reverse().map(estado => {
      const cantidad   = entradasConAnimo.filter(([, e]) => e.animo === estado.valor).length;
      const porcentaje = ((cantidad / entradasConAnimo.length) * 100).toFixed(0);
      return `
        <div class="fila-distribucion-animo">
          <div class="cabecera-distribucion">
            <span>${estado.emoji} ${estado.etiqueta}</span>
            <span class="conteo-distribucion">${cantidad}x</span>
          </div>
          <div class="barra-fondo"><div class="barra-relleno" style="width:${porcentaje}%"></div></div>
        </div>
      `;
    }).join('');
  }

  // ── Rosquilla de actividades ─────────────────────────────

  function renderizarRosquilla(entradasDeRango) {
    const conteoActividades = entradasDeRango.reduce((acumulador, [, entrada]) => {
      (entrada.actividades || []).forEach(id => {
        acumulador[id] = (acumulador[id] || 0) + 1;
      });
      return acumulador;
    }, {});

    const actividadesOrdenadas = Object.entries(conteoActividades)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    if (!actividadesOrdenadas.length) {
      ocultarElemento('tarjeta-rosquilla');
      return;
    }
    mostrarElemento('tarjeta-rosquilla');

    const total        = actividadesOrdenadas.reduce((suma, [, c]) => suma + c, 0);
    const RADIO        = 44, CENTRO_X = 52, CENTRO_Y = 52, GROSOR = 18;
    const circunferencia = 2 * Math.PI * RADIO;

    let desplazamiento = 0;
    const segmentos = actividadesOrdenadas.map(([id, cantidad], indice) => {
      const porcentaje  = cantidad / total;
      const longitud    = porcentaje * circunferencia;
      const segmento    = `<circle cx="${CENTRO_X}" cy="${CENTRO_Y}" r="${RADIO}" fill="none" stroke="${COLORES_GRAFICAS[indice]}" stroke-width="${GROSOR}" stroke-dasharray="${longitud.toFixed(2)} ${(circunferencia - longitud).toFixed(2)}" stroke-dashoffset="${(-desplazamiento).toFixed(2)}" transform="rotate(-90 ${CENTRO_X} ${CENTRO_Y})" opacity="0.85"/>`;
      desplazamiento += longitud;
      return segmento;
    }).join('');

    const leyenda = actividadesOrdenadas.map(([id, cantidad], indice) => {
      const actividad = ACTIVIDADES.find(a => a.id === id);
      return `
        <div class="item-leyenda-rosquilla">
          <div class="punto-leyenda" style="background:${COLORES_GRAFICAS[indice]}"></div>
          <span class="etiqueta-leyenda">${actividad?.emoji || ''} ${actividad?.etiqueta || id}</span>
          <span class="conteo-leyenda">${cantidad}x</span>
        </div>
      `;
    }).join('');

    document.getElementById('contenedor-rosquilla').innerHTML = `
      <svg class="svg-rosquilla" width="104" height="104" viewBox="0 0 104 104">
        <circle cx="${CENTRO_X}" cy="${CENTRO_Y}" r="${RADIO}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="${GROSOR}"/>
        ${segmentos}
        <text x="${CENTRO_X}" y="${CENTRO_Y + 5}" text-anchor="middle" fill="rgba(200,168,75,0.8)" font-size="12" font-family="Cinzel,serif">${total}</text>
      </svg>
      <div class="leyenda-rosquilla">${leyenda}</div>
    `;
  }

  // ── Renderizado principal ────────────────────────────────

  function renderizar() {
    const todasLasEntradas = Almacenamiento.leerTodasLasEntradas();
    const diasDeRango      = obtenerDiasDeRango();
    const entradasDeRango  = diasDeRango
      .map(fecha => [fecha, todasLasEntradas[fecha]])
      .filter(([, entrada]) => !!entrada);
    const entradasConAnimo = entradasDeRango.filter(([, e]) => e.animo);

    renderizarTarjetasResumen(todasLasEntradas, entradasConAnimo);
    renderizarLineaDeVida(diasDeRango, todasLasEntradas);
    renderizarMapaDeCalor(todasLasEntradas);
    renderizarDistribucionDeAnimos(entradasConAnimo);
    renderizarRosquilla(entradasDeRango);
  }

  return { renderizar, cambiarRango };
})();
