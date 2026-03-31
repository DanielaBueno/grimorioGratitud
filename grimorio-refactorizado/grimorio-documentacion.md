# 🌿 Grimorio de Gratitud
### Documentación técnica y funcional

> *Un diario personal de gratitud con estadísticas emocionales, cartas a tu yo, logros y exportación en múltiples formatos.*

---

## Tabla de contenidos

1. [¿Qué es el Grimorio?](#1-qué-es-el-grimorio)
2. [Tecnologías utilizadas](#2-tecnologías-utilizadas)
3. [Funciones de la aplicación](#3-funciones-de-la-aplicación)
4. [Arquitectura del software](#4-arquitectura-del-software)
5. [Estructura de archivos](#5-estructura-de-archivos)
6. [Estructura de datos](#6-estructura-de-datos)
7. [Control de versiones](#7-control-de-versiones)
8. [Cómo usar la aplicación](#8-cómo-usar-la-aplicación)
9. [Recomendaciones para el futuro](#9-recomendaciones-para-el-futuro)

---

## 1. ¿Qué es el Grimorio?

El **Grimorio de Gratitud** es una aplicación web personal de escritura emocional y seguimiento del bienestar. Corre completamente en el navegador, sin servidores ni cuentas: todos los datos se guardan de forma privada en el dispositivo de la usuaria usando `localStorage`.

**Filosofía del proyecto:** una herramienta íntima, bella y funcional que acompaña la práctica diaria de la gratitud. No recopila datos, no necesita internet después de la primera carga, y todo lo que escribes es tuyo para siempre.

---

## 2. Tecnologías utilizadas

| Tecnología | Versión | Uso en el proyecto |
|---|---|---|
| **HTML5** | Estándar actual | Estructura semántica de la interfaz |
| **CSS3** | Estándar actual | Estilos, temas, animaciones y variables de diseño |
| **JavaScript (ES6+)** | Vanilla (sin frameworks) | Toda la lógica de la aplicación |
| **localStorage API** | Nativa del navegador | Persistencia local de datos sin servidor |
| **jsPDF** | v2.5.1 (CDN) | Generación de archivos PDF para exportar |
| **Google Fonts** | CDN | Tipografías Cinzel y EB Garamond |

### ¿Por qué Vanilla JS y no React o Vue?

La aplicación es intencionalmente un proyecto de archivo estático: se abre con doble clic, sin instalar nada. El JavaScript está organizado con el **patrón IIFE Revealing Module**, que es directamente análogo a los módulos de React o Vue, lo que facilita una futura migración.

---

## 3. Funciones de la aplicación

### 3.1 Vista "Hoy" — Entrada diaria

La pantalla principal donde la usuaria registra su día.

| Función | Descripción |
|---|---|
| **Selector de ánimo (luna)** | Elige entre 5 estados: 🌑 Muy baja · 🌒 Baja · 🌓 Neutral · 🌔 Bien · 🌕 Radiante |
| **Tres gratitudes** | Tres campos de texto para escribir las cosas por las que agradece hoy |
| **Actividades del día** | 12 chips seleccionables: Programar, Caminar, Ejercicio, Escribir, Dibujar, Leer, Cocinar, Meditar, Música, Descansar, Amistades, Naturaleza |
| **Etiquetas** | Sistema de hashtags personalizados (#familia, #trabajo, etc.) escritos con Enter o coma |
| **Nota libre** | Campo opcional para una reflexión, intención o recuerdo del día |
| **Prompt de reflexión** | Pregunta aleatoria que invita a la introspección, cambia cada vez |
| **Sellar entrada** | Guarda toda la entrada en el dispositivo con animación de celebración |
| **Modo día difícil 🤍** | Botón que activa un modo suave con mensajes de acompañamiento emocional y prompts adaptados |
| **Recuerdo aleatorio 🥹** | Tarjeta que muestra una entrada escrita hace más de 7 días, para recordar el camino recorrido |
| **Carrusel de días** | Barra horizontal deslizable con los últimos 60 días; muestra el ánimo de cada uno y permite editarlos con un clic |
| **Celebración al guardar** | Mensaje positivo aleatorio que aparece después de sellar la entrada |

---

### 3.2 Vista "Luna" — Estadísticas

Visualizaciones del progreso emocional y de escritura.

| Función | Descripción |
|---|---|
| **Selector de rango** | Filtra todas las estadísticas por 7 días, 30 días o todo el historial |
| **Tarjetas de resumen** | Muestra: racha de días consecutivos 🔥, total de entradas 🌿, luna media del período 🌙 |
| **Línea de vida emocional 📈** | Curva SVG animada que muestra cómo ha variado el ánimo en el tiempo. Los puntos se colorean: verde (bien), rosa (difícil), dorado (neutral) |
| **Mapa de calor tipo GitHub** | Cuadrícula de 18 semanas que muestra la actividad diaria con 4 niveles de intensidad según el ánimo registrado. Clic en cualquier día para editarlo |
| **Distribución de lunas** | Barras horizontales que muestran cuántas veces se registró cada estado de ánimo |
| **Rosquilla de actividades 🍩** | Gráfica circular que muestra las actividades más frecuentes del período con leyenda y conteos |

---

### 3.3 Vista "Archivo" — Historial

Acceso a todas las entradas escritas.

| Función | Descripción |
|---|---|
| **Lista de entradas** | Todas las entradas ordenadas de más reciente a más antigua, expandibles con clic |
| **Filtro por etiquetas** | Botones que filtran el historial por hashtag (#familia, #trabajo, etc.) |
| **Detalle de entrada** | Al expandir: actividades del día, gratitudes numeradas, etiquetas y nota libre |
| **Indicador día difícil** | Las entradas marcadas como día difícil muestran un indicador 🤍 |

---

### 3.4 Vista "Cartas" — Cartas a mi yo

Espacio para escribirse a una misma a través del tiempo.

| Función | Descripción |
|---|---|
| **Nueva carta** | Modal con título, cuerpo y tipo de destinataria |
| **Tipo de carta** | Dos opciones: 💛 *A mi yo del pasado* o 🌱 *A mi yo del futuro* |
| **Editar carta** | Clic en cualquier carta existente para editarla o eliminarla |
| **Vista previa** | Las cartas se muestran con un fragmento de su contenido en la lista |

---

### 3.5 Vista "Logros" — Gamificación

Sistema de niveles y logros para motivar la constancia.

#### Niveles de progreso

| Nivel | Entradas necesarias | Emoji |
|---|---|---|
| Semilla | 0–4 | 🌱 |
| Brote | 5–14 | 🌿 |
| Flor | 15–29 | 🌸 |
| Árbol | 30–59 | 🌳 |
| Jardín | 60–99 | 🌺 |
| Grimorio Pleno | 100+ | 🌟 |

#### Logros desbloqueables

| Logro | Condición |
|---|---|
| 🌱 Primera semilla | Escribir la primera entrada |
| 🌿 7 días | 7 días consecutivos de gratitud |
| 🌷 21 días | 21 días consecutivos |
| 🌺 Un mes | 30 entradas totales |
| 🌻 50 entradas | 50 páginas del grimorio |
| 🌟 100 entradas | Un grimorio florecido |
| 💌 Carta enviada | Escribir la primera carta |
| 🌕 Luna llena | 5 días radiantes seguidos |

---

### 3.6 Vista "Exportar" — Tus datos, siempre tuyos

| Formato | Uso recomendado |
|---|---|
| **JSON** | Respaldo completo de todos los datos. Incluye entradas y cartas |
| **Markdown (.md)** | Legible en Obsidian, Notion, VS Code o cualquier editor de texto |
| **CSV** | Análisis en Excel o Google Sheets |
| **PDF** | Documento formateado listo para imprimir o guardar como recuerdo |

---

### 3.7 Funciones globales

| Función | Descripción |
|---|---|
| **Toggle de tema ☀️/🌙** | Cambia entre modo oscuro (musgo y dorado) y modo claro (crema y beige). La preferencia se guarda automáticamente |
| **Tostadas de notificación** | Mensajes emergentes breves que confirman acciones (guardar, exportar, desbloquear logro) |
| **Modal de edición de días pasados** | Desde el carrusel o el mapa de calor, se puede abrir cualquier día pasado para ver o escribir su entrada |

---

## 4. Arquitectura del software

### 4.1 Tipo de arquitectura

El Grimorio usa una **arquitectura modular por capas** implementada con el patrón **IIFE Revealing Module** en JavaScript vanilla. No tiene bundler ni build step: todos los archivos se cargan directamente en el navegador en orden explícito.

```
┌─────────────────────────────────────────────────┐
│                   index.html                    │
│           (estructura semántica pura)           │
└─────────────────────────────────────────────────┘
              │              │
    ┌─────────▼──────┐  ┌───▼──────────────────┐
    │   css/ (5 arch)│  │    js/ (14 módulos)  │
    │                │  │                      │
    │  variables.css │  │  configuracion.js    │ ← datos puros
    │  base.css      │  │  almacenamiento.js   │ ← capa de datos
    │  componentes   │  │  fechas.js           │ ← utilidades puras
    │  vistas.css    │  │  interfaz.js         │ ← helpers DOM
    │  graficas.css  │  │  [módulos de vistas] │ ← lógica por vista
    └────────────────┘  │  app.js              │ ← punto de entrada
                        └──────────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │    localStorage   │
                        │  (datos privados) │
                        └───────────────────┘
```

### 4.2 Las tres capas

#### Capa 1 — Datos (`almacenamiento.js`)
Es la **única** capa que habla con `localStorage`. Ningún otro módulo accede al almacenamiento directamente. Esto significa que si en el futuro se quiere cambiar a IndexedDB o a una API externa, solo hay que modificar este archivo.

```
Capa de Datos
└── almacenamiento.js
    ├── guardarEntrada(fecha, datos)
    ├── leerEntrada(fecha)
    ├── leerTodasLasEntradas()
    ├── leerCartas() / guardarCartas()
    ├── leerLogrosDesbloqueados() / guardarLogrosDesbloqueados()
    └── leerTema() / guardarTema()
```

#### Capa 2 — Lógica de negocio (módulos de vistas)
Cada vista tiene su propio módulo que coordina los datos con la interfaz. El estado de cada vista es **privado** a su módulo.

```
Capa de Lógica
├── diario.js       → estado del formulario de hoy
├── estadisticas.js → cálculos y renderizado de gráficas
├── historial.js    → filtrado y expansión de entradas
├── cartas.js       → CRUD de cartas
├── logros.js       → cálculo de nivel y verificación de logros
├── exportar.js     → generación de JSON, MD, CSV, PDF
├── recuerdos.js    → selección aleatoria de entrada pasada
└── carrusel.js     → construcción del carrusel de días
```

#### Capa 3 — Presentación (`interfaz.js` + CSS)
Funciones de bajo nivel que manipulan el DOM sin conocer la lógica de negocio. Reciben datos ya procesados y los pintan.

```
Capa de Presentación
├── interfaz.js
│   ├── mostrarTostada(mensaje)
│   ├── cambiarVista(nombreVista)
│   ├── construirSelectorAnimo(id, callback)
│   ├── marcarAnimoEnSelector(id, valor)
│   ├── leerCampo(id) / escribirEnCampo(id, texto)
│   ├── abrirModal(id) / cerrarModal(id)
│   └── mostrarElemento(id) / ocultarElemento(id)
└── css/
    ├── variables.css  → tokens de diseño (única fuente de verdad)
    ├── base.css       → reset y estilos base
    ├── componentes.css → clases reutilizables
    ├── vistas.css     → estilos por vista
    └── graficas.css   → visualizaciones
```

### 4.3 Patrón de módulo utilizado

Cada módulo JS sigue el **patrón IIFE Revealing Module**: expone solo lo necesario y oculta su estado interno.

```javascript
const NombreModulo = (() => {
  // Estado privado — nadie más puede tocarlo
  let estadoPrivado = null;

  function funcionPrivada() { /* lógica interna */ }

  function funcionPublica() {
    funcionPrivada();
  }

  // Solo se exporta lo que otros módulos necesitan
  return { funcionPublica };
})();
```

### 4.4 Flujo de datos

```
Usuaria interactúa con el DOM
        │
        ▼
Módulo de vista (ej: Diario)
  ├── Lee del DOM con leerCampo()
  ├── Procesa la lógica
  ├── Llama a Almacenamiento.guardarEntrada()
  └── Llama a Logros.verificar()
        │
        ▼
Almacenamiento
  └── escribe en localStorage
        │
        ▼
Módulo de vista renderiza el resultado
  └── Escribe en el DOM
```

### 4.5 Orden de carga de scripts

El orden en `index.html` es deliberado: primero los módulos sin dependencias, último el punto de entrada.

```
1. configuracion.js   (sin dependencias)
2. almacenamiento.js  (sin dependencias)
3. fechas.js          (sin dependencias)
4. interfaz.js        (depende de configuracion)
5. tema.js            (depende de almacenamiento)
6. diario.js          (depende de todo lo anterior)
7. estadisticas.js    (depende de almacenamiento, fechas, interfaz)
8. historial.js       (depende de almacenamiento, interfaz)
9. cartas.js          (depende de almacenamiento, interfaz)
10. logros.js         (depende de almacenamiento, fechas, interfaz)
11. exportar.js       (depende de almacenamiento, fechas, jsPDF)
12. recuerdos.js      (depende de almacenamiento, fechas, interfaz)
13. carrusel.js       (depende de almacenamiento, fechas, interfaz)
14. app.js            (depende de todos los anteriores)
```

---

## 5. Estructura de archivos

```
grimorio-gratitud/
│
├── index.html                 ← HTML semántico. Sin lógica inline. Sin estilos inline.
│
├── css/
│   ├── variables.css          ← Tokens de diseño: colores, fuentes, radios, transiciones.
│   │                            Es la única fuente de verdad para valores visuales.
│   ├── base.css               ← Reset, body, layout principal, animación base.
│   ├── componentes.css        ← Clases reutilizables: .tarjeta, .boton-guardar,
│   │                            .boton-animo, .chip-actividad, .tostada, .modal...
│   ├── vistas.css             ← Estilos exclusivos de cada vista: hoy, estadísticas,
│   │                            historial, cartas, logros, exportar.
│   └── graficas.css           ← Estilos de visualizaciones: línea de vida,
│                                mapa de calor y rosquilla de actividades.
│
├── js/
│   ├── configuracion.js       ← Constantes: ESTADOS_ANIMO, ACTIVIDADES, PROMPTS_NORMALES,
│   │                            PROMPTS_DIA_DIFICIL, MENSAJES_CELEBRACION,
│   │                            DEFINICION_LOGROS, NIVELES, COLORES_GRAFICAS.
│   │
│   ├── almacenamiento.js      ← Módulo Almacenamiento. Capa de datos.
│   │                            Único acceso a localStorage.
│   │
│   ├── fechas.js              ← Funciones puras: fechaComoTexto(), formatearFecha(),
│   │                            generarUltimosDias(), calcularRachaConsecutiva(),
│   │                            calcularMejorRachaRadiante(), elementoAleatorio().
│   │
│   ├── interfaz.js            ← Helpers de DOM: mostrarTostada(), cambiarVista(),
│   │                            construirSelectorAnimo(), leerCampo(), abrirModal()...
│   │
│   ├── tema.js                ← Módulo Tema. Toggle claro/oscuro con persistencia.
│   │
│   ├── diario.js              ← Módulo Diario. Toda la lógica de la vista "Hoy":
│   │                            guardar, cargar, modo día difícil, etiquetas, actividades.
│   │
│   ├── estadisticas.js        ← Módulo Estadisticas. Línea de vida SVG, mapa de calor,
│   │                            distribución de ánimos, rosquilla, tarjetas resumen.
│   │
│   ├── historial.js           ← Módulo Historial. Lista de entradas, filtros, expansión.
│   │
│   ├── cartas.js              ← Módulo Cartas. CRUD completo de cartas a mi yo.
│   │
│   ├── logros.js              ← Módulo Logros. Nivel actual, barra de progreso,
│   │                            verificación y desbloqueo de logros.
│   │
│   ├── exportar.js            ← Módulo Exportar. Genera y descarga JSON, MD, CSV, PDF.
│   │
│   ├── recuerdos.js           ← Módulo Recuerdos. Selección y display de entrada pasada.
│   │
│   ├── carrusel.js            ← Módulo Carrusel. Barra de días deslizable.
│   │
│   └── app.js                 ← Punto de entrada. Inicializa módulos, conecta navegación.
│
└── README.md                  ← Guía rápida de uso y estructura de datos.
```

---

## 6. Estructura de datos

Todos los datos viven en `localStorage` del navegador. Las claves siguen el prefijo `grimoire_v2:`.

### Entrada del diario
**Clave:** `grimoire_v2:YYYY-MM-DD`

```json
{
  "gratitudes":  ["El sol esta mañana", "Una llamada de mamá", "Un café tranquilo"],
  "animo":       4,
  "nota":        "Hoy me sentí en paz con lo que tengo.",
  "actividades": ["caminar", "leer"],
  "etiquetas":   ["#familia", "#calma"],
  "diaDificil":  false
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `gratitudes` | `string[]` | Array de 3 textos (pueden estar vacíos) |
| `animo` | `number` (1–5) | 1 = Muy baja, 5 = Radiante |
| `nota` | `string` | Reflexión libre (opcional) |
| `actividades` | `string[]` | IDs de actividades seleccionadas |
| `etiquetas` | `string[]` | Hashtags como `"#familia"` |
| `diaDificil` | `boolean` | Si se activó el modo día difícil |

### Cartas
**Clave:** `grimoire_v2:cartas`

```json
[
  {
    "id":     "1700000000000",
    "fecha":  "2024-11-14",
    "tipo":   "pasado",
    "titulo": "Carta a mi yo de hace un año",
    "cuerpo": "Querida yo, quiero que sepas que..."
  }
]
```

### Logros desbloqueados
**Clave:** `grimoire_v2:logros`

```json
{
  "primera-semilla":  "2024-01-15",
  "siete-dias":       "2024-01-22",
  "primera-carta":    "2024-02-03"
}
```

### Preferencia de tema
**Clave:** `grimoire_v2:tema`

```
"oscuro"  |  "claro"
```

---

## 7. Control de versiones

### Historial de versiones

---

#### 🌑 v1.0 — El grimorio original
**Fecha:** Primera versión

**Descripción:**
Archivo HTML único con la funcionalidad base del diario.

**Funciones incluidas:**
- Entrada diaria con 3 gratitudes y nota libre
- Selector de ánimo con 5 fases lunares
- Vista de estadísticas básica (racha, entradas en 30 días, luna media)
- Gráfica de barras de humor (últimas 2 semanas)
- Calendario de puntos (últimos 30 días)
- Vista de historial (entradas de los últimos 30 días)
- Distribución de lunas

**Stack:** 1 archivo HTML monolítico (~490 líneas)

---

#### 🌒 v2.0 — El grimorio expandido
**Fecha:** Segunda iteración

**Descripción:**
Gran expansión de funciones. Aún como archivo único.

**Funciones añadidas:**
- ✨ Mensajes positivos de celebración al guardar
- 🤍 Modo día difícil con mensajes de acompañamiento
- 💌 Pestaña "Cartas" — cartas al yo del pasado y del futuro
- 📤 Exportación en JSON, Markdown, CSV y PDF (via jsPDF)
- 🏆 Sistema de logros (8 logros desbloqueables)
- 📊 Sistema de niveles con barra de progreso (6 niveles)
- 🎯 Actividades del día (12 chips seleccionables)
- 🏷️ Sistema de etiquetas (#hashtags personalizados)
- 🗓️ Calendario interactivo: clic para editar días pasados
- 💾 Historial expandido con filtro por etiquetas y visualización de actividades

**Stack:** 1 archivo HTML (~1.200 líneas)

---

#### 🌓 v3.0 — El grimorio inteligente
**Fecha:** Tercera iteración

**Descripción:**
Refinamiento visual, carrusel de días y mejoras al historial.

**Funciones añadidas:**
- 🗂️ Historial expandido a todo el historial (no solo 30 días)
- 📅 Carrusel horizontal de días deslizable con ánimo visible
- 🔧 Correcciones de comportamiento del guardado y etiquetas

**Stack:** 1 archivo HTML (~1.840 líneas)

---

#### 🌔 v4.0 — El grimorio completo
**Fecha:** Cuarta iteración

**Descripción:**
Rediseño de estadísticas, modo claro y recuerdos.

**Funciones añadidas:**
- ☀️ Toggle de tema claro (crema/beige) y oscuro (musgo/dorado)
- 🥹 Tarjeta de recuerdo aleatorio en pantalla de Hoy (entradas > 7 días)
- 📊 Estadísticas completamente rediseñadas:
  - Selector de rango: 7 días / 30 días / todo el historial
  - Línea de vida emocional (curva SVG con Bézier)
  - Mapa de calor tipo GitHub (18 semanas de actividad)
  - Gráfica de rosquilla de actividades más frecuentes
- 🔗 Mapa de calor vinculado al modal de edición de días

**Stack:** 1 archivo HTML (~2.350 líneas)

---

#### 🌕 v5.0 — El grimorio refactorizado
**Fecha:** Quinta iteración — refactorización arquitectural

**Descripción:**
Refactorización completa aplicando principios de Clean Code, DRY, KISS y separación de responsabilidades. Funcionalidad idéntica a v4.0, arquitectura completamente nueva.

**Cambios técnicos (sin cambios visibles para la usuaria):**

*Arquitectura:*
- Separación en 21 archivos (1 HTML + 5 CSS + 14 JS + 1 README)
- Patrón IIFE Revealing Module para encapsulamiento de estado
- `almacenamiento.js` como única capa de acceso a localStorage
- `app.js` como único punto de entrada y coordinador

*Nombres refactorizados:*

| Antes | Después |
|---|---|
| `SK` | `CLAVE_ALMACENAMIENTO` |
| `fmtDate()` | `formatearFecha()` |
| `tod` | `entradaExistente` |
| `moodE` | `entradasConAnimo` |
| `actCount` | `conteoActividades` |
| `isSaved` | `estaGuardado` |
| `renderDonut()` | `renderizarRosquilla()` |
| `buildCarousel()` | `construirCarrusel()` |
| `MOODS` | `ESTADOS_ANIMO` |
| `openHistDay` | `fechaAbierta` |

*Mejoras de accesibilidad:*
- `aria-label` en todos los botones de emoji
- `role="dialog"` y `aria-modal="true"` en modales
- `aria-live` en tostadas y mensajes dinámicos
- `aria-expanded` en items del historial

**Stack:** 21 archivos estáticos (HTML + CSS + JS)

---

### Tabla resumen de versiones

| Versión | Líneas aprox. | Archivos | Funciones principales |
|---|---|---|---|
| v1.0 | ~490 | 1 HTML | Diario base, estadísticas simples |
| v2.0 | ~1.200 | 1 HTML | + Cartas, Logros, Exportar, Actividades, Etiquetas |
| v3.0 | ~1.840 | 1 HTML | + Carrusel, historial completo |
| v4.0 | ~2.350 | 1 HTML | + Tema claro, Recuerdos, Estadísticas avanzadas |
| v5.0 | ~2.800 | 21 archivos | Refactorización: mismas funciones, mejor arquitectura |

---

### Convención de versionado

El proyecto sigue **Semantic Versioning** adaptado a un proyecto personal:

```
vMAYOR.MENOR

MAYOR → cambio de arquitectura o rediseño significativo
MENOR → funciones nuevas o mejoras visibles
```

### Clave de datos

La clave `grimoire_v2` en localStorage indica la segunda versión del esquema de datos. Si en el futuro se cambia la estructura de los datos de forma incompatible, se incrementaría a `grimoire_v3` y se incluiría una función de migración automática.

---

## 8. Cómo usar la aplicación

### Abrir el proyecto

Por ser archivos estáticos, se puede abrir de dos formas:

**Opción 1 — Directamente en el navegador:**
```
Doble clic en index.html
```

**Opción 2 — Con servidor local (recomendado para desarrollo):**
```bash
# Con Node.js
npx serve .

# Con Python
python3 -m http.server 8080

# Luego abrir: http://localhost:8080
```

### Flujo de uso diario sugerido

```
1. Abrir la app
2. En "Hoy": seleccionar ánimo, actividades y etiquetas
3. Escribir las 3 gratitudes
4. Escribir nota libre (opcional)
5. Presionar "Sellar entrada de hoy"
6. Revisar estadísticas en "Luna" de vez en cuando
7. Exportar en JSON cada cierto tiempo como respaldo
```

### Migrar datos entre dispositivos

Exportar desde el dispositivo origen en **JSON** e importar los datos pegándolos en la consola del navegador en el dispositivo destino:

```javascript
// En la consola del navegador del dispositivo destino:
const datos = { /* pegar el JSON exportado aquí */ };
Object.entries(datos.entradas).forEach(([fecha, entrada]) => {
  localStorage.setItem(`grimoire_v2:${fecha}`, JSON.stringify(entrada));
});
localStorage.setItem('grimoire_v2:cartas', JSON.stringify(datos.cartas));
location.reload();
```

---

## 9. Recomendaciones para el futuro

### Próximos pasos técnicos sugeridos

| Prioridad | Mejora | Beneficio |
|---|---|---|
| Alta | Migrar a ES Modules (`type="module"`) | Elimina el orden manual de carga de scripts |
| Alta | Pruebas unitarias en `fechas.js` y `almacenamiento.js` con Jest | Garantiza que los cálculos de racha y logros siempre sean correctos |
| Media | Service Worker para funcionamiento offline completo | La app funciona sin internet incluyendo las fuentes |
| Media | IndexedDB en lugar de localStorage | Soporta más de 5MB de datos (útil para >500 entradas) |
| Media | Backup automático en JSON cada 30 días | Protege contra pérdida accidental de datos |
| Baja | Migración a React | Facilita agregar funciones más complejas en el futuro |

### Próximas funciones sugeridas

- **Búsqueda full-text** en todo el historial
- **Gráfica de palabras más usadas** en las gratitudes
- **Notificaciones push** como recordatorio diario (requiere Service Worker)
- **Sincronización entre dispositivos** via exportación/importación automática a Google Drive

---

*Documentación generada para el Grimorio de Gratitud v5.0*
*Con 🌿 y mucho amor por la escritura*

---

```
✦   ✦   ✦
```
