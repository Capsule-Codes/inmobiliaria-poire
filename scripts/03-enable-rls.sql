-- Habilitar Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para propiedades (públicas para lectura, admin para escritura)
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Properties are editable by admin" ON properties FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para emprendimientos
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Projects are editable by admin" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para contactos (solo admin puede ver)
CREATE POLICY "Contacts are viewable by admin" ON contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Contacts are insertable by everyone" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Contacts are editable by admin" ON contacts FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para configuracion (solo admin puede ver y editar)
CREATE POLICY "Configs are viewable by admin" ON configs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Configs are editable by admin" ON configs FOR UPDATE USING (auth.role() = 'authenticated');
