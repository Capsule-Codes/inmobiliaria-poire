import { Button } from "@/components/ui/button";
import Link from "next/link";
// Deje comentado esto porque cambiamos la imagen el hero image y tiene mucho texto como para sumar lo que tenemos aca pero no lo borro por si el cliente se arrepeiente

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Mobile */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat xl:hidden"
        style={{
          backgroundImage: `url('/hero-image-vertical.jpg')`,
        }}
      >
        <div className="absolute inset-0"></div>
      </div>

      {/* Background Image - Desktop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden xl:block"
        style={{
          backgroundImage: `url('/hero-image.webp')`,
        }}
      >
        <div className="absolute inset-0 "></div>
      </div>

      {/* {/* Content */}
      <div className="absolute bottom-30 left-0 right-0 z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"> */}
        {/*   Bienvenidos a */}
        {/*   <span className="block text-accent">Poire Propiedades</span> */}
        {/* </h1> */}
        {/**/}
        {/* <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed"> */}
        {/*   Descubre propiedades exclusivas que definen el lujo y la elegancia. Tu */}
        {/*   hogar ideal te está esperando. */}
        {/* </p> */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3"
          >
            <Link href="/propiedades">Ver Propiedades</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3 bg-transparent"
          >
            <Link href="/contacto">Contactar Asesor</Link>
          </Button>
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
