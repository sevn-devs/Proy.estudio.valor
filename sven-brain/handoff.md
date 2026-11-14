# Borrador para recolección de SVEN Brain

2026-11-14 · Estado: observación local candidata, pendiente de revisión humana.

- `project_id`: `valor-y-asociados`
- `source_repo`: `sevn-devs/Proy.estudio.valor`
- Base Git: `34a329ce6bf1dae5cfd7900d2c3117ae71ae331e`
- Entorno de avances confirmado: https://estudiovalor-demo.sven.com.ar/. Mantener noindex hasta confirmación del cliente. La comprobación pública del 2026-11-14 no observó noindex en inicio/mockup; corrección local pendiente de publicación humana.
- Capacidades y límites: [ficha](product-card.md).
- Hallazgos: [auditoría](audit.md).
- Evidencia ejecutada: [validación](validation.md).
- Alcance y próximos pasos: [ISABEL](plan.md).

## Integración manual compatible

Se adaptó `sven-landing/sven-brain/collect.mjs` en su contrato existente (schema 1, lista explícita, huellas, SHA Git, estado local, cobertura, fecha y stdout). Se cambiaron identidad del producto y rutas. No se agregó servicio, cron, conexión remota ni sincronización alternativa.

1. Ejecutar `npm run collect` o `node sven-brain/collect.mjs` (este último produce JSON puro).
2. Revisar cobertura, huellas y `working_tree_dirty`. Un SHA identifica la base; las huellas describen archivos locales aún sin confirmar. No afirmar que estos cambios están en GitHub o desplegados.
3. Una persona decide qué conservar y cómo confirmar/publicar. Después puede recolectar desde una revisión accesible y preparar `catalog/products/valor-y-asociados.md` en Brain siguiendo su plantilla.
4. Comparar revisiones y huellas; no sobrescribir decisiones aprobadas ni inferir capacidades por un hash. No enviar código ni contenidos de consultas.

## Aprendizajes candidatos

- Diferenciar «preparar contacto», «abrir servicio externo» y «consulta recibida» con pruebas observables.
- localStorage no equivale a administración remota.
- Un servidor estático nunca debe recurrir al checkout cuando falta un recurso del build.
- El estado de demo debe abarcar HTML directo, páginas embebidas y cabeceras; noindex no es control de acceso.
- Probar datos hostiles persistidos y ausencia de datos en enlaces, además del build.

## Límite documental central

El README de Brain se presenta como distribución portable ISABEL y recomienda alojarla fuera de `sevn-devs/sven-brain`, mientras el árbol también contiene catálogo/skills compartidas. Se registra la discrepancia para resolución humana central. No se eligió un repositorio nuevo, instalación o publicación. La etapa genérica de PR en `brain-sync.md` no se ejecuta por las reglas explícitas del usuario.

`skills/isabel-unleash/references/north-star-contract.md` no estuvo disponible al intentar leerlo; no se usó como fuente. Se utilizó la salida definida en `SKILL.md`. No se encontraron auditorías Markdown adicionales de Shanti: se contrastaron README, código e historial, sin atribuirles pruebas no ejecutadas.
