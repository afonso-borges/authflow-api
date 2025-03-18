# AuthFlow API

A robust authentication API built with NestJS, Prisma, and PostgreSQL, offering a complete authentication system with refresh tokens.

## 🚀 Features

- ✅ User registration and login
- 🔄 Refresh token system
- 🔒 JWT authentication
- 🛡️ Data validation with Zod
- 🌐 Structured message keys (ready for i18n integration)

## 🛠️ Technologies

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Modern ORM for Node.js and TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Jest](https://jestjs.io/) - Testing framework

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

## 🔧 Installation

1. Clone the repository:

```bash
git clone git@github.com:afonso-borges/authflow-api.git
cd authflow-api
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` with database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/authflow?schema=public"
JWT_SECRET="your-secret-here"
```

5. Run migrations:

```bash
npx prisma migrate dev
```

6. Start the server:

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

### Response Format

All responses follow this pattern:

```typescript
interface BaseResponse<T> {
    data: T;
    meta: any;
    status: number;
    message: string;
}
```

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens with expiration
- Refresh token system with revocation
- Protection against common attacks

## 🧪 Tests

```bash
# unit tests
npm run test

# test coverage
npm run test:cov
```

## 📦 Project Structure

```
app/
├── src/                  # Application source code
│   ├── auth/             # Authentication module
│   │   ├── controllers/  # Controllers
│   │   ├── dtos/         # Data transfer objects
│   │   ├── services/     # Services
│   │   └── strategies/   # JWT strategies
│   ├── config/           # Application configurations
│   ├── shared/           # Shared resources
│   │   ├── interfaces/   # Shared interfaces
│   │   ├── filters/      # Exception filters
│   │   ├── interceptors/ # Interceptors
│   │   └── pipes/        # Validation pipes
│   └── main.ts           # Application entry point
└── prisma/               # Prisma configuration and schemas
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
