# Contexto SVEN consultado y aplicación local

2026-11-14. Aplicación solicitada por el usuario para esta modernización; no implica instalación de skills, aprobación de sus borradores ni adopción permanente por una persona. Responsable de ratificar versiones: Por confirmar.

| Material / fuente verificada | Versión/estado observado | Relación | Aplicación/adaptación |
|---|---|---|---|
| Brain `skills/shared/local-first-human-release/SKILL.md` | 0.1.0, draft | Aplica | Cambios locales; publicación humana, sin instalar copia |
| Brain `skills/isabel-guidance`, `isabel-unleash`, `isabel-equalizer` | Suite portable identificada en README como v0.4-team.1 | Aplica | Secuencia única en `sven-brain/plan.md`; variantes `shared/` como antecedentes, sin instalación |
| Brain `skills/shared/sven-seo-visibility/SKILL.md` | 0.1.0, draft | Aplica | AUDIT e IMPLEMENT acotados; noindex, pruebas de HTML/HTTP; lanzamiento pendiente |
| Brain `skills/shared/landing-page-second-brain/SKILL.md` | 0.1.0, draft | Aplica | Brief, integridad editorial, identidad conservada; caso Valor como antecedente, no prueba productiva |
| Brain `skills/shared/sven-landing-page-builder/SKILL.md` | 0.1.0, draft | Aplica | Componentes existentes, JS nativo, canales explícitos y comprobación de interacción |
| Landing `.agents/skills/astro-static-architecture/SKILL.md` | Sin versión declarada | Intersección | SSG, dependencias mínimas y rutas verificadas; no adoptar dominio/rutas/política específica de Landing |
| Landing `.agents/skills/frontend-quality-and-seo/SKILL.md` | Sin versión declarada | Intersección | Verificar salida y separar producción de local; no copiar canonical, GTM, marca o cabeceras sin adaptación |
| Brain `skills/shared/request-shaping` | Índice consultado | No requerido | Pedido suficientemente completo; indexación aclarada puntualmente |
| Brain `skills/skysoul`, `adapters/isabel` | Inventario/contrato consultados | Intersección documental | Contrato de traspaso; no instalación ni publicación |
| Landing `apple-design`, `sven-technical-content`, `sven-safe-workflows` | Inventario consultado; contenido no ejecutado | Fuera de alcance como skills | No rediseño Apple ni contenido corporativo SVEN; gobernanza cubierta por usuario y local-first |
| Brain `devops`, `product-design`, `project-quality`, `commercial` | Directorios de área en índice; sin SKILL.md descubierto | Por confirmar | No afirmar certificación DevOps, seguridad, QA o comercial; usar evidencia y responsables humanos |
| Brain `standards/README.md` | Convención de aprobación | Intersección | No se encontraron estándares adicionales versionados; ningún draft se declara aprobado |

Fuentes centrales consultadas sin cambios: `AGENTS.md`, `docs/WORKFLOW.md`, `templates/product-card.md`, `templates/SHARED_CONTEXT.md`, `templates/SHARED_UPDATE.md`, `skills/skysoul/references/brain-sync.md`.

## Adaptaciones y límites

La instrucción directa del usuario de mantener la demo fuera de indexación determina robots/noindex. Los ejemplos de SEO productivo no habilitan reutilizar dominios, ofertas ni identificadores. El contrato de Brain contempla publicación en su descripción general; esta sesión aplica el límite explícito del usuario: únicamente borrador y recolección local, sin PR ni publicación. No hay sincronización automática.

No se crean nuevas skills. Seguridad especializada, validación jurídica, auditoría asistiva y operación productiva requieren responsables; proponer una skill solo si aparece un procedimiento reutilizable no cubierto.
