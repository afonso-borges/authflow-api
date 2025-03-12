FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências do Prisma
RUN apk add --no-cache openssl

# Ativar o Corepack e instalar o Yarn
RUN corepack enable && corepack prepare yarn@4.2.2 --activate

# Copiar arquivos de configuração do projeto
COPY package.json yarn.lock .yarnrc.yml ./
RUN mkdir -p .yarn
COPY .yarn/* ./.yarn/

# Instalar dependências
RUN yarn install --immutable

# Copiar o restante do código fonte
COPY . .

# Gerar o cliente Prisma
RUN yarn prisma:generate

# Compilar a aplicação
RUN yarn build

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instalar dependências do Prisma e PostgreSQL client
RUN apk add --no-cache openssl postgresql-client

# Ativar o Corepack e instalar o Yarn
RUN corepack enable && corepack prepare yarn@4.2.2 --activate

# Copiar arquivos de configuração do projeto
COPY package.json yarn.lock .yarnrc.yml ./
RUN mkdir -p .yarn
COPY .yarn/* ./.yarn/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/app/prisma ./app/prisma

# Expor a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação com Corepack habilitado
CMD ["sh", "-c", "corepack enable && yarn prisma:migrate:deploy && yarn start:prod"]
