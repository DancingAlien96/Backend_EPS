# Uso de MySQL con Docker

## Iniciar el contenedor MySQL

1. **Levantar el contenedor:**
   ```powershell
   docker-compose up -d
   ```

2. **Ver logs del contenedor:**
   ```powershell
   docker logs eps-mysql
   ```

3. **Verificar que está corriendo:**
   ```powershell
   docker ps
   ```

## Configurar el backend

1. **Copiar configuración de entorno:**
   ```powershell
   cp .env.docker .env
   ```

2. **Iniciar el backend:**
   ```powershell
   npm run dev
   ```

## Comandos útiles

- **Detener el contenedor:**
  ```powershell
  docker-compose down
  ```

- **Reiniciar el contenedor:**
  ```powershell
  docker-compose restart
  ```

- **Eliminar todo (incluyendo datos):**
  ```powershell
  docker-compose down -v
  ```

- **Acceder a MySQL CLI:**
  ```powershell
  docker exec -it eps-mysql mysql -uroot -p65cristofer sistema_emprendedores_chiquimula
  ```

## Ventajas de usar Docker

✅ No hay problemas de caché de MySQL  
✅ Base de datos limpia cada vez que recreas el contenedor  
✅ Fácil de resetear: `docker-compose down -v && docker-compose up -d`  
✅ Mismo entorno en desarrollo y producción  
✅ No interfiere con MySQL local (usa puerto 3307)
