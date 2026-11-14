export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function telHref(phone: string): string {
  return `tel:${digitsOnly(phone)}`;
}

export function whatsappHref(number: string, message: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digitsOnly(number)}${query}`;
}

export function mapsHref(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export function mapEmbedHref(latitude: number, longitude: number, zoom: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;
}

export function hexToRgbTriplet(hex: string): string | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = parseInt(match[1], 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}
