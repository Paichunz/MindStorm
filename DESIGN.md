---
name: MindStorm
description: Tablero creativo colaborativo — Kanban + canvas Mycelium + IA para equipos creativos
colors:
  paper: "#EFEBE3"
  paper-2: "#E5E0D5"
  paper-3: "#D8D2C5"
  card-white: "#FFFFFF"
  card-soft: "#FAF7F0"
  card-border: "#EAE5DA"
  ink-0: "#1A1814"
  ink-1: "#3A352D"
  ink-2: "#6A6258"
  ink-3: "#9A9286"
  ink-4: "#C8C1B3"
  neon: "#E8F062"
  neon-soft: "#F2F4C8"
  terra: "#C97D5C"
  terra-soft: "#F0DDD2"
  olive: "#7A8A4F"
  olive-soft: "#DCE2C8"
  sky: "#6B91B3"
  sky-soft: "#D5DFE8"
  line: "#2A2620"
  line-soft: "#C0B8A8"
typography:
  display:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontStyle: "italic"
  title:
    fontFamily: "'Fraunces', Georgia, serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
    fontStyle: "italic"
  body:
    fontFamily: "'Quicksand', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "'Quicksand', system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.06em"
rounded:
  sm: "10px"
  md: "16px"
  lg: "22px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.line}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-ghost:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    typography: "{typography.body}"
  button-ghost-active:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  card-canvas:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-0}"
    rounded: "{rounded.md}"
    padding: "0"
    width: "250px"
  card-kanban:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-0}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
---

# Design System: MindStorm

## 1. Overview

**Creative North Star: "El Puente de Mando"**

MindStorm es una herramienta seria diseñada por y para creativos. No es un cuaderno de notas con stickers, no es un dashboard corporativo, no es una pizarra lúdica. Es el puente de una nave diseñada por artistas: cada control tiene intención, cada espacio respira, cada conexión entre ideas deja una marca visible.

El sistema visual habla de papel de bitácora sobre una mesa de trabajo real. El cream no es decorativo, es el contexto físico. Las tarjetas flotan como fichas de papel blanco sobre ese fondo. La tinta es oscura y directa. El amarillo neón, cuando aparece, lo hace como una señal inequívoca: algo aquí importa, algo aquí está aprobado, algo aquí está vivo.

La tipografía mezcla intencionalmente dos mundos: Fraunces italic para los títulos de las ideas (lo que los creativos crean) y Quicksand para la interfaz (lo que la herramienta ofrece). Esta dualidad hace que el contenido del usuario se destaque sobre los controles del sistema, sin que la herramienta compita visualmente con las ideas que alberga.

**Key Characteristics:**
- Papel cream como contexto físico, no como color de moda
- Tarjetas blancas flotando sobre el fondo con sombras dobles de papel
- Fraunces italic como firma visual de los títulos de ideas
- Amarillo neón disciplinado: solo en conexiones aprobadas y estados activos
- Conexiones orgánicas con dots negros sólidos, nunca líneas invisibles
- Grilla de puntos tenue como referencia n8n, no como decoración

## 2. Colors: La Paleta del Cuaderno

El sistema es deliberadamente restringido. El cream y las tintas oscuras cubren el 90% de la superficie. Los colores de estado (terra, olive, sky) aparecen como información, nunca como decoración. El neón aparece como pulso.

### Primary
- **Tinta Negra** (`#1A1814`): El color de los botones primarios, el hover de acciones críticas, y los endpoint dots de conexión. Equivale al `--noir` del sistema. Tan cerca del negro como se puede sin serlo.
- **Neón Eléctrico** (`#E8F062`): El único acento saturado. Aparece en midpoint dots de conexiones aprobadas, estados activos de navegación, y checkmarks de completado. Su presencia constante pero disciplinada lo hace legible como sistema de señales.

### Secondary
- **Terracota** (`#C97D5C`): Estado de error, acción destructiva, objeción. Apagado y papeloso, nunca alarmista.
- **Oliva** (`#7A8A4F`): Aprobación secundaria, stickers de complemento. Verde tierra, no tech.
- **Azul Polvo** (`#6B91B3`): Información, referencias, preguntas. Desaturado, como tinta de bolígrafo azul.

### Neutral
- **Papel Cream** (`#EFEBE3`): Fondo de toda la app. La superficie de trabajo.
- **Papel Cream 2** (`#E5E0D5`): Paneles secundarios, chips inactivos, fondo hover.
- **Papel Cream 3** (`#D8D2C5`): Divisores, bordes de scrollbar. La línea que se ve pero no molesta.
- **Blanco Card** (`#FFFFFF`): Superficie de cada tarjeta, input, pill navegable.
- **Tinta Principal** (`#1A1814`): Texto de mayor jerarquía.
- **Tinta Secundaria** (`#3A352D`): Cuerpo de texto en cards expandidas.
- **Tinta Terciaria** (`#6A6258`): Texto de apoyo, labels de datos.
- **Tinta Meta** (`#9A9286`): Timestamps, autores, meta. Visible pero no compite.
- **Tinta Placeholder** (`#C8C1B3`): Bordes sutiles, placeholders de input.
- **Línea de Conexión** (`#2A2620`): Todas las líneas del canvas Mycelium. Un tono más cálido que ink-0 para que las conexiones pertenezcan al papel.

### Named Rules
**La Regla del Pulso.** El neón (`#E8F062`) es un sistema de señales, no un color de marca. Aparece en el midpoint de cada conexión aprobada y en los estados activos de navegación. Su constancia controlada lo hace confiable; su saturación lo hace inconfundible. Prohibido como fondo de página, columna, hero o botón primario.

**La Regla de la Tinta.** No hay naranja. No hay violeta. No hay gradientes de color. Los únicos saturados son neón (señal), terra (error), olive (aprobación) y sky (información), todos apagados y papelosos. Cualquier propuesta de color nuevo debe pasar por el filtro: ¿se parece a tinta sobre papel? Si no, no pertenece.

## 3. Typography: Tinta Italic

**Display/Title Font:** Fraunces (con Georgia, serif de fallback) — siempre italic
**Body Font:** Quicksand (con system-ui de fallback)
**Mono Font:** JetBrains Mono (para timestamps, datos, HUD)

**Character:** Fraunces italic es la escritura a mano del sistema — orgánica, con personalidad, no neutral. Quicksand es el tipo de letra de la interfaz — redondeado, legible, sin pretensiones. La combinación dice: las ideas tienen voz propia; la herramienta se hace a un lado.

### Hierarchy
- **Display** (Fraunces italic 400, 36px, lh 1.1, ls -0.02em): Títulos de pantalla, nombre del proyecto en la topbar. Solo cuando la idea necesita ser la protagonista.
- **Title** (Fraunces italic 500, 14px, lh 1.3, ls -0.01em): Títulos de tarjetas en el canvas Mycelium. El más visto; define la identidad visual del canvas.
- **Body** (Quicksand 500, 13px, lh 1.6): Cuerpo de texto en cards expandidas, descripciones, paneles. Máx. 65ch de ancho.
- **Label** (Quicksand 600, 10px, ls 0.14em, UPPERCASE): Etiquetas de columna, section headers, contadores. El uppercase no es un default, es una distinción de escala.
- **Mono** (JetBrains Mono 500, 10px, ls 0.06em): Timestamps, datos del HUD (ZOOM · 100%), usernames. Datos, no prosa.

### Named Rules
**La Regla de la Doble Voz.** Los títulos de *lo que el usuario crea* (tarjetas, proyectos, ideas) van en Fraunces italic. Todo lo que *pertenece a la herramienta* (botones, labels, HUD) va en Quicksand. No mezclar en el mismo elemento. Esta distinción hace posible que la herramienta desaparezca.

**La Regla del Italic Obligatorio.** Fraunces sin italic pierde su personalidad. No hay uso de Fraunces en estilo normal en este sistema. Si la fuente está en roman, usar Quicksand en su lugar.

## 4. Elevation: Papel sobre Papel

El sistema usa sombras que imitan capas de papel físico: una línea hairline en la parte superior (el borde del papel debajo) más una difusión suave que aumenta con la altura. No hay sombras de color. No hay blur exagerado. El origen de luz es siempre arriba.

### Shadow Vocabulary
- **Nivel 1 — Reposo** (`0 1px 0 rgba(58,50,38,0.06), 0 2px 8px rgba(58,50,38,0.06)`): Estado base de cards, pills, inputs. La card "descansa" sobre el papel cream.
- **Nivel 2 — Hover / Panel** (`0 1px 0 rgba(58,50,38,0.08), 0 8px 24px rgba(58,50,38,0.08)`): Hover de cards, paneles laterales. La card "se levanta" al interactuar.
- **Nivel 3 — Modal / Drag** (`0 2px 0 rgba(58,50,38,0.10), 0 16px 40px rgba(58,50,38,0.12)`): Modales, card en estado drag-activo, card expandida en canvas. El papel más arriba en la pila.

### Named Rules
**La Regla del Papel sobre Papel.** Cada sombra tiene dos capas: hairline arriba + difusa abajo. La hairline simula el borde de la hoja debajo. La difusa simula la distancia al fondo. Sin hairline, la card flota sin contexto. Sin difusa, no hay profundidad. Las dos capas siempre van juntas.

**La Regla del Color Neutro.** Las sombras no tienen color de marca. El tono cálido (`rgba(58,50,38,...)`) es papel viejo, no tinta naranja ni glow de acento. Prohibido: `box-shadow` con el neon, terra, olive o sky como color.

## 5. Components

### Buttons

Pills navegables: la forma vertebral del sistema. Cualquier control horizontal vive dentro de una pill blanca con sombra.

- **Shape:** Completamente redondeada (999px — pill), nunca rectangular.
- **Primary (Noir):** Fondo `#1A1814` (ink-0), texto `#EFEBE3` (paper). Padding 10px 24px. Una sola por panel. Representa la acción principal, sin ambigüedad.
- **Primary Hover:** Fondo `#2A2620` (noir-2), `translateY(-1px)`.
- **Ghost / HUD Pill:** Fondo `#FFFFFF` (card-white), texto `ink-2`, borde `card-border`, `shadow-1`. Hover: `shadow-2` + `translateY(-1px)`. El estado por defecto de todos los controles navegables.
- **Ghost Active:** Fondo `#1A1814` (noir), texto `paper`. El cambio de pill blanca a pill negra señala el estado activo sin requerir color de acento.
- **Neon:** Fondo `#E8F062`, texto `#1A1814`. Solo para "aprobar conexión" y "completar onboarding". Máximo una por pantalla en cualquier momento.

### Cards — Canvas Mycelium (mcard)

La tarjeta flotante del canvas. Superficie de papel blanco sobre el fondo cream.

- **Shape:** 16px radius (`--r-md`). Dimensión base: 250px ancho; expandida: 300px.
- **Background:** `#FFFFFF` (card-white), borde `card-border` (`rgba(58,50,38,0.08)`).
- **Shadow:** `shadow-1` en reposo, `shadow-3` expandida.
- **Header:** Fraunces italic 500, 14px, `ink-0`. Glyph de estado (`▸` / `◢`) en `ink-3`. Dot de categoría (7px, color del column) en el extremo derecho.
- **Body expandido:** Quicksand 500, 12px, `ink-1`. Tags como pills con borde `paper-3`. Meta (autor, tiempo) en JetBrains Mono `ink-3`.
- **Hover:** `shadow-2` + `translateY(-1px)`. Sin cambio de borde.
- **Drag:** Cursor grab; `shadow-3` durante el arrastre.

### Cards — Kanban (wcard / tile)

- **Shape:** Misma familia (`--r-md`), sin left-border accent.
- **Background:** `#FFFFFF`, `shadow-1`, borde `card-border`.
- **Hover:** `shadow-2` + `translateY(-1px)`. Fondo permanece blanco.

### Inputs / Fields

- **Style:** Fondo `#FFFFFF`, borde 1.5px `paper-3`, radius `--r-md` (16px).
- **Focus:** Border-color cambia a `ink-2`; halo `0 0 0 4px rgba(58,50,38,0.06)` — cream neutro, sin color de acento.
- **Autofill:** Override activo para que Chrome no imponga fondo azul. Usa `card-white` de fondo.

### Conexiones (Firma del Sistema)

El componente más distintivo de MindStorm. Define visualmente que esto es un canvas de ideas conectadas, no un tablero de tareas.

- **Curva:** Bezier cúbico horizontal (`C` path). Los puntos de control crean una S-suave que da organicidad sin caer en el caos.
- **Línea:** `stroke: var(--line)` (`#2A2620`), `strokeWidth: 1.4`. No semántica, siempre tinta oscura.
- **Endpoint dots:** Círculos negros sólidos (`r=3.5`, `fill: var(--noir)`). Siempre presentes. Son la puntuación del sistema.
- **Midpoint neon dot:** `r=4`, `fill: var(--neon)` (#E8F062), `stroke: var(--noir)` con `strokeWidth: 1`. Marca cada conexión aprobada. El pulso del canvas.
- **Label de tipo:** Quicksand 600, 8px, `ink-3`, sobre el midpoint. Legible pero no dominante.
- **Sticker strings:** `line-soft` punteado (`4 4`), con dot noir en el endpoint del card y dot color-categoría en el endpoint del sticker.

### HUD Canvas

Toolbar flotante del canvas (esquina superior izquierda + inferior derecha).

- **Contenedor:** Pills blancas sueltas, no barra. Cada botón es un `hud-btn` independiente.
- **Activo:** La pill activa cambia a pill negra (`hud-btn-active`). No hay línea underline, no hay borde de color.
- **Info widget (zoom):** Fondo `paper` (`bgPanel`), borde `paper-3`, mono 10px, `ink-3`. Sin backdrop-filter agresivo.

## 6. Do's and Don'ts

### Do:
- **Do** usar Fraunces italic para cualquier texto que represente una idea del usuario (títulos de cards, títulos de proyectos). Es la voz del contenido.
- **Do** usar el amarillo neón (`#E8F062`) solo como señal de estado activo o conexión aprobada. Su pulso constante pero disciplinado es lo que lo hace útil como sistema.
- **Do** mantener las dos capas en cada sombra: hairline (`0 1px 0`) + difusa (`0 Xpx Ypx`). Separar las capas rompe la ilusión de papel.
- **Do** usar endpoint dots negros (`fill: var(--noir)`) en todas las conexiones del canvas, sin excepción. Son la puntuación visual del grafo.
- **Do** mantener las pills como el contenedor por defecto de controles navegables. Pill blanca + shadow-1 en reposo; pill negra en activo.
- **Do** dejar que el canvas respire. El fondo cream con grilla de puntos tenue es el protagonista cuando no hay tarjetas.
- **Do** usar los colores de estado (terra, olive, sky) solo para información: errores, aprobaciones, referencias. Nunca para decorar.

### Don't:
- **Don't** usar Notion, ClickUp ni Linear como referencia visual. Son herramientas genéricas para gestores de proyecto; MindStorm es para creativos. La diferencia debe ser inmediatamente perceptible.
- **Don't** usar gradientes de purple, fondo blanco puro (#FFFFFF como fondo de página), Inter font, ni el patrón de tarjetas idénticas con icon+heading+text en grid. Este es el "template SaaS de 2021" que PRODUCT.md prohíbe explícitamente.
- **Don't** imitar Miro o FigJam: sin stickers de colores sólidos, sin herramientas de dibujo a mano, sin lienzos que parezcan cuadernos de notas infantiles. MindStorm tiene estética de estudio profesional.
- **Don't** usar Fraunces en estilo normal (roman). Si la fuente no está en italic, no es Fraunces; usar Quicksand.
- **Don't** poner sombras con color de acento (neon, terra, sky). Las sombras son siempre `rgba(58,50,38,...)` — papel envejecido.
- **Don't** usar `border-left` mayor a 1px como stripe de color en cards o list items. El tipo de tarjeta se comunica con el dot de categoría en el header, no con una barra lateral.
- **Don't** usar el neón como fondo de página, columna, hero, botón primario habitual, ni acento decorativo. Si el amarillo aparece más de dos veces en una pantalla sin representar estados activos, algo está mal.
- **Don't** agregar glassmorphism (blur + transparencia) como decoración. Si hay un panel semitransparente, es por función (overlay de modal), no por estética.
- **Don't** agregar bordes de colores de marca a inputs o cards en reposo. El sistema en reposo es monocromo: paper + white + ink. El color aparece con el contenido del usuario, no con los contenedores.
