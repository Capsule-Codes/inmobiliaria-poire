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
  embedMapUrl: string;
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
  embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0056136375115!2d-58.3867115234177!3d-34.604019557515635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac59a5bd441%3A0x1408e2f06974627!2sAv.%20Corrientes%201234%2C%20C1043AAZ%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1759270928974!5m2!1ses!2sar",
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

