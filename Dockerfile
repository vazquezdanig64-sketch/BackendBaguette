# Usamos una versión ligera de Node.js
FROM node:18-alpine

# Creamos el directorio de la app
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto interno (el que configuramos en docker-compose)
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "src/index.js"]