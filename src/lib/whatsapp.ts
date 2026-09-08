export function lienWhatsapp(whatsapp: string, message: string) {
  const numero = whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}
