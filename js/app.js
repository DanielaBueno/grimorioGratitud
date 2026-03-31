/**
 * @module app
 * @description Punto de entrada de la aplicación.
 * Inicializa todos los módulos en el orden correcto y conecta
 * los eventos de navegación global. Es el único lugar donde
 * los módulos se conocen entre sí.
 *
 * Orden de carga de scripts en index.html:
 *   1. configuracion.js  (datos puros, sin dependencias)
 *   2. almacenamiento.js (capa de datos)
 *   3. fechas.js         (utilidades puras)
 *   4. interfaz.js       (helpers de DOM)
 *   5. tema.js
 *   6. diario.js
 *   7. estadisticas.js
 *   8. historial.js
 *   9. cartas.js
 *  10. logros.js
 *  11. exportar.js
 *  12. recuerdos.js
 *  13. carrusel.js
 *  14. app.js  ← este archivo, siempre el último
 */

// Mapa de vista → módulo que debe renderizarse al abrirla
const MODULOS_POR_VISTA = {
  'estadisticas': () => Estadisticas.renderizar(),
  'historial':    () => Historial.renderizar(),
  'cartas':       () => Cartas.renderizar(),
  'logros':       () => Logros.renderizar(),
};

function manejarCambioDeVista(nombreVista) {
  cambiarVista(nombreVista);
  MODULOS_POR_VISTA[nombreVista]?.();
}

function inicializarNavegacion() {
  document.querySelectorAll('.boton-nav').forEach(boton => {
    boton.addEventListener('click', () => {
      manejarCambioDeVista(boton.dataset.vista);
    });
  });
}

function inicializarApp() {
  // El orden importa: primero lo que no depende de nada
  Tema.inicializar();
  Diario.inicializar();
  Recuerdos.mostrar();
  Carrusel.construir();
  Logros.verificar();
  inicializarNavegacion();
}

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);
