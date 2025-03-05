# AuthFlow API

Uma API robusta de autenticação construída com NestJS, Prisma e PostgreSQL, oferecendo um sistema completo de autenticação com refresh tokens.

## 🚀 Funcionalidades

- ✅ Registro e login de usuários
- 🔄 Sistema de refresh token
- 🔒 Autenticação JWT
- 🌐 Suporte a i18n para mensagens
- 🛡️ Validação de dados com Zod
- 📝 Logs estruturados
- 🔍 Rastreamento de sessões

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js progressivo
- [Prisma](https://www.prisma.io/) - ORM moderno para Node.js e TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [JWT](https://jwt.io/) - JSON Web Tokens para autenticação
- [Zod](https://zod.dev/) - Validação de schemas TypeScript-first
- [Jest](https://jestjs.io/) - Framework de testes

## 📋 Pré-requisitos

- Node.js (v18+)
- PostgreSQL
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone git@github.com:afonso-borges/authflow-api.git
cd authflow-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Configure seu `.env` com as credenciais do banco:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/authflow?schema=public"
JWT_SECRET="seu-secret-aqui"
```

5. Execute as migrations:

```bash
npx prisma migrate dev
```

6. Inicie o servidor:

```bash
npm run start:dev
```

## 📚 API Endpoints

### Auth

```bash
POST /auth/register
POST /auth/login
POST /auth/refresh
```

### Users

```bash
GET /users
GET /users/:id
PUT /users/:id
```

### Formato de Resposta

Todas as respostas seguem o padrão:

```typescript
interface BaseResponse<T> {
    data: T;
    meta: any;
    status: number;
    message: string;
}
```

## 🔐 Segurança

- Senhas hasheadas com bcrypt
- Tokens JWT com expiração
- Sistema de refresh token com revogação
- Proteção contra ataques comuns

## 🧪 Testes

```bash
# unit tests
npm run test

# test coverage
npm run test:cov
```

## 📦 Estrutura do Projeto

```
app/
├── src/                  # Código fonte da aplicação
│   ├── auth/             # Módulo de autenticação
│   │   ├── controllers/  # Controladores
│   │   ├── dtos/         # Objetos de transferência de dados
│   │   ├── services/     # Serviços
│   │   └── strategies/   # Estratégias JWT
│   ├── config/           # Configurações da aplicação
│   ├── shared/           # Recursos compartilhados
│   │   ├── interfaces/   # Interfaces compartilhadas
│   │   ├── filters/      # Filtros de exceção
│   │   ├── interceptors/ # Interceptadores
│   │   └── pipes/        # Pipes de validação
│   └── main.ts           # Ponto de entrada da aplicação
└── prisma/               # Configuração e schemas do Prisma
```

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
