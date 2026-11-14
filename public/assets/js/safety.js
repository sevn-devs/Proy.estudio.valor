/* Helpers compartidos por los scripts clásicos. Sin persistencia de consultas. */
const ValorSafety = Object.freeze({
  escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  },
  imageURL(value) {
    const input = String(value ?? '');
    if (/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(input)) return input;
    try {
      const url = new URL(input);
      return url.protocol === 'https:' && url.hostname === 'images.unsplash.com' && !url.username && !url.password ? url.href : '';
    } catch { return ''; }
  },
  videoURL(value) {
    const input = String(value ?? '');
    if (/^data:video\/(mp4|webm);base64,[A-Za-z0-9+/=]+$/.test(input)) return input;
    try {
      const url = new URL(input);
      if (url.protocol !== 'https:' || url.username || url.password) return '';
      let id;
      if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
      else if (['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
        id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/embed\/([\w-]{11})$/.exec(url.pathname)?.[1];
      }
      return /^[\w-]{11}$/.test(id ?? '') ? `https://www.youtube-nocookie.com/embed/${id}` : '';
    } catch { return ''; }
  },
  contact(province) {
    const north = ['Tucumán', 'Santiago del Estero', 'Salta', 'Jujuy'].includes(province);
    return north ? '5493815736202' : '5491134614115';
  },
  whatsappURL(province) {
    // No incorporar nombre, área, provincia ni relato en query strings.
    return `https://wa.me/${this.contact(province)}?text=${encodeURIComponent('Hola, quisiera conocer los canales de atención de Valor y Asociados.')}`;
  }
});
