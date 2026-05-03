---
name: MindStorm
description: Tablero creativo colaborativo — Kanban + canvas Mycelium + IA para proyectos editoriales y worldbuilding
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
  laton: "#B08C5A"
  laton-soft: "#F0E6D4"
  terra: "#C97D5C"
  terra-soft: "#F0DDD2"
  olive: "#7A8A4F"
  olive-soft: "#DCE2C8"
  sky: "#6B91B3"
  sky-soft: "#D5DFE8"
  line: "#2A2620"
  line-soft: "#C0B8A8"
  dark-warm: "#1C1513"
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
    fontFamily: "'Lora', Georgia, serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
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
    typography: "{typography.label}"
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
  panel-ai:
    backgroundColor: "{colors.card-soft}"
    textColor: "{colors.ink-0}"
    border: "1px solid {colors.card-border}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: MindStorm

## 1. Overview

**Creative North Star: "El Cuaderno del Ingeniero"**

MindStorm es una herramienta seria diseñada por y para creativos de proyectos editoriales y worldbuilding. No es un cuaderno de notas con stickers, no es un dashboard corporativo, no es una pizarra lúdica. Es el cuaderno de trabajo de un ingeniero victoriano que encontró una red neuronal: papel real, tinta real, conexiones que dejan marca, pero con la precisión calibrada de lo digital.

El sistema visual habla de papel de bitácora sobre una mesa de trabajo real. El cream no es decorativo — es el contexto físico del pensamiento analógico. Las tarjetas flotan como fichas de papel blanco sobre ese fondo. La tinta es oscura y directa. El latón (`#B08C5A`) es el puente: el color del instrumento de medición, del engranaje bien torneado, del detalle que revela que detrás hay una mente que entiende tanto la belleza como la función. El amarillo neón, cuando aparece, lo hace como señal inequívoca: algo aquí está aprobado, algo aquí está vivo.

La tipografía mezcla tres mundos intencionalmente: Fraunces italic para los títulos de las ideas (lo que los creativos crean), Lora para el cuerpo editorial (el texto de trabajo, las descripciones, el contenido extendido), y Quicksand solo para los labels de la interfaz (lo que la herramienta ofrece). Esta estructura hace que el contenido del usuario se destaque sobre los controles del sistema.

**Key Characteristics:**
- Papel cream como contexto físico del pensamiento, no como color de tendencia
- Tarjetas blancas flotando sobre el fondo con sombras dobles de papel
- Fraunces italic como firma visual de los títulos de ideas
- Lora como voz editorial del cuerpo de texto: legible, con carácter, con serif
- Latón como acento del detalle: el color del instrumento entre lo analógico y lo digital
- Amarillo neón disciplinado: solo en conexiones aprobadas y estados activos
- Conexiones orgánicas con dots negros sólidos, nunca líneas invisibles
- Grilla de puntos tenue como referencia n8n, no como decoración

## 2. Colors: La Paleta del Cuaderno

El sistema es deliberadamente restringido. El cream y las tintas oscuras cubren el 90% de la superficie. Los colores de estado (terra, olive, sky) aparecen como información, nunca como decoración. El latón aparece como detalle artesanal. El neón aparece como pulso.

### Primary
- **Tinta Negra** (`#1A1814`): El color de los botones primarios, el hover de acciones críticas, y los endpoint dots de conexión. Tan cerca del negro como se puede sin serlo.
- **Neón Eléctrico** (`#E8F062`): El único acento saturado. Aparece en midpoint dots de conexiones aprobadas, estados activos de navegación, y checkmarks de completado. Constante pero disciplinado.
- **Latón Digital** (`#B08C5A` · `oklch(63% 0.075 68)`): El puente entre lo analógico y lo digital. Aparece en el logo, el sidebar oscuro como highlight de navegación activa, detalles de instrumentos y controles premium. No es naranja ni dorado — es la pátina del instrumento de precisión.

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
- **Línea de Conexión** (`#2A2620`): Todas las líneas del canvas Mycelium.
- **Noir Cálido** (`#1C1513`): Fondo del sidebar y panels oscuros. Marrón muy oscuro, nunca azulado. Más cálido que `#1C1A18` — pertenece al mismo mundo que el paper.

### Named Rules

**La Regla del Pulso.** El neón (`#E8F062`) es un sistema de señales, no un color de marca. Aparece en el midpoint de cada conexión aprobada y en los estados activos de navegación. Su constancia controlada lo hace confiable; su saturación lo hace inconfundible. Prohibido como fondo de página, columna, hero o botón primario.

**La Regla de la Tinta.** No hay naranja puro. No hay violeta. No hay gradientes de color. Los únicos saturados son neón (señal), laton (detalle), terra (error), olive (aprobación) y sky (información), todos apagados y papelosos. Cualquier propuesta de color nuevo debe pasar por el filtro: ¿se parece a tinta, latón o papel envejecido? Si no, no pertenece.

**La Regla del Latón.** El latón (`#B08C5A`) es el único acento cálido dorado permitido. Aparece donde hay un detalle de precisión o un instrumento: logo, sidebar activo, ocasionalmente un borde highlight. No reemplaza al neón (que es señal de estado), no reemplaza a la tinta (que es texto y botón primario). Prohibido como fondo de card, como color de categoría, o como color de acento decorativo repetitivo.

**La Regla de la Calidez Oscura.** Todo dark surface de la app usa `#1C1513` (Noir Cálido) como base, nunca azules fríos ni grises neutros. Los paneles oscuros (sidebar, AI panel en modo focus) deben tener tinte marrón cálido consistente. Un panel oscuro que se ve azul o gris pertenece a otra app.

## 3. Typography: Tres Voces, Tres Mundos

**Display/Title Font:** Fraunces (con Georgia, serif de fallback) — siempre italic
**Body/Editorial Font:** Lora (con Georgia, serif de fallback) — regular y medium
**Label/UI Font:** Quicksand (con system-ui de fallback) — solo para labels de interfaz
**Mono Font:** JetBrains Mono (para timestamps, datos, HUD)

**Character:** Fraunces italic es la escritura a mano del sistema — orgánica, con personalidad, lo que el usuario crea. Lora es la voz de lectura editorial — claro, con estructura serif, para textos de más de 2 líneas. Quicksand es el tipo de letra de la interfaz — redondeado, legible, para labels y botones, nunca para párrafos. La combinación dice: las ideas tienen voz propia; el cuerpo de trabajo tiene dignidad editorial; la herramienta se hace a un lado.

### Hierarchy
- **Display** (Fraunces italic 400, 36px, lh 1.1, ls -0.02em): Títulos de pantalla, nombre del proyecto en la topbar. Solo cuando la idea necesita ser la protagonista.
- **Title** (Fraunces italic 500, 14px, lh 1.3, ls -0.01em): Títulos de tarjetas en el canvas Mycelium. El más visto; define la identidad visual del canvas.
- **Body** (Lora 400, 13px, lh 1.65): Cuerpo de texto en cards expandidas, descripciones, paneles de AI, respuestas de IA. Máx. 65ch de ancho. Nunca Quicksand en texto corrido mayor a 2 líneas.
- **Label** (Quicksand 600, 10px, ls 0.14em, UPPERCASE): Etiquetas de columna, section headers, contadores, botones de interfaz. El uppercase no es un default, es una distinción de escala. Quicksand nunca va en texto de párrafo.
- **Mono** (JetBrains Mono 500, 10px, ls 0.06em): Timestamps, datos del HUD (ZOOM · 100%), usernames, counters numéricos. Datos, no prosa.

### Named Rules

**La Regla de la Doble Voz.** Los títulos de *lo que el usuario crea* (tarjetas, proyectos, ideas) van en Fraunces italic. Todo lo que *pertenece a la herramienta* (botones, labels, HUD) va en Quicksand. El cuerpo de texto editorial (más de 2 líneas de contenido, respuestas de IA, descripciones largas) va en Lora. No mezclar roles: un botón nunca va en Fraunces, un párrafo largo nunca va en Quicksand.

**La Regla del Italic Obligatorio.** Fraunces sin italic pierde su personalidad. No hay uso de Fraunces en estilo normal (roman) en este sistema. Si la fuente está en roman, usar Lora para body o Quicksand para labels.

**La Regla del Descubrimiento.** Lora como body font no es casual — es la fuente de los libros editoriales, de los cuadernos de trabajo, de los textos que se leen con atención. Al usarla para las respuestas de IA y el texto largo de las tarjetas, el sistema dice: este contenido merece ser leído con calma. No acelerar con sans-serif utilitario en textos de más de 2 líneas.

## 4. Elevation: Papel sobre Papel

El sistema usa sombras que imitan capas de papel físico: una línea hairline en la parte superior (el borde del papel debajo) más una difusión suave que aumenta con la altura. No hay sombras de color. No hay blur exagerado. El origen de luz es siempre arriba.

### Shadow Vocabulary
- **Nivel 1 — Reposo** (`0 1px 0 rgba(58,50,38,0.06), 0 2px 8px rgba(58,50,38,0.06)`): Estado base de cards, pills, inputs. La card "descansa" sobre el papel cream.
- **Nivel 2 — Hover / Panel** (`0 1px 0 rgba(58,50,38,0.08), 0 8px 24px rgba(58,50,38,0.08)`): Hover de cards, paneles laterales. La card "se levanta" al interactuar.
- **Nivel 3 — Modal / Drag** (`0 2px 0 rgba(58,50,38,0.10), 0 16px 40px rgba(58,50,38,0.12)`): Modales, card en estado drag-activo, card expandida en canvas. El papel más arriba en la pila.

### Named Rules

**La Regla del Papel sobre Papel.** Cada sombra tiene dos capas: hairline arriba + difusa abajo. La hairline simula el borde de la hoja debajo. La difusa simula la distancia al fondo. Sin hairline, la card flota sin contexto. Sin difusa, no hay profundidad. Las dos capas siempre van juntas.

**La Regla del Color Neutro.** Las sombras no tienen color de marca. El tono cálido (`rgba(58,50,38,...)`) es papel viejo, no tinta naranja ni glow de acento. Prohibido: `box-shadow` con el neon, laton, terra, olive o sky como color.

## 5. Components

### Buttons

Pills navegables: la forma vertebral del sistema. Cualquier control horizontal vive dentro de una pill blanca con sombra.

- **Shape:** Completamente redondeada (999px — pill), nunca rectangular.
- **Primary (Noir):** Fondo `#1A1814` (ink-0), texto `#EFEBE3` (paper). Padding 10px 24px. Una sola por panel.
- **Primary Hover:** Fondo `#2A2620` (noir-2), `translateY(-1px)`.
- **Ghost / HUD Pill:** Fondo `#FFFFFF` (card-white), texto `ink-2`, borde `card-border`, `shadow-1`. Hover: `shadow-2` + `translateY(-1px)`.
- **Ghost Active:** Fondo `#1A1814` (noir), texto `paper`. El cambio de pill blanca a pill negra señala el estado activo.
- **Neon:** Fondo `#E8F062`, texto `#1A1814`. Solo para "aprobar conexión" y "completar onboarding". Máximo una por pantalla.

### Cards — Canvas Mycelium (mcard)

La tarjeta flotante del canvas. Superficie de papel blanco sobre el fondo cream.

- **Shape:** 16px radius (`--r-md`). Dimensión base: 250px ancho.
- **Background:** `#FFFFFF` (card-white), borde `card-border` (`rgba(58,50,38,0.08)`).
- **Shadow:** `shadow-1` en reposo, `shadow-3` expandida.
- **Header:** Fraunces italic 500, 14px, `ink-0`. Glyph de estado (`▸` / `◢`) en `ink-3`. Dot de categoría (7px, color del column) en el extremo derecho.
- **Body expandido:** Lora 400, 12px, `ink-1`. Tags como pills con borde `paper-3`. Meta (autor, tiempo) en JetBrains Mono `ink-3`.
- **Hover:** `shadow-2` + `translateY(-1px)`. Sin cambio de borde.

### Cards — Kanban (wcard / tile)

- **Shape:** Misma familia (`--r-md`), sin left-border accent.
- **Background:** `#FFFFFF`, `shadow-1`, borde `card-border`.
- **Hover:** `shadow-2` + `translateY(-1px)`. Fondo permanece blanco.

### Inputs / Fields

- **Style:** Fondo `#FFFFFF`, borde 1.5px `paper-3`, radius `--r-md` (16px).
- **Focus:** Border-color cambia a `ink-2`; halo `0 0 0 4px rgba(58,50,38,0.06)` — cream neutro, sin color de acento.
- **Autofill:** Override activo para que Chrome no imponga fondo azul. Usa `card-white` de fondo.

### Panels — AI (AIPanel / ConnectionsPanel)

Los paneles de IA son superficies editoriales de trabajo, no interfaces de chat tech frías.

- **Fondo:** `card-soft` (`#FAF7F0`), nunca dark glass ni backdrop-blur. El panel de IA pertenece al mundo cream, no al mundo dark.
- **Borde:** 1px `card-border`. Sin glow. Sin blur.
- **Texto de respuesta IA:** Lora 400, 13px, `ink-1`. Las respuestas de la IA se leen como texto editorial, no como output de terminal.
- **Headers de panel:** Quicksand 600, 10px, UPPERCASE, `ink-3`. Misma regla que labels de UI.
- **Error / Quota messages:** terra para el texto, no para el fondo. El mensaje de error es información, no alarma.

### Conexiones (Firma del Sistema)

El componente más distintivo de MindStorm. Define visualmente que esto es un canvas de ideas conectadas, no un tablero de tareas.

- **Curva:** Bezier cúbico horizontal (`C` path). Los puntos de control crean una S-suave que da organicidad sin caer en el caos.
- **Línea:** `stroke: var(--line)` (`#2A2620`), `strokeWidth: 1.4`. Siempre tinta oscura.
- **Endpoint dots:** Círculos negros sólidos (`r=3.5`, `fill: var(--noir)`). Siempre presentes. Son la puntuación del sistema.
- **Midpoint neon dot:** `r=4`, `fill: var(--neon)` (#E8F062), `stroke: var(--noir)` con `strokeWidth: 1`. Marca cada conexión aprobada. El pulso del canvas.
- **Label de tipo:** Quicksand 600, 8px, `ink-3`, sobre el midpoint. Legible pero no dominante.
- **Sticker strings:** Color de categoría al 55% de opacidad, `strokeWidth: 1.8`, dasharray "6 4". Dot `ink-0` (`r=3`) en el endpoint del card; dot color-categoría (`r=2.5`, opacity 0.45) en el endpoint del sticker.

### HUD Canvas

Toolbar flotante del canvas (esquina superior izquierda + inferior derecha).

- **Contenedor:** Pills blancas sueltas, no barra. Cada botón es un `hud-btn` independiente.
- **Activo:** La pill activa cambia a pill negra (`hud-btn-active`). No hay línea underline, no hay borde de color.
- **Info widget (zoom):** Fondo `paper` (`bgPanel`), borde `paper-3`, mono 10px, `ink-3`. Sin backdrop-filter agresivo.

## 6. Do's and Don'ts

### Do:
- **Do** usar Fraunces italic para cualquier texto que represente una idea del usuario (títulos de cards, títulos de proyectos). Es la voz del contenido.
- **Do** usar Lora para texto corrido de más de 2 líneas: cuerpo de cards expandidas, respuestas de IA, descripciones en paneles. Es la voz editorial.
- **Do** usar Quicksand solo para labels de interfaz: botones, section headers, contadores, HUD. Nunca en párrafos.
- **Do** usar el latón (`#B08C5A`) donde hay un detalle de precisión: logo, sidebar activo, detalles de instrumento.
- **Do** usar el amarillo neón (`#E8F062`) solo como señal de estado activo o conexión aprobada.
- **Do** mantener las dos capas en cada sombra: hairline (`0 1px 0`) + difusa (`0 Xpx Ypx`). Separar las capas rompe la ilusión de papel.
- **Do** usar endpoint dots negros (`fill: var(--noir)`) en todas las conexiones del canvas, sin excepción.
- **Do** mantener las pills como el contenedor por defecto de controles navegables.
- **Do** asegurar que todo dark surface use `#1C1513` (Noir Cálido) como base, con tinte marrón cálido.

### Don't:
- **Don't** usar Quicksand en texto de párrafo o respuestas de IA. Es una fuente de label, no de lectura.
- **Don't** poner los paneles de IA con dark glass, backdrop-blur decorativo, o fondos azulados. Pertenecen al mundo cream.
- **Don't** usar Fraunces en estilo normal (roman). Si no está en italic, usar Lora o Quicksand según el contexto.
- **Don't** usar Notion, ClickUp ni Linear como referencia visual. Son para gestores, no para creativos de proyectos narrativos.
- **Don't** usar gradientes de purple, fondo blanco puro (`#FFFFFF` como fondo de página), Inter font, ni el patrón de tarjetas idénticas con icon+heading+text en grid.
- **Don't** imitar Miro o FigJam: sin stickers de colores sólidos dominantes, sin lienzos que parezcan cuadernos infantiles.
- **Don't** poner sombras con color de acento (neon, laton, terra, sky). Las sombras son siempre `rgba(58,50,38,...)`.
- **Don't** usar `border-left` mayor a 1px como stripe de color en cards o list items.
- **Don't** usar el neón como fondo de página, columna, hero, o botón primario habitual.
- **Don't** agregar glassmorphism (blur + transparencia) como decoración.
- **Don't** usar `#1C1A18` ni grises azulados en dark surfaces. El Noir Cálido es `#1C1513`.
- **Don't** usar naranja puro (`T.orange`) donde corresponde el latón. Son distintos: naranja es un color de marca agresivo, latón es un tono artesanal de precisión.
