# Usa a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Instala as dependências e compila o TypeScript
RUN yarn
RUN yarn build

# Expõe a porta e inicia o servidor
EXPOSE 3000
CMD ["node", "dist/index.js"]
