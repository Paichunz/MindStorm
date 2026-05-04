# Auditoría de Fluidez — Canvas Micelio (MindStorm)

**Fecha:** 2026-05-03  
**Base:** `src/App.jsx` · commit c72c1ab  
**Stack:** React 18 · Vite 5 · Supabase · Sin react-spring ni requestAnimationFrame explícito  
**Prioridades:** P0 = bloqueo crítico · P1 = degradación significativa · P2 = pulido / UX

---

## Resumen ejecutivo

| Dimensión | Estado actual | Target | Gap | Esfuerzo |
|---|---|---|---|---|
| 1. Pan & Zoom | Funcional, re-renders en cada scroll | 60fps sin jank, debounced state | Medio | S |
| 2. Layout algorithm | BFS+force, O(n²), random jitter, CARD_W mismatch | Reproducible, non-blocking, sizes correctos | Alto | M |
| 3. Modelo de interacción | Drag/expand básico, sin teclado ni multiselect | Atajos, space-to-pan, rubber-band | Alto | M |
| 4. Arquitectura de información | SVG 9000px, sin minimap, sin leyenda | SVG acotado, minimap, jerarquía clara | Crítico | L |
| 5. Renderizado de conexiones | Color uniforme, bezier degenera en vertical | Color por tipo, bezier correcto | Medio | S |
| 6. Responsive | Cards no escalan en móvil, grid no reactivo | Cards 160px en móvil, grid dinámico | Bajo | S |
| 7. Persistencia & recuperación | Relayout total al agregar tarjeta | Layout incremental, saves debounced | Crítico | M |

**2 bloqueos P0 · 7 hallazgos P1 · 9 hallazgos P2**

---

## Dimensión 1 — Pan & Zoom

### Estado actual
- Zoom por rueda: `factor = e.deltaY < 0 ? 1.1 : 0.91` — anclado al cursor, correcto.
- Rango: 0.10× – 4.00× por rueda; 0.25× – 2.0× por botones HUD — inconsistente.
- Transform via `applyT()` toca el DOM directamente → correcto, evita React re-render en cada frame.
- **Problema**: `setZoomPct(Math.round(nz * 100))` se llama en cada evento `wheel`. Cada llamada dispara un render de React del componente CanvasView.
- `zoomBy()` definida pero nunca invocada → dead code.
- Cursor siempre `grab`, no cambia a `grabbing` durante pan activo.

### Target
- `setZoomPct` actualizado máximo 8fps (cada 125ms) durante scroll activo.
- Cursor `grabbing` durante drag de fondo.
- Rango consistente entre rueda y botones.

### Hallazgos

| Prioridad | Hallazgo | Fix concreto |
|---|---|---|
| **P1** | `setZoomPct` en cada evento `wheel` → react re-render cada scroll tick | Throttle con `useRef` timestamp: si `Date.now() - lastZoomTs < 120` saltar la llamada a `setZoomPct`; actualizarla en `onWheel` end o mouseup |
| **P2** | Cursor no cambia a `grabbing` durante pan | `containerRef.current.style.cursor = "grabbing"` en `startPan`, restaurar en `onUp` |
| **P2** | `zoomBy()` dead code — eliminar | Borrar función (8 líneas) |
| **P2** | Rango HUD max 2.0× pero rueda llega a 4.0× | Unificar `ZOOM_STEPS` o cambiar `Math.min` a 4.0 en botones |

**Esfuerzo total: S** (≤2h)

---

## Dimensión 2 — Algoritmo de Layout

### Estado actual
```
ITER=100, REP=14000, SPK=0.06, SPL=250, DAMP=0.7, GRAV=0.01
```
- BFS radial desde nodo de mayor grado, luego espiral dorada para nodos aislados.
- Force simulation: O(n²) repulsión por par × 100 iteraciones → O(100n²). Para n=30 cards: 90 000 operaciones en el hilo principal.
- `Math.random()-0.5)*0.18` jitter en BFS: layout no reproducible — cada "Reorganizar" produce resultado distinto.
- `CARD_W=210` en cálculos de layout vs `.mcard { width:250px }` en CSS — 40px de diferencia provoca solapamiento de tarjetas en grafos densos.
- Sin animación de transición al aplicar nuevo layout — las tarjetas teletransportan.
- `SPL=250` (spring rest length) → separación media de 250px entre tarjetas conectadas — razonable.

### Target
- Layout reproducible dado el mismo grafo (seed determinista).
- Corre en ≤16ms para n≤20 (O.K. actual), no bloquea para n>30.
- Tamaño de nodo en layout = tamaño real renderizado.
- Transición animada con CSS al aplicar layout.

### Hallazgos

| Prioridad | Hallazgo | Fix concreto |
|---|---|---|
| **P1** | `CARD_W=210` en layout vs 250px renderizado → cards se solapan | Cambiar constante `CARD_W=250` y ajustar `SPL=280` para compensar |
| **P1** | `Math.random()` en BFS → layout no reproducible | Reemplazar `Math.random()` con PRNG seeded por `cards.map(c=>c.id).join("")` — `mulberry32` o `sfc32` (10 líneas) |
| **P2** | O(n²) en hilo principal bloquea UI para n>30 | Envolver en `requestIdleCallback` con chunks de 10 iteraciones; mostrar progreso en botón |
| **P2** | Sin transición al aplicar layout | En `runLayout`, agregar `{ transition:"left .4s ease, top .4s ease" }` a `.mcard` antes del setState, remover después |

**Esfuerzo total: M** (4-6h)

---

## Dimensión 3 — Modelo de Interacción

### Estado actual
- Drag de tarjeta individual: implementado correctamente (coord math con `zoomRef`).
- Drag de sticker: implementado.
- Click en background → pan. Click en tarjeta → expand/collapse.
- Propagación correcta: `stopPropagation` en cards evita activar pan.
- Sin multiselect, sin rubber-band selection box.
- Sin atajos de teclado en canvas.
- Sin space-to-pan (estándar en Figma, Miro, FigJam).
- Sin doble-click para crear tarjeta en posición.

### Target (referencia: Figma, Excalidraw)
| Acción | Shortcut esperado |
|---|---|
| Zoom in/out | Cmd+= / Cmd+- |
| Fit to view | Cmd+0 |
| Reorganizar | Cmd+Shift+L |
| Pan mode | Space |
| Nueva tarjeta | Double-click en canvas |

### Hallazgos

| Prioridad | Hallazgo | Fix concreto |
|---|---|---|
| **P1** | Sin atajos de teclado en canvas | `useEffect` en CanvasView con `keydown` listener: `Cmd+=` → `zoomStep(+1)`, `Cmd+-` → `zoomStep(-1)`, `Cmd+0` → `fitToView()`, `Cmd+Shift+L` → `runLayout()` |
| **P2** | Sin space-to-pan | Track `spaceDown` en `keydown/keyup`; mientras activo: cursor `crosshair`, background-click → pan en lugar de nada |
| **P2** | Sin rubber-band multiselect | Estado `selectionBox`, render div semitransparente durante drag de fondo; cards dentro del box → array `selectedIds`; shift+drag mueve grupo |
| **P2** | Sin doble-click para crear tarjeta | `onDoubleClick` en container, calcular posición canvas, invocar `onAddCard` con coordenadas |

**Esfuerzo total: M** (4-6h — P1 solo: S)

---

## Dimensión 4 — Arquitectura de Información

### Estado actual

```jsx
// Línea 4928
<svg style={{
  position:"absolute", left:"-3000px", top:"-3000px",
  width:"9000px", height:"9000px",  // <-- siempre en DOM
  pointerEvents:"none", zIndex:2
}}>
```

El SVG de 9000×9000px **siempre está presente en el DOM** independientemente de cuántas tarjetas haya. El compositor del navegador tiene que incluirlo en cada frame de composición aunque esté fuera del viewport. En dispositivos con GPU limitada, esto solo genera rasterización tiles de 9MB+ en memoria.

- Sin minimap para navegar en grafos con >10 tarjetas.
- Stickers visualmente al mismo nivel que tarjetas (misma sombra, mismo border-radius).
- Etiquetas de conexión (7px) ilegibles a <75% zoom.
- Sin leyenda de tipos de tarjeta, columnas o stickers.

### Target
- SVG acotado al área visible + overflow.
- Minimap en esquina inferior-izquierda (canvas Figma-style) para n>8 cards.
- Stickers visualmente subordinados: box-shadow reducida, bordes más finos.
- Etiquetas de conexión solo visibles cuando `zoomPct > 65`.

### Hallazgos

| Prioridad | Hallazgo | Fix concreto |
|---|---|---|
| **P0** | SVG 9000×9000px siempre en DOM — compositor overhead constante | Cambiar a SVG con `overflow:visible` posicionado en `left:0, top:0, width:100%, height:100%`. Sumar `+3000` en coordenadas → `el.clientWidth/2` + desplazamiento real. O mantener el SVG grande pero con `will-change:transform` en el layer padre |
| **P1** | Sin minimap — usuarios se pierden con >12 cards | Agregar minimap: `<canvas>` 180×120px en esquina inf-izq. Renderiza posiciones como rectángulos 4×2px. Actualizar en `onSavePositions`. Click en minimap → `fitToView` relativo |
| **P1** | Stickers al mismo nivel visual que cards | Reducir `box-shadow` de stickers a `var(--shadow-1)` (sin `var(--shadow-2)`). Border `0.5px`. Tamaño de texto header de 8px → 7px |
| **P2** | Etiquetas de conexión siempre visibles (7px → ~2px a 25% zoom) | Render condicional: `{zoomPct > 65 && <text...>}` — requiere `zoomPct` en React state (ya existe) |
| **P2** | Sin leyenda de tipos y colores | Botón "?" en HUD que muestra tooltip con tipo de tarjeta → color, tipos de sticker → símbolo |

**Esfuerzo total: L** (P0 solo: M · minimap: M)

---

## Dimensión 5 — Renderizado de Conexiones

### Estado actual

```jsx
// Línea 4941-4942
const dx = ep2.x - ep1.x;
const organicD = `M${ep1.x},${ep1.y} C${ep1.x+dx*0.5},${ep1.y} ${ep2.x-dx*0.5},${ep2.y} ${ep2.x},${ep2.y}`;
```

La curva bezier usa solo `dx` como control de curvatura — funciona para tarjetas en el eje horizontal pero **degenera a línea recta cuando las tarjetas están verticalmente alineadas** (dx≈0).

- Todas las conexiones tienen el mismo color `var(--line)` — los tipos `CONN_COLORS` están definidos pero no se aplican al path SVG.
- Sticker threads: línea recta horizontal (recién corregida) — correcto para el nuevo layout en columna.

### Target
- Bezier correcto para cualquier ángulo (perpendicular a la dirección de la arista).
- Color por tipo de conexión usando `CONN_COLORS`.
- Labels visibles solo cuando `zoomPct > 65`.

### Hallazgos

| Prioridad | Hallazgo | Fix concreto |
|---|---|---|
| **P1** | Bezier degenera en conexiones verticales | Cambiar control points a perpendicular: `const len = Math.sqrt(dx*dx+dy*dy); const cx = dx/len*Math.min(len*0.4, 120); const cy = dy/len*Math.min(len*0.4, 120);` — luego `C${ep1.x+cx},${ep1.y+cy} ${ep2.x-cx},${ep2.y-cy}` |
| **P1** | Conexiones sin color por tipo — `CONN_COLORS` definido pero ignorado | En SVG path usar `stroke={CONN_COLORS[conn.type] \|\| "var(--line)"}` en lugar de `stroke="var(--line)"`. Los endpoints `fill="var(--laton)"` → `fill={CONN_COLORS[conn.type] \|\| "var(--laton)"}` |
| **P2** | Labels siempre visibles independiente del zoom | `{zoomPct > 65 && <text ...>}` (ver Dimensión 4) |

**Esfuerzo total: S** (≤2h)

---

## Dimensión 6 — Responsive

### Estado actual
- `isMobile` existe en `BoardScreen` pero **no se pasa a `CanvasView`**.
- Touch pinch: implementado.
- Touch pan: implementado.
- Cards: `width:250px` fijo — en móvil (375px) caben 1.5 tarjetas en el ancho visible.
- Dot grid: `background-size: 28px 28px` fijo — no escala con zoom.

### Target
- Cards: `width: min(250px, 80vw)` en móvil.
- `isMobile` propagado para adaptar HUD y card size.
- Grid `background-size` sincronizado con `zoomRef` (efecto DOM directo, sin React state).

### Hallazgos

| Prioridad | Hallazgo | Fix concreto |
|---|---|---|
| **P2** | `isMobile` no propagado a CanvasView | Pasar `isMobile` como prop. En CSS canvas: `@media (max-width:680px) { .mcard { width:180px !important; } }` |
| **P2** | Dot grid no escala con zoom | En `applyT`, agregar: `const gs = Math.round(28 * nz * 10)/10; containerRef.current.style.backgroundSize = gs+"px "+gs+"px"` |
| **P2** | HUD botones en móvil muy pequeños en canvas | Asegurar `min-height:44px` en HUD buttons cuando `isMobile` |

**Esfuerzo total: S** (≤3h)

---

## Dimensión 7 — Persistencia & Recuperación

### Estado actual

```jsx
// Línea 4671
useEffect(() => { if (!hasAllPos && cards.length > 0) runLayout(); }, []);
```

```js
// Línea 4626
const hasAllPos = cards.length > 0 && cards.every(c => posRef.current.cards[c.id]);
```

**Si una sola tarjeta no tiene posición, `hasAllPos` es `false` → layout completo → destruye posiciones del usuario.**

Esto ocurre cada vez que:
- El usuario crea una nueva tarjeta desde el tablero Kanban y luego va a Canvas.
- Un colaborador agrega una tarjeta mientras el canvas está abierto.

Además, `onSavePositions` se llama directamente en `onUp` tras cada drag, sin debounce — cada drag termina con una escritura a Supabase.

### Target
- Layout incremental: solo colocar las tarjetas sin posición, preservar las que la tienen.
- `onSavePositions` debounced 800ms para agrupar drags rápidos.
- Estado de "última posición buena" para recuperación si el layout automático es malo.

### Hallazgos

| Prioridad | Hallazgo | Fix concreto |
|---|---|---|
| **P0** | Cualquier tarjeta nueva dispara relayout total | Cambiar `hasAllPos` a `hasMissingPos`. En `useEffect`, detectar qué cards no tienen posición y solo layoutearlas. Inicializar las nuevas en espiral alrededor del centroide de las ya posicionadas |
| **P1** | `onSavePositions` sin debounce → Supabase write por drag | Crear `debouncedSave = useRef(debounce(onSavePositions, 800))`. Llamar `debouncedSave.current(posRef.current)` en `onUp` |
| **P2** | Sin historial de layout → imposible deshacer relayout malo | Guardar `layoutHistory = useRef([])` (máx 3 estados). Botón "↩ Deshacer layout" en HUD cuando `layoutHistory.length > 0` |

**Esfuerzo total: M** (P0 solo: S — 1.5h)

---

## Plan de acción priorizado

### P0 — Bloqueos críticos (hacer hoy)

| # | Fix | Archivo | Líneas afectadas | Esfuerzo |
|---|---|---|---|---|
| A | Layout incremental: tarjetas nuevas no destruyen posiciones existentes | App.jsx | 4626, 4671 | S |
| B | SVG 9000×9000: cambiar a `overflow:visible` o `will-change:transform` en layer | App.jsx | 4924, 4928 | S |

### P1 — Degradación significativa (esta semana)

| # | Fix | Archivo | Líneas | Esfuerzo |
|---|---|---|---|---|
| C | `CARD_W=250` + `SPL=280` — corregir mismatch layout/CSS | App.jsx | 4512 | XS |
| D | Layout reproducible — PRNG seeded por IDs | App.jsx | 4497 | S |
| E | Bezier correcto para conexiones verticales | App.jsx | 4942 | S |
| F | Colores por tipo de conexión en SVG | App.jsx | 4945 | XS |
| G | Atajos de teclado: Cmd+=/-/0/Shift+L | App.jsx | 4609 | S |
| H | `onSavePositions` debounced 800ms | App.jsx | 4775 | XS |
| I | Throttle `setZoomPct` — evitar re-renders en scroll | App.jsx | 4690 | XS |

### P2 — Pulido (próximo sprint)

| # | Fix | Esfuerzo |
|---|---|---|
| J | Minimap 180×120px en canvas | M |
| K | Etiquetas de conexión ocultas cuando zoom < 65% | XS |
| L | Stickers visualmente subordinados (shadow reducida) | XS |
| M | `isMobile` propagado + cards 180px en móvil | S |
| N | Dot grid escala con zoom en `applyT` | XS |
| O | Cursor `grabbing` durante pan activo | XS |
| P | Space-to-pan mode | S |
| Q | Doble-click para crear tarjeta en posición | S |
| R | Eliminar `zoomBy()` dead code | XS |

---

## Tabla maestra

| Dimensión | Estado actual | Target | Gap | Acción principal | Esfuerzo |
|---|---|---|---|---|---|
| 1. Pan & Zoom | Funcional; re-renders en scroll | 60fps, debounced | P1: throttle setZoomPct | Fix I | S |
| 2. Layout | BFS+force; random; CARD_W mismatch | Reproducible, non-blocking, sizes OK | P1: seed PRNG, fix CARD_W | Fix C+D | M |
| 3. Interacción | Drag básico, sin teclado | Atajos, space-pan, multiselect | P1: keyboard shortcuts | Fix G | M |
| 4. Info architecture | SVG 9000px; sin minimap | SVG acotado; minimap n>8 | P0: fix SVG; P1: minimap | Fix B+J | L |
| 5. Conexiones | Color uniforme; bezier falla vertical | Color por tipo; curvas correctas | P1: aplicar CONN_COLORS | Fix E+F | S |
| 6. Responsive | Cards fijas 250px; grid estático | Cards fluidas; grid dinámico | P2: isMobile prop | Fix M+N | S |
| 7. Persistencia | Relayout total en nueva card | Incremental; saves debounced | P0: incremental layout | Fix A+H | M |

---

*Auditoría generada con análisis directo de src/App.jsx — sin instrumentación de profiler. Para validación de tiempos reales: `performance.mark` alrededor de `layoutMicelio` y `React Profiler` en `CanvasView`.*
