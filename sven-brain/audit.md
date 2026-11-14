# Diagnóstico, transferencia e implementación

2026-11-14 · Revisión local. No equivale a una auditoría productiva, certificación de seguridad ni dictamen jurídico.

## Fuentes e inventario

| Checkout | Revisión observada | Evidencia usada |
|---|---|---|
| Valor | `34a329ce6bf1dae5cfd7900d2c3117ae71ae331e` | package/lock, config, Layout, componentes, scripts public, server, README e historial; limpio al inicio |
| SVEN Landing | `04655813a261aa589cc2124071d327a8b6fdf6d9` | `sven-brain/README.md`, `audit.md`, `collect.mjs`, `collect.test.mjs`, `_headers` y skills de arquitectura/SEO; limpio, solo lectura |
| Shanti | `45d3afed5c160fe154b01456342e9e6344956e26` | README, AGENTS, `src/layouts/Layout.astro`, `HeaderNav.tsx`, `global.css`, historial SEO; limpio, solo lectura |
| Brain | `83dc740b58529eac09b0fd6114b19bd27aa8bab0` | Reglas, skills, plantillas, workflow, contrato de recolección y `proposals/sven-landing-seo-audit.md`; limpio, solo lectura |

Directorio inicial de sesión: `sven-brain`; producto intervenido: `Proy.estudio.valor`. Las pestañas de letscook-engine no forman parte del pedido. No se encontraron instrucciones AGENTS propias de Valor al inicio; se agregó una guía local. No se leyó ningún `.env`, token o contrato privado.

## Matriz inicial de hallazgos

Criticidad contextual, no puntaje de explotación. Esfuerzo B/M/A = bajo/medio/alto relativo; no estimación de calendario. Confianza alta para código inspeccionado; exposición productiva no verificada.

| ID | Evidencia inicial | Criticidad / impacto / esfuerzo | Acción y estado local |
|---|---|---|---|
| V01 | `server.js`: busca archivos en raíz si faltan en dist; decodeURI sin manejo de error y fallback HTML 200 | Crítica potencial / archivos internos y soft 404 / M | Restringido a build, rutas y extensiones públicas; traversal/control chars rechazados; 400/404/405/HEAD; probado localmente |
| V02 | `main.js`, `chatbot.js`: `valor_consultas_leads`, nombre/teléfono/relato y texto sensible en wa.me | Alta / privacidad / M | Contacto mínimo, sin persistencia de consultas; WhatsApp genérico y salida explícita. Datos históricos no borrados automáticamente |
| V03 | `innerHTML` con entrada del usuario y medios sin escape; URLs arbitrarias e IDs en onclick | Alta / XSS en navegador / M | Texto DOM en formulario/bot; escape de medios y URL allowlist; botones sin IDs interpolados en eventos |
| V04 | Formulario dice «Consulta Recibida», bot anuncia guardia/cobertura y respuestas jurídicas por palabras clave | Alta / confianza y alcance / M | Resultado «No se envió», clasificación controlada sin asesoramiento. Promesas editoriales restantes se marcan V10 |
| V05 | Panel público anuncia publicación; solo localStorage base64, sin auth/API ni manejo honesto de cuota | Alta / operación / M | Identificado como demo local; límites de archivo, avisos y rollback de inserción fallida. CMS real diferido |
| V06 | Astro 5.18.2; audit devuelve cinco paquetes afectados | Alta prioridad / cadena de herramientas / A | 1 crítica, 3 altas, 1 baja. Corrección propuesta: Astro 7.4.12 (major); upgrade separado, no audit fix automático |
| V07 | Layout sin noindex/canonical; robots/sitemap en raíz no copiados por Astro; mockups indexables; sin 404 | Alta / indexación involuntaria / B-M | Demo noindex en HTML/cabeceras, robots rastreable, 404 real; canonical/sitemap/schema pospuestos por decisión del usuario |
| V08 | Menú sin expanded/Escape, chat sin etiqueta, talones div clicables, focos de modal incompletos | Media / teclado y lectura / M | Controles semánticos, Escape, foco, labels, región viva, skip/main y movimiento reducido. No se declara conformidad WCAG completa |
| V09 | Hero/vídeos solo JS, autoplay de slider, iframes de terceros eager, muchas variantes de fuentes | Media / carga y estabilidad / M | Fallback HTML del hero; slider manual, inactivos inert; YouTube por acción, preload none. CWV y optimización de activos pendientes |
| V10 | Promesas 24 h, cobertura nacional, resultados/indemnización y gratuidad en fuentes; videos de ejemplo | Alta / contenido comercial / M | Aviso de demo; flujo de contacto neutralizado. Resto del copy conservado para revisión del estudio; no ratificado ni extendido en schema |
| V11 | `index.html`, assets raíz, public y dist versionado; ofuscadores describen protección de datos | Media / mantenibilidad y publicación errónea / M | Documentada fuente activa; dist preservado en auditoría, build aislado; ignorar dist no lo desversiona. Ofuscación no es seguridad |
| V12 | Sin tests/lint/CI declarados al inicio, sin configuración productiva verificable | Media / regresiones y operación / M | Pruebas Node y navegador; cabeceras Pages locales; CI, hosting, HTTPS y operación pendientes |

## Aprendizajes transferidos

| Origen verificable | Práctica | Adaptación para Valor | No corresponde / límite |
|---|---|---|---|
| Landing `sven-brain/audit.md` + Brain `proposals/sven-landing-seo-audit.md` | Comparar fuente, build y HTTP; una compilación no prueba indexación | Pruebas del HTML y servidor local, noindex por estado demo | No copiar dominio, GTM, schemas, ofertas ni evidencias de producción de SVEN |
| Landing `_headers` | CSP acotada, MIME, framing y permisos | Hosts que Valor usa, no-referrer y X-Robots-Tag; sin analítica añadida | No copiar permisos GTM/GA ni HSTS de un dominio con HTTPS no confirmado |
| Landing skill de arquitectura | SSG y dependencias mínimas | Astro actual, JS/CSS nativos y rutas observadas | Sin React, migración de stack ni páginas comerciales inventadas |
| Shanti `Layout.astro` | Metadatos centralizados, skip link y main | Metadatos de demo, landmark y enlace de salto | Canonical/OG image/schema productivos requieren datos propios aprobados |
| Shanti `HeaderNav.tsx`, `global.css` | Escape, estado de menú, devolución de foco y movimiento reducido | JS nativo en menú/chat/panel y CSS compartido | No copiar React, paleta espiritual ni declarar AA/AAA por afirmación del README |
| Brain caso Valor + second-brain/builder | Canales reales, no inventar promesas ni simular envíos | Selección mínima y salida externa explícita | No afirmar cobertura, gratuidad, plazos de respuesta o reserva de turnos |
| Landing `collect.mjs` + contrato Brain | Observación manual por allowlist, SHA y huellas | Mismo contrato, identidad y rutas propias | No sincronización, cron ni publicación automática |

## Archivos afectados y motivos

- `server.js`, `public/_headers`, `public/robots.txt`, `src/pages/404.astro`: confinamiento de archivos, cabeceras y estado de demo.
- `src/layouts/Layout.astro`, `src/pages/index.astro`, `mockup.astro`, `public/mockup.html`: SEO de demo, recursos, landmarks y evitar inicializar widgets donde no existen.
- `ConsultationForm.astro`, `Chatbot.astro`, `public/assets/js/main.js`, `chatbot.js`, `safety.js`: minimizar datos, representación segura y enlaces controlados.
- `AdminModal.astro`, `HeroSlider.astro`, `VideoGallery.astro`, `media-manager.js`: persistencia local explícita, validación y carga de medios.
- `Navbar.astro`, `TearStrip.astro`, `public/assets/css/styles.css`: navegación y foco; componentes con enlaces externos reciben `noopener noreferrer`.
- `.gitignore`, `astro.config.mjs`, `package.json`, `README.md`, `AGENTS.md`: fuente activa, host local, comandos y límites.
- `tests/`, `docs/SHARED_CONTEXT.md`, `sven-brain/`: pruebas reproducibles y conocimiento interno.

## Seguridad y lanzamiento pendiente

La CSP permite inline por los estilos y handlers heredados, sin unsafe-eval. Es endurecimiento compatible, no defensa total contra XSS. Requiere ensayo de recursos externos reales antes de publicación. El prototipo embebido requiere framing propio. No se agregó HSTS/preload ni se cambiaron DNS/HTTPS/remotos.

No hay endpoint de recepción: no corresponde incorporar CAPTCHA o rate limiting de formulario inexistente. Si se agrega backend, definir límites, validación del lado servidor, control de abuso, retención, acceso y responsables antes de habilitar consultas reales. La política jurídica/de privacidad final y base de tratamiento requieren validación profesional; este trabajo no certifica cumplimiento legal.

Sobre dependencias: `npm audit` clasifica paquetes, no demuestra que todas las vulnerabilidades sean explotables en este build estático. No se observó adaptador SSR, server islands, MDX ni optimización remota de imágenes en la configuración actual. Sí existe riesgo en herramientas y futuros cambios: evaluar advisories y upgrade antes de producción. No ejecutar dev server expuesto en red ni procesar medios no confiables con herramientas vulnerables.

## Fuentes oficiales consultadas

- [Cloudflare: headers](https://developers.cloudflare.com/pages/configuration/headers/) y [serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/): `_headers` en salida estática y 404 explícito; comportamiento remoto pendiente de verificación.
- [Astro: configuración](https://docs.astro.build/en/reference/configuration-reference/): salida estática/directorios y opciones; compatibilidad local comprobada con la versión instalada.
- [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing): permitir rastreo para leer noindex. Noindex no restringe acceso humano.
- Advisories obtenidos de `npm audit`: [Astro/AVIF](https://github.com/advisories/GHSA-26w7-cxv4-gfx2), [sharp/libheif](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). Revisar aplicabilidad y versión al abordar la actualización.
