/**
 * @module Almacenamiento
 * @description Única capa de acceso a datos del Grimorio.
 * Encapsula todas las operaciones sobre localStorage.
 * Ningún otro módulo debe llamar a localStorage directamente.
 */
const Almacenamiento = (() => {
  const PREFIJO      = 'grimoire_v2';
  const CLAVE_CARTAS = `${PREFIJO}:cartas`;
  const CLAVE_LOGROS = `${PREFIJO}:logros`;
  const CLAVE_TEMA   = `${PREFIJO}:tema`;
  const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/;

  function claveDeEntrada(fecha) {
    return `${PREFIJO}:${fecha}`;
  }

  // ── Entradas del diario ──────────────────────────────────

  function guardarEntrada(fecha, datos) {
    localStorage.setItem(claveDeEntrada(fecha), JSON.stringify(datos));
  }

  function leerEntrada(fecha) {
    try {
      const crudo = localStorage.getItem(claveDeEntrada(fecha));
      return crudo ? JSON.parse(crudo) : null;
    } catch {
      return null;
    }
  }

  function leerTodasLasEntradas() {
    return Object.keys(localStorage)
      .filter(clave => clave.startsWith(PREFIJO + ':'))
      .filter(clave => PATRON_FECHA.test(clave.replace(PREFIJO + ':', '')))
      .reduce((acumulador, clave) => {
        const fecha = clave.replace(PREFIJO + ':', '');
        try {
          acumulador[fecha] = JSON.parse(localStorage.getItem(clave));
        } catch {
          // Entrada corrupta — se ignora silenciosamente
        }
        return acumulador;
      }, {});
  }

  // ── Cartas ──────────────────────────────────────────────

  function leerCartas() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_CARTAS) || '[]');
    } catch {
      return [];
    }
  }

  function guardarCartas(cartas) {
    localStorage.setItem(CLAVE_CARTAS, JSON.stringify(cartas));
  }

  // ── Logros ──────────────────────────────────────────────

  function leerLogrosDesbloqueados() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_LOGROS) || '{}');
    } catch {
      return {};
    }
  }

  function guardarLogrosDesbloqueados(logros) {
    localStorage.setItem(CLAVE_LOGROS, JSON.stringify(logros));
  }

  // ── Preferencias ────────────────────────────────────────

  function leerTema() {
    return localStorage.getItem(CLAVE_TEMA) || 'oscuro';
  }

  function guardarTema(tema) {
    localStorage.setItem(CLAVE_TEMA, tema);
  }

  // API pública del módulo
  return {
    guardarEntrada,
    leerEntrada,
    leerTodasLasEntradas,
    leerCartas,
    guardarCartas,
    leerLogrosDesbloqueados,
    guardarLogrosDesbloqueados,
    leerTema,
    guardarTema,
  };
})();
