import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Mobile - altura mínima de pantalla completa */}
      <div className="relative h-screen xl:hidden">
        <Image
          src="/hero-image-vertical.jpg"
          alt="Hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Desktop - altura 90vh sin margen, la imagen se ajusta automáticamente */}
      <div className="relative hidden xl:block h-[95vh] w-full">
        <Image
          src="/hero-image.webp"
          alt="Hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Content - Botones posicionados de manera fija */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pb-24 xl:pb-28">
        <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 shadow-lg"
            >
              <Link href="/propiedades">Ver Propiedades</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 bg-transparent shadow-lg backdrop-blur-sm"
            >
              <Link href="/contacto">Contactar Asesor</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
