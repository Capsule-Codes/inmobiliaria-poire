-- Insertar usuario admin por defecto
INSERT INTO admin_users (email, password_hash, name) VALUES 
('admin@inmobiliaria.com', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZO', 'Administrador');

-- Insertar propiedades de ejemplo
INSERT INTO properties (title, description, price, location, type, bedrooms, bathrooms, area, features, images, is_featured) VALUES 
('Casa Moderna en Belgrano', 'Hermosa casa con jardín y pileta', 450000, 'Belgrano, CABA', 'casa', 4, 3, 280, '["Jardín", "Pileta", "Garage", "Parrilla"]', '["/luxury-modern-living-room.png", "/modern-house-exterior.png"]', true),
('Departamento Premium Palermo', 'Departamento de lujo con vista panorámica', 320000, 'Palermo, CABA', 'departamento', 3, 2, 120, '["Balcón", "Gym", "Sum", "Seguridad 24hs"]', '["/luxury-penthouse-interior.png", "/elegant-apartment-living.png"]', true),
('Oficina Corporativa Puerto Madero', 'Oficina premium en torre corporativa', 280000, 'Puerto Madero, CABA', 'oficina', 0, 2, 85, '["Vista al río", "Aire acondicionado", "Seguridad"]', '["/industrial-loft-design.png"]', false);

-- Insertar emprendimientos de ejemplo
INSERT INTO projects (name, description, location, status, progress, total_units, available_units, price_from, price_to, delivery_date, amenities, images, is_featured) VALUES 
('Torres del Río', 'Complejo residencial de lujo frente al río', 'Puerto Madero, CABA', 'en-construccion', 65, 120, 45, 250000, 800000, '2025-12-01', '["Pileta", "Gym", "Spa", "Concierge"]', '["/luxury-towers-river-view.png"]', true),
('Green Village', 'Desarrollo sustentable con espacios verdes', 'Tigre, Buenos Aires', 'en-venta', 100, 80, 12, 180000, 350000, '2024-06-01', '["Parque", "Senderos", "Club House"]', '["/green-residential-complex.png"]', true);
