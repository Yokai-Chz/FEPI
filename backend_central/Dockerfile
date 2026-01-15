# Usar una imagen oficial de Node.js como imagen base
FROM node:20-slim

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de producción
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 4000

# Definir el comando para ejecutar la aplicación
CMD [ "node", "src/index.js" ]
