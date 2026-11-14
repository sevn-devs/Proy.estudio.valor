# Validación local — 2026-11-14

Resultados ejecutados sobre la copia local. No se enviaron consultas, no se usaron datos personales y no se desplegó.

- Base: build inicial en `.astro/baseline`, dos páginas, exit 0, Astro 5.18.2.
- Runtime observado: Node 26.13.1 / npm 11.20.0.
- `npm audit --omit=dev --json`: exit 1; 5 dependencias afectadas (1 crítica, 3 altas, 1 baja). No se ejecutó `audit fix` ni se modificó el lock.
- No se midieron Core Web Vitals de campo, Search Console, recepción real de mensajes ni cuenta Cloudflare. No se realizó despliegue.

## Comprobaciones

| Comando / método | Resultado observado |
|---|---|
| `npm run build -- --outDir .astro/validation` | Exit 0, tres páginas Astro: inicio, mockup y 404; además copia HTML del mockup desde public |
| `npm test` | Seis pruebas aprobadas: escape de entradas, URLs de medios, WhatsApp sin datos, servidor seguro/404, HTML noindex y recolector |
| `node tests/browser.mjs` | Nueve grupos aprobados en Chrome headless con perfil temporal y HTTPS externo bloqueado; cero excepciones JavaScript |
| `node --check` sobre safety/main/chatbot/media-manager y server | Sin errores de sintaxis; no equivale a lint |
| `git diff --check` | Sin errores de espacios; Git avisa normalización LF/CRLF en algunos archivos |
| Inspección de capturas | Inicio móvil/escritorio, formulario, chat y panel local revisados. Capturas bajo `.astro/validation-*.png`, fuera del sitio y de Git |
| Recolección manual | 36 archivos autorizados, cobertura `observed`, `working_tree_dirty: true`; salida local `.astro/knowledge-observation.json` |

Comparación de bytes sin compresión de los scripts referenciados por el Layout: baseline **47.373 bytes** (data/chatbot/media-manager/main), actual **40.605 bytes** (incluye safety). Reducción de 6.768 bytes, aproximadamente 14,3 %. Es tamaño de archivos locales; no representa tiempos de carga, transferencia comprimida ni Core Web Vitals.

## Cobertura de comportamiento

- Provincias: 24 opciones más el placeholder, sin duplicado de hidratación.
- Formulario: campos requeridos, selección efímera, texto «No se envió», salida genérica y sin escritura de leads.
- Asistente: provincia/área, derivación, descarte de texto hostil, reinicio, Escape y retorno de foco; sin evaluación jurídica ni IA.
- Panel: foco inicial, ciclo Tab/Shift+Tab y retorno de foco. Entradas hostiles guardadas como datos sintéticos no crean HTML ejecutable. Fallo de cuota no modifica inserciones ni eliminaciones de la sesión como si hubieran persistido.
- Medios: no hay iframes de YouTube antes de la acción; URLs fuera de allowlist rechazadas. No se probó reproducción externa por el bloqueo deliberado de HTTPS.
- HTTP: 200 de inicio/mockup, 308 del directorio mockup sin barra, 404 real de inexistentes/privados/traversal, 400 de escape inválido, 405 de POST y HEAD sin cuerpo. Las respuestas incluyen noindex.
- Viewports: 320, 390 y 1440 px sin desborde horizontal en el ensayo. Se reemplazaron iconos de controles esenciales por símbolos locales tras observar vacíos con el CDN bloqueado.
- Recorrido mockup y página inexistente sin inicialización errónea de widgets.

La primera corrida de navegador se detuvo por una expectativa incorrecta de foco: el ensayo abría el panel con clic programático sin enfocar su disparador. Se corrigió la simulación y se repitió. No se presenta esa corrida como aprobada.

## Límites explícitos

- No hay linter existente ni auditoría automatizada axe instalada. No se añadió dependencia para simular una certificación.
- Sin medición LCP/INP/CLS, Lighthouse, campo, lector de pantalla, contraste completo, móvil físico ni validación de subtítulos/transcripciones. No se afirma conformidad WCAG ni mejoras cuantitativas de CWV.
- Recursos externos bloqueados en navegador: el ensayo valida funcionamiento sin CDN, no disponibilidad de fuentes, imágenes, YouTube o WhatsApp. Verificar compatibilidad CSP y reproducción con recursos reales antes de publicación.
- No se ejercitó la cuenta de Cloudflare ni se auditaron DNS, configuración TLS, redirecciones de dominio, caché, rollback, despliegue o motores de búsqueda. La comprobación pública posterior de HTTPS está separada abajo.
- Se conservaron versiones y lock de dependencias. El resultado de audit sigue abierto y requiere evaluar actualización mayor y exposición real.
- Los archivos heredados de raíz/dist no fueron modernizados ni validados como sitio alternativo. No publicarlos ni usar el obfuscador para regenerar el sitio activo.

## Estado de Git y procedencia

Valor estaba limpio al inicio. Los cambios quedan sin staging, commits ni publicación. `dist/` y `package-lock.json` se preservaron. Landing, Shanti y Brain no fueron modificados por esta tarea. Durante la ejecución apareció `standards/visual-attribution.md` sin seguimiento en Brain, ajeno a estas modificaciones: se dejó intacto.

## Comprobación del entorno público de avances

2026-11-14, después de que el usuario confirmó https://estudiovalor-demo.sven.com.ar/ como entorno para mostrar avances y mantuvo la prohibición de indexarlo hasta la confirmación del cliente.

Lectura HTTP mediante `fetch` de Node, sin enviar formularios ni alterar el hosting. El lector web no pudo acceder; se utilizó HTTP directo como alternativa.

| URL | Resultado observado |
|---|---|
| `https://estudiovalor-demo.sven.com.ar/` | 200 HTTPS; `server: cloudflare`; sin meta robots/googlebot ni `X-Robots-Tag` |
| `https://estudiovalor-demo.sven.com.ar/mockup/` | 200 HTTPS; `server: cloudflare`; sin meta robots/googlebot ni `X-Robots-Tag` |
| `https://estudiovalor-demo.sven.com.ar/robots.txt` | 200; el bloque gestionado por Cloudflare observado declara `User-agent: *`, `Allow: /` y `search=yes`, junto con restricciones para bots específicos |

Conclusión acotada: **el noindex local no está presente en las dos páginas públicas inspeccionadas**. No se comprobó si ya están indexadas ni qué revisión exacta está desplegada. No se puede equiparar el build local validado con el sitio servido.

Pendiente humano: publicar el build actual con sus metadatos y `_headers`; verificar nuevamente portada, mockup, HTML directo y 404. Si las cabeceras no aparecen, revisar con el responsable cómo el hosting procesa `_headers`. No habilitar sitemap, canonical productiva o indexación por el solo hecho de disponer del dominio de demo. No se modificó Cloudflare ni se ejecutó despliegue.
