# Sistema de Gestión de Productos

Aplicación web full-stack para gestionar productos y categorías con React, Node.js, Express y PostgreSQL.

### Prerrequisitos
- Docker y Docker Compose instalados


### Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Prueba
   ```

2. **Crear archivo .env para el backend**
   ```bash
   cd backend-products-management-api
   cp env.example .env
   cd ..
   ```

3. **Levantar la aplicación**
   ```bash
   docker compose up -d
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8001/api

### Comandos Útiles

```bash
# Detener la aplicación
docker compose down

# Ver logs
docker compose logs

# Limpiar base de datos y recargar categorías
docker compose exec backend npm run clean
```

## 📋 Funcionalidades

- ✅ Gestión de productos (CRUD)
- ✅ Gestión de categorías
- ✅ Interfaz responsive
- ✅ Paginación
- ✅ Estadísticas por categoría
- ✅ Validaciones de formularios
- ✅ Alertas con SweetAlert2

## 🛠️ Tecnologías

- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express
- **Base de datos**: PostgreSQL
- **Contenedores**: Docker, Docker Compose

## 📁 Estructura del Proyecto

```
Prueba/
├── backend-products-management-api/    # API Node.js
├── front-products-management/          # Frontend React
└── docker-compose.yml                  # Orquestación de contenedores
```
