# TalentStream AI — Plataforma de RRHH con Inteligencia Artificial

Una plataforma moderna de Recursos Humanos con análisis de CVs, pruebas psicotécnicas y dashboard de métricas en tiempo real.

---

## Requisitos

Solo necesitás tener instalado:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (incluido en Docker Desktop)

---

## Inicio rápido (3 pasos)

### 1. Clonar y entrar al proyecto

```bash
git clone <url-del-repo>
cd Proyecto-IA-aplicada-a-RRHH
```

### 2. Levantar todos los servicios

```bash
docker compose up --build
```

La primera vez tarda ~3-5 minutos mientras descarga las imágenes y compila el frontend.

### 3. Abrir la app

Abrí tu navegador en: **http://localhost:3000**

---

## Acceso demo

| Campo       | Valor                |
|-------------|----------------------|
| Email       | demo@talentstream.ai |
| Contraseña  | Demo1234             |

---

## Estructura del proyecto

```
Proyecto-IA-aplicada-a-RRHH/
├── docker-compose.yml       # Orquestación de los 3 servicios
├── .env                     # Variables de entorno
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js        # Punto de entrada Express
│       ├── config/          # Conexión a MongoDB
│       ├── models/          # Esquemas: User, CV, HRTest, Metric
│       ├── routes/          # API: auth, cvs, tests, dashboard
│       ├── middleware/       # Autenticación JWT
│       └── seed/            # Datos de ejemplo precargados
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── App.jsx          # Rutas principales
        ├── context/         # AuthContext con JWT
        ├── pages/           # Login, Register, Dashboard, CVs, Tests, Settings, Profile
        ├── components/      # Layout, Card, Badge, PageHeader
        └── utils/           # Cliente HTTP Axios
```

---

## Servicios y puertos

| Servicio  | Puerto | Descripción              |
|-----------|--------|--------------------------|
| Frontend  | 3000   | React + Vite (via Nginx) |
| Backend   | 5000   | Node.js + Express API    |
| MongoDB   | 27017  | Base de datos            |

---

## API endpoints principales

```
POST   /api/auth/login        Iniciar sesión
POST   /api/auth/register     Registrar usuario
GET    /api/auth/me           Obtener usuario actual
PUT    /api/auth/me           Actualizar perfil

GET    /api/dashboard/stats   Estadísticas completas del dashboard

GET    /api/cvs               Listar CVs (filtros: status, search, page)
GET    /api/cvs/:id           Detalle de un CV
PUT    /api/cvs/:id/status    Cambiar estado de un CV

GET    /api/tests             Listar pruebas (filtros: testType, page)
GET    /api/tests/:id         Detalle de una prueba
```

---

## Comandos útiles

```bash
# Ver logs en tiempo real
docker compose logs -f

# Parar todos los servicios
docker compose down

# Parar y borrar datos de la base de datos
docker compose down -v

# Rebuild solo el frontend
docker compose up --build frontend

# Acceder a la base de datos
docker exec -it talentstream_db mongosh -u admin -p adminpass
```

---

## Variables de entorno (.env)

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb://admin:adminpass@mongodb:27017/talentstream?authSource=admin
```

> Para producción, cambiá `JWT_SECRET` por una clave fuerte y aleatoria.

---

## Funcionalidades

- **Login / Registro** con JWT (token en localStorage, rutas protegidas)
- **Dashboard** con gráficos de barras, líneas y torta (datos reales de MongoDB)
- **Análisis de CVs**: tarjetas con score IA, filtros, búsqueda, panel lateral con análisis completo
- **Pruebas de HR**: listado con tipos (técnica, personalidad, cognitiva, liderazgo, emocional), gráfico radar de resultados
- **Perfil de usuario**: edición de nombre, departamento y teléfono
- **Configuración**: idioma, notificaciones, integraciones, apariencia
- **Datos precargados**: 8 CVs + 8 pruebas + 6 meses de métricas + usuario demo
