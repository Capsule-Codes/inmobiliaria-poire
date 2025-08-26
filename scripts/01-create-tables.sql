-- Crear tabla de usuarios admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de propiedades
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- casa, departamento, oficina, etc.
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(8,2), -- metros cuadrados
  features JSONB DEFAULT '[]', -- array de características
  images JSONB DEFAULT '[]', -- array de URLs de imágenes
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'available', -- available, sold, rented
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de emprendimientos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL, -- en-construccion, en-venta, proximamente
  progress INTEGER DEFAULT 0, -- porcentaje de progreso
  total_units INTEGER,
  available_units INTEGER,
  price_from DECIMAL(12,2),
  price_to DECIMAL(12,2),
  delivery_date DATE,
  amenities JSONB DEFAULT '[]', -- array de amenities
  images JSONB DEFAULT '[]', -- array de URLs de imágenes
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de contactos/leads
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  inquiry_type VARCHAR(100), -- contacto, tasacion, compra, venta
  property_id UUID REFERENCES properties(id),
  project_id UUID REFERENCES projects(id),
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
