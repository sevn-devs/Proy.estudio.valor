document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('heroSliderContainer')) window.mediaManagerInstance = new MediaManager();
  if (document.getElementById('chatbotWidget')) window.chatbotInstance = new LegalChatbot();
  initConsultationForm();
  initTearTabs();
  initMobileMenu();
  document.querySelectorAll('a[target="_blank"]').forEach(link => { link.rel = 'noopener noreferrer'; });
});

function initConsultationForm() {
  const form = document.getElementById('formConsultaPrincipal');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const province = document.getElementById('consultaProvincia').value;
    const area = document.getElementById('consultaArea').value;
    if (!ARGENTINA_PROVINCIAS.includes(province)) return;
    const result = document.getElementById('consultaResultado');
    const summary = document.createElement('p');
    summary.textContent = `Selección: ${province} · ${area}. No se envió una consulta. El enlace abre WhatsApp con un saludo genérico; vos decidís qué enviar allí.`;
    const link = document.createElement('a');
    link.className = 'btn btn-whatsapp';
    link.textContent = 'Abrir WhatsApp (servicio externo)';
    link.href = ValorSafety.whatsappURL(province);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    result.replaceChildren(summary, link);
    result.hidden = false;
    link.focus();
  });
}

function initTearTabs() {
  document.querySelectorAll('.tear-tab').forEach(tab => {
    tab.addEventListener('click', async () => {
      const phone = tab.getAttribute('data-phone');
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      let copied = false;
      try { await navigator.clipboard.writeText(phone); copied = true; } catch { /* Acceso opcional. */ }
      if (confirm(`${phone}${copied ? ' (copiado)' : ''}. ¿Querés abrir WhatsApp?`)) {
        window.open(`https://wa.me/549${cleanPhone}`, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('navLinks');
  if (!toggle || !nav) return;
  const setOpen = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    const symbol = document.createElement('span');
    symbol.className = 'control-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = open ? '×' : '☰';
    toggle.replaceChildren(symbol);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
  });
}
