interface SiteConfig {
  maxFeaturedProperties: number
  maxFeaturedProjects: number
  maxPropertiesPerSlide: number
  maxProjectsPerSlide: number
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  siteTitle: string
  siteDescription: string
  availableLocations: string[]
}

const defaultConfig: SiteConfig = {
  maxFeaturedProperties: 9,
  maxFeaturedProjects: 9,
  maxPropertiesPerSlide: 3,
  maxProjectsPerSlide: 3,
  companyName: "Inmobiliaria Premium",
  companyEmail: "info@inmobiliaria.com",
  companyPhone: "+54 11 1234-5678",
  companyAddress: "Av. Corrientes 1234, CABA, Argentina",
  siteTitle: "Inmobiliaria Premium - Propiedades de Lujo",
  siteDescription: "La mejor selección de propiedades premium en Buenos Aires",
  availableLocations: [
    "Palermo",
    "Belgrano",
    "Recoleta",
    "Puerto Madero",
    "Villa Crespo",
    "Caballito",
    "San Telmo",
    "La Boca",
    "Barracas",
    "Núñez",
  ],
}

class ConfigStore {
  private config: SiteConfig
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.config = this.loadConfig()
  }

  private loadConfig(): SiteConfig {
    if (typeof window === "undefined") return defaultConfig

    try {
      const saved = localStorage.getItem("site-config")
      return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig
    } catch {
      return defaultConfig
    }
  }

  private saveConfig() {
    if (typeof window === "undefined") return
    localStorage.setItem("site-config", JSON.stringify(this.config))
    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  getConfig(): SiteConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<SiteConfig>) {
    this.config = { ...this.config, ...updates }
    this.saveConfig()
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const configStore = new ConfigStore()
export type { SiteConfig }
