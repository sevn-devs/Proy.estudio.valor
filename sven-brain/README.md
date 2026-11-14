# Cerebro satélite — Valor y Asociados

Estado: demo; mantener fuera de indexación. Revisión: 2026-11-14.

Este directorio contiene conocimiento interno y nunca debe publicarse como contenido del sitio.
El código y sus evidencias pertenecen a este checkout; Brain consolida únicamente conocimiento revisado por personas.

- [Ficha y arquitectura](product-card.md)
- [Diagnóstico y transferencia](audit.md)
- [Secuencia ISABEL y plan](plan.md)
- [Validaciones](validation.md)
- [Traspaso manual a Brain](handoff.md)
- [Contexto compartido](../docs/SHARED_CONTEXT.md)

Ejecutar `node sven-brain/collect.mjs` desde cualquier directorio para obtener una observación JSON por stdout. Adaptación del recolector existente de SVEN Landing: lista explícita, huellas SHA-256, revisión Git, cobertura y estado local; sin contenidos, secretos, remotos ni red. No constituye sincronización ni aprobación. Una persona revisa el informe y decide su incorporación a Brain. No guardar salidas sensibles ni publicar este directorio.
