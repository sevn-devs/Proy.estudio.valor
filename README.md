# Valor y Asociados — demo institucional

Sitio Astro estático con presentación de especialidades, contacto por WhatsApp y asistente guiado de clasificación. **Es una demo fuera de indexación.** No confirma recepción de consultas, no agenda turnos y no ofrece asesoramiento jurídico personalizado.

Entorno para mostrar avances: https://estudiovalor-demo.sven.com.ar/. La indexación debe seguir deshabilitada hasta la confirmación del cliente. Atención: el noindex preparado localmente todavía no aparece en la portada ni en `/mockup/` publicados, según la comprobación del 2026-11-14. Ver [evidencia pública](sven-brain/validation.md#comprobación-del-entorno-público-de-avances).

El panel de medios permite probar banners y videos **solo en el navegador actual** mediante localStorage. No es un CMS autenticado ni publica contenidos para otros visitantes. No cargar datos de casos reales.

## Desarrollo y validación

Dependencias existentes: `npm ci` para una instalación reproducible decidida por el responsable. Consultar primero el resultado de vulnerabilidades en [la auditoría](sven-brain/audit.md); no ejecutar `audit fix --force` como reemplazo de una actualización revisada.

```sh
npm run dev
npm run build -- --outDir .astro/validation
npm test
node tests/browser.mjs
node sven-brain/collect.mjs
```

El ensayo de navegador requiere Chrome/Edge instalado (o `BROWSER_PATH`), usa un perfil temporal y bloquea HTTPS externo. Las capturas quedan bajo `.astro/`. Las pruebas Node requieren el build de validación previo. No hay linter configurado; las comprobaciones de sintaxis no equivalen a lint ni a revisión WCAG completa.

## Fuente activa y publicación humana

- Editar `src/` y `public/`; `astro.config.mjs` controla la compilación.
- `index.html`, `mockup.html`, `assets/`, `robots.txt`, `sitemap.xml` y ofuscadores de la raíz son material heredado. No se usan como fuente del build Astro. No publicar la raíz del repositorio.
- `dist/` ya estaba versionado. Se agregó a `.gitignore`, lo cual **no lo desversiona**. Esta revisión lo preserva y valida en `.astro/validation`; la persona responsable debe generar un nuevo build antes de cualquier publicación.
- `npm run build` genera `dist/`. `npm start` sirve exclusivamente ese build y requiere `_headers`, sin fallback al checkout; por defecto solo loopback. `HOST`/`PORT` son parámetros de operación, no secretos.
- Preparación local para Cloudflare Pages: build `npm run build`, salida `dist`, `_headers` y `404.html`. No se accedió a una cuenta ni se desplegó. HTTPS, dominio, rama, caché, entorno y rollback quedan por confirmar.
- Mantener `noindex, nofollow`. Canonical, sitemap, Schema.org, imagen social y revisión editorial del dominio definitivo quedan para una autorización de lanzamiento.

## Conocimiento y privacidad

[Cerebro satélite](sven-brain/README.md) · [Diagnóstico y transferencia](sven-brain/audit.md) · [Plan ISABEL](sven-brain/plan.md) · [Validación](sven-brain/validation.md) · [Contexto compartido](docs/SHARED_CONTEXT.md).

No se persisten consultas nuevas ni se incluyen datos personales en enlaces de WhatsApp. Los datos históricos que pudiera tener una versión anterior en `valor_consultas_leads` no se borran automáticamente: su limpieza requiere una decisión informada. No exportarlos al satélite ni a Brain.

Datos de contacto, cobertura, horarios, condiciones comerciales y contenidos jurídicos presentes en la demo: pendientes de validación del estudio. El pedido comercial contempla plataforma institucional y asistente guiado, con estimación de 45 días hábiles; no incluye automáticamente CRM, agenda, administración avanzada ni IA generativa.
