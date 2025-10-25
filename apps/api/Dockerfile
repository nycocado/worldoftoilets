FROM node:lts-alpine

# Instalar dependências do sistema
RUN apk add --no-cache curl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (inclui o Nest CLI para o build)
RUN npm install

# Copiar o restante do código
COPY . .

# Compilar o projeto NestJS
RUN npm run build

# Remover dependências de desenvolvimento para reduzir o tamanho da imagem
RUN npm prune --omit=dev

# Expor a porta do NestJS
EXPOSE 3000

# Healthcheck opcional
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Rodar o app em modo produção
CMD ["npm", "run", "start:prod"]