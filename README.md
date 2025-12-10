# Aplicación de Gestión de Tareas

Aplicación web full-stack para la gestión de tareas personales, desarrollada con React (Vite) en el frontend y Node.js con Express y MySQL en el backend.

## Características

- Autenticación de usuarios
- Creación, lectura, actualización y eliminación de tareas (CRUD)
- Marcar tareas como completadas/pendientes
- Interfaz de usuario intuitiva y responsiva
- API RESTful segura
- Base de datos relacional MySQL

## Estructura del Proyecto

```
Buscador-interactivo-
├── backend/                 # Código del servidor
│   ├── controllers/         # Controladores de la API
│   │   ├── auth.controller.js  # Autenticación de usuarios
│   │   └── tareas.controller.js # Lógica de negocio de tareas
│   ├── database/
│   │   └── db.js           # Configuración de la base de datos
│   ├── node_modules/        # Dependencias
│   ├── .env                 # Variables de entorno
│   └── package.json         # Dependencias y scripts del backend
├── frontend/                # Aplicación React
│   ├── public/              # Archivos estáticos
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   └── context/         # Contexto de autenticación
│   ├── .env                 # Variables de entorno del frontend
│   └── package.json         # Dependencias y scripts del frontend
└── README.md                # Este archivo
```

## Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución de JavaScript
- **Express**: Framework web para Node.js
- **MySQL**: Sistema de gestión de bases de datos relacional
- **JWT**: Autenticación basada en tokens
- **CORS**: Middleware para permitir solicitudes cruzadas
- **dotenv**: Manejo de variables de entorno

### Frontend
- **React**: Biblioteca de JavaScript para interfaces de usuario
- **Vite**: Herramienta de construcción y desarrollo
- **React Router**: Enrutamiento del lado del cliente
- **Context API**: Gestión del estado global
- **Tailwind CSS**: Framework de estilos
- **Axios**: Cliente HTTP para realizar peticiones a la API

## Configuración del Entorno

### Requisitos Previos

- Node.js (v14 o superior)
- MySQL Server (v8.0 o superior)
- npm o yarn

### Configuración del Backend

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   cd backend
   npm install
   ```
3. Configurar las variables de entorno (crear archivo `.env` en la carpeta `backend`):
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_base_datos
   JWT_SECRET=tu_clave_secreta_jwt
   PORT=3001
   ```

4. Crear la base de datos en MySQL:
   ```sql
   CREATE DATABASE nombre_base_datos;
   USE nombre_base_datos;

   CREATE TABLE usuarios (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(100) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     nombre VARCHAR(100) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE tareas (
     id INT AUTO_INCREMENT PRIMARY KEY,
     tarea TEXT NOT NULL,
     fecha DATE,
     completada BOOLEAN DEFAULT FALSE,
     userId INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE
   );
   ```

5. Iniciar el servidor:
   ```bash
   npm run dev
   ```

### Configuración del Frontend

1. Navegar a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno (crear archivo `.env` en la carpeta `frontend`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Tareas
- `GET /api/tareas/:userId` - Obtener todas las tareas de un usuario
- `POST /api/tareas` - Crear nueva tarea
- `PUT /api/tareas/:id` - Actualizar tarea existente
- `DELETE /api/tareas/:id` - Eliminar tarea

## Estructura de Datos

### Usuario
```javascript
{
  id: number,
  email: string,
  nombre: string,
  password: string, // hasheado
  created_at: timestamp
}
```

### Tarea
```javascript
{
  id: number,
  tarea: string,
  fecha: date,
  completada: boolean,
  userId: number,
  created_at: timestamp
}
```

## Desarrollo

### Estructura del Código

#### Backend
- **Controladores**: Contienen la lógica de negocio
- **Rutas**: Definen los endpoints de la API
- **Middleware**: Autenticación y manejo de errores
- **Base de datos**: Configuración y consultas SQL

#### Frontend
- **Componentes**: Elementos reutilizables de la interfaz
- **Contexto**: Estado global de la aplicación
- **Servicios**: Llamadas a la API
- **Hooks personalizados**: Lógica reutilizable

### Mejoras Futuras

- Implementar pruebas unitarias y de integración
- Añadir búsqueda y filtrado de tareas
- Implementar categorías y etiquetas
- Añadir recordatorios por correo electrónico
- Desplegar en un servicio en la nube (AWS, Google Cloud, etc.)

## Contribución

1. Hacer fork del repositorio
2. Crear una rama para tu función (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Hacer push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
