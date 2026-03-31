/**
 * @module Tema
 * @description Gestiona el toggle entre modo oscuro y modo claro.
 * Lee y persiste la preferencia del usuario.
 */
const Tema = (() => {
  const TEMA_CLARO  = 'claro';
  const TEMA_OSCURO = 'oscuro';

  function aplicarTema(tema) {
    document.body.classList.toggle(TEMA_CLARO, tema === TEMA_CLARO);
    document.getElementById('boton-tema').textContent = tema === TEMA_CLARO ? '🌙' : '☀️';
  }

  function alternar() {
    const temaActual = Almacenamiento.leerTema();
    const nuevoTema  = temaActual === TEMA_CLARO ? TEMA_OSCURO : TEMA_CLARO;
    Almacenamiento.guardarTema(nuevoTema);
    aplicarTema(nuevoTema);
  }

  function inicializar() {
    aplicarTema(Almacenamiento.leerTema());
  }

  return { inicializar, alternar };
})();
