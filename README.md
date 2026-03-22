# SIGEP — Sistema de Gestión de Estacionamiento Universitario

Sistema web para la gestión de accesos, usuarios y vehículos en un estacionamiento universitario.
Desarrollado como proyecto académico — Sprint 1.

---

## Tecnologías

| Capa       | Tecnología                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite + React Router    |
| Backend    | Spring Boot 3.2 + Spring Security |
| Base de datos | PostgreSQL 15                  |
| Autenticación | Sesiones HTTP (cookies)        |

---

## Requisitos previos

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 15+

---

## 1. Configurar la base de datos

Crear la base de datos y el usuario en PostgreSQL:

```sql
CREATE DATABASE sigep_db;
CREATE USER sigep_user WITH PASSWORD 'sigep_pass';
GRANT ALL PRIVILEGES ON DATABASE sigep_db TO sigep_user;
```

> Las tablas se crean automáticamente al iniciar el backend (`ddl-auto=update`).

---

## 2. Iniciar el backend

```bash
cd backend
mvn spring-boot:run
```

El servidor arranca en **http://localhost:8080**

Al iniciar por primera vez se crea automáticamente un usuario administrador:

| Campo    | Valor             |
|----------|-------------------|
| Email    | admin@sigep.edu   |
| Password | admin123          |

---

## 3. Iniciar el frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend arranca en **http://localhost:5173**

> Las peticiones a `/api` se redirigen automáticamente al backend via proxy de Vite.

---

## Estructura del proyecto

```
sigep/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/sigep/
│       ├── SigepApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java        # Spring Security + CORS + sesiones
│       │   ├── DataSeeder.java            # Crea usuario admin al iniciar
│       │   └── GlobalExceptionHandler.java
│       ├── controller/
│       │   ├── AuthController.java        # POST /api/auth/login, logout, GET /me
│       │   ├── UsuarioController.java     # CRUD /api/usuarios
│       │   └── VehiculoController.java    # CRUD /api/vehiculos
│       ├── dto/
│       │   ├── AuthDTO.java
│       │   ├── UsuarioDTO.java
│       │   └── VehiculoDTO.java
│       ├── entity/
│       │   ├── Usuario.java
│       │   ├── Vehiculo.java
│       │   ├── Rol.java                   # ADMINISTRADOR, GUARDIA, AUDITOR, USUARIO_UNIVERSITARIO
│       │   └── TipoUsuario.java           # DOCENTE, ESTUDIANTE_CARRERA, ESTUDIANTE_CURSO, EXTERNO
│       ├── repository/
│       │   ├── UsuarioRepository.java
│       │   └── VehiculoRepository.java
│       ├── security/
│       │   └── CustomUserDetailsService.java
│       └── service/
│           ├── UsuarioService.java
│           └── VehiculoService.java
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx                        # Rutas y PrivateRoute por rol
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx            # Estado global de sesión
        ├── services/
        │   ├── api.js                     # Instancia axios con credentials
        │   ├── authService.js
        │   ├── usuarioService.js
        │   └── vehiculoService.js
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── UsuariosPage.jsx           # CRUD completo de usuarios
        │   └── VehiculosPage.jsx          # CRUD completo de vehículos
        └── components/
            └── layout/
                ├── Layout.jsx             # Sidebar + navegación por rol
                └── Layout.css
```

---

## Endpoints del backend

### Autenticación

| Método | Endpoint        | Descripción              | Acceso   |
|--------|-----------------|--------------------------|----------|
| POST   | /api/auth/login | Iniciar sesión           | Público  |
| POST   | /api/auth/logout| Cerrar sesión            | Autenticado |
| GET    | /api/auth/me    | Usuario de sesión actual | Autenticado |

### Usuarios

| Método | Endpoint              | Descripción              | Rol requerido   |
|--------|-----------------------|--------------------------|-----------------|
| GET    | /api/usuarios         | Listar todos             | ADMINISTRADOR   |
| GET    | /api/usuarios/{id}    | Obtener por ID           | ADMINISTRADOR   |
| POST   | /api/usuarios         | Crear usuario            | ADMINISTRADOR   |
| PUT    | /api/usuarios/{id}    | Actualizar datos         | ADMINISTRADOR   |
| DELETE | /api/usuarios/{id}    | Baja lógica              | ADMINISTRADOR   |
| GET    | /api/usuarios/buscar?q= | Buscar por texto       | ADMINISTRADOR, GUARDIA |

### Vehículos

| Método | Endpoint                        | Descripción              | Rol requerido                        |
|--------|---------------------------------|--------------------------|--------------------------------------|
| GET    | /api/vehiculos                  | Listar todos             | ADMINISTRADOR                        |
| GET    | /api/vehiculos/{id}             | Obtener por ID           | ADMINISTRADOR                        |
| GET    | /api/vehiculos/usuario/{id}     | Vehículos de un usuario  | ADMINISTRADOR, USUARIO_UNIVERSITARIO |
| POST   | /api/vehiculos                  | Registrar vehículo       | ADMINISTRADOR, USUARIO_UNIVERSITARIO |
| PUT    | /api/vehiculos/{id}             | Actualizar datos         | ADMINISTRADOR, USUARIO_UNIVERSITARIO |
| DELETE | /api/vehiculos/{id}             | Dar de baja              | ADMINISTRADOR, USUARIO_UNIVERSITARIO |

---

## Roles del sistema

| Rol                   | Acceso                                          |
|-----------------------|-------------------------------------------------|
| ADMINISTRADOR         | Acceso completo a usuarios y vehículos          |
| GUARDIA               | Búsqueda de usuarios                            |
| AUDITOR               | Solo dashboard (próximos sprints)               |
| USUARIO_UNIVERSITARIO | Gestión de sus propios vehículos                |

---

## Módulos implementados (Sprint 1)

- HU-22 — Autenticación con email y contraseña + cierre de sesión
- HU-21 — Roles diferenciados con acceso restringido por endpoint
- HU-01 — Registro de usuario universitario
- HU-02 — Registro de usuario externo
- HU-03 — Modificación y baja lógica de usuarios
- HU-04 — Búsqueda de usuarios por nombre, documento y email
- HU-05 — Registro de vehículos asociados a un usuario
- HU-06 — Modificación y baja de vehículos

---

## Próximo sprint (Sprint 2)

- Definición de zonas y espacios de estacionamiento
- Mapa de ocupación en tiempo real
- Registro de ingreso y salida de vehículos (puesto del guardia)
- Consulta de disponibilidad por zona
