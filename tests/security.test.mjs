import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createContext, runInContext } from 'node:vm';
import http from 'node:http';
import path from 'node:path';
import { createStaticServer } from '../server.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const context = createContext({ URL });
runInContext(await readFile(new URL('../public/assets/js/safety.js', import.meta.url), 'utf8'), context);
const safety = runInContext('ValorSafety', context);

test('entradas hostiles se muestran como texto, no etiquetas ni atributos', () => {
  const value = safety.escapeHTML('<img src=x onerror="alert(1)">\'&');
  assert.equal(value, '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&#39;&amp;');
  assert.equal(safety.escapeHTML(null), '');
});

test('medios solo admiten los esquemas y hosts previstos', () => {
  for (const bad of ['javascript:alert(1)', 'https://www.youtube.com.evil.test/embed/ScMzIvxBSi4', 'https://evil.test/embed/x', 'https://user:pass@youtube.com/watch?v=ScMzIvxBSi4', 'data:image/svg+xml,<svg onload=alert(1)>']) {
    assert.equal(safety.videoURL(bad), '');
    assert.equal(safety.imageURL(bad), '');
  }
  assert.equal(safety.videoURL('https://youtu.be/ScMzIvxBSi4?t=2'), 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4');
  assert.equal(safety.videoURL('https://www.youtube.com/watch?v=ScMzIvxBSi4'), 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4');
  assert.equal(safety.videoURL('data:video/webm;base64,YQ=='), 'data:video/webm;base64,YQ==');
  assert.equal(safety.imageURL('data:image/png;base64,YQ=='), 'data:image/png;base64,YQ==');
});

test('WhatsApp usa destino controlado y saludo sin datos de la selección', () => {
  const generic = new URL(safety.whatsappURL('Tucumán'));
  assert.equal(generic.hostname, 'wa.me');
  assert.equal(generic.pathname, '/5493815736202');
  assert.equal(new URL(safety.whatsappURL('Buenos Aires')).pathname, '/5491134614115');
  assert.equal(new URL(safety.whatsappURL('Salta')).pathname, '/5493815736202');
  assert.equal(generic.search, new URL(safety.whatsappURL('dato privado')).search);
  assert.doesNotMatch(generic.searchParams.get('text'), /Tucumán|penal|documento/i);
});

test('servidor devuelve 404 real, rechaza traversal y nunca sirve raíz ni archivos internos', async () => {
  await mkdir(path.join(root, '.astro'), { recursive: true });
  const fixture = await mkdtemp(path.join(root, '.astro', 'server-test-'));
  const output = path.join(fixture, 'output');
  await mkdir(output);
  await mkdir(path.join(output, 'mockup'));
  await writeFile(path.join(output, 'index.html'), '<h1>Demo</h1>');
  await writeFile(path.join(output, '404.html'), '<h1>No encontrada</h1>');
  await writeFile(path.join(output, 'mockup', 'index.html'), '<h1>Mockup</h1>');
  await writeFile(path.join(fixture, 'private.txt'), 'not public');
  await writeFile(path.join(output, '_headers'), await readFile(path.join(root, 'public/_headers')));
  const server = await createStaticServer(output);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const request = (url, method = 'GET') => new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: url, method }, res => {
      let body = ''; res.setEncoding('utf8'); res.on('data', data => body += data);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject); req.end();
  });
  try {
    assert.equal((await request('/')).status, 200);
    assert.equal((await request('/mockup')).status, 308);
    assert.equal((await request('/mockup/')).status, 200);
    assert.equal((await request('/%ZZ')).status, 400);
    assert.equal((await request('/', 'POST')).status, 405);
    assert.equal((await request('/', 'HEAD')).body, '');
    for (const url of ['/missing', '/private.txt', '/package.json', '/.git/config', '/sven-brain/audit.md', '/%2e%2e/private.txt', '/..%5cprivate.txt', '//outside.test/', '/index.html:stream', '/_headers']) {
      const response = await request(url);
      assert.equal(response.status, 404, url);
      assert.doesNotMatch(response.body, /not public|root|D:\\Repositorios/);
      assert.equal(response.headers['x-robots-tag'], 'noindex, nofollow');
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
    // Solo el fixture creado por este test, dentro del directorio de validación.
    assert.equal(path.dirname(fixture), path.join(root, '.astro'));
    await rm(fixture, { recursive: true, force: true });
  }
});

test('build de demo mantiene noindex, rutas y fuentes internas fuera de publicación', async () => {
  const output = path.join(root, '.astro', 'validation');
  const html = await readFile(path.join(output, 'index.html'), 'utf8');
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal((html.match(/<main[\s>]/g) || []).length, 1);
  assert.doesNotMatch(html, /id="consultaNombre"|id="consultaMensaje"|rel="canonical"/);
  for (const route of ['mockup/index.html', 'mockup.html', '404.html']) {
    assert.match(await readFile(path.join(output, route), 'utf8'), /name="robots" content="noindex, nofollow"/);
  }
  assert.equal(await readFile(path.join(output, '_headers'), 'utf8'), await readFile(path.join(root, 'public/_headers'), 'utf8'));
  await assert.rejects(readFile(path.join(output, 'sven-brain', 'audit.md')), { code: 'ENOENT' });
  await assert.rejects(readFile(path.join(output, 'sitemap.xml')), { code: 'ENOENT' });
});

test('recolector exporta huellas autorizadas sin contenido, remotos ni datos', () => {
  const output = execFileSync(process.execPath, [path.join(root, 'sven-brain/collect.mjs')], { cwd: root, encoding: 'utf8' });
  const snapshot = JSON.parse(output);
  assert.equal(snapshot.schema_version, 1);
  assert.equal(snapshot.project_id, 'valor-y-asociados');
  assert.equal(snapshot.status, 'observed');
  assert.match(snapshot.last_scanned_sha, /^[a-f0-9]{40}$/);
  assert.equal(typeof snapshot.working_tree_dirty, 'boolean');
  assert.ok(Number.isFinite(Date.parse(snapshot.scanned_at_utc)));
  const paths = snapshot.findings.map(item => item.path);
  assert.deepEqual(paths, [...new Set(paths)].sort());
  for (const item of snapshot.findings) {
    assert.deepEqual(Object.keys(item).sort(), ['path', 'sha256', 'status']);
    assert.match(item.sha256, /^[a-f0-9]{64}$/);
    assert.doesNotMatch(item.path, /\.env|\.git\/|node_modules|^dist\//);
  }
  assert.doesNotMatch(output, /<script|valor_consultas_leads|D:\\\\Repositorios/);
});
