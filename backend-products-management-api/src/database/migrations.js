const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const createDatabaseConnection = () => {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Conectarse a la BD por defecto primero
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
};

const createAppConnection = () => {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'products_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
};

const waitForPostgres = async (maxAttempts = 30) => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const pool = createDatabaseConnection();
      await pool.query('SELECT 1');
      await pool.end();
      console.log('PostgreSQL está disponible');
      return true;
    } catch (error) {
      attempts++;
      console.log(`Esperando PostgreSQL... intento ${attempts}/${maxAttempts}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  throw new Error('PostgreSQL no está disponible después de múltiples intentos');
};

const createDatabase = async () => {
  const pool = createDatabaseConnection();
  
  try {
    const dbName = process.env.DB_NAME || 'products_db';
    
    // Verificar si la base de datos existe
    const result = await pool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    
    if (result.rows.length === 0) {
      console.log(`Creando base de datos: ${dbName}`);
      await pool.query(`CREATE DATABASE "${dbName}"`);
      console.log('Base de datos creada correctamente');
    } else {
      console.log(`Base de datos ${dbName} ya existe`);
    }
  } finally {
    await pool.end();
  }
};

const runMigrations = async () => {
  const pool = createAppConnection();
  
  try {
    console.log('Iniciando migraciones de base de datos...');
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schemaSQL);
    
    console.log('Migraciones ejecutadas correctamente');
  } catch (error) {
    console.error('Error ejecutando migraciones:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

const checkConnection = async () => {
  try {
    await waitForPostgres();
    await createDatabase();
    await runMigrations();
    
    const pool = createAppConnection();
    const result = await pool.query('SELECT NOW()');
    console.log('Conexión a PostgreSQL verificada:', result.rows[0].now);
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('Error en inicialización de base de datos:', error);
    return false;
  }
};

module.exports = {
  runMigrations,
  checkConnection
};
