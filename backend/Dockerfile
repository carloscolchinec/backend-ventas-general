FROM node:20-alpine

WORKDIR /app

# 1. Copiar archivos de configuración de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# 2. Instalar TODAS las dependencias (incluyendo TypeScript para el build)
RUN npm install

# 3. Copiar el código fuente
COPY . .

# 4. Ejecutar el build con logs detallados
# Si esto falla, los logs de Portainer te dirán exactamente en qué línea de qué archivo está el error
RUN npm run build

# 5. (Opcional) Limpiar dependencias de desarrollo para producción
# RUN npm prune --production

EXPOSE 3100

CMD ["npm", "start"]