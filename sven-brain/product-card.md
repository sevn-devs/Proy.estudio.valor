# Estudio Jurídico Valor y Asociados

- Estado: demo para mostrar avances, confirmado por el usuario el 2026-11-14. Debe permanecer fuera de indexación hasta la confirmación del cliente. El noindex está implementado localmente; aún no se observó en las respuestas públicas comprobadas.
- Entorno de avances: https://estudiovalor-demo.sven.com.ar/ (URL aportada por el usuario y comprobada por HTTP). Dominio definitivo: Por confirmar.
- Repositorio: https://github.com/sevn-devs/Proy.estudio.valor (verificado con la configuración local de Git; no se consultó GitHub).
- Responsable de producto, contacto técnico y aprobación editorial: Por confirmar.
- Base auditada: `34a329ce6bf1dae5cfd7900d2c3117ae71ae331e`; árbol limpio al inicio.
- Última revisión: 2026-11-14. Cambios de esta sesión aún locales.

## Propósito y alcance

Plataforma institucional para presentar el estudio, especialidades, contenidos multimedia y canales de contacto. Asistente guiado para clasificar la consulta y derivar a atención humana. Fuente: pedido del usuario de esta sesión.

El plazo de **45 días hábiles** es una estimación comercial aportada por el usuario, no un calendario recalculado ni una fecha comprometida. Inicio, capacidad, responsables y disponibilidad: Por confirmar. CRM, turnero, administración avanzada, automatizaciones complejas e integraciones adicionales quedan fuera.

## Arquitectura observada

Astro SSG con componentes `.astro`, CSS y JavaScript nativos. Única dependencia directa: Astro `^5.0.0`, lock `5.18.2`. No se agregó framework ni servicio. Runtime observado: Node `26.13.1`, npm `11.20.0`; esto no fija la versión productiva. El inventario de vulnerabilidades se describe en la auditoría.

```text
src/pages/ -> Layout + componentes Astro -> build -> dist/
public/ -> CSS, scripts, mockup y cabeceras -> dist/
navegador -> selección efímera -> enlace genérico a WhatsApp
panel de medios -> localStorage del dispositivo (solo medios de prueba)
sven-brain/ + docs/ -> conocimiento interno fuera del sitio
```

| Fuente | Función y límite |
|---|---|
| `src/pages/index.astro` | Institucional, áreas, contacto, sedes y demo de medios |
| `src/pages/mockup.astro`, `public/mockup.html` | Prototipo visual conservado; noindex |
| `src/pages/404.astro` | Respuesta para rutas inexistentes, sin canonical |
| `src/layouts/Layout.astro` | Metadatos, recursos y scripts solo en páginas interactivas |
| `src/data/legalData.js` | Datos usados al compilar; contenido comercial pendiente de aprobación |
| `public/assets/js/data.js` | Datos del navegador y base jurídica heredada; el nuevo bot no usa sus respuestas jurídicas |
| `safety.js`, `main.js`, `chatbot.js` | URLs restringidas, contacto mínimo, menú y clasificación controlada |
| `media-manager.js`, `AdminModal.astro` | Medios locales; no hay backend, cuentas, roles, sincronización ni publicación |
| `server.js` | Vista previa HTTP restringida al build, sin fallback a la raíz |

## Capacidades y privacidad

El formulario permite elegir provincia y área. El asistente permite clasificar, reiniciar y abrir un contacto. Ninguno registra ni transmite consultas a una API propia, agenda turnos o confirma recepción. El enlace a WhatsApp elige un número ya existente según la provincia y lleva exclusivamente un saludo genérico; el usuario decide qué enviar en el servicio externo.

La eliminación de la captura de nombre, teléfono y relato es una mitigación deliberada del riesgo de consultas sensibles. No se eliminaron automáticamente valores históricos de `valor_consultas_leads` en navegadores anteriores: una persona debe decidir su limpieza con conocimiento de la posible pérdida de datos. No exportarlos al cerebro.

El administrador guarda medios de prueba en localStorage, con límites de tipo/tamaño y avisos de errores. Ese mecanismo no alcanza para administrar contenido compartido. Teléfonos, direcciones, correo, cobertura, horarios, tarifas, promesas y correspondencia de videos: **Por confirmar**. Su presencia en código no demuestra aprobación.

## Operación

- Compilar: `npm run build`; revisión local que preserva dist: `npm run build -- --outDir .astro/validation`.
- Pruebas: `npm test`; navegador: `node tests/browser.mjs` (requiere Chrome/Edge instalado y build de validación).
- Servidor: `npm start`, exige un build con `_headers`. `HOST` y `PORT` son nombres de configuración del servidor local; no contienen secretos. Por defecto escucha solo loopback. El responsable define valores al operar.
- Cloudflare Pages: propuesta local de salida `dist`, comando `npm run build`. El dominio de demo está confirmado y las respuestas declaran Cloudflare; cuenta, proyecto de hosting, rama, revisión desplegada y disparador no verificados. No se ejecutó despliegue.
- Sin canonical, sitemap ni Schema.org comercial en esta demo. Prepararlos únicamente con dominio y datos aprobados, manteniendo coherencia por ruta y sin inventar imagen social.
- Sin analítica agregada. Fuentes/CDN/imágenes externas permanecen y requieren revisión de privacidad; YouTube se solicita únicamente al activar su control.
