# Contexto de los agentes

## Proyecto actual

Sitio de reparación y mantenimiento de equipos de cómputo y soporte técnico. El estado actual es una página estática en construcción, con HTML, CSS y JavaScript y entorno local XAMPP.

- Entrada: [index.html](../index.html).
- Estilos: [css/style.css](../css/style.css).
- Interacciones: [js/animation.js](../js/animation.js).
- No hay backend ni herramientas npm declaradas actualmente. Verifica el estado real antes de cada tarea; no inventes comandos de build o pruebas.
- Las listas de tecnologías de cada agente describen capacidades, no dependencias obligatorias. No introduzcas frameworks, servidores ni bases de datos sin que el alcance lo requiera.

## Equipo y uso

Selecciona el agente en el selector del editor según la tarea. Esta configuración no cambia automáticamente el agente seleccionado.

- [Coordinador](agents/Coordinador.agent.md): planificación, reparto de trabajo e integración.
- [Frontend](agents/Frontend.agent.md): HTML, CSS e interacciones.
- [Backend](agents/Backend.agent.md): servicios e integraciones cuando se soliciten.
- [Uiux](agents/Uiux.agent.md): experiencia, accesibilidad y diseño responsive.
- [Segurity](agents/Segurity.agent.md): auditoría defensiva y recomendaciones de seguridad.
- [Reviewer](agents/Reviewer.agent.md): revisión de cambios y regresiones.
- [Tester](agents/Tester.agent.md): pruebas de los flujos afectados.

Para cambios que involucren varios especialistas, utiliza Coordinador. Define criterios de aceptación antes de implementar; asigna archivos sin solapamientos y contratos de integración cuando correspondan. Si no hay delegación disponible, realiza las etapas necesarias sin afirmar revisiones independientes.

## Reglas compartidas

- Responde en español y respeta las instrucciones del usuario.
- Revisa el estado de Git y conserva los cambios locales, incluidos los archivos eliminados por el usuario. No restaures versiones anteriores sin que la tarea lo requiera.
- Lee los archivos afectados antes de editar. Mantén cambios pequeños y pertinentes.
- Preserva la identidad visual y las animaciones existentes, cuando las haya. Respeta movimiento reducido, accesibilidad por teclado y navegación móvil.
- En cambios visuales, comprueba 390x764, 393x852, 768x1024, 1365x768 y 1920x1080. Informa cuáles pudiste verificar.
- Evita desbordamientos, contenido cortado y dependencias innecesarias.
- Usa HTML semántico, etiquetas de formulario y foco visible.
- No insertes datos externos mediante innerHTML ni expongas credenciales. Usa textContent o nodos del DOM.
- Ejecuta comprobaciones aplicables a los archivos modificados, como node --check para JavaScript cuando Node esté disponible. No confundas sintaxis con pruebas funcionales.
- No ejecutes pruebas destructivas ni acciones sobre servicios externos sin autorización.
- No hagas commit, push ni despliegue salvo solicitud del usuario. Si se pide un commit, incluye únicamente archivos de la tarea.
- Entrega cambios, verificaciones realizadas, resultados y pendientes. No declares comprobaciones que no ejecutaste.