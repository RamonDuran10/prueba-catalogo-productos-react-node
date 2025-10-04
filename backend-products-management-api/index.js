const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('Error: Archivo .env no encontrado');
  console.error('Solución: Crea un archivo .env basado en env.example');
  console.error('   Ejemplo: cp env.example .env');
  process.exit(1);
}

require('dotenv').config();
const { runMigrations, checkConnection } = require('./src/database/migrations');

if (!process.env.PORT) {
  console.warn('Advertencia: Variable PORT no encontrada en .env');
  console.warn('Usando puerto por defecto: 8001');
}

const app = require("./app");
const PORT = process.env.PORT || 8001;

const startServer = async () => {
  try {
    const isConnected = await checkConnection();
    if (!isConnected) {
      process.exit(1);
    }

    await runMigrations();
    
    const server = app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Iniciado: ${new Date().toLocaleString()}`);
    });

    module.exports = server;
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();

