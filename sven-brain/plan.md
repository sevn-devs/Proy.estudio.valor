# ISABEL y plan de ejecución

2026-11-14 · Secuencia realizada: Guidance → Unleash → Equalizer. No agentes paralelos. Fuente del alcance: pedido de modernización y confirmación de demo/noindex del usuario.

## Guidance — ficha semilla

- **Intención:** aplicar aprendizajes comprobables sin reescribir el producto ni ampliar compromisos.
- **Actores:** visitantes con consultas potencialmente sensibles, equipo del estudio, responsables SVEN de implementación y publicación. Validadores concretos: Por confirmar.
- **Verificado:** Astro estático, fuentes duplicadas, scripts con captura local de consultas, servidor con fallback a raíz, medios solo locales, fuentes de referencia disponibles. Ver auditoría para evidencias.
- **Inferencia:** la confusión entre prueba local y publicación puede inducir a creer que se recibió una consulta o se publicó contenido.
- **Desconocido:** dominio final, alojamiento activo, responsables, licencias/editorial, validez de ofertas, capacidad y comienzo de plazo.
- **Restricciones duras:** solo Valor; referencias de lectura; sin publicación, secretos, pagos, IA generativa, CRM, migraciones destructivas ni staging.
- **Inclusiones:** diagnóstico, correcciones incrementales de seguridad/privacidad/UX, preparación estática y satélite.
- **Éxito observable:** no persistir consultas; WhatsApp sin contenido sensible; entradas no ejecutables; rutas privadas inaccesibles; 404 real; demo noindex; build y evidencias diferenciadas.
- **Matriz transversal:** `docs/SHARED_CONTEXT.md`. Áreas no cubiertas por skills aprobadas se registran como tales.
- **Handoff:** listo para Unleash; no se requiere decidir el dominio para corregir la demo.

## Unleash — visión norte y alternativas

Visión norte: un primer contacto claro que preserve privacidad y permita al profesional hacerse cargo del caso, con conocimiento local trazable para mantenimiento.

| Lente | Pregunta / aporte | Contraste y prueba que puede refutar |
|---|---|---|
| Privacidad | ¿Hace falta pedir el caso antes de abrir un canal? Minimizar selección y mensaje | Si una operación validada necesita más datos, evaluar consentimiento y recepción segura antes de ampliar |
| UX/accesibilidad | ¿Se comprende qué ocurrió? Mostrar selección y salida externa, nunca recepción ficticia | Recorrido con teclado y móvil debe permitir completar o abandonar |
| Arquitectura/operación | ¿Puede el sitio seguir estático? Sí para presentación y derivación | Un CMS compartido real exige requisitos de roles, persistencia y soporte |
| SEO/editorial | ¿Se debe indexar contenido de prueba? No, confirmado por el usuario | Solo una aprobación editorial y de dominio habilita preparar lanzamiento |

Alternativa evolutiva elegida: endurecer Astro existente y derivación mínima, sin nuevas dependencias. Alternativa diferenciadora futura: edición editorial compartida autenticada, condicionada a requisitos y presupuesto. Alternativa sin desarrollo: edición de contenido fuente y publicación humana; suficiente mientras el estudio no requiera CMS. Descartada para este alcance: IA generativa, CRM/agenda y migración de framework. No se crean skills nuevas: los vacíos se documentan y las existentes cubren el método.

## Equalizer — GO_WITH_CONDITIONS para trabajo local

| Prioridad / stopper | Acción y dependencia | Aceptación | Validación humana pendiente |
|---|---|---|---|
| P0, S4 riesgo crítico | Quitar persistencia y relato de WhatsApp; limitar servidor al build | Pruebas de URLs, entradas hostiles y HTTP privado/404 | Tratamiento histórico de datos; privacidad y canales reales |
| P1, S2/13 | Escapar medios, restringir URLs y tamaños; explicitar alcance local | Texto hostil no ejecuta; errores de storage no anuncian éxito | CMS futuro separado |
| P1, S3 requisitos | Demo noindex, fuentes activas claras, rutas válidas | HTML/cabeceras y robots verificados | Dominio, editorial y publicación |
| P1, S3 verificabilidad | Menú/chat con Escape, foco, campos etiquetados, medios manuales | Recorridos de navegador y comprobaciones locales | Revisión con tecnologías asistivas |
| P1, S4 dependencias | Evaluar actualización mayor de Astro por resultado de audit | Upgrade separado con build, rutas, interacción y audit | Responsable técnico y entorno de Node |
| P2, S2 optimización | Medir CWV y recursos externos antes de sustituir activos | Medición reproducible, separar laboratorio/campo | Activos aprobados y pruebas móviles reales |
| P2, S3 capacidad/fechas | Confirmar responsables, capacidad, dependencias editoriales y operación | Plan humano fechado | No convertir 45 días hábiles en promesa nueva |

Retorno acotado a Guidance: incertidumbre de indexación resuelta por respuesta del usuario («Es una demo; mantenerla fuera de indexación»). No cambió la visión norte; no fue necesario repetir Unleash. La discrepancia entre README de Brain (paquete ISABEL) y su árbol de conocimiento se registra en `handoff.md`; no se modifica el repositorio de referencia ni se decide dónde debe instalarse la suite.

## Decisiones locales y reversibilidad

1. Conservar Astro y CSS existentes. Sin rediseño ni dependencias nuevas.
2. Sustituir la captura excesiva y respuestas jurídicas del bot por clasificación controlada. Los textos jurídicos heredados permanecen como material pendiente, fuera del recorrido activo.
3. Mantener el prototipo multimedia con mensajes honestos; no convertir almacenamiento del navegador en CMS.
4. Mantener demo noindex; diferir canonical, sitemap, Schema.org e imagen social hasta contar con datos aprobados.
5. No regenerar `dist/` versionado en esta revisión; probar salida separada. Antes de publicar, compilar de nuevo. El cambio no es una migración de contenido ni elimina datos persistidos previamente.

Los cambios se revisan por grupos con `git diff`. No usar rollback masivo si hay trabajo posterior: revisar archivo por archivo. No se ejecutaron commits ni acciones remotas.
