/* Recorrido controlado, sin IA, asesoramiento personalizado ni almacenamiento. */
class LegalChatbot {
  constructor() {
    this.window = document.getElementById('chatbotWindow');
    this.trigger = document.getElementById('chatbotTrigger');
    this.input = document.getElementById('chatbotInput');
    this.messages = document.getElementById('chatbotMessages');
    this.province = null;
    this.area = null;
    this.trigger.addEventListener('click', () => this.toggleWindow());
    document.getElementById('chatbotClose').addEventListener('click', () => this.closeWindow());
    document.getElementById('chatbotReset').addEventListener('click', () => this.reset());
    document.getElementById('chatbotSend').addEventListener('click', () => this.handleUserSubmit());
    this.input.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); this.handleUserSubmit(); }
    });
    this.window.addEventListener('keydown', event => {
      if (event.key === 'Escape') this.closeWindow();
    });
    this.renderWelcome();
  }
  toggleWindow() {
    if (!this.window.hidden) { this.closeWindow(); return; }
    this.window.hidden = false;
    this.window.classList.add('open');
    this.trigger.setAttribute('aria-expanded', 'true');
    const badge = document.getElementById('chatbotBadge');
    if (badge) badge.hidden = true;
    this.input.focus();
  }
  closeWindow() {
    this.window.hidden = true;
    this.window.classList.remove('open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.focus();
  }
  appendMessage(text, options = []) {
    const message = document.createElement('div');
    message.className = 'message bot';
    const body = document.createElement('p');
    body.textContent = text;
    message.appendChild(body);
    const actions = document.createElement('div');
    actions.className = 'message-options';
    for (const option of options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chat-option-btn';
      button.textContent = option.label;
      button.addEventListener('click', () => {
        actions.remove();
        option.action();
        this.messages.lastElementChild?.querySelector('button, select, a')?.focus();
      });
      actions.appendChild(button);
    }
    message.appendChild(actions);
    this.messages.appendChild(message);
    this.messages.scrollTop = this.messages.scrollHeight;
  }
  renderWelcome() {
    this.appendMessage('Soy el asistente guiado de Valor y Asociados. Organizo el contacto inicial; no doy asesoramiento jurídico ni reemplazo a un profesional. No ingreses nombres, documentos ni relatos del caso. ¿Desde qué provincia consultás?');
    const label = document.createElement('label');
    label.htmlFor = 'chatProvinciaSelect';
    label.textContent = 'Provincia';
    const select = document.createElement('select');
    select.id = 'chatProvinciaSelect';
    select.className = 'form-control';
    select.add(new Option('Seleccioná tu provincia', ''));
    for (const province of ARGENTINA_PROVINCIAS) select.add(new Option(province, province));
    select.addEventListener('change', () => {
      if (!ARGENTINA_PROVINCIAS.includes(select.value)) return;
      this.province = select.value;
      select.disabled = true;
      this.renderMenuAreas();
      this.messages.lastElementChild?.querySelector('button')?.focus();
    });
    this.messages.lastElementChild.append(label, select);
  }
  renderMenuAreas() {
    this.appendMessage('Elegí la especialidad. La clasificación es orientativa y debe confirmarla un profesional.', [
      ...['Área Penal', 'Área Civil', 'Jubilados y Pensionados', 'Otra Consulta'].map(area => ({
        label: area, action: () => { this.area = area; this.escalateToHuman(); }
      })),
      { label: 'Ver canales de contacto', action: () => this.escalateToHuman() }
    ]);
  }
  handleUserSubmit() {
    const text = this.input.value.trim().slice(0, 120);
    if (!text) return;
    this.input.value = '';
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const province = ARGENTINA_PROVINCIAS.find(value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === normalized);
    if (province) this.province = province;
    // No reflejar ni retener texto libre: solo presentar categorías controladas.
    this.appendMessage('Usá las opciones para clasificar el contacto. No analizo relatos ni documentos; la evaluación del caso corresponde a un profesional.');
    this.renderMenuAreas();
  }
  escalateToHuman() {
    this.appendMessage(`Selección: ${this.province || 'Provincia por elegir'} · ${this.area || 'Área por elegir'}. No se envió una consulta ni se reservó un turno. WhatsApp es un servicio externo: el enlace solo incluye un saludo genérico, sin esta selección ni conversación.`);
    const link = document.createElement('a');
    link.href = ValorSafety.whatsappURL(this.province);
    link.textContent = 'Abrir WhatsApp y decidir qué enviar';
    link.className = 'btn btn-whatsapp';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    this.messages.lastElementChild.appendChild(link);
  }
  reset() {
    this.province = null;
    this.area = null;
    this.input.value = '';
    this.messages.replaceChildren();
    this.renderWelcome();
    document.getElementById('chatProvinciaSelect').focus();
  }
}
