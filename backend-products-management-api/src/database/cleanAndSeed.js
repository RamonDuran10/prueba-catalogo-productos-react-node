const pool = require('./Dbconn');

const categoriesData = [
  { id: 1, name: 'Ropa de Hombre', description: 'Ropa y accesorios para hombres' },
  { id: 2, name: 'Joyería', description: 'Joyas y accesorios' },
  { id: 3, name: 'Electrónica', description: 'Dispositivos electrónicos y tecnología' },
  { id: 4, name: 'Ropa de Mujer', description: 'Ropa y accesorios para mujeres' },
  { id: 5, name: 'Hogar', description: 'Artículos para el hogar' },
  { id: 6, name: 'Deportes', description: 'Artículos deportivos y fitness' }
];


const cleanAndSeed = async () => {
  try {
    console.log('Limpiando base de datos...');

    // Limpiar tablas completamente
    await pool.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE categories RESTART IDENTITY CASCADE');

    // Insertar categorías
    console.log('Insertando categorías...');
    for (const category of categoriesData) {
      await pool.query(
        'INSERT INTO categories (id, name, description) VALUES ($1, $2, $3)',
        [category.id, category.name, category.description]
      );
    }

    // Mostrar resumen
    const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
    const productsCount = await pool.query('SELECT COUNT(*) FROM products');
    
    console.log(`Categorías insertadas: ${categoriesCount.rows[0].count}`);

  } catch (error) {
    console.error('Error limpiando e insertando datos:', error);
    throw error;
  }
};

module.exports = { cleanAndSeed };
