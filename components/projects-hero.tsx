export function ProjectsHero() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-primary/90 to-primary/70 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/architectural-blueprint-pattern.png')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
          Nuestros <span className="text-accent">Emprendimientos</span>
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
          Descubre proyectos inmobiliarios únicos diseñados para el futuro. Desde torres residenciales hasta complejos
          comerciales de vanguardia.
        </p>
      </div>
    </section>
  )
}
