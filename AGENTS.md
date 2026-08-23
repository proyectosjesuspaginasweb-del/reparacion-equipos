# AGENTS.md

Instrucciones del proyecto para agentes que trabajen en esta pagina. Estas reglas aplican a todo el repositorio salvo que el usuario indique lo contrario.

## Contexto Del Proyecto

- Sitio web estatico para soporte tecnico y mantenimiento de equipos.
- Archivos principales: `index.html`, `css/styles.css`, `js/main.js`.
- Estilo visual actual: Bauhaus/neon, bordes duros, sombras marcadas, fondo con grilla y paneles animados.
- Framework actual: Bootstrap 5 por CDN, usado como apoyo responsive. El CSS propio debe seguir mandando sobre el estilo visual.
- Animaciones actuales: GSAP + Observer para transiciones por paneles. No quitarlas ni desactivarlas sin autorizacion explicita.

## Subagente Maquetador & UI Developer

### Rol

Especialista en frontend, maquetacion web, responsive design, accesibilidad y SEO tecnico. Su trabajo es mejorar la interfaz sin romper el estilo visual existente ni las animaciones.

### Reglas De Trabajo

- Revisar primero `index.html`, `css/styles.css` y `js/main.js` antes de modificar layout.
- Mantener el estilo Bauhaus/neon: colores, bordes, sombras, fondos y composicion general.
- Usar Bootstrap 5 solo como soporte responsive (`row`, `col-*`, utilidades) cuando ayude.
- No introducir Tailwind, otro framework CSS o dependencias nuevas sin autorizacion explicita.
- Preferir CSS propio para ajustes finos de layout, altura, sombras, paneles y animaciones.
- No crear estilos inline en HTML salvo que sea estrictamente necesario para JS dinamico.
- Evitar scroll horizontal y cualquier elemento cortado por bordes, sombras o botones flotantes.
- Validar responsive despues de cambios visuales con al menos estos tamanos:
  - Movil bajo: `390x764`.
  - Movil alto: `393x852`.
  - Tablet: `768x1024`.
  - Escritorio bajo: `1365x768`.
  - Escritorio grande si aplica: `1920x1080`.

### Breakpoints Base

Usar estos puntos de ruptura como guia. Si el CSS existente ya tiene reglas cercanas, trabajar con ellas en vez de duplicar sin necesidad.

- Movil: `max-width: 560px`.
- Tablet: `min-width: 561px` y `max-width: 980px`.
- Escritorio: `min-width: 981px`.
- Pantallas grandes: `min-width: 1440px`.
- Pantallas bajas: combinar con `max-height: 780px` o `max-height: 860px` cuando el problema sea vertical.

### Reglas Responsive Especificas Del Proyecto

- Los paneles GSAP deben ocupar el viewport completo sin cortar contenido.
- En movil, los bloques principales deben usar una sola columna.
- En movil, reservar espacio para el header fijo, el boton home inferior izquierdo y el boton WhatsApp/chat inferior derecho.
- Usar `100dvh` cuando se necesite altura real de viewport movil.
- No depender de `100vh` como unica medida en moviles.
- Evitar usar `zoom` para resolver responsive en moviles. Solo puede usarse como ultimo recurso en escritorio o pantallas extremas.
- Las tarjetas con `box-shadow` deben tener margen suficiente para que la sombra no se corte.
- Los textos de botones y tarjetas no deben desbordar. Si no caben, ajustar ancho, `line-height`, `font-size` o estructura antes de recortar contenido.

### SEO Y Semantica

- Mantener estructura semantica: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` cuando aplique.
- Mantener un solo `h1` principal en la pagina.
- Respetar jerarquia logica de encabezados.
- Mantener `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Mantener `title` y `meta name="description"`.
- Si se agregan imagenes reales, deben incluir `alt` descriptivo.
- Enlaces y botones deben tener texto claro o `aria-label` cuando el texto visible no sea suficiente.

### Criterios De Aceptacion

Antes de cerrar una tarea visual:

- Ejecutar validacion basica de CSS, por ejemplo balance de llaves.
- Ejecutar `node -c js/main.js` si se toca JavaScript.
- Generar o revisar capturas responsive cuando el cambio afecte layout.
- Reportar que pantallas se validaron y que riesgos quedan.

## Subagente De Seguridad Web & Hardening

### Rol

Especialista en seguridad web, hardening y buenas practicas de codigo seguro. Su trabajo es detectar riesgos y aplicar medidas razonables para un sitio estatico con JavaScript en cliente.

### Reglas De Seguridad

- No usar `innerHTML` con datos del usuario o fuentes no confiables.
- Es aceptable usar `innerHTML = ""` solo para limpiar un contenedor, sin insertar datos externos.
- Para renderizar datos del usuario usar `textContent`, `innerText` o nodos creados con `document.createElement`.
- Validar y normalizar entradas de formularios antes de usarlas.
- No almacenar datos sensibles en `localStorage` ni `sessionStorage`.
- No exponer claves API, tokens, credenciales ni datos privados en el repositorio.
- Todo recurso externo debe usar HTTPS.
- Todo enlace con `target="_blank"` debe incluir `rel="noopener noreferrer"`.
- Mantener SRI (`integrity`) y `crossorigin` en dependencias CDN cuando el proveedor lo permita.
- No agregar scripts de terceros no verificados.

### Dependencias Externas Permitidas Actualmente

- Google Fonts.
- Bootstrap 5 CDN.
- GSAP CDN.

Si se necesita otra dependencia externa, explicar:

- Por que hace falta.
- De donde se carga.
- Version exacta.
- Riesgos de seguridad.
- Si incluye SRI.

### Cabeceras De Seguridad

Este proyecto puede ejecutarse como sitio estatico local o en hosting. Si hay acceso a configuracion de servidor, recomendar o configurar:

- `Content-Security-Policy`.
- `X-Frame-Options: SAMEORIGIN` o `DENY`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.

Si no hay servidor configurable, documentar la recomendacion en vez de inventar una solucion en HTML.

### Proceso De Auditoria

Antes de cerrar una tarea de seguridad:

- Revisar `index.html` y `js/main.js` en busca de XSS, enlaces inseguros y uso incorrecto del DOM.
- Revisar que no haya secretos con busquedas como `api_key`, `token`, `password`, `secret`, `sk-`.
- Revisar dependencias CDN, `target="_blank"` y formularios.
- Reportar hallazgos por severidad y archivo.

## Reglas Git Del Proyecto

- Preservar cambios locales no relacionados.
- Stagear solo archivos de la tarea, nunca usar `git add .` ni `git add -A`.
- No revertir cambios del usuario sin autorizacion explicita.
- Cuando el usuario pida subir cambios, publicar en `main` y sincronizar `developer` si asi lo solicita o si esa ha sido la practica inmediata del proyecto.
