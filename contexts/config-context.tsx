"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

export type SiteConfig = {
  maxFeaturedProperties: number;
  maxFeaturedProjects: number;
  maxPropertiesPerSlide: number;
  maxProjectsPerSlide: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  siteTitle: string;
  siteDescription: string;
  availableLocations: string[];
};

const defaultConfig: SiteConfig = {
  maxFeaturedProperties: 9,
  maxFeaturedProjects: 9,
  maxPropertiesPerSlide: 3,
  maxProjectsPerSlide: 3,
  companyName: "Inmobiliaria Poire",
  companyEmail: "info@inmobiliaria.com",
  companyPhone: "+54 11 1234-5678",
  companyAddress: "Av. Corrientes 1234, CABA, Argentina",
  siteTitle: "Inmobiliaria Poire - Propiedades de Lujo",
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
    "Nuñez",
  ],
};

type ConfigContextType = {
  config: SiteConfig;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const ConfigContext = createContext<ConfigContextType | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/configs', { cache: 'no-store' });
      if (!res.ok) {
        setConfig(defaultConfig);
        return;
      }
      const data = await res.json();
      setConfig({ ...defaultConfig, ...data });
    } catch {
      setConfig(defaultConfig);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, isLoading, refresh: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig debe usarse dentro de <ConfigProvider/>');
  return ctx;
}

