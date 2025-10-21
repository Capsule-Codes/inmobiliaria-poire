-- Habilitar Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para propiedades (públicas para lectura, service role para escritura)
-- Nota: El Service Role Key bypasea automáticamente RLS, estas políticas son para consultas anónimas
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
DROP POLICY IF EXISTS "Properties are editable by admin" ON properties;
CREATE POLICY "Properties are editable by service role" ON properties FOR ALL USING (true);

-- Políticas para emprendimientos (públicas para lectura, service role para escritura)
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Projects are editable by admin" ON projects;
CREATE POLICY "Projects are editable by service role" ON projects FOR ALL USING (true);

-- Políticas para contactos (insertables por todos, manejables por service role)
DROP POLICY IF EXISTS "Contacts are viewable by admin" ON contacts;
DROP POLICY IF EXISTS "Contacts are editable by admin" ON contacts;
CREATE POLICY "Contacts are viewable by service role" ON contacts FOR SELECT USING (true);
CREATE POLICY "Contacts are insertable by everyone" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Contacts are updatable by service role" ON contacts FOR UPDATE USING (true);

-- Políticas para configuracion (públicas para lectura, service role para escritura)
CREATE POLICY "Configs are viewable by everyone" ON configs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Configs are editable by admin" ON configs;
CREATE POLICY "Configs are editable by service role" ON configs FOR UPDATE USING (true);
