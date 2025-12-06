FROM node:lts-alpine

RUN apk add --no-cache curl python3 make g++

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

COPY . .

CMD ["npm", "run", "dev"]
