const rawWhatsapp = (process.env.REACT_APP_CONTACT_WHATSAPP || '').replace(/\D/g, '');

export const contactWhatsapp = rawWhatsapp.length >= 12 ? rawWhatsapp : '';
export const leadEndpoint = (process.env.REACT_APP_LEAD_ENDPOINT || '').trim();
export const contactReady = Boolean(leadEndpoint || contactWhatsapp);

export function getWhatsappUrl(message) {
  if (!contactWhatsapp) return '';
  return `https://wa.me/${contactWhatsapp}?text=${encodeURIComponent(message)}`;
}
