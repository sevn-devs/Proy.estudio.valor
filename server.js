import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm' };
const within = (root, file) => { const relative = path.relative(root, file); return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative)); };

export async function createStaticServer(directory = path.join(repository, 'dist')) {
  const root = await realpath(directory);
  // Leer las mismas cabeceras globales que usará Cloudflare Pages.
  const headerFile = await readFile(path.join(root, '_headers'), 'utf8');
  const headers = {};
  let global = false;
  for (const line of headerFile.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { global = line.trim() === '/*'; continue; }
    const colon = line.indexOf(':');
    if (global && colon > 0) headers[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return http.createServer(async (req, res) => {
    const finish = (status, content, type = 'text/plain; charset=utf-8', extra = {}) => {
      res.writeHead(status, { ...headers, 'Content-Type': type, 'Cache-Control': 'no-cache', ...extra });
      res.end(req.method === 'HEAD' ? undefined : content);
    };
    if (!['GET', 'HEAD'].includes(req.method)) { finish(405, 'Método no permitido', undefined, { Allow: 'GET, HEAD' }); return; }
    let pathname;
    try { pathname = decodeURIComponent(req.url.split('?')[0]); }
    catch { finish(400, 'Solicitud inválida'); return; }
    // Rechazar segmentos ocultos, traversal, separadores Windows y controles.
    if (!pathname.startsWith('/') || pathname.startsWith('//') || /[\\\x00-\x1f\x7f:]/.test(pathname) || pathname.split('/').some(part => part.startsWith('.'))) {
      finish(404, 'Página no encontrada'); return;
    }
    const candidate = path.resolve(root, '.' + pathname);
    if (!within(root, candidate)) { finish(404, 'Página no encontrada'); return; }
    let target = candidate;
    try {
      const info = await stat(target);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) { finish(308, '', undefined, { Location: pathname + '/' }); return; }
        target = path.join(target, 'index.html');
      }
      const resolved = await realpath(target);
      if (!within(root, resolved) || !(await stat(resolved)).isFile() || !types[path.extname(resolved)]) {
        finish(404, 'Página no encontrada'); return;
      }
      finish(200, await readFile(resolved), types[path.extname(resolved)]);
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) { finish(500, 'Error interno'); return; }
      try { finish(404, await readFile(path.join(root, '404.html')), types['.html']); }
      catch { finish(404, 'Página no encontrada'); }
    }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // Solo servir el build. Nunca recurrir a la raíz ni simular rutas inexistentes.
  const server = await createStaticServer();
  server.listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => {
    console.log('Vista previa de Valor disponible en el puerto configurado.');
  });
}
