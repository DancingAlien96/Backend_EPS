# Backend_EPS

Backend del Sistema de Emprendedores (Node.js + Express + Sequelize).

## Requisitos

- Node.js 20+
- npm 10+
- Docker + Docker Compose

## Desarrollo local

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env` (no subirlo al repo):

```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=sistema_emprendedores_chiquimula
DB_USER=root
DB_PASSWORD=...
PORT=3000
NODE_ENV=development
```

3. Levantar MySQL con Docker:

```bash
docker compose up -d
```

4. Ejecutar backend:

```bash
npm run dev
```

## Despliegue en servidor

La guía completa para levantar y mantener el backend en servidor está en [DOCKER_README.md](DOCKER_README.md).

Incluye:

- puesta en marcha inicial,
- variables de entorno para servidor,
- verificación de salud,
- flujo de actualización con `git pull`.
