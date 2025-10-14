"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useConfig } from "@/contexts/config-context";

export function Footer() {
  const { config } = useConfig();

  return (
    <footer className="bg-foreground text-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Inmobiliaria Silvia Poire
            </h3>
            <p className="text-sm text-background/80">
              Tu inmobiliaria de confianza. Comprometidos con encontrar la
              propiedad perfecta para vos.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <a
                  href={`tel:${config.companyPhone.replace(/[^+\d]/g, "")}`}
                  className="text-sm text-background/80 hover:text-accent transition-colors"
                >
                  {config.companyPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <a
                  href={`mailto:${config.companyEmail}`}
                  className="text-sm text-background/80 hover:text-accent transition-colors"
                >
                  {config.companyEmail}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <p className="text-sm text-background/80">
                  {config.companyAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/propiedades"
                  className="text-sm text-background/80 hover:text-accent transition-colors"
                >
                  Propiedades
                </Link>
              </li>
              <li>
                <Link
                  href="/emprendimientos"
                  className="text-sm text-background/80 hover:text-accent transition-colors"
                >
                  Emprendimientos
                </Link>
              </li>
              <li>
                <Link
                  href="/tasaciones"
                  className="text-sm text-background/80 hover:text-accent transition-colors"
                >
                  Tasaciones
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-background/80 hover:text-accent transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-background/10">
          <p className="text-center text-sm text-background/60">
            © {new Date().getFullYear()} Inmobiliaria Silvia Poire. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
