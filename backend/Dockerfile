# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Instalamos todas las dependencias para poder compilar
RUN npm install
COPY . .
# Esto generará la carpeta /dist
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Instalamos solo dependencias de ejecución (más ligero)
RUN npm install --production
# Copiamos solo lo compilado y los archivos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.production ./.env.production
COPY --from=builder /app/public ./public

EXPOSE 3100
# Asegúrate de que tu package.json tenga: "start": "node dist/server.js"
CMD ["npm", "start"]