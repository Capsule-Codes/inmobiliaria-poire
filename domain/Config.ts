import 'server-only';
import { supabase } from "@/lib/supabase";

export type ConfigEntry = {
  key: string;
  value: string;
  type: 'string' | 'int' | 'bool' | 'json' | 'decimal';
  updated_at: string;
};

function parseValue(entry?: ConfigEntry | null): any {
  if (!entry) return null;
  const raw = entry.value;
  switch (entry.type) {
    case 'int':
      return Number.parseInt(raw as string);
    case 'decimal':
      return Number.parseFloat(raw as string);
    case 'bool':
      return raw === 'true' || raw === '1';
    case 'json':
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    default:
      return raw;
  }
}

export async function getConfigValuesByKey(key: string) {
  const { data, error } = await supabase
    .from('configs')
    .select('*')
    .eq('key', key)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []) as ConfigEntry[];
}

export async function getSingleConfigValue(key: string) {
  const entries = await getConfigValuesByKey(key);
  return parseValue(entries[0] || null);
}

export async function replaceSingleConfigValue(key: string, value: any, type: ConfigEntry['type'] = 'string') {
  // Ensure scalar keys have only one row: delete then insert
  const del = await supabase.from('configs').delete().eq('key', key);
  if (del.error) throw del.error;
  const payload = { key, value: type === 'json' ? JSON.stringify(value) : String(value), type };
  const { data, error } = await supabase.from('configs').insert(payload).select().single();
  if (error) throw error;
  return data as ConfigEntry;
}

export async function addListConfigValue(key: string, value: any, type: ConfigEntry['type'] = 'string') {
  const payload = { key, value: type === 'json' ? JSON.stringify(value) : String(value), type };
  const { data, error } = await supabase.from('configs').insert(payload).select().single();
  if (error) throw error;
  return data as ConfigEntry;
}

export async function deleteListConfigValue(key: string, value?: any) {
  let query = supabase.from('configs').delete().eq('key', key);
  if (typeof value !== 'undefined') {
    query = query.eq('value', String(value));
  }
  const { error } = await query;
  if (error) throw error;
}

export type AdminConfig = {
  availableLocations: string[];
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
};

export async function getAdminConfig(): Promise<AdminConfig> {
  const [locations, maxFeatProps, maxFeatProjs, maxSlideProps, maxSlideProjs, companyName, companyEmail, companyPhone, companyAddress, siteTitle, siteDescripcion] = await Promise.all([
    getConfigValuesByKey('available_locations'),
    getSingleConfigValue('max_featured_properties'),
    getSingleConfigValue('max_featured_projects'),
    getSingleConfigValue('max_slide_proproperties'),
    getSingleConfigValue('max_slide_projects'),
    getSingleConfigValue('company_name'),
    getSingleConfigValue('company_email'),
    getSingleConfigValue('company_phone'),
    getSingleConfigValue('company_address'),
    getSingleConfigValue('site_title'),
    getSingleConfigValue('site_descripcion'),
  ]);

  const availableLocations = locations.map(l => String(l.value));

  return {
    availableLocations,
    maxFeaturedProperties: Number(maxFeatProps ?? 12),
    maxFeaturedProjects: Number(maxFeatProjs ?? 12),
    maxPropertiesPerSlide: Number(maxSlideProps ?? 3),
    maxProjectsPerSlide: Number(maxSlideProjs ?? 3),
    companyName: String(companyName ?? ''),
    companyEmail: String(companyEmail ?? ''),
    companyPhone: String(companyPhone ?? ''),
    companyAddress: String(companyAddress ?? ''),
    siteTitle: String(siteTitle ?? ''),
    siteDescription: String(siteDescripcion ?? ''),
  };
}

