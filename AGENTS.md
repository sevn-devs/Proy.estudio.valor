# Valor y Asociados — contexto de trabajo

- Demo institucional de avances: https://estudiovalor-demo.sven.com.ar/ (confirmada por el usuario). Mantener `noindex, nofollow` en todas las páginas y cabeceras hasta la confirmación del cliente y una decisión humana explícita de habilitar indexación. Mostrar avances en esta URL no autoriza indexar ni desplegar automáticamente.
- Leer `sven-brain/README.md`, `product-card.md`, `audit.md`, `plan.md` y `validation.md` antes de cambiar alcance.
- Fuente activa: `src/`, `public/`, `astro.config.mjs`, `server.js`. `index.html`, `assets/`, ofuscadores, robots/sitemap de raíz y `dist/` versionado son herencia; no editarlos como fuente ni publicarlos directamente.
- Compilar en `.astro/validation` para validar sin reescribir `dist/` preexistente. El despliegue humano debe generar `dist/` desde fuentes actuales.
- No guardar consultas, relatos, datos personales ni secretos. WhatsApp solo lleva un saludo genérico. No agregar IA generativa, CRM, turnero ni servicios pagos.
- El panel de medios es una demo local sin autenticación ni publicación remota. No presentarlo como CMS.
- Aplicar `local-first-human-release` desde el checkout central disponible; no instalar ni sincronizar skills automáticamente.
- Preservar cambios ajenos. No hacer staging, commits, push, PR, Issues, releases ni despliegues. Solo un pedido humano explícito puede habilitar un commit local; la publicación permanece humana.
- Hechos comerciales y contenido jurídico requieren fuente y validación del responsable. Lo desconocido se registra como `Por confirmar`.
- La recolección manual está en `sven-brain/collect.mjs`. No publicar documentos internos ni copiar código de productos al repositorio central.
