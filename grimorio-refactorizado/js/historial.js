/**
 * @module Historial
 * @description Gestiona la vista "Archivo".
 * Renderiza todas las entradas del diario con soporte de filtrado por etiqueta
 * y apertura/cierre de cada entrada.
 * Depende de: Almacenamiento, fechas, interfaz, configuracion.
 */
const Historial = (() => {
  let fechaAbierta  = null;
  let filtroActivo  = 'todas';

  // ── Filtros ──────────────────────────────────────────────

  function establecerFiltro(etiqueta) {
    filtroActivo = etiqueta;
    renderizar();
  }

  function renderizarFiltros(todasLasEtiquetas) {
    const etiquetas = ['todas', ...todasLasEtiquetas];
    document.getElementById('fila-filtros-historial').innerHTML = etiquetas.map(etiqueta => `
      <button class="boton-filtro${filtroActivo === etiqueta ? ' activo' : ''}"
              onclick="Historial.establecerFiltro('${etiqueta}')">
        ${etiqueta === 'todas' ? 'Todas' : etiqueta}
      </button>
    `).join('');
  }

  // ── Construcción de cada entrada ─────────────────────────

  function construirHTMLEntrada(fecha, entrada) {
    const cantidadGratitudes = (entrada.gratitudes || []).filter(Boolean).length;
    const emojiAnimo         = entrada.animo ? ESTADOS_ANIMO[entrada.animo - 1]?.emoji : '';
    const estaAbierta        = fechaAbierta === fecha;
    const indicadoresDificil = entrada.diaDificil
      ? `<span class="indicador-dia-dificil">🤍 difícil</span>` : '';

    const filaGratitudes = (entrada.gratitudes || [])
      .filter(Boolean)
      .map((texto, i) => `
        <div class="fila-gratitud-historial">
          <span class="numero-gratitud">${['i', 'ii', 'iii'][i]}</span>
          <span>${texto}</span>
        </div>
      `).join('');

    const filasActividades = entrada.actividades?.length
      ? `<div class="actividades-historial">${entrada.actividades.map(id => ACTIVIDADES.find(a => a.id === id)?.emoji || '').join(' ')}</div>`
      : '';

    const filasEtiquetas = entrada.etiquetas?.length
      ? `<div class="etiquetas-historial">${entrada.etiquetas.map(e => `<span class="chip-etiqueta-historial">${e}</span>`).join('')}</div>`
      : '';

    const notaSeccion = entrada.nota
      ? `<div class="separador-historial"></div><div class="nota-historial">${entrada.nota}</div>`
      : '';

    return `
      <button class="item-historial${estaAbierta ? ' abierto' : ''}"
              onclick="Historial.alternarEntrada('${fecha}')"
              aria-expanded="${estaAbierta}">
        <div>
          <div class="fecha-historial">${formatearFecha(fecha)}${indicadoresDificil}</div>
          <div class="meta-historial">${cantidadGratitudes} gratitudes${emojiAnimo ? ' · ' + emojiAnimo : ''}</div>
        </div>
        <span class="flecha-historial" aria-hidden="true">${estaAbierta ? '▴' : '▾'}</span>
      </button>
      <div class="cuerpo-historial${estaAbierta ? ' abierto' : ''}">
        ${filasActividades}${filaGratitudes}${filasEtiquetas}${notaSeccion}
      </div>
    `;
  }

  // ── Toggle de entradas ───────────────────────────────────

  function alternarEntrada(fecha) {
    fechaAbierta = fechaAbierta === fecha ? null : fecha;
    renderizar();
  }

  // ── Renderizado principal ────────────────────────────────

  function renderizar() {
    const todasLasEntradas = Almacenamiento.leerTodasLasEntradas();
    let entradas = Object.entries(todasLasEntradas).sort(([a], [b]) => b.localeCompare(a));

    // Recolectar etiquetas únicas para los filtros
    const etiquetasUnicas = new Set();
    entradas.forEach(([, e]) => (e.etiquetas || []).forEach(t => etiquetasUnicas.add(t)));
    renderizarFiltros(etiquetasUnicas);

    // Aplicar filtro activo
    if (filtroActivo !== 'todas') {
      entradas = entradas.filter(([, e]) => e.etiquetas?.includes(filtroActivo));
    }

    const contenedor = document.getElementById('lista-historial');
    if (!entradas.length) {
      contenedor.innerHTML = `
        <div class="estado-vacio">
          <div class="emoji-estado-vacio">🌱</div>
          Tu grimorio está vacío todavía.<br>
          <span style="font-size:13px">Empieza hoy.</span>
        </div>
      `;
      return;
    }

    contenedor.innerHTML = entradas
      .map(([fecha, entrada]) => construirHTMLEntrada(fecha, entrada))
      .join('');
  }

  return { renderizar, alternarEntrada, establecerFiltro };
})();
