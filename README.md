# 🌸 BloomDay – Agenda y Calendario Escolar para Kindergarten

> "Floreciendo juntos en cada etapa del aprendizaje"

Aplicación móvil multiplataforma que permite a padres de familia y docentes de un kindergarten visualizar, organizar y recibir notificaciones sobre actividades escolares, tareas y eventos importantes.

---

## 👥 Equipo de Desarrollo

| Nombre | Carnet | Rol |
|--------|--------|-----|
| Paola Matilde Orellana Castillo | OC250609 | Coordinadora / Líder de Proyecto |
| Ángel Josué Rodríguez Alemán | RA232736 | Desarrollador Frontend (React Native) |
| Kleberson Rafael Mejia Perez | MP20214 | Diseñador UX/UI |
| Jefferson Ulises Martínez López | ML250841 | Desarrollador Backend (Node.js) |
| José Enrique Rodriguez Zometa | RZ242333 | DevOps / Pruebas |

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | React Native (Expo) |
| Backend | Node.js + Express |
| Base de Datos | MySQL |
| Autenticación | JWT + bcryptjs |
| Contenedores | Docker + Docker Compose |
| Control de Versiones | GitHub |
| Diseño UI/UX | Figma |

---

## 🎨 Diseño de Mockups

Los mockups de la aplicación fueron diseñados en Figma:  
🔗 [Ver diseño en Figma](https://www.figma.com/design/U1T7FsOx6smCZjsUixrMtG/Sin-t%C3%ADtulo?node-id=19-21&t=36c58NfsaEGp6Lxf-0)

---

## 📁 Estructura del Proyecto

```
BloomDay/
├── backend/            # API REST con Node.js + Express
│   ├── src/
│   │   └── app.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── db/                 # Scripts SQL de base de datos
├── docker/             # Configuración Docker Compose
│   └── docker-compose.yml
├── docs/               # Documentación del proyecto
├── frontend/           # Aplicación React Native (Expo)
├── .gitignore
└── README.md
```

---

## 📱 Funcionalidades de la Aplicación

- **Autenticación**: Registro e inicio de sesión para Padres y Docentes
- **Home / Dashboard**: Vista general con tareas pendientes y próximos eventos
- **Agenda / Calendario**: Calendario mensual interactivo con eventos escolares
- **Tareas**: Listado de tareas pendientes y entregadas por semana
- **Eventos**: Visualización de eventos, reuniones y festividades
- **Notificaciones**: Alertas y recordatorios de actividades importantes
- **Perfil**: Gestión de datos personales y configuración de cuenta

---

## ⚙️ Variables de Entorno

Copia el archivo `.env.example` y renómbralo a `.env` dentro de la carpeta `backend/`:

```bash
cp backend/.env.example backend/.env
```

Contenido del archivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=proyecto_db
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Ya está incluido en `.gitignore`.

---

## 🚀 Guía de Instalación y Configuración

### Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu máquina:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started) y [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) v18 o superior (solo si deseas correr sin Docker)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (para el frontend)

---

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/itspao529/BloomDay.git
cd BloomDay
```

---

### Paso 2: Configurar Variables de Entorno

```bash
cp backend/.env.example backend/.env
```

Abre `backend/.env` y edita los valores según tu entorno:

```env
PORT=3000
DB_HOST=db               # Usar "db" si corres con Docker Compose
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=proyecto_db
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h
```

---

### Paso 3: Levantar los Contenedores con Docker

Desde la raíz del proyecto, ejecuta:

```bash
cd docker
docker-compose up --build
```

Esto levantará automáticamente:
- 🟢 **Backend** en `http://localhost:3000`
- 🗄️ **Base de datos MySQL** en el puerto `3306`

Para correr en segundo plano:

```bash
docker-compose up --build -d
```

Para detener los contenedores:

```bash
docker-compose down
```

---

### Paso 4: Inicializar la Base de Datos

Si los scripts SQL no se ejecutan automáticamente, conéctate al contenedor de MySQL:

```bash
docker exec -it bloomday_db mysql -u root -p
```

Luego ejecuta el script de la carpeta `db/`:

```sql
source /docker-entrypoint-initdb.d/init.sql;
```

---

### Paso 5: Ejecutar el Frontend (React Native / Expo)

```bash
cd frontend
npm install
npx expo start
```

Escanea el código QR con la app **Expo Go** en tu teléfono Android o iOS.

---

## 🧪 Verificar que todo funciona

Una vez levantados los contenedores, verifica:

- Backend activo: abre `http://localhost:3000` en tu navegador
- Base de datos: el backend debe conectarse sin errores al iniciar
- Frontend: la app debe cargar la pantalla de Login correctamente

---

## 📦 Comandos Útiles de Docker

```bash
# Ver contenedores activos
docker ps

# Ver logs del backend
docker logs bloomday_backend

# Ver logs de la base de datos
docker logs bloomday_db

# Reconstruir imágenes desde cero
docker-compose up --build --force-recreate

# Eliminar contenedores y volúmenes
docker-compose down -v
```

---

## 🔌 Endpoints Principales de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| GET | `/api/eventos` | Listar eventos |
| POST | `/api/eventos` | Crear evento |
| PUT | `/api/eventos/:id` | Actualizar evento |
| DELETE | `/api/eventos/:id` | Eliminar evento |
| GET | `/api/tareas` | Listar tareas |
| POST | `/api/tareas` | Crear tarea |
| GET | `/api/notificaciones` | Listar notificaciones |

---

## 🧩 Arquitectura del Sistema

```
┌─────────────────────────────────────────┐
│              React Native (Expo)         │
│         (Frontend - Móvil Android/iOS)  │
└───────────────────┬─────────────────────┘
                    │ HTTP / REST API
                    ▼
┌─────────────────────────────────────────┐
│         Node.js + Express (Backend)      │
│     JWT Auth · CRUD · Validaciones      │
└───────────────────┬─────────────────────┘
                    │ mysql2
                    ▼
┌─────────────────────────────────────────┐
│              MySQL Database              │
│            (proyecto_db)                │
└─────────────────────────────────────────┘

Todo contenido en Docker Compose 🐳
```

---

## 🎥 Video de Evidencia

El siguiente video muestra el funcionamiento completo de la aplicación, incluyendo la instalación, navegación entre pantallas, consumo de la API y ejecución de los contenedores Docker.

🔗 [Ver video de evidencia]()

> El video tiene una duración de 3 a 7 minutos y cubre:
> - Instalación y ejecución del sistema
> - Navegación entre pantallas móviles
> - Interacción con las funciones principales
> - Respuestas de la API y datos en base de datos
> - Ejecución de los contenedores Docker

---

## 📊 Presentación del Proyecto

La presentación técnica del proyecto (pitch) está disponible en el siguiente enlace:

🔗 [Ver presentación](https://www.canva.com/PENDIENTE)

> Incluye: resumen del problema, solución propuesta, arquitectura del sistema, tecnologías utilizadas, retos técnicos y lecciones aprendidas.

---

## 👨‍💻 Autores

Proyecto desarrollado para la materia **Diseño y Programación de Software Multiplataforma DPS441 G02T**  
Universidad Don Bosco · 2026
