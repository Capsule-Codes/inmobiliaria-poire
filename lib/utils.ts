import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns/format";
import { es } from "date-fns/locale/es";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, dateFormat: string = "dd/MM/yyyy") {
  const date = new Date(dateString);
  return format(date, dateFormat, { locale: es }); // Use Spanish locale
}