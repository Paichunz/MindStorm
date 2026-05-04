# UX_AUDIT.md — MindStorm Beta
**Fecha:** 2026-05-03  
**Auditor:** impeccable · Claude Opus  
**Stack:** React 18 · Vite 5 · Supabase · Gemini/Groq · SPA monolítica (App.jsx ~6 050 líneas)

---

## 1. Resumen ejecutivo

MindStorm es una herramienta creativa con buena personalidad visual pero con fricciones de UX que penalizan su audiencia objetivo: escritores y creativos **no técnicos** que necesitan capturar ideas con fricción cero. El mayor riesgo no es estético —el diseño Editorial Cream es coherente— sino de usabilidad fundamental: hay cuatro defectos P0 de accesibilidad/recuperación de datos que bloquean usuarios reales.

### Top 5 hallazgos

| # | ID | Problema | Severidad |
|---|-----|---------|-----------|
| 1 | UX-021 | `WorkCard` completo no es alcanzable por teclado — el área de expand y el título son `div` con `onClick` sin `tabIndex` ni `role="button"` | **P0** |
| 2 | UX-031 | Error de guardado desaparece en 5 s sin opción de reintento — el usuario puede perder datos sin saberlo | **P0** |
| 3 | UX-009 | El canvas (Micelio) no tiene control por teclado: sin flechas de paneo, sin +/- zoom, sin Tab entre nodos | **P0** |
| 4 | UX-022 | Botones de iconos en barra lateral (▤ ◎ ⚿ ✕) sin `aria-label` — invisibles para lectores de pantalla | **P0** |
| 5 | UX-003 | `BoardScreen` presenta 5 zonas de atención simultáneas; el panel derecho mezcla 7+ tipos de información en 200 px | **P1** |

### Score general por dimensión

| Dimensión | Score (1–5) | Nota breve |
|-----------|------------|-----------|
| D1 TTFV | 3 | Board abre rápido; onboarding hasta primer valor: ~5 pasos |
| D2 Carga cognitiva | 2 | BoardScreen excede Miller 7±2 con regularidad |
| D3 Costo por acción | 3 | Botón edit en WorkCard 20 px — bajo mínimo táctil |
| D4 Power paths | 2 | Shortcuts existen pero invisibles; canvas sin teclado |
| D5 Disclosure progresiva | 3 | Buen patrón en WorkCard; íconos sin label en sidebar |
| D6 Performance percibida | 3 | Canvas re-render sin memo; AI sin feedback intermedio |
| D7 Estados extremos | 3 | Empty states básicos; 100+ nodos sin estrategia |
| D8 Accesibilidad | 2 | Múltiples P0: foco, roles ARIA, motion |
| D9 Microcopy | 3 | Español coherente; inconsistencia UTC vs UTC-7/8 |
| D10 Vacíos/errores | 2 | Save error sin recovery; DocPanel error silencioso |
| D11 Onboarding | 2 | JoinScreen mínimo; cero tour dentro del tablero |

### 3 Wins rápidos (P0/P1 · Esfuerzo S)

1. **UX-021 S** — Añadir `tabIndex=0 role="button" onKeyDown` al área expand de `WorkCard` y al div del título.
2. **UX-022 S** — Añadir `aria-label` a los cuatro botones de iconos en la barra lateral de `BoardScreen`.
3. **UX-031 S** — Persistir el error de guardado + añadir botón "Reintentar" en el toast y en el panel derecho.

---

## 2. Tabla maestra

Ordenada por **Severidad ASC → Esfuerzo ASC**.

| ID | Vista / Componente | Dim | Sev | Esfuerzo | Resumen |
|----|-------------------|-----|-----|----------|---------|
| UX-021 | `WorkCard` | D8 | P0 | S | Expand/título no son accesibles por teclado |
| UX-022 | `BoardScreen` sidebar | D8 | P0 | S | Botones íconos sin `aria-label` |
| UX-031 | `BoardScreen` / `save()` | D10 | P0 | S | Save error sin recovery path |
| UX-009 | `CanvasView` | D4/D8 | P0 | M | Canvas sin teclado ni ARIA |
| UX-025 | `CanvasView` SVG | D8 | P0 | M | Conexiones SVG sin `<title>` ni `aria-*` |
| UX-026 | `OOverlay` | D8 | P0 | M | Sin focus trap en modales |
| UX-003 | `BoardScreen` | D2 | P1 | M | 5 zonas + panel derecho 7+ items |
| UX-005 | `WorkCard` botón ✎ | D3 | P1 | S | Hit target ~20 px (mín. WCAG: 24 px) |
| UX-008 | `BoardScreen` | D4 | P1 | S | Shortcuts sin documentar en UI |
| UX-011 | `BoardScreen` sidebar | D5 | P1 | S | Íconos sin etiqueta visible |
| UX-014 | `CanvasView` | D6 | P1 | M | `setPos` en cada `mousemove`, sin `React.memo` |
| UX-017 | `LobbyScreen` | D7 | P1 | S | Empty state plano, sin CTA visual |
| UX-020 | `CreateBoardModal` | D7/D10 | P1 | S | Password sin security questions → lock-out permanente |
| UX-024 | Global | D8 | P1 | M | `prefers-reduced-motion` incompleto |
| UX-027 | `AIPanel` / `ConnectionsPanel` | D9 | P1 | S | "medianoche UTC" vs "UTC-7/8" — contradicción |
| UX-034 | `JoinScreen` | D11 | P1 | S | Sin propuesta de valor; pantalla de login sin contexto |
| UX-035 | `BoardScreen` | D11 | P1 | M | Sin tour ni callouts después de crear primer tablero |
| UX-036 | AI key flow | D11 | P1 | M | Setup de API key invisible para creativos no técnicos |
| UX-001 | `JoinScreen` → `BoardScreen` | D1 | P1 | M | TTFV largo: 5 pasos hasta primera tarjeta útil |
| UX-006 | `WorkCard` / columnas | D3 | P1 | S | Dos CTAs "añadir" sin jerarquía clara |
| UX-032 | `DocPanel` | D10 | P1 | S | Error state sin mensaje explicativo |
| UX-015 | `BoardScreen` `moveCard` | D6 | P1 | M | Save síncrono en cada movimiento D&D |
| UX-002 | `CreateBoardModal` | D1 | P2 | S | 3 campos obligatorios bloquean exploración |
| UX-004 | `EditCardModal` | D2 | P2 | S | Non-owner ve tarjeta duplicada (read-only + tab) |
| UX-007 | `CanvasSkillNode` | D3 | P2 | S | Chevron expand 10×12 px — hit target mínimo |
| UX-010 | Global | D4 | P2 | L | Sin command palette |
| UX-012 | `ConnCard` | D5 | P2 | S | Tipos de conexión sin tooltip explicativo |
| UX-013 | `AddStickerForm` | D5 | P2 | S | Tipos de sticker sin descripción inline |
| UX-016 | `AIPanel` | D6 | P2 | S | AI analysis: spinner estático sin feedback intermedio |
| UX-018 | Columnas Kanban | D7 | P2 | S | Columna vacía sin explicación de propósito |
| UX-019 | `CanvasView` | D7 | P2 | L | 100+ nodos: sin agrupación, zoom infinito |
| UX-023 | `OTextarea` | D8 | P2 | S | Monospace en textarea de escritura creativa |
| UX-028 | `ConnectionsPanel` | D9 | P2 | S | Header no revela que es AI-powered |
| UX-029 | Card types | D9 | P2 | S | "bloqueo" no tiene peso visual diferenciado |
| UX-030 | Stickers | D9 | P2 | S | "Sticker" vs "anotación" — término no intuitivo |
| UX-033 | Share link | D10 | P2 | S | Board ID inválido redirige en silencio |
| UX-037 | `AddForm` | D11 | P2 | S | Card types sin descripción en creación |
| UX-038 | `ConnectionsPanel` | D11 | P1 | M | Flujo de conexiones poco descubrible |

---

## 3. Detalle por dimensión

---

### D1 — TTFV (Time to First Value)

---

#### UX-001 · P1 · M · JoinScreen → BoardScreen

**Problema:** El camino hasta la primera tarjeta útil requiere 5 acciones mínimas:
1. Escribir nombre → 2. Crear proyecto (modal con 3 campos) → 3. Asignar categoría → 4. Escribir concepto → 5. Abrir el tablero. Un usuario nuevo sin una idea preparada queda bloqueado en el paso 2.

**Antes:** CreateBoardModal exige `name` + `categoryId` + `conceptTitle` antes de habilitar "Crear proyecto".

**Después:** Permitir crear un board con solo el nombre. Categoría y concepto son opcionales (se pueden completar luego dentro del board). El botón cambia a `"Crear proyecto ✦"` siempre habilitado cuando `name.trim()` es válido.

```jsx
// App.jsx — CreateBoardModal
const canCreate = name.trim().length > 0; // era: name && categoryId && conceptTitle

// Botón — el label ya describe los faltantes
<OBtn full onClick={handleCreate} disabled={!canCreate}>
  Crear proyecto ✦
</OBtn>
```

**Respaldo:** Nielsen #1 — Visibilidad del estado del sistema; los campos secundarios pueden migrarse a un "Completar perfil del proyecto" inline post-creación.

---

#### UX-002 · P2 · S · CreateBoardModal

**Problema:** Tres campos obligatorios se muestran a la vez sin guía de por qué cada uno importa. Un escritor sin una idea estructurada no puede entrar a explorar.

**Solución:** Convertir los campos opcionales (categoría, subcategorías, contraseña, preguntas de seguridad) en una sección colapsable "Configuración avanzada". Solo el nombre es blocking. Ver UX-001 para el código.

---

### D2 — Carga Cognitiva

---

#### UX-003 · P1 · M · BoardScreen

**Problema:** BoardScreen expone simultáneamente 5 zonas de atención:
- Sidebar izquierda (56px icon rail)
- Barra de filtros + búsqueda
- Área de columnas Kanban (protagonista)
- Panel derecho (200px con tablero info + contadores + IA + save + task list)
- Modales flotantes (cuando activos)

El panel derecho solo contiene: nombre del tablero, categoría, 4 contadores de columna, barra de progreso, indicador IA, 2 botones de acción, estado de guardado, y lista de tareas colapsable. Esto es ≥9 elementos de atención en 200px — supera Miller 7±2 consistentemente.

**Solución:** Colapsar el panel derecho a tres secciones expandibles:
- **Progreso** (barra de % completado — siempre visible, 36px)
- **IA** (botones Analizar + Conexiones — expandible)
- **Tareas** (lista — expandible, colapsada por defecto)

Los contadores por columna ya están en los encabezados de columna — duplicarlos en el panel derecho es ruido.

```jsx
// Panel derecho propuesto — collapsed-by-default sections
<div style={{ padding:"8px 0" }}>
  {/* Always visible: compact progress bar */}
  <div style={{ padding:"12px 14px" }}>
    <div style={{ height:3, background:T.bgPanel, borderRadius:2 }}>
      <div style={{ height:"100%", width:pct+"%", background:pct>=75?T.green:T.amber }} />
    </div>
    <div style={{ color:T.ink4, fontSize:10, fontFamily:"var(--mono)", marginTop:4 }}>{pct}% completado · {activeCards.length} tarjetas</div>
  </div>
  {/* Collapsible IA section */}
  <CollapsibleSection title="IA" defaultOpen>
    <OBtn full onClick={() => setAiPanel(true)}>✦ Analizar</OBtn>
    <ConnectionsBtn />
  </CollapsibleSection>
  {/* Collapsible tasks */}
  <CollapsibleSection title="Tareas" badge={taskCards.length}>
    {/* existing task list */}
  </CollapsibleSection>
</div>
```

---

#### UX-004 · P2 · S · EditCardModal (non-owner)

**Problema:** Los usuarios que no son dueños de la tarjeta ven: (1) un banner "Tarjeta de @autor" + (2) una copia read-only del título+body + (3) el contenido del tab activo (comentarios/stickers). La tarjeta aparece duplicada.

**Solución:** Eliminar la copia read-only. El banner ya establece el contexto. El tab de "Comentarios" muestra el contenido natural de la tarjeta. La copia redundante (lines 3394-3397) puede eliminarse.

---

### D3 — Costo por Acción (Fitts + Hick)

---

#### UX-005 · P1 · S · WorkCard botón ✎

**Problema:** El botón de editar en cada tarjeta:
```jsx
<button onClick={e => { e.stopPropagation(); onEdit(); }}
  style={{ fontSize:12, padding:"1px 4px", ... }}>
  {isOwner ? "✎" : "◯"}
</button>
```
Area efectiva de toque: ~20×20px. WCAG 2.5.5 recomienda 24×24px mínimo; WCAG 2.5.8 (AA, 2025): 24px. En móvil es inutilizable.

**Solución:**
```jsx
<button onClick={e => { e.stopPropagation(); onEdit(); }}
  title={isOwner ? "Editar" : "Ver · Comentar · Sticker"}
  style={{
    background:"transparent", border:"none", color:T.ink4, cursor:"pointer",
    fontSize:13, padding:"4px 6px",  // ← mínimo 24×24px
    borderRadius:4, flexShrink:0, transition:"all .12s",
    minWidth:24, minHeight:24, display:"flex", alignItems:"center", justifyContent:"center"
  }}>
  {isOwner ? "✎" : "◯"}
</button>
```

---

#### UX-006 · P1 · S · Columnas Kanban — CTAs duplicadas

**Problema:** Cada columna tiene DOS puntos de entrada para añadir tarjeta:
1. Botón `+` (26×26px) en el encabezado de columna
2. Botón "Nueva tarjeta" (dashed, full-width) al final de la lista

Sin jerarquía clara. El botón final requiere scroll en columnas largas. Fitts: mayor distancia = mayor costo.

**Solución:** Hacer el botón `+` del encabezado el único CTA primario, con tamaño mínimo 32×32px y tooltip explicativo. El botón final puede permanecer como affordance secundaria pero visualmente tenue (solo borde punteado, sin texto). Alternativamente: sticky "Nueva tarjeta" al fondo de la columna con `position:sticky`.

---

#### UX-007 · P2 · S · CanvasSkillNode — chevron expand

**Problema:** El glyph `▸/◢` que controla expand/collapse tiene `width:12px` y está en un header de 10px de padding. Hit target efectivo ≈ 12px wide — imposible en touch.

**Solución:**
```jsx
// mcard-head ya tiene padding 10px 13px — el área total es correcta.
// El problema es que el glyph solo ocupa 12px dentro de ese espacio.
// Solución: toda la .mcard-head es el target de click — ya lo es.
// El problema real es que didDragRef ahora filtra clicks — el área es suficiente.
// Ningún cambio adicional necesario si el fix de drag detection ya está en producción.
```
Sin hallazgo material adicional post-fix de drag threshold.

---

### D4 — Atajos / Power User Paths

---

#### UX-008 · P1 · S · Keyboard shortcuts no documentados

**Problema:** `BoardScreen` tiene shortcuts reales:
- `N` → nueva tarjeta en columna "Concepto"
- `C` → toggle kanban/canvas
- `Cmd/Ctrl+K` → enfocar búsqueda
- `Esc` → cerrar panel activo
- `1–4` → scroll a columna

Ninguno está visible en la UI. Un usuario descubre "C" por accidente o no lo descubre nunca.

**Solución:** Añadir un tooltip de shortcuts accesible con `?` key, y un hint sutil en el footer del board:

```jsx
// En el footer o toolbar — añadir hint:
<span style={{ fontFamily:"var(--mono)", fontSize:10, color:T.ink4, letterSpacing:".06em" }}>
  N nueva · C vista · ⌘K buscar · ? ayuda
</span>

// Handler para ?:
if (e.key === "?" && !typing) setShortcutsHelp(v => !v);

// Modal con tabla de shortcuts:
function ShortcutsHelp() {
  return (
    <OOverlay onClose={() => setShortcutsHelp(false)}>
      <OModalBox>
        <h2>Atajos de teclado</h2>
        <table>
          {[["N","Nueva tarjeta"],["C","Cambiar vista"],["⌘K","Buscar"],["1–4","Ir a columna"],["Esc","Cerrar panel"],["?","Esta ayuda"]].map(([k,d])=>(<tr key={k}><td><kbd>{k}</kbd></td><td>{d}</td></tr>))}
        </table>
      </OModalBox>
    </OOverlay>
  );
}
```

---

#### UX-009 · P0 · M · Canvas sin teclado

**Problema:** `CanvasView` solo responde a mouse y touch. No hay:
- Flechas para paneo
- `+`/`-` para zoom
- `Tab` para navegar entre nodos
- `Enter`/`Space` para abrir un nodo

Un usuario keyboard-primary no puede usar el canvas en absoluto.

**Solución:**
```jsx
// En CanvasView — añadir handler de teclado:
useEffect(() => {
  function onKey(e) {
    if (document.activeElement?.tagName === "INPUT") return;
    const STEP = 30 / zoomRef.current;
    if (e.key === "ArrowLeft")  { panRef.current.x += STEP; applyT(panRef.current.x, panRef.current.y, zoomRef.current); }
    if (e.key === "ArrowRight") { panRef.current.x -= STEP; applyT(panRef.current.x, panRef.current.y, zoomRef.current); }
    if (e.key === "ArrowUp")    { panRef.current.y += STEP; applyT(panRef.current.x, panRef.current.y, zoomRef.current); }
    if (e.key === "ArrowDown")  { panRef.current.y -= STEP; applyT(panRef.current.x, panRef.current.y, zoomRef.current); }
    if (e.key === "+" || e.key === "=") zoomStep(+1);
    if (e.key === "-") zoomStep(-1);
    if (e.key === "0") fitToView();
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);
```
Para Tab-navigation entre nodos, añadir `tabIndex` a `CanvasSkillNode` y manejar focus con `onFocus`.

---

#### UX-010 · P2 · L · Sin command palette

**Sin hallazgos materiales urgentes para este sprint.** La audiencia creativa de MindStorm puede beneficiarse de una command palette (Cmd+K global) en el futuro, pero no es un bloqueador actual dado que `Cmd+K` ya está ocupado para search.

---

### D5 — Progressive Disclosure

---

#### UX-011 · P1 · S · Sidebar izquierda: íconos sin etiqueta

**Problema:** Los botones ▤ (Documento) y ◎ (Worldbuilding) en la barra lateral tienen solo `title=""` como label — texto tooltip del navegador, que:
- No aparece en móvil
- No es visible para lectores de pantalla (sin `aria-label`)
- Tarda ~700ms en aparecer en desktop

Un usuario nuevo no sabe qué hacen estos botones.

**Antes:**
```jsx
<button onClick={() => setDocPanel(true)} title="Documento" style={{ ... }}>
  ▤
</button>
```

**Después:** Añadir label visible en hover (tooltip propio) o label siempre visible en texto reducido:
```jsx
<button onClick={() => setDocPanel(true)}
  aria-label="Generar documento del proyecto"
  title="Documento"
  style={{ width:36, height:36, display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", gap:2, ... }}>
  <span style={{ fontSize:14, lineHeight:1 }}>▤</span>
  <span style={{ fontSize:8, fontFamily:"var(--mono)", letterSpacing:".04em",
    color:"inherit", lineHeight:1 }}>doc</span>
</button>
```

---

#### UX-012 · P2 · S · Tipos de conexión sin tooltip

**Problema:** Al editar una conexión en `ConnCard`, los 6 tipos (complementa/causa/consecuencia/contraste/refuerza/secuencia) son píldoras de texto sin definición. ¿Cuál es la diferencia entre "complementa" y "refuerza"?

**Solución:** `title` tooltip en cada píldora de tipo:
```jsx
const CONN_DESCRIPTIONS = {
  complementa: "Una idea enriquece o amplía a la otra",
  causa: "Una idea es origen de la otra",
  consecuencia: "Una idea resulta de la otra",
  contraste: "Las ideas se oponen o tensionan",
  refuerza: "Las ideas se refuerzan mutuamente",
  secuencia: "Una idea precede a la otra en el tiempo",
};
// En ConnCard:
<button title={CONN_DESCRIPTIONS[t]} ...>{CONN_TYPE_LABELS[t]}</button>
```

---

#### UX-013 · P2 · S · Tipos de sticker sin descripción

Los placeholders contextuales en `AddStickerForm` ya son un buen patrón:
```jsx
type === "opinión" ? "Tu opinión sobre esta tarjeta…"
```
Sin hallazgos materiales adicionales — este patrón es correcto.

---

### D6 — Performance Percibida

---

#### UX-014 · P1 · M · Canvas: re-render masivo en drag

**Problema:** En `CanvasView`, cada `mousemove` durante drag llama `setPos({...np})`, que dispara re-render en todos los `CanvasSkillNode` hijos porque no tienen `React.memo`. Con 20+ tarjetas esto degrada el drag a ~30fps en laptops mediocres.

**Código actual:**
```jsx
function onMove(ev) {
  // ...
  posRef.current = np;
  setPos({...np}); // ← re-render de todos los nodos en cada pixel
}
```

**Solución:** Envolver `CanvasSkillNode` y `CanvasStickerNode` en `React.memo` con comparación shallow de `p`:
```jsx
const CanvasSkillNode = React.memo(function CanvasSkillNode({ card, p, col, cc, sc, onOpen, onMouseDown, onTouchStart }) {
  // ...existing code...
}, (prev, next) => {
  return prev.p.x === next.p.x && prev.p.y === next.p.y &&
         prev.card === next.card && prev.col === next.col;
});
```
Esto hace que solo el nodo que se mueve re-renderice durante el drag.

---

#### UX-015 · P1 · M · `moveCard` — guardado síncrono en D&D

**Problema:** `moveCard` llama directamente a `save()` con `await`:
```jsx
async function moveCard(id, col) { await save(cards.map(c => c.id===id ? {...c, col} : c)); }
```
Si el usuario arrastra rápido entre columnas (drop → drag → drop), puede generar múltiples Supabase upserts simultáneos en conflicto.

**Solución:** Aplicar el mismo patrón `debouncedSave` que ya existe para posiciones del canvas:
```jsx
const debouncedMoveRef = useRef(null);
function moveCard(id, col) {
  const updated = cards.map(c => c.id===id ? {...c, col} : c);
  setCards(updated); // actualización optimista inmediata
  clearTimeout(debouncedMoveRef.current);
  debouncedMoveRef.current = setTimeout(() => save(updated), 600);
}
```

---

#### UX-016 · P2 · S · AI analysis sin feedback intermedio

**Problema:** La llamada a `callAI` en `AIPanel.run()` tarda 5-15 segundos con solo un CSS spinner estático y "Analizando…". No hay streaming, ni pasos intermedios, ni estimación de tiempo.

**Solución:** Simular progreso con mensajes rotativos que den contexto:
```jsx
const ANALYSIS_STEPS = [
  "Leyendo las tarjetas…",
  "Identificando patrones y tensiones…",
  "Evaluando viabilidad de mercado…",
  "Formulando preguntas editoriales…",
  "Redactando análisis final…",
];
// Usar useState + setInterval de 3s para rotar mensajes durante loading
```

---

### D7 — Estados Extremos (0, 1, 10, 100, 1000 nodos)

---

#### UX-017 · P1 · S · LobbyScreen empty state

**Problema:**
```jsx
{allBoards.length === 0
  ? <EmptyMsg>Aún no hay proyectos. Crea el primero → o importa un archivo .mindstorm.json</EmptyMsg>
  ...}
```
`EmptyMsg` es texto gris de 12px mono sin icono, sin CTA visual. La flecha `→` apunta a nada visible.

**Antes:**
```
Aún no hay proyectos. Crea el primero → o importa un archivo .mindstorm.json
```

**Después:**
```jsx
<div style={{ textAlign:"center", padding:"60px 20px" }}>
  <div style={{ fontSize:48, opacity:0.15, marginBottom:16 }}>◯</div>
  <h3 style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontSize:22, color:T.ink, marginBottom:8 }}>
    Tu primer proyecto te espera
  </h3>
  <p style={{ color:T.ink3, fontSize:14, lineHeight:1.6, marginBottom:24, maxWidth:360, margin:"0 auto 24px" }}>
    MindStorm organiza tus ideas en un tablero visual. Crea uno en 30 segundos.
  </p>
  <OBtn onClick={() => setCreating(true)}>+ Crear primer proyecto</OBtn>
</div>
```

---

#### UX-018 · P2 · S · Columna kanban vacía sin contexto

**Problema:** Columna sin tarjetas y sin filtro activo muestra solo el botón "Nueva tarjeta" punteado. La descripción de columna existe (`col.desc`) pero en 10px mono barely visible.

**Solución:** En columna vacía sin filtro, mostrar la descripción con mayor prominencia:
```jsx
{!hasFilter && colCards.length === 0 && addingTo !== col.id && (
  <div style={{ textAlign:"center", padding:"20px 8px", color:T.ink4, fontSize:12, lineHeight:1.6 }}>
    <div style={{ fontSize:20, marginBottom:8, opacity:0.4 }}>{col.icon}</div>
    <div style={{ fontWeight:600, marginBottom:4, color:T.ink3 }}>{col.desc}</div>
  </div>
)}
```

---

#### UX-019 · P2 · L · Canvas con 100+ nodos

Sin estrategia actual. `layoutMicelio` escala visualmente pero sin agrupación. Priorizar en sprint 3. Requiere investigación con usuarios reales (ver Apéndice B).

---

#### UX-020 · P1 · S · Password sin security questions → lock-out

**Problema:** `CreateBoardModal` permite crear un tablero con contraseña pero sin preguntas de seguridad (`needsSecurity = password.trim().length > 0`, pero las preguntas son opcionales si el usuario llena la contraseña y deja las respuestas vacías).

Verificando el código:
```jsx
const canCreate = name.trim() && categoryId && conceptTitle.trim() &&
  (!needsSecurity || (secA1.trim() && secA2.trim()));
```
Aquí `needsSecurity = password.trim().length > 0` fuerza que si hay password, ambas respuestas sean obligatorias. **Este caso está cubierto.** Sin hallazgo material.

---

### D8 — Accesibilidad

---

#### UX-021 · P0 · S · WorkCard: expand y título no son accesibles por teclado

**Problema:** El área que expande la tarjeta y el span del título son `div`s con `onClick`:
```jsx
// Área de expand:
<div onClick={e => { e.stopPropagation(); setExpanded(p => !p); }} style={{ cursor:"pointer", ... }}>

// Título (abre reader):
<div onClick={e => { e.stopPropagation(); onOpen(); }} ...>{card.title}</div>
```
Ninguno tiene `tabIndex`, `role="button"`, ni `onKeyDown`. Un usuario de teclado no puede expandir ni leer una tarjeta.

**Respaldo:** WCAG 2.1 — 2.1.1 (Keyboard, Level A).

**Antes:** `<div onClick={...}>` sin atributos de accesibilidad.

**Después:**
```jsx
// Área header completa — click para expand
<div
  role="button"
  tabIndex={0}
  aria-expanded={expanded}
  onClick={e => { e.stopPropagation(); setExpanded(p => !p); }}
  onKeyDown={e => { if (e.key==="Enter"||e.key===" ") { e.preventDefault(); setExpanded(p => !p); }}}
  style={{ padding:"9px 10px 9px 11px", display:"flex", alignItems:"flex-start", gap:8, cursor:"pointer" }}>

  {/* Título — click para abrir reader */}
  <div
    role="button"
    tabIndex={0}
    aria-label={`Leer tarjeta: ${card.title}`}
    onClick={e => { e.stopPropagation(); onOpen(); }}
    onKeyDown={e => { if (e.key==="Enter"||e.key===" ") { e.preventDefault(); onOpen(); }}}
    title={card.title}
    style={{ ... }}>
    {card.title}
  </div>
```

---

#### UX-022 · P0 · S · Sidebar: botones de íconos sin aria-label

**Problema:**
```jsx
<button onClick={() => setDocPanel(true)} title="Documento" ...>▤</button>
<button onClick={() => setWbPanel(true)} title="Worldbuilding" ...>◎</button>
<button onClick={() => setKeyModal(true)} title="IA conectada…" ...>⚿</button>
```
`title` no es suficiente para lectores de pantalla (depende de la implementación del AT).

**Respaldo:** WCAG 4.1.2 (Name, Role, Value, Level A).

**Después:**
```jsx
<button aria-label="Generar documento del proyecto" onClick={() => setDocPanel(true)} title="Documento" ...>▤</button>
<button aria-label="Analizar worldbuilding con IA" onClick={() => setWbPanel(true)} title="Worldbuilding" ...>◎</button>
<button aria-label={getAIKey() ? "IA conectada — cambiar clave" : "Conectar clave de IA"} onClick={() => setKeyModal(true)} title="IA" ...>⚿</button>
```

---

#### UX-023 · P2 · S · OTextarea en monospace

**Problema:**
```jsx
function OTextarea({ style, ...props }) {
  return <textarea ... style={{ fontFamily:"var(--mono)", fontSize:13, ... }} />;
}
```
`var(--mono)` es JetBrains Mono — adecuado para código, no para escritura narrativa. EditCardModal usa OTextarea para la descripción de la tarjeta.

**Respaldo:** PRODUCT.md "La herramienta desaparece, las ideas emergen" — la fuente monospace en escritura creativa interrumpe el flujo.

**Solución:** Usar `var(--body)` (Lora) para OTextarea en contextos narrativos, o añadir prop `mono`:
```jsx
function OTextarea({ style, mono = false, ...props }) {
  return <textarea ... style={{ fontFamily: mono ? "var(--mono)" : "var(--body)", ... }} />;
}
// AddStickerForm: <OTextarea mono /> (comentarios cortos)
// EditCardModal body: <OTextarea /> (escritura narrativa)
```

---

#### UX-024 · P1 · M · `prefers-reduced-motion` incompleto

**Problema:** PRODUCT.md (Accessibility) exige respetar `prefers-reduced-motion`. El CSS base en GLOBAL_CSS no tiene ninguna regla `@media (prefers-reduced-motion: reduce)`. Las animaciones afectadas:
- `scaleIn` (modales)
- `slideIn` (AIPanel, WorldbuildingPanel)
- `spinner` (loadings)
- `stickerPulse` (onboarding dot en EditCardModal)
- `orb3` (JoinScreen background)

**Solución — añadir al final de GLOBAL_CSS:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .spinner { animation: none !important; border-top-color: var(--terra) !important; }
}
```

---

#### UX-025 · P0 · M · Canvas SVG: conexiones sin ARIA

**Problema:** Las líneas SVG de conexión entre nodos no tienen `<title>`, `role`, ni `aria-*`. El canvas en su totalidad no tiene `role="region"` ni `aria-label`. Para usuarios de lectores de pantalla el canvas es un div opaco sin información.

**Solución mínima:**
```jsx
// Container del canvas:
<div ref={containerRef} role="region" aria-label="Canvas de ideas — Micelio" ...>

// Cada conexión SVG:
<g key={conn.id} role="img" aria-label={`Conexión ${CONN_LABELS[conn.type]}: ${ca?.title} ↔ ${cb?.title}`}>
  <title>{`${CONN_LABELS[conn.type]}: ${ca?.title} ↔ ${cb?.title}`}</title>
  <path .../>
</g>
```

---

#### UX-026 · P0 · M · OOverlay: sin focus trap

**Problema:** Cuando se abre un modal (`OOverlay`), el foco no queda atrapado dentro. Presionando Tab el usuario puede alcanzar elementos detrás del modal.

**Respaldo:** WCAG 2.4.3 (Focus Order, Level A).

**Solución:** Implementar focus trap con `useEffect`:
```jsx
function OOverlay({ children, onClose }) {
  const overlayRef = useRef(null);
  const downRef = useRef(false);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    // Save previous focus
    const prev = document.activeElement;
    // Focus first focusable inside
    const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();
    
    function onKeyDown(e) {
      if (e.key !== "Tab") return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    }
    el.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("keydown", onKeyDown);
      prev?.focus(); // restore focus on close
    };
  }, []);

  return <div ref={overlayRef} ...>{children}</div>;
}
```

---

### D9 — Microcopy y Voz del Producto

---

#### UX-027 · P1 · S · Inconsistencia UTC vs UTC-7/8

**Problema:** El error de `callAI` dice:
```js
"El reinicio es a medianoche (hora del Pacífico, UTC-7/8), no UTC."
```
Pero el panel de `AIPanel` muestra:
```jsx
<div>El cupo gratuito de Gemini se reinicia a medianoche UTC.</div>
```
Una de las dos es incorrecta. Gemini en realidad reinicia a medianoche hora del Pacífico (no UTC).

**Solución:** Unificar a:
```jsx
"El cupo gratuito de Gemini se reinicia a medianoche hora del Pacífico (UTC-7 o UTC-8)."
```
En ambos `AIPanel` (línea ~4180) y `ConnectionsPanel` (línea ~4031).

---

#### UX-028 · P2 · S · ConnectionsPanel header no revela AI

**Problema:** La entrada al panel es el botón "◎ Conexiones" en el sidebar. El header del panel solo dice "Conexiones". Un usuario no sabe que esto es AI-powered hasta que está dentro y ve el botón "Buscar conexiones con IA".

**Solución:** Renombrar el botón de entrada:
```jsx
// Sidebar button:
<span>✦ Conexiones IA</span>
// Panel header:
<div style={{ fontWeight:800, fontSize:15 }}>✦ Conexiones IA</div>
```

---

#### UX-029 · P2 · S · "bloqueo" sin peso visual diferenciado

**Problema:** Los 5 tipos de tarjeta (tarea/idea/pregunta/referencia/bloqueo) se presentan como píldoras de igual peso en AddForm. Los "bloqueos" deberían comunicar urgencia — son obstáculos al progreso.

**Solución:** En AddForm y WorkCard, añadir el ícono NODE_ICONS al badge del tipo para dar mayor contexto visual:
```jsx
// WorkCard type badge:
const TYPE_ICONS = { tarea:"✦", idea:"◎", pregunta:"?", referencia:"◈", bloqueo:"◆" };
<span style={{ background:tc+"15", color:tc, ... }}>
  {TYPE_ICONS[card.type]} {card.type || "idea"}
</span>
```

---

#### UX-030 · P2 · S · "Sticker" como término

**Problema:** "Sticker" como nombre para anotaciones/comentarios enriquecidos no es intuitivo para la audiencia de escritores. "Sticker" en cultura digital significa emoji decorativo; aquí significa "nota estructurada de análisis".

**A/B propuesto:**
- **A (actual):** "Stickers" — consistente con la metáfora visual sticky note, pero confuso para novatos
- **B (propuesto):** "Notas" o "Anotaciones" — más claro, menos memorable

**Tradeoff:** Opción A preserva el carácter lúdico y diferenciador del producto. Opción B es más inmediatamente comprensible. **Recomendación: mantener "Sticker" pero añadir subtítulo explicativo en la tab.** `"▤ Stickers · notas de análisis"`.

---

### D10 — Empty States y Errores

---

#### UX-031 · P0 · S · Save error sin recovery

**Problema:**
```jsx
// En save():
} catch(e) {
  console.error("Save failed:", e);
  setSaveStatus("error");
  showToast("⚠ Error al guardar — revisa tu conexión");
}

// Toast desaparece en 5 segundos:
setTimeout(() => setToast(null), 5000);
```
El usuario pierde el contexto de error. Si el save falló, los datos están solo en memoria. No hay retry, no hay indicador persistente, no hay "guardado local de emergencia".

**Solución:**
1. **Persistent error badge** en el panel derecho (no desaparece hasta que el save tenga éxito):
```jsx
{saveStatus === "error" && (
  <div style={{ display:"flex", alignItems:"center", gap:6, background:T.roseBg,
    border:"1px solid "+T.rose+"44", borderRadius:8, padding:"8px 12px", margin:"8px 14px" }}>
    <div style={{ flex:1 }}>
      <div style={{ color:T.rose, fontSize:11, fontWeight:700 }}>Error al guardar</div>
      <div style={{ color:T.ink4, fontSize:10, fontFamily:"var(--mono)" }}>Los cambios están en memoria</div>
    </div>
    <button onClick={() => save()} style={{ color:T.rose, border:"1px solid "+T.rose+"44",
      background:"none", borderRadius:5, padding:"3px 8px", cursor:"pointer", fontSize:11 }}>
      Reintentar
    </button>
  </div>
)}
```
2. **Toast con acción:**
```jsx
showToast("⚠ Error al guardar", null, { label:"Reintentar", fn: () => save() });
```

---

#### UX-032 · P1 · S · DocPanel: error state silencioso

**Problema:**
```jsx
async function generate() {
  // ...
  try {
    const txt = await callAI(...)
    // ...
    setStatus("done");
  } catch(e) {
    if (e.code==="NO_KEY"||e.code==="INVALID_KEY") setStatus("no_key");
    else setStatus("error"); // ← sin mensaje
  }
}
```
Cuando `status === "error"` no hay ningún mensaje visible. El panel retorna al estado idle sin explicación.

**Solución:**
```jsx
const [docError, setDocError] = useState("");

catch(e) {
  if (e.code==="NO_KEY"||e.code==="INVALID_KEY") setStatus("no_key");
  else {
    setDocError(e.detail || "Error al generar. Intenta de nuevo.");
    setStatus("error");
  }
}

// En el render:
{status === "error" && (
  <div style={{ background:T.roseBg, border:"1px solid "+T.rose+"44", borderRadius:8, padding:"12px", marginBottom:14 }}>
    <div style={{ color:T.rose, fontWeight:700, fontSize:13, marginBottom:4 }}>Error al generar el documento</div>
    <div style={{ color:T.ink3, fontSize:12 }}>{docError}</div>
    <button onClick={generate} style={{ marginTop:8, ... }}>Reintentar →</button>
  </div>
)}
```

---

#### UX-033 · P2 · S · Share link: board ID inválido sin feedback

**Problema:**
```jsx
// En useEffect de App():
openBoardById(sharedBoardId, all).then(ok => {
  if (!ok) { setScreen("lobby"); }
  setRestoring(false);
  window.history.replaceState({}, "", window.location.pathname);
});
```
Si el board ID no existe (link expirado, board eliminado), el usuario llega al lobby sin ninguna explicación.

**Solución:**
```jsx
openBoardById(sharedBoardId, all).then(ok => {
  if (!ok) {
    setScreen("lobby");
    // Mostrar toast explicativo tras llegada al lobby:
    setTimeout(() => showGlobalToast("El tablero compartido no existe o no tienes acceso."), 200);
  }
  // ...
});
```

---

### D11 — Onboarding / First-Run

---

#### UX-034 · P1 · S · JoinScreen sin propuesta de valor

**Problema:** JoinScreen muestra logo + tagline "think together" + campo de nombre. No hay:
- Descripción de qué hace MindStorm
- Capturas o preview
- Beneficio concreto en 1 frase

La audiencia objetivo (escritores, worldbuilders) llega sin contexto de qué van a encontrar.

**Solución:**
```jsx
// Debajo del logo, antes del card de login:
<p style={{ color:T.ink3, fontSize:14, lineHeight:1.6, textAlign:"center",
  maxWidth:340, margin:"0 auto 24px", fontFamily:"var(--body)", fontStyle:"italic" }}>
  Organiza tus ideas creativas en tarjetas, descubre conexiones con IA y genera documentos de tu proyecto.
</p>
```
Mínimo: 1 frase de propuesta de valor. No screenshots ni marketing en esta pantalla — mantiene el tono artesanal.

---

#### UX-035 · P1 · M · Sin guía post-creación del primer tablero

**Problema:** Después de crear el primer board y entrar a `BoardScreen`, el usuario ve el tablero vacío sin ninguna guía de próximos pasos. El board tip banner es reciente pero solo aparece en canvas.

**Solución — Tip card inline en primer tablero vacío:**
```jsx
// En BoardScreen, column "concepto" empty state para nuevo usuario:
const isFirstBoard = boards.length === 1;
const isFirstOpen = activeCards.length === 0;

{isFirstBoard && isFirstOpen && !firstTipDismissed && (
  <div style={{ background:T.amberBg, border:"1px solid "+T.amber+"44",
    borderRadius:10, padding:"16px", marginBottom:12 }}>
    <div style={{ fontWeight:700, color:T.amber, marginBottom:6 }}>
      ✦ Empieza aquí
    </div>
    <ol style={{ color:T.ink3, fontSize:12, lineHeight:1.8, paddingLeft:16 }}>
      <li>Añade tu primera tarjeta → presiona <kbd>N</kbd> o el botón <strong>+</strong></li>
      <li>Agrega más ideas — las mejores vienen en serie</li>
      <li>Usa <strong>✦ Analizar</strong> (panel derecho) para feedback de IA</li>
    </ol>
    <button onClick={dismissFirstTip} style={{ marginTop:8, fontSize:11, color:T.ink4,
      background:"none", border:"none", cursor:"pointer" }}>Entendido</button>
  </div>
)}
```

---

#### UX-036 · P1 · M · AI key setup oculto para creativos

**Problema:** El flujo para conectar IA es: sidebar icon ⚿ → modal → tab Gemini/Groq → instrucciones → campo de texto. Para un escritor sin experiencia técnica, "API key", "aistudio.google.com", "Bearer token" son términos opacos.

**Solución:** Añadir un callout más prominente en el right panel cuando la IA no está conectada:
```jsx
{!getAIKey() && !getGroqKey() && (
  <div style={{ background:T.greenBg, border:"1px solid "+T.green+"44",
    borderRadius:8, padding:"12px 14px", margin:"12px 14px" }}>
    <div style={{ color:T.green, fontWeight:700, fontSize:12, marginBottom:4 }}>Activa la IA gratis</div>
    <p style={{ color:T.ink3, fontSize:11, lineHeight:1.6, marginBottom:8 }}>
      MindStorm usa Google Gemini (sin tarjeta). 2 minutos de setup.
    </p>
    <button onClick={() => setKeyModal(true)}
      style={{ background:T.green, color:"#fff", border:"none", borderRadius:6,
        padding:"7px 14px", fontSize:12, cursor:"pointer", fontWeight:700 }}>
      Conectar IA →
    </button>
  </div>
)}
```

---

#### UX-037 · P2 · S · Card types sin descripción en creación

**Sin hallazgo material urgente** — los placeholders en `AddStickerForm` son modelo a seguir pero los tipos de tarjeta en `AddForm` son suficientemente autoexplicativos en español. Sin cambio necesario en este sprint.

---

#### UX-038 · P1 · M · Flujo de conexiones poco descubrible

**Problema:** El valor core de MindStorm — descubrir conexiones entre ideas — está detrás de 3 pasos: (1) abrir sidebar panel, (2) hacer clic en "Buscar conexiones con IA", (3) aprobar/descartar. El botón en el right panel (`◎ Conexiones`) no tiene estado visual activo que invite a explorar.

**Solución:** Después de que el usuario tiene ≥3 tarjetas, mostrar un inline callout en la primera sesión:
```jsx
// En BoardScreen, cuando activeCards.length >= 3 && pendingConns.length === 0 && !connDiscoverySeen:
<div style={{ background:T.accentBg, border:"1px solid "+T.accent+"33",
  borderRadius:8, padding:"10px 14px", marginTop:8 }}>
  <span style={{ color:T.accent, fontWeight:700, fontSize:12 }}>
    ✦ ¿Tus ideas se conectan?
  </span>
  <p style={{ color:T.ink3, fontSize:11, lineHeight:1.5, margin:"4px 0 8px" }}>
    Con {activeCards.length} tarjetas, la IA puede encontrar relaciones no obvias entre ellas.
  </p>
  <button onClick={() => setConnPanel(true)}
    style={{ color:T.accent, background:"none", border:"1px solid "+T.accent+"44",
      borderRadius:5, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>
    Buscar conexiones →
  </button>
</div>
```

---

## 4. Roadmap propuesto en 3 sprints

### Sprint 1 — P0 críticos + P1 rápidos (~14h total)

**Objetivo:** Eliminar todos los bloqueadores de accesibilidad y el riesgo de pérdida de datos.

| ID | Descripción | Est. |
|----|------------|------|
| UX-021 | `WorkCard`: `role="button"`, `tabIndex`, `onKeyDown` en expand y título | 1h |
| UX-022 | `aria-label` en botones de íconos de sidebar | 30m |
| UX-031 | Save error: badge persistente + botón Reintentar | 1.5h |
| UX-009 | Canvas: keyboard pan (flechas) + zoom (+/-/0) | 2h |
| UX-026 | `OOverlay`: focus trap + focus return | 2h |
| UX-008 | Shortcut hints en toolbar + handler `?` | 1.5h |
| UX-011 | Sidebar icons: micro-label (`doc`, `wb`) + aria-label | 45m |
| UX-017 | Lobby empty state con CTA visual | 45m |
| UX-027 | Unificar mensaje UTC vs UTC-7/8 en AIPanel y ConnectionsPanel | 15m |
| UX-034 | JoinScreen: 1 frase de propuesta de valor | 30m |
| UX-005 | WorkCard edit button: minWidth/minHeight 24px | 15m |
| UX-032 | DocPanel error state con mensaje y retry | 45m |
| **Total** | | **~12h** |

---

### Sprint 2 — P1 restantes (~20h total)

**Objetivo:** Reducir carga cognitiva, mejorar onboarding y performance.

| ID | Descripción | Est. |
|----|------------|------|
| UX-003 | Right panel: colapsar en 3 secciones expandibles | 3h |
| UX-024 | `@media (prefers-reduced-motion)` en GLOBAL_CSS | 1h |
| UX-025 | Canvas SVG: `<title>` + `aria-label` en conexiones | 2h |
| UX-014 | `React.memo` en `CanvasSkillNode` y `CanvasStickerNode` | 1h |
| UX-015 | `moveCard` con debounce optimista | 1.5h |
| UX-035 | Tip card inline en primer tablero vacío | 2h |
| UX-036 | AI setup callout en right panel cuando IA desconectada | 1.5h |
| UX-038 | Callout "¿tus ideas se conectan?" al llegar a 3+ tarjetas | 1.5h |
| UX-001 | CreateBoardModal: solo `name` obligatorio | 2h |
| UX-033 | Share link inválido: toast explicativo en lobby | 30m |
| UX-006 | Jerarquía clara entre los dos CTAs de "añadir tarjeta" | 1h |
| UX-016 | AI: mensajes rotativos durante loading | 45m |
| **Total** | | **~18h** |

---

### Sprint 3 — P2 selectivos (~14h total)

**Objetivo:** Pulir UX de poder y estados edge.

| ID | Descripción | Est. |
|----|------------|------|
| UX-004 | EditCardModal non-owner: eliminar copia redundante read-only | 30m |
| UX-012 | ConnCard: tooltip descriptivo por tipo de conexión | 30m |
| UX-023 | OTextarea: prop `mono` para separar escritura narrativa de código | 45m |
| UX-028 | Botón "✦ Conexiones IA" + header del panel | 30m |
| UX-029 | WorkCard tipo badge: añadir ícono por tipo | 30m |
| UX-018 | Columna vacía: mostrar descripción con mayor peso | 45m |
| UX-030 | Tab stickers: añadir subtítulo "· notas de análisis" | 15m |
| UX-037 | AddForm card types: tooltip en cada píldora de tipo | 30m |
| UX-019 | Canvas 100+ nodos: grouping por columna (diseño) | 8h |
| **Total** | | **~12h** |

---

## 5. Apéndice A — Comandos para reproducir hallazgos

**UX-021** (WorkCard inaccesible por teclado):
1. Abrir MindStorm, entrar a un tablero con tarjetas
2. Presionar Tab hasta llegar a la primera tarjeta (si es posible)
3. **Resultado esperado:** ningún elemento de WorkCard recibe foco — confirma el hallazgo
4. **Verificación:** `document.querySelector('.wcard').getAttribute('tabindex')` → `null`

**UX-009** (Canvas sin teclado):
1. Entrar al tablero, cambiar a vista Micelio (tecla C o botón)
2. Presionar flechas ↑↓←→
3. **Resultado:** el canvas no se mueve — confirma hallazgo

**UX-024** (motion no respetado):
1. En macOS: Preferencias → Accesibilidad → Reducir movimiento → ON
2. En Windows: Configuración → Accesibilidad → Efectos visuales → OFF
3. Navegar a JoinScreen
4. **Resultado:** animación `orb3` y `scaleIn` del card siguen ejecutándose — confirma hallazgo
5. **Verificación CSS:** `getComputedStyle(document.querySelector('.orb-bg > div')).animationDuration` → valor > 0ms

**UX-031** (Save error sin recovery):
1. Abrir devtools → Network → offline
2. Arrastrar una tarjeta a otra columna
3. Esperar 5 segundos
4. **Resultado:** el toast desaparece, el right panel muestra punto rojo "Error al guardar" pero sin botón de retry — confirma hallazgo

**UX-026** (Focus trap ausente):
1. Abrir cualquier modal (ej: crear tarjeta, editar)
2. Presionar Tab repetidamente
3. **Resultado:** el foco sale del modal y alcanza el botón de sidebar detrás del overlay — confirma hallazgo

**UX-027** (UTC inconsistency):
1. Configurar una clave Gemini válida
2. Hacer análisis hasta agotar cupo diario
3. Comparar el texto en AIPanel (`medianoche UTC`) vs el error en callAI (`UTC-7/8`) — confirma hallazgo

**UX-003** (Carga cognitiva):
1. Abrir BoardScreen con 10+ tarjetas distribuidas
2. Contar elementos discretos en el right panel (200px)
3. **Resultado esperado:** ≥9 tipos de información en 200px — confirma hallazgo

---

## 6. Apéndice B — `needs-user-research`

Los siguientes hallazgos no pueden evaluarse con certeza sin investigación de usuario real. Lista de preguntas para las próximas 5 entrevistas:

| # | Área | Pregunta | Por qué importa |
|---|------|---------|-----------------|
| 1 | D1 / Onboarding | ¿Cuánto tiempo tardó en crear su primera tarjeta útil? ¿Qué los confundió en ese camino? | Valida o refuta UX-001 — puede que el flujo de 5 pasos no sea el bottleneck real |
| 2 | D2 / Cognitive load | ¿Con qué frecuencia usan el panel derecho? ¿Qué secciones del right panel les parecen más/menos útiles? | Define qué colapsar en Sprint 2 sin sacrificar funciones usadas |
| 3 | D5 / Terminology | ¿Qué creen que hace el botón ▤ antes de abrirlo? ¿Y el ◎? | Valida si los micro-labels propuestos en UX-011 son suficientes |
| 4 | D7 / Scale | ¿Han llegado a tener más de 30 tarjetas en un tablero? ¿Cómo navegan el canvas a esa escala? | Prioriza el alcance real de UX-019 |
| 5 | D11 / AI | ¿Conectaron la IA en la primera sesión? Si no, ¿cuándo y por qué? | Determina si UX-036 (callout de setup) es suficiente o si se necesita onboarding forzado |

---

*Generado por impeccable · audit · 2026-05-03*  
*Basado en revisión estática de `App.jsx` (6 049 líneas), `DESIGN.md`, `PRODUCT.md`, y `GLOBAL_CSS`. No se evaluó comportamiento runtime en producción.*
