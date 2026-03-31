/**
 * @module interfaz
 * @description Helpers de DOM reutilizables entre vistas.
 * Funciones de bajo nivel que manipulan el DOM sin conocer la lógica de negocio.
 * No acceden a localStorage ni calculan nada de negocio.
 */

function mostrarTostada(mensaje, duracion = 2800) {
  const elemento = document.getElementById('tostada');
  elemento.textContent = mensaje;
  elemento.classList.add('visible');
  setTimeout(() => elemento.classList.remove('visible'), duracion);
}

function cambiarVista(nombreVista) {
  document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
  document.querySelectorAll('.boton-nav').forEach(b => b.classList.remove('activo'));
  document.getElementById(`vista-${nombreVista}`).classList.add('activa');
  document.querySelector(`[data-vista="${nombreVista}"]`).classList.add('activo');
}

/**
 * Construye botones de selección de ánimo dentro de un contenedor.
 * @param {string} idContenedor - ID del elemento contenedor en el DOM
 * @param {function} alSeleccionar - Callback que recibe el valor numérico seleccionado
 */
function construirSelectorAnimo(idContenedor, alSeleccionar) {
  const contenedor = document.getElementById(idContenedor);
  contenedor.innerHTML = '';

  ESTADOS_ANIMO.forEach(estado => {
    const boton = document.createElement('button');
    boton.className      = 'boton-animo';
    boton.textContent    = estado.emoji;
    boton.title          = estado.etiqueta;
    boton.dataset.valor  = estado.valor;
    boton.setAttribute('aria-label', estado.etiqueta);

    boton.addEventListener('click', () => {
      contenedor.querySelectorAll('.boton-animo')
        .forEach(b => b.classList.toggle('seleccionado', +b.dataset.valor === estado.valor));
      alSeleccionar(estado.valor);
    });

    contenedor.appendChild(boton);
  });
}

function marcarAnimoEnSelector(idContenedor, valor) {
  document.getElementById(idContenedor)
    ?.querySelectorAll('.boton-animo')
    .forEach(b => b.classList.toggle('seleccionado', +b.dataset.valor === valor));
}

function actualizarEtiquetaAnimo(idEtiqueta, valor) {
  const estado = ESTADOS_ANIMO.find(e => e.valor === valor);
  const elemento = document.getElementById(idEtiqueta);
  if (elemento) elemento.textContent = estado ? estado.etiqueta : '';
}

function leerCampo(id) {
  return document.getElementById(id)?.value ?? '';
}

function escribirEnCampo(id, texto) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.value = texto || '';
}

function mostrarElemento(id) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.style.display = 'block';
}

function ocultarElemento(id) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.style.display = 'none';
}

function abrirModal(id) {
  document.getElementById(id)?.classList.add('abierto');
}

function cerrarModal(id) {
  document.getElementById(id)?.classList.remove('abierto');
}
