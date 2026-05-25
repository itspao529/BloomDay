# BloomDay - Classroom App para Kindergarden

App movil para gestion de salon de clases Kinder con React Native, Node.js, MySQL y Docker.

## Requisitos Previos
- Node.js v18 o superior
- Docker Desktop
- Expo Go en tu celular
- Git

## Instalacion

### 1. Clonar el repositorio
git clone <url-del-repositorio>
cd BloomDay

### 2. Configurar variables de entorno
cp .env.example .env

Edita el .env con tu IP local:
- MY_IP=TU_IP_LOCAL
- EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000/api

Para obtener tu IP en Mac:
ipconfig getifaddr en0

### 3. Levantar el Backend con Docker
cd docker
docker-compose up -d

Verifica los contenedores:
docker ps
Debes ver: docker-db-1, docker-backend-1, docker-frontend-1

### 4. Configurar el Frontend
cd ../frontend
npm install

Actualiza tu IP en frontend/services/api.js:
baseURL: "http://TU_IP_LOCAL:3000/api"

### 5. Iniciar la App
npx expo start --clear

Escanea el QR con Expo Go en tu celular.

## Funcionalidades

Maestra:
- Gestionar actividades y tareas
- Gestionar eventos del salon
- Registrar asistencia diaria
- Gestionar alumnos
- Registrar calificaciones
- Galeria de fotos
- Notificaciones

Familia:
- Ver actividades del nino
- Ver proximos eventos
- Recibir mensajes de la maestra
- Ver calendario

## Arquitectura
BloomDay/
- backend/     Node.js + Express + JWT
- frontend/    React Native + Expo SDK 54
- docker/      Docker Compose
- db/          Schema MySQL

## Endpoints principales
- POST /api/auth/login
- POST /api/auth/register
- GET/POST/PUT/DELETE /api/eventos
- GET/POST/PUT/DELETE /api/tareas
- GET/PUT /api/notificaciones
- GET /api/usuarios

## Comandos Docker
docker-compose up -d        Levantar servicios
docker-compose down         Detener servicios
docker logs docker-backend-1  Ver logs backend

## Tecnologias
- Frontend: React Native + Expo SDK 54
- Backend: Node.js + Express
- Base de Datos: MySQL 8
- Autenticacion: JWT
- Contenedores: Docker + Docker Compose
- HTTP Client: Axios
- Navegacion: React Navigation v6

## Notas Importantes
- El celular y la computadora deben estar en la misma red WiFi
- Actualiza la IP si cambias de red
- Puerto 3000 para el backend
- Puerto 3307 para MySQL
