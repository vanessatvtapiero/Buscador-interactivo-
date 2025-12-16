#  Gestor de Tareas Interactivo
En este proyecto veras como un inicio de sesion donde podra iniciar para poder hacer tu tareas interactivo, donde podras crear tus tareas, actualizar, y completar o desmarcar tu tarea y por utlimo eliminar tus tareas.
##  Tecnologías Usadas

### Frontend
- **React** con Vite 
- **TailwindCSS** para los estilos 
- **React Router** para la navegación 
- **Context API** para el manejo de estado global 

### Backend
- **Node.js** con **Express** 
- **MySQL** para la base de datos 
- **JWT** para la autenticación 
- **CORS** para permitir peticiones cruzadas 

##  Requisitos Previos

Antes de empezar, necesitas tener instalado:

- Node.js (v16 o superior) 
- npm (viene con Node.js) o Yarn
- MySQL Server (v8.0 o superior) 
- Git 

##  Cómo Empezar

### 1. Clona el repositorio
```bash
git clone https://github.com/vanessatvtapiero/Buscador-interactivo-.git
cd Buscador-interactivo
```

### 2. Configura el Backend
```bash
cd backend
npm install
cp .env.example .env
```

### 3. Configura la Base de Datos
1. Crea una base de datos MySQL
2. Configura las variables de entorno en `.env`:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_datos
JWT_SECRET=tu_clave_secreta
```

### 4. Inicia el Backend
```bash
npm run dev
```

### 5. Configura el Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
```

### 6. Inicia el Frontend
```bash
npm run dev
```

La aplicación debería estar funcionando en `http://localhost:5173`

##  Despliegue

### Frontend en Vercel
[![Deploy with Vercel](https://6938c7e4370ea200082ef19a--effulgent-alfajores-c12bef.netlify.app/login)]

### Backend en Render
[![Deploy to Render](https://buscador-interactivo.onrender.com)]


##  Estructura del Proyecto

```
Buscador-interactivo/
├── backend/               # Todo el código del backend
│   ├── controllers/       # Lógica de los endpoints
│   ├── database/          # Configuración de la base de datos
│   └── routes/            # Rutas de la API
└── frontend/              # Aplicación React
    ├── src/
    │   ├── components/    # Componentes reutilizables
    │   ├── context/       # Manejo de estado global
    │   └── pages/         # Páginas de la aplicación
    └── public/            # Archivos estáticos
```

##  API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

##  Arquitectura

### Diagrama de Flujo
```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │     │           │
│  Usuario  ├────►│ Frontend  ├────►│ Backend   ├────►│  Base de  │
│           │     │ (Vercel)  │     │ (Render)  │     │  Datos    │
└───────────┘     └───────────┘     └───────────┘     │ (Railway) │
                                                      └───────────┘
```

### Flujo de una Operación Típica
1. El usuario interactúa con la interfaz de React
2. El frontend hace peticiones a la API de Node.js
3. El backend procesa la petición y se comunica con MySQL
4. La respuesta viaja de vuelta al usuario

##  Pipeline de CI/CD

1. **Pruebas**: Se ejecutan automáticamente en cada push
2. **Build**: Se compila la aplicación
3. **Despliegue**: Se despliega automáticamente a producción

##  Documentación de la API

### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Códigos de Estado HTTP
- 200: OK
- 201: Creado
- 400: Solicitud incorrecta
- 401: No autorizado
- 404: No encontrado
- 500: Error del servidor

##  Licencia

Este proyecto está protegido por derechos de autor. Se otorga permiso para:
- Clonar el repositorio con fines de revisión y aprendizaje personal
- Probar la aplicación en un entorno local

**No está permitido:**
- Modificar ningún archivo del proyecto (código, estilos o lógica)
- Utilizar partes del código en otros proyectos sin autorización expresa
- Distribuir versiones modificadas del proyecto

Cualquier uso que no esté expresamente permitido en esta licencia requerirá autorización por escrito del autor.

© 2025 Vanessa Remicio. Todos los derechos reservados.

---

Hecho con  por Vanessa Remicio
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
   DB_HOST=mysql://root:yrCwBDMEGwOAFBncFFfjFDxQXTKhKcrP@switchyard.proxy.rlwy.net:51655/railway
   JWT_SECRET=tu_clave_secreta_para_jwt
   ```

4. Crear la base de datos en MySQL:
   ```sql
   CREATE DATABASE nombre_base_datos;
   USE nombre_base_datos;

   CREATE TABLE usuarios (
     id INT AUTO_INCREMENT PRIMARY KEY,
     nombre VARCHAR(100) NOT NULL UNIQUE,
     apellido VARCHAR(100) NOT NULL UNIQUE,
     correo VARCHAR(100) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     intereses VARCHAR(100) NOT NULL,
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
   VITE_API_URL=https://buscador-interactivo.onrender.com
   ```

4. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

## API Endpoints

### Autenticación
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
  correo: string,
  nombre: string,
  password: string,
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

Este proyecto está bajo la Licencia MIT 
