/**
 * @module Cartas
 * @description Gestiona la vista "Cartas a mi yo".
 * Permite escribir, editar y eliminar cartas dirigidas
 * al yo del pasado o del futuro.
 * Depende de: Almacenamiento, fechas, interfaz, configuracion.
 */
const Cartas = (() => {
  let tipoCarta       = 'pasado';
  let idCartaEditando = null;

  // ── Modal ────────────────────────────────────────────────

  function abrirModalNuevaCarta() {
    idCartaEditando = null;
    tipoCarta       = 'pasado';
    document.getElementById('titulo-modal-carta').textContent = 'NUEVA CARTA';
    document.getElementById('boton-eliminar-carta').style.display = 'none';
    document.getElementById('entrada-titulo-carta').value = '';
    document.getElementById('entrada-cuerpo-carta').value = '';
    actualizarBotonesTipoCarta();
    abrirModal('modal-carta');
  }

  function abrirModalEdicionCarta(id) {
    const carta = Almacenamiento.leerCartas().find(c => c.id === id);
    if (!carta) return;

    idCartaEditando = id;
    tipoCarta       = carta.tipo;
    document.getElementById('titulo-modal-carta').textContent   = 'EDITAR CARTA';
    document.getElementById('entrada-titulo-carta').value       = carta.titulo || '';
    document.getElementById('entrada-cuerpo-carta').value       = carta.cuerpo || '';
    document.getElementById('boton-eliminar-carta').style.display = 'block';
    actualizarBotonesTipoCarta();
    abrirModal('modal-carta');
  }

  function cerrarModalCarta() {
    cerrarModal('modal-carta');
    idCartaEditando = null;
  }

  function actualizarBotonesTipoCarta() {
    document.getElementById('boton-tipo-pasado').classList.toggle('activo', tipoCarta === 'pasado');
    document.getElementById('boton-tipo-futuro').classList.toggle('activo', tipoCarta === 'futuro');
  }

  function establecerTipoCarta(tipo) {
    tipoCarta = tipo;
    actualizarBotonesTipoCarta();
  }

  // ── CRUD de cartas ───────────────────────────────────────

  function guardar() {
    const titulo = document.getElementById('entrada-titulo-carta').value.trim();
    const cuerpo = document.getElementById('entrada-cuerpo-carta').value.trim();

    if (!cuerpo) {
      mostrarTostada('Escribe algo primero 🌿');
      return;
    }

    const cartas = Almacenamiento.leerCartas();

    if (idCartaEditando) {
      const indice = cartas.findIndex(c => c.id === idCartaEditando);
      if (indice >= 0) {
        cartas[indice] = { ...cartas[indice], titulo, cuerpo, tipo: tipoCarta };
      }
    } else {
      cartas.push({
        id:     Date.now().toString(),
        fecha:  fechaComoTexto(),
        tipo:   tipoCarta,
        titulo,
        cuerpo,
      });
    }

    Almacenamiento.guardarCartas(cartas);
    cerrarModalCarta();
    renderizar();
    mostrarTostada('Carta sellada 💌');
    Logros.verificar();
  }

  function eliminar() {
    if (!idCartaEditando) return;
    const cartasActualizadas = Almacenamiento.leerCartas().filter(c => c.id !== idCartaEditando);
    Almacenamiento.guardarCartas(cartasActualizadas);
    cerrarModalCarta();
    renderizar();
    mostrarTostada('Carta eliminada');
  }

  // ── Renderizado ──────────────────────────────────────────

  function construirHTMLTarjetaCarta(carta) {
    const etiquetaTipo = carta.tipo === 'pasado'
      ? '💛 A mi yo del pasado'
      : '🌱 A mi yo del futuro';
    const vistaPrevia = (carta.cuerpo || '').slice(0, 80);
    const hayMasTexto = (carta.cuerpo || '').length > 80;

    return `
      <div class="tarjeta-carta" onclick="Cartas.abrirModalEdicionCarta('${carta.id}')" role="button" aria-label="${carta.titulo || 'Carta sin título'}">
        <div class="cabecera-tarjeta-carta">
          <span class="tipo-carta">${etiquetaTipo}</span>
          <span class="fecha-carta">${formatearFecha(carta.fecha).split(',')[0]}</span>
        </div>
        <div class="titulo-carta">${carta.titulo || 'Sin título'}</div>
        <div class="vista-previa-carta">${vistaPrevia}${hayMasTexto ? '…' : ''}</div>
      </div>
    `;
  }

  function renderizar() {
    const cartas    = Almacenamiento.leerCartas();
    const contenedor = document.getElementById('lista-cartas');

    if (!cartas.length) {
      contenedor.innerHTML = `
        <div class="estado-vacio" style="margin-top:16px">
          <div class="emoji-estado-vacio">💌</div>
          Todavía no hay cartas.<br>
          <span style="font-size:13px">Escríbete con amor.</span>
        </div>
      `;
      return;
    }

    contenedor.innerHTML = [...cartas]
      .reverse()
      .map(carta => construirHTMLTarjetaCarta(carta))
      .join('');
  }

  return {
    renderizar,
    guardar,
    eliminar,
    abrirModalNuevaCarta,
    abrirModalEdicionCarta,
    cerrarModalCarta,
    establecerTipoCarta,
  };
})();
