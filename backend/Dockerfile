FROM node:20-alpine

WORKDIR /app

# Instalación de dependencias
COPY package*.json ./
RUN npm install --production

# Copia de archivos y construcción
COPY . .
RUN npm run build

# El puerto interno que tu app escucha es el 3100
EXPOSE 3100

CMD ["npm", "start"]