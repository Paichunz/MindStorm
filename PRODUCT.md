# Product

## Register

product

## Users

Escritores, worldbuilders y directores creativos de proyectos editoriales y narrativos: novelistas estructurando arcos de personajes, directores de arte mapeando universos ficticios, guionistas conectando tramas, equipos de producción editorial gestionando campañas. El usuario típico llega con un caos creativo rico en potencial y necesita un espacio para capturarlo, conectarlo y convertirlo en un plan coherente sin matar la energía del proceso.

También sirve a equipos de agencias creativas, estrategas de contenido y diseñadores de experiencias que trabajan en sesiones de brainstorming colaborativo, a veces en tiempo real. El modo de uso oscila entre la exploración orgánica libre (canvas Mycelium) y la gestión estructurada (tablero Kanban). Lo que distingue a este usuario del gestor de proyecto genérico: piensa en imágenes y conexiones, no en listas y tickets.

## Product Purpose

MindStorm es un tablero creativo colaborativo que combina la estructura del Kanban con la libertad visual de un grafo de ideas (vista Mycelium), asistido por IA (Gemini + Groq) para amplificar la creatividad del equipo. Está construido específicamente para proyectos editoriales, worldbuilding y producción creativa donde las ideas son orgánicas y las conexiones entre ellas son tan importantes como las ideas mismas.

El éxito se ve cuando un escritor puede externalizar el caos de su universo narrativo, descubrir patrones y conexiones no obvias entre personajes y tramas, y avanzar hacia la acción sin perder la energía del proceso creativo.

## Brand Personality

Cálido pero preciso. Como un taller de encuadernación que descubrió el software. Tres palabras: **artesanal, conectado, preciso**. El tono visual es el de un cuaderno de bitácora de un ingeniero victoriano que encontró una red neuronal: papel real, tinta real, pero con la precisión de lo digital. La voz es directa y segura, con la calidez de lo hecho a mano, nunca corporativa ni condescendiente.

## Anti-references

- **Notion / ClickUp / Linear**: demasiado genérico, corporativo y sin personalidad. Intercambiables. MindStorm debe sentirse hecho para creativos con proyectos específicos, no para gestores de proyecto que manejan backlogs.
- **SaaS genérico frío**: gradientes en purple, tarjetas idénticas, Inter font, fondo blanco `#FFFFFF`. El template de startup de 2021. Evitar por completo.
- **Miro / FigJam**: modo pizarra lúdico y caricaturesco. MindStorm es una herramienta seria con estética de estudio profesional, no un cuaderno de notas con stickers de colores.
- **Dashboards "tech" sin alma**: interfaces azul-gris con esquinas perfectas, tipografía monospace como estética decorativa, todo lo que comunique "robot" o "dashboard de analítica corporativa". El calidez no es opcional.

## Design Principles

1. **La herramienta desaparece, las ideas emergen.** La UI no compite con el contenido. Los elementos de control se retraen cuando no se necesitan; el espacio de trabajo es el protagonista. Un usuario en flujo creativo no debería pensar en la interfaz.
2. **Potencia sin intimidación.** Features avanzadas (canvas, IA, conexiones) accesibles sin tutorial. La curva de aprendizaje es visual, no documental. El usuario descubre capacidades mientras trabaja, no mientras lee instrucciones.
3. **El caos tiene estructura.** El sistema visual refleja que las ideas son orgánicas pero el flujo de trabajo tiene intención. La tensión entre libertad y orden es la esencia del producto: ni pizarra caótica ni hoja de cálculo rígida.
4. **Consistencia como confianza.** Un sistema de tokens coherente (colores, tipos, espaciado) permite agregar features sin que la app se vea fragmentada. Cada pantalla se siente parte del mismo instrumento.
5. **El calor es contexto.** El fondo cream no es decorativo: reduce la fatiga en sesiones largas de ideación, remite al papel físico donde nacen las ideas, y hace que el contenido del usuario (colores de categoría, conexiones, títulos en italic) tome protagonismo sobre la interfaz.

## Accessibility & Inclusion

Target: WCAG 2.1 AA. Prioridad en contraste de texto sobre fondos cream (mínimo 4.5:1 para texto normal — verificar ink-2/ink-3 sobre paper). Navegación por teclado en acciones críticas (crear tarjeta, navegar tablero, activar IA). Respetar `prefers-reduced-motion` para animaciones del canvas Mycelium, transiciones de UI y el contador de quota de la IA.
