-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category_id INTEGER NOT NULL,
    image_url TEXT
);

-- Datos de ejemplo
INSERT INTO categories (name, description) VALUES
('ropa de hombre', 'Ropa y accesorios para hombres'),
('ropa de mujer', 'Ropa y accesorios para mujeres'),
('electrónicos', 'Dispositivos electrónicos y tecnología'),
('joyería', 'Joyas y accesorios'),
('hogar', 'Artículos para el hogar')
ON CONFLICT (name) DO NOTHING;
