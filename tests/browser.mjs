// Ensayo local con perfil temporal; sin dependencias ni mensajes externos.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createStaticServer } from '../server.js';
const root = fileURLToPath(new URL('../', import.meta.url));
let executable;
for (const candidate of [process.env.BROWSER_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].filter(Boolean)) {
  try { await access(candidate); executable = candidate; break; } catch {}
}
if (!executable) throw new Error('Definí BROWSER_PATH con un Chrome/Edge instalado.');
await mkdir(path.join(root, '.astro'), { recursive: true });
const profile = await mkdtemp(path.join(root, '.astro', 'browser-test-'));
const server = await createStaticServer(path.join(root, '.astro', 'validation'));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = 'http://127.0.0.1:' + server.address().port;
const browser = spawn(executable, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
const pending = new Map(), waiters = new Map(), errors = [];
let sequence = 0, checks = 0;
const passed = label => { checks++; console.log('PASS ' + label); };
try {
  const debugURL = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Chromium no inició')), 20000);
    let stderr = '';
    browser.stderr.on('data', chunk => {
      stderr += chunk.toString();
      const match = /DevTools listening on (ws:\/\/[^\s]+)/.exec(stderr);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    browser.on('error', error => { clearTimeout(timer); reject(error); });
    browser.on('exit', code => { clearTimeout(timer); reject(new Error('Chromium finalizó: ' + code)); });
  });
  const target = await (await fetch('http://' + new URL(debugURL).host + '/json/new?about:blank', { method: 'PUT' })).json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  socket.addEventListener('message', message => {
    const data = JSON.parse(message.data);
    if (data.id) {
      const item = pending.get(data.id);
      if (!item) return;
      clearTimeout(item.timer); pending.delete(data.id);
      if (data.error) item.reject(new Error(JSON.stringify(data.error))); else item.resolve(data.result);
    } else {
      if (data.method === 'Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text);
      const waiting = waiters.get(data.method);
      if (waiting) { clearTimeout(waiting.timer); waiters.delete(data.method); waiting.resolve(data.params); }
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('Timeout: ' + method)); }, 10000);
    pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params }));
  });
  const once = method => new Promise((resolve, reject) => {
    const timer = setTimeout(() => { waiters.delete(method); reject(new Error('Timeout evento: ' + method)); }, 15000);
    waiters.set(method, { resolve, reject, timer });
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const navigate = async route => {
    const loaded = once('Page.loadEventFired'); await send('Page.navigate', { url: address + route }); await loaded;
  };
  const capture = async name => {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(root, '.astro', 'validation-' + name + '.png'), Buffer.from(shot.data, 'base64'));
  };
  const key = async (key, code, modifiers = 0) => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers, windowsVirtualKeyCode: key === 'Escape' ? 27 : 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers, windowsVirtualKeyCode: key === 'Escape' ? 27 : 9 });
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['https://*'] });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate('/');
  assert.equal(await evaluate('document.querySelectorAll("#consultaProvincia option").length'), 25);
  assert.equal(await evaluate('document.querySelectorAll("#videosGrid iframe").length'), 0);
  assert.equal(await evaluate('document.querySelector("meta[name=robots]").content'), 'noindex, nofollow');
  passed('HTML: provincias sin duplicación, noindex y videos sin carga externa');
  await evaluate('document.getElementById("mobileToggle").click()');
  assert.equal(await evaluate('document.getElementById("mobileToggle").getAttribute("aria-expanded")'), 'true');
  await key('Escape', 'Escape');
  assert.equal(await evaluate('document.activeElement.id'), 'mobileToggle');
  assert.equal(await evaluate('document.getElementById("mobileToggle").getAttribute("aria-expanded")'), 'false');
  passed('menú móvil: aria-expanded, Escape y devolución de foco');
  await evaluate('document.getElementById("formConsultaPrincipal").requestSubmit()');
  assert.equal(await evaluate('document.getElementById("consultaResultado").hidden'), true);
  await evaluate('document.getElementById("consultaProvincia").value="Tucumán"; document.getElementById("consultaArea").value="Área Penal"; document.getElementById("formConsultaPrincipal").requestSubmit()');
  const contact = await evaluate('document.querySelector("#consultaResultado a").href');
  assert.equal(new URL(contact).pathname, '/5493815736202');
  assert.doesNotMatch(decodeURIComponent(contact), /Tucumán|Penal/);
  assert.equal(await evaluate('localStorage.getItem("valor_consultas_leads")'), null);
  assert.match(await evaluate('document.getElementById("consultaResultado").textContent'), /No se envió/);
  await capture('contact');
  passed('formulario: validación, aviso honesto, mensaje genérico y sin persistencia');
  await evaluate('document.getElementById("chatbotTrigger").click()');
  assert.equal(await evaluate('document.getElementById("chatbotWindow").hidden'), false);
  await evaluate('document.getElementById("chatProvinciaSelect").value="Salta"; document.getElementById("chatProvinciaSelect").dispatchEvent(new Event("change")); document.querySelector("#chatbotMessages .message:last-child button").click()');
  assert.equal(new URL(await evaluate('document.querySelector("#chatbotMessages a").href')).pathname, '/5493815736202');
  await capture('chat');
  await evaluate('document.getElementById("chatbotInput").value="<img src=x onerror=alert(1)>"; document.getElementById("chatbotSend").click()');
  assert.equal(await evaluate('document.querySelectorAll("#chatbotMessages img").length'), 0);
  assert.equal(await evaluate('document.getElementById("chatbotMessages").textContent.includes("<img")'), false);
  await evaluate('document.getElementById("chatbotReset").click()');
  assert.equal(await evaluate('document.querySelectorAll("#chatbotMessages a").length'), 0);
  await key('Escape', 'Escape');
  assert.equal(await evaluate('document.activeElement.id'), 'chatbotTrigger');
  passed('asistente: clasificación, derivación, entrada hostil, reinicio y Escape');
  await evaluate('document.getElementById("adminTriggerFab").focus(); document.getElementById("adminTriggerFab").click()');
  assert.equal(await evaluate('document.activeElement.id'), 'adminModalClose');
  await capture('media');
  await key('Tab', 'Tab', 8);
  assert.notEqual(await evaluate('document.activeElement.id'), 'adminModalClose');
  assert.equal(await evaluate('document.getElementById("adminModalOverlay").contains(document.activeElement)'), true);
  await key('Escape', 'Escape');
  assert.equal(await evaluate('document.activeElement.id'), 'adminTriggerFab');
  passed('panel: foco inicial, ciclo de teclado y retorno de foco');
  await evaluate("localStorage.setItem('valor_asociados_banners', JSON.stringify([{id:'hostile',title:'<img src=x onerror=window.__injected=true>',tag:'<svg onload=alert(1)>',subtitle:'prueba',imageUrl:DEFAULT_BANNERS[0].imageUrl,linkTarget:'javascript:alert(1)'}])); localStorage.setItem('valor_asociados_videos', JSON.stringify([{id:'hostile',title:'<img src=x onerror=window.__injected=true>',description:'<svg onload=alert(1)>',url:'https://youtu.be/ScMzIvxBSi4'}]));");
  await navigate('/');
  assert.equal(await evaluate('Boolean(window.__injected)'), false);
  assert.equal(await evaluate('document.querySelectorAll("#heroSliderContainer img, #heroSliderContainer svg, #videosGrid img, #videosGrid svg").length'), 0);
  assert.equal(await evaluate('document.querySelector("#heroSliderContainer a").getAttribute("href")'), '#contacto');
  passed('medios: texto hostil persistido no ejecuta ni crea enlaces arbitrarios');
  const failure = await evaluate("(() => { const m=window.mediaManagerInstance, original=Storage.prototype.setItem, previous=window.alert; let message=''; window.alert=v=>{message=v}; Storage.prototype.setItem=()=>{throw new Error('QuotaExceededError')}; const before=m.banners.length; m.bannerTitleInput.value='Prueba'; m.tempBannerImageBase64='data:image/png;base64,YQ=='; m.saveNewBanner(); Storage.prototype.setItem=original; window.alert=previous; return {unchanged:before===m.banners.length,message}; })()");
  assert.equal(failure.unchanged, true); assert.match(failure.message, /No se pudo guardar/);
  assert.equal(await evaluate("(() => { const m=window.mediaManagerInstance, set=Storage.prototype.setItem, a=window.alert, c=window.confirm; Storage.prototype.setItem=()=>{throw new Error('QuotaExceededError')}; window.alert=()=>{}; window.confirm=()=>true; const b=m.banners, v=m.videos; m.deleteBanner(b[0].id); m.deleteVideo(v[0].id); Storage.prototype.setItem=set; window.alert=a; window.confirm=c; return m.banners===b && m.videos===v; })()"), true);
  passed('cuota: guardado fallido sin éxito ficticio ni cambios de contenido');
  await evaluate('localStorage.clear()'); await navigate('/');
  for (const width of [320, 390, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: width === 1440 ? 1000 : 844, deviceScaleFactor: 1, mobile: width < 600 });
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'), false, 'overflow at ' + width);
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(path.join(root, '.astro', 'validation-' + width + '.png'), Buffer.from(shot.data, 'base64'));
  }
  passed('layout: 320, 390 y 1440 px sin desborde horizontal; capturas locales');
  await navigate('/mockup/'); await navigate('/no-existe');
  assert.match(await evaluate('document.querySelector("h1").textContent'), /no encontrada/i);
  assert.deepEqual(errors, []);
  passed('mockup y 404 sin excepciones JavaScript');
  console.log(JSON.stringify({ checks, viewportWidths: [320,390,1440], externalResources:'blocked', javascriptExceptions:errors.length }));
} finally {
  socket?.close();
  for (const item of pending.values()) clearTimeout(item.timer);
  for (const item of waiters.values()) clearTimeout(item.timer);
  browser.kill();
  await new Promise(resolve => server.close(resolve));
  assert.equal(path.dirname(profile), path.join(root, '.astro'));
  try { await rm(profile, { recursive:true, force:true, maxRetries:5, retryDelay:200 }); }
  catch { console.log('Perfil temporal retenido bajo .astro; no es el perfil personal.'); }
}

