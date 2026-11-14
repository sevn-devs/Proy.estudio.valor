// Adaptado del recolector manual de SVEN Landing, revisión 04655813.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
const git = (...args) => execFileSync('git', ['--no-optional-locks', '-C', root, ...args], {
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
}).trim();
const evidencePaths = [
  'AGENTS.md', 'README.md', 'astro.config.mjs', 'package.json', 'package-lock.json',
  'server.js', 'public/_headers', 'public/robots.txt', 'public/mockup.html',
  'src/layouts/Layout.astro', 'src/pages/index.astro', 'src/pages/404.astro',
  'src/pages/mockup.astro', 'src/components/Chatbot.astro',
  'src/components/ConsultationForm.astro', 'src/components/AdminModal.astro',
  'src/components/HeroSlider.astro', 'src/components/Navbar.astro', 'src/components/VideoGallery.astro',
  'src/data/legalData.js', 'public/assets/js/data.js', 'public/assets/js/safety.js',
  'public/assets/js/main.js', 'public/assets/js/chatbot.js', 'public/assets/js/media-manager.js',
  'public/assets/css/styles.css', 'docs/SHARED_CONTEXT.md', 'sven-brain/README.md',
  'sven-brain/product-card.md', 'sven-brain/audit.md', 'sven-brain/plan.md',
  'sven-brain/validation.md', 'sven-brain/handoff.md', 'sven-brain/collect.mjs',
  'tests/security.test.mjs', 'tests/browser.mjs',
];
function fingerprint(relativePath) {
  const file = join(root, relativePath);
  try {
    if (realpathSync(file) !== file || !lstatSync(file).isFile()) return { path: relativePath, status: 'skipped' };
    return { path: relativePath, status: 'observed', sha256: createHash('sha256').update(readFileSync(file)).digest('hex') };
  } catch (error) {
    if (error.code === 'ENOENT') return { path: relativePath, status: 'missing' };
    throw error;
  }
}
try {
  if (realpathSync(git('rev-parse', '--show-toplevel')) !== root) throw new Error('Unexpected repository root');
  const state = () => ({
    last_scanned_sha: git('log', '-1', '--format=%H'),
    working_tree_dirty: Boolean(git('status', '--porcelain=v1', '--untracked-files=normal')),
  });
  const before = state();
  const findings = [...evidencePaths].sort().map(fingerprint);
  const after = state();
  if (JSON.stringify(before) !== JSON.stringify(after) ||
      JSON.stringify(findings) !== JSON.stringify([...evidencePaths].sort().map(fingerprint))) throw new Error('Source changed');
  console.log(JSON.stringify({
    schema_version: 1, project_id: 'valor-y-asociados',
    source_repo: 'sevn-devs/Proy.estudio.valor', source_type: 'local-working-tree',
    ...after, scanned_at_utc: new Date().toISOString(),
    status: findings.every(item => item.status === 'observed') ? 'observed' : 'partial', findings,
  }, null, 2));
} catch {
  console.error('No se pudo recolectar evidencia. Revisá Git, permisos y estabilidad del checkout.');
  process.exitCode = 1;
}

