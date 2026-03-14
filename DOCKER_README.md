# Despliegue en servidor (Backend + MySQL)

Esta guía deja documentado cómo levantar el backend en un servidor de forma estable.

## Estado actual del repositorio

- El archivo [docker-compose.yml](docker-compose.yml) actualmente levanta **MySQL**.
- El backend Node.js se ejecuta en el host (recomendado usar `pm2` o `systemd`).

Si más adelante quieres dockerizar también la API, se puede agregar un servicio `backend` al compose, pero este documento cubre el flujo que ya existe en el proyecto.

## 1) Prerrequisitos del servidor

- Docker Engine
- Docker Compose (`docker compose`)
- Node.js 20+
- npm 10+
- Git

## 2) Clonar y preparar proyecto

```bash
git clone <URL_DEL_REPO> backend-eps
cd backend-eps
```

## 3) Variables de entorno

Crear `.env` para servidor (no versionar secretos):

```env
DB_HOST=127.0.0.1
DB_PORT=3307
DB_NAME=sistema_emprendedores_chiquimula
DB_USER=root
DB_PASSWORD=TU_PASSWORD_SEGURA

PORT=3000
NODE_ENV=production

# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Cloudinary (si aplica)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Nota: si usas `FIREBASE_PRIVATE_KEY` en una sola línea, respeta escapes `\\n`.

## 4) Levantar MySQL en contenedor

```bash
docker compose up -d
docker compose ps
docker logs --tail 80 eps-mysql
```

Comprobación rápida de conexión:

```bash
docker exec -it eps-mysql mysql -uroot -p
```

## 5) Levantar backend en servidor

```bash
npm ci --omit=dev
npm run start
```

Para producción se recomienda proceso administrado. Ejemplo con PM2:

```bash
npm install -g pm2
pm2 start app.js --name backend-eps
pm2 save
pm2 startup
```

## 6) Verificar que todo quedó arriba

- API: `GET http://<IP_O_DOMINIO>:3000/`
- BD: `docker compose ps`
- Logs API (PM2): `pm2 logs backend-eps`
- Logs MySQL: `docker logs --tail 100 eps-mysql`

## 7) Cómo aplicar cambios nuevos del repo

Cada vez que subas cambios y quieras actualizar servidor:

```bash
cd backend-eps
git pull

# Recreate MySQL service definition if compose changed
docker compose up -d

# Refresh backend dependencies and restart service
npm ci --omit=dev
pm2 restart backend-eps --update-env
```

Si no usas PM2, reinicia el proceso del backend con tu gestor actual (`systemd`, supervisor, etc.).

## 8) Comandos útiles

- Detener MySQL:

```bash
docker compose stop mysql
```

- Reiniciar MySQL:

```bash
docker compose restart mysql
```

- Bajar contenedor y red:

```bash
docker compose down
```

- Borrado total (incluye datos):

```bash
docker compose down -v
```

Usar `down -v` solo si deseas reinicializar la base de datos desde cero.
