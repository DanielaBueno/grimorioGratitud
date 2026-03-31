/**
 * @module Diario
 * @description Gestiona toda la lógica de la vista "Hoy".
 * Coordina la lectura del formulario, el guardado de la entrada,
 * el modo día difícil y la visualización del recuerdo aleatorio.
 * El estado del formulario es privado a este módulo.
 */
const Diario = (() => {
  // ── Estado privado ───────────────────────────────────────
  let animoSeleccionado      = null;
  let actividadesSeleccionadas = new Set();
  let etiquetasActuales      = [];
  let estaGuardado           = false;
  let modoDiaDificilActivo   = false;
  const hoy                  = fechaComoTexto();

  // ── Lectura del formulario ───────────────────────────────

  function leerFormulario() {
    return {
      gratitudes: [
        leerCampo('gratitud-0'),
        leerCampo('gratitud-1'),
        leerCampo('gratitud-2'),
      ],
      animo:      animoSeleccionado,
      nota:       leerCampo('nota'),
      actividades: [...actividadesSeleccionadas],
      etiquetas:  [...etiquetasActuales],
      diaDificil: modoDiaDificilActivo,
    };
  }

  // ── Persistencia ─────────────────────────────────────────

  function guardar() {
    if (estaGuardado) return;

    const datos = leerFormulario();
    Almacenamiento.guardarEntrada(hoy, datos);

    marcarComoGuardado();
    mostrarCelebracion();
    Logros.verificar();
  }

  function marcarComoGuardado() {
    estaGuardado = true;
    const boton = document.getElementById('boton-guardar');
    boton.classList.add('guardado');
    document.getElementById('texto-boton-guardar').textContent = 'Guardado en el grimorio';
  }

  function marcarComoNoGuardado() {
    estaGuardado = false;
    const boton = document.getElementById('boton-guardar');
    boton.classList.remove('guardado');
    document.getElementById('texto-boton-guardar').textContent = 'Sellar entrada de hoy';
    ocultarElemento('celebracion');
  }

  // ── Celebración al guardar ────────────────────────────────

  function mostrarCelebracion() {
    const mensaje = elementoAleatorio(MENSAJES_CELEBRACION);
    document.getElementById('celebracion-emoji').textContent = mensaje.emoji;
    document.getElementById('celebracion-texto').textContent = mensaje.texto;
    document.getElementById('celebracion').classList.add('visible');
  }

  // ── Modo día difícil ─────────────────────────────────────

  function activarModoDiaDificil(silencioso = false) {
    modoDiaDificilActivo = true;
    document.getElementById('vista-hoy').classList.add('modo-dia-dificil');
    document.getElementById('mensaje-dia-dificil').textContent =
      elementoAleatorio(PROMPTS_DIA_DIFICIL);
    document.getElementById('texto-prompt').textContent =
      elementoAleatorio(PROMPTS_DIA_DIFICIL);
    if (!silencioso) marcarComoNoGuardado();
  }

  function desactivarModoDiaDificil() {
    modoDiaDificilActivo = false;
    document.getElementById('vista-hoy').classList.remove('modo-dia-dificil');
    document.getElementById('texto-prompt').textContent =
      elementoAleatorio(PROMPTS_NORMALES);
    marcarComoNoGuardado();
  }

  // ── Etiquetas ────────────────────────────────────────────

  function agregarEtiqueta(textoRaw) {
    if (!textoRaw) return;
    let etiqueta = textoRaw.startsWith('#') ? textoRaw : `#${textoRaw}`;
    etiqueta = etiqueta.replace(/[,\s]+/g, '').toLowerCase();
    if (!etiqueta || etiqueta === '#' || etiquetasActuales.includes(etiqueta)) {
      document.getElementById('entrada-etiqueta').value = '';
      return;
    }
    etiquetasActuales.push(etiqueta);
    document.getElementById('entrada-etiqueta').value = '';
    renderizarEtiquetas();
    marcarComoNoGuardado();
  }

  function eliminarEtiqueta(etiqueta) {
    etiquetasActuales = etiquetasActuales.filter(e => e !== etiqueta);
    renderizarEtiquetas();
    marcarComoNoGuardado();
  }

  function renderizarEtiquetas() {
    const contenedor = document.getElementById('contenedor-etiquetas');
    const entradaEtiqueta = document.getElementById('entrada-etiqueta');
    contenedor.querySelectorAll('.chip-etiqueta').forEach(el => el.remove());

    etiquetasActuales.forEach(etiqueta => {
      const chip = document.createElement('div');
      chip.className = 'chip-etiqueta';
      chip.innerHTML = `<span>${etiqueta}</span><button onclick="Diario.eliminarEtiqueta('${etiqueta}')" aria-label="Eliminar ${etiqueta}">×</button>`;
      contenedor.insertBefore(chip, entradaEtiqueta);
    });
  }

  // ── Carga inicial ────────────────────────────────────────

  function cargarEntradaDeHoy() {
    const entrada = Almacenamiento.leerEntrada(hoy);
    if (!entrada) return;

    if (entrada.gratitudes) {
      entrada.gratitudes.forEach((texto, i) => escribirEnCampo(`gratitud-${i}`, texto));
    }
    if (entrada.animo) {
      animoSeleccionado = entrada.animo;
      marcarAnimoEnSelector('selector-animo', entrada.animo);
      actualizarEtiquetaAnimo('etiqueta-animo', entrada.animo);
    }
    if (entrada.nota)        escribirEnCampo('nota', entrada.nota);
    if (entrada.actividades) {
      entrada.actividades.forEach(id => {
        actividadesSeleccionadas.add(id);
        document.querySelector(`[data-id="${id}"]`)?.classList.add('seleccionado');
      });
    }
    if (entrada.etiquetas) {
      etiquetasActuales = [...entrada.etiquetas];
      renderizarEtiquetas();
    }
    if (entrada.diaDificil) activarModoDiaDificil(true);

    marcarComoGuardado();
  }

  // ── Inicialización ───────────────────────────────────────

  function inicializar() {
    // Fecha de hoy
    document.getElementById('etiqueta-fecha-hoy').textContent = formatearFecha(hoy);

    // Prompt aleatorio
    document.getElementById('texto-prompt').textContent = elementoAleatorio(PROMPTS_NORMALES);

    // Selector de ánimo
    construirSelectorAnimo('selector-animo', valor => {
      animoSeleccionado = valor;
      actualizarEtiquetaAnimo('etiqueta-animo', valor);
      marcarComoNoGuardado();
    });

    // Actividades
    const contenedorActividades = document.getElementById('grilla-actividades');
    ACTIVIDADES.forEach(actividad => {
      const boton = document.createElement('button');
      boton.className   = 'chip-actividad';
      boton.innerHTML   = `${actividad.emoji} ${actividad.etiqueta}`;
      boton.dataset.id  = actividad.id;
      boton.setAttribute('aria-label', actividad.etiqueta);
      boton.addEventListener('click', () => {
        if (actividadesSeleccionadas.has(actividad.id)) {
          actividadesSeleccionadas.delete(actividad.id);
        } else {
          actividadesSeleccionadas.add(actividad.id);
        }
        boton.classList.toggle('seleccionado', actividadesSeleccionadas.has(actividad.id));
        marcarComoNoGuardado();
      });
      contenedorActividades.appendChild(boton);
    });

    // Entrada de etiquetas
    const entradaEtiqueta = document.getElementById('entrada-etiqueta');
    entradaEtiqueta.addEventListener('keydown', evento => {
      if (evento.key === 'Enter' || evento.key === ',') {
        evento.preventDefault();
        agregarEtiqueta(entradaEtiqueta.value.trim());
      } else if (evento.key === 'Backspace' && !entradaEtiqueta.value && etiquetasActuales.length) {
        eliminarEtiqueta(etiquetasActuales[etiquetasActuales.length - 1]);
      }
    });

    // Cargar entrada existente si la hay
    cargarEntradaDeHoy();
  }

  // ── API pública ──────────────────────────────────────────
  return {
    inicializar,
    guardar,
    marcarComoNoGuardado,
    activarModoDiaDificil,
    desactivarModoDiaDificil,
    agregarEtiqueta,
    eliminarEtiqueta,
  };
})();
