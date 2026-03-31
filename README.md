# 🌿 Grimorio de Gratitud

Diario personal de gratitud con modo oscuro/claro, estadísticas emocionales,
cartas a tu yo, logros y exportación en múltiples formatos.

---

## Estructura del proyecto

```
grimorio-gratitud/
├── index.html              ← Estructura semántica, sin lógica inline
├── css/
│   ├── variables.css       ← Tokens de diseño (colores, fuentes, espaciado)
│   ├── base.css            ← Reset y estilos base
│   ├── temas.css           ← Modo claro y oscuro
│   ├── componentes.css     ← Componentes reutilizables
│   ├── vistas.css          ← Estilos por vista
│   └── graficas.css        ← Visualizaciones (mapa de calor, línea de vida)
└── js/
    ├── configuracion.js    ← Constantes (datos estáticos, nunca cambian)
    ├── almacenamiento.js   ← Capa de datos (única que toca localStorage)
    ├── fechas.js           ← Utilidades puras de fecha
    ├── interfaz.js         ← Helpers de DOM reutilizables
    ├── tema.js             ← Toggle modo claro/oscuro
    ├── diario.js           ← Vista "Hoy"
    ├── estadisticas.js     ← Vista "Luna"
    ├── historial.js        ← Vista "Archivo"
    ├── cartas.js           ← Vista "Cartas"
    ├── logros.js           ← Vista "Logros" y gamificación
    ├── exportar.js         ← Vista "Exportar" (JSON, MD, CSV, PDF)
    ├── recuerdos.js        ← Componente de recuerdo aleatorio
    ├── carrusel.js         ← Componente carrusel de días
    └── app.js              ← Punto de entrada (siempre el último en cargar)
```

---

## Estructura de datos (localStorage)

### Entrada del diario
**Clave:** `grimoire_v2:YYYY-MM-DD`

```json
{
  "gratitudes": ["texto 1", "texto 2", "texto 3"],
  "animo": 4,
  "nota": "Reflexión opcional",
  "actividades": ["programar", "caminar"],
  "etiquetas": ["#familia", "#trabajo"],
  "diaDificil": false
}
```

### Cartas
**Clave:** `grimoire_v2:cartas`

```json
[
  {
    "id": "1700000000000",
    "fecha": "2024-11-14",
    "tipo": "pasado",
    "titulo": "Carta a mi yo de hace un año",
    "cuerpo": "Querida yo..."
  }
]
```

### Logros desbloqueados
**Clave:** `grimoire_v2:logros`

```json
{
  "primera-semilla": "2024-01-15",
  "siete-dias": "2024-01-22"
}
```

---

## Principios de arquitectura

- **Separación de responsabilidades**: cada módulo tiene una sola razón para cambiar.
- **Almacenamiento como frontera**: ningún módulo accede a `localStorage` directamente excepto `almacenamiento.js`.
- **Funciones puras en fechas.js**: sin efectos secundarios, fáciles de probar.
- **Estado privado por módulo**: el estado del diario vive en `Diario`, el de cartas en `Cartas`, etc.
- **Preparado para ES Modules**: cada IIFE puede convertirse en `export default` sin cambiar la lógica.

---

## Cómo correrlo localmente

Por ser archivos estáticos, puedes abrirlo directamente en el navegador.
Para desarrollo con recarga automática:

```bash
npx serve .
# o
python3 -m http.server 8080
```

---

## Próximos pasos sugeridos

1. Migrar a ES Modules con `type="module"` en los scripts
2. Agregar pruebas unitarias a `fechas.js` y `almacenamiento.js` con Jest
3. Agregar `aria-label` a todos los botones de emoji para accesibilidad
4. Considerar IndexedDB si el grimorio crece más de 500 entradas
