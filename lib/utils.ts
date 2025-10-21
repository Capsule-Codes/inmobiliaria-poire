import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns/format";
import { es } from "date-fns/locale/es";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string,
  dateFormat: string = "dd/MM/yyyy"
) {
  const date = new Date(dateString);
  return format(date, dateFormat, { locale: es }); // Use Spanish locale
}

/**
 * Formatea un precio con su moneda de manera legible
 * @param price - Precio numérico
 * @param currency - Código de moneda (USD, ARS, EUR, etc.)
 * @returns Precio formateado con moneda (ej: "USD 450.000")
 */
export function formatPrice(
  price: number | string,
  currency: string = "USD"
): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return `${currency} 0`;
  }

  const formatter = new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${currency} ${formatter.format(numPrice)}`;
}
