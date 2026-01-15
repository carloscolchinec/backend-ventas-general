FROM node:20-alpine

WORKDIR /app

# Copiamos archivos de dependencias primero para aprovechar el cache
COPY package*.json ./
RUN npm install

# Copiamos todo el contenido de la carpeta backend
COPY . .

# Compilamos el proyecto
RUN npm run build

EXPOSE 3100

CMD ["npm", "start"]