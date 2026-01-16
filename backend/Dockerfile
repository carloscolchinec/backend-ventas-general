# Usa una imagen de Node ligera
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar el proyecto (ya que veo una carpeta 'dist' y 'ts' en tu captura)
RUN npm run build

# Exponer el puerto
EXPOSE 3100

# Comando para arrancar
CMD ["npm", "start"]