# 🛒 Thera Consulting API

Uma API RESTful completa para gerenciamento de e-commerce, desenvolvida com **NestJS**, seguindo os princípios **SOLID**, arquitetura **Clean Architecture** e aderindo aos **4 níveis do Richardson Maturity Model**.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Banco de Dados](#-banco-de-dados)
- [Cache (Redis)](#-cache-redis)
- [Autenticação](#-autenticação)
- [API RESTful - Richardson Maturity Model](#-api-restful---richardson-maturity-model)
- [Endpoints](#-endpoints)
- [Testes](#-testes)
- [Swagger](#-swagger)
- [Logs](#-logs)
- [Deploy em Produção](#-deploy-em-produção)

---

## 📖 Sobre o Projeto

A **Thera Consulting API** é uma plataforma de e-commerce que permite:

- 👤 **Usuários** podem se cadastrar, fazer login e gerenciar seus dados
- 🏢 **Empresas** podem se cadastrar e anunciar produtos
- 📍 **Endereços** são gerenciados como step do onboarding
- 📦 **Produtos** podem ser criados, editados, listados e excluídos
- 🛒 **Pedidos** podem ser feitos com cálculo automático de frete
- 🚚 **Frete** é calculado via integração com API externa

### Funcionalidades Principais

| Módulo | Funcionalidades |
|--------|-----------------|
| **Auth** | Registro, Login com JWT |
| **Users** | CRUD de usuários, roles (USER, COMPANY_OWNER) |
| **Companies** | CRUD de empresas |
| **Addresses** | CRUD de endereços (polimórfico) |
| **Products** | CRUD de produtos, listagem com filtros, cálculo de frete |
| **Orders** | Criação de pedidos, atualização de status |

---

## 🏛 Arquitetura

A aplicação segue os princípios da **Clean Architecture** e **Domain-Driven Design (DDD)**:

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│  Controllers, DTOs, Decorators, Guards, Middlewares             │
├─────────────────────────────────────────────────────────────────┤
│                      APPLICATION LAYER                          │
│  Use Cases (Business Logic)                                     │
├─────────────────────────────────────────────────────────────────┤
│                        DOMAIN LAYER                             │
│  Entities, Interfaces, Repositories (Abstract), Adapters       │
├─────────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                         │
│  Database (Prisma), Integrations (JWT, Bcrypt, Redis, Shipping) │
└─────────────────────────────────────────────────────────────────┘
```

### Princípios SOLID Aplicados

| Princípio | Aplicação |
|-----------|-----------|
| **S** - Single Responsibility | Cada Use Case tem uma única responsabilidade |
| **O** - Open/Closed | Entidades abertas para extensão, fechadas para modificação |
| **L** - Liskov Substitution | Adapters podem ser substituídos sem quebrar a aplicação |
| **I** - Interface Segregation | Interfaces específicas para cada contexto |
| **D** - Dependency Inversion | Use Cases dependem de abstrações (Repositories, Adapters) |

### Fluxo de Dados

```
Request → Controller → Use Case → Repository/Adapter → Database/External API
                ↓
          Response ← ResponseInterceptor ← Result
```

---

## 🛠 Tecnologias

### Core
- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Prisma](https://www.prisma.io/)** - ORM moderno e type-safe

### Cache
- **[Redis](https://redis.io/)** - Cache em memória de alta performance
- **[ioredis](https://github.com/redis/ioredis)** - Cliente Redis para Node.js

### Autenticação
- **[Passport.js](http://www.passportjs.org/)** - Middleware de autenticação
- **[JWT](https://jwt.io/)** - JSON Web Tokens
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas

### Documentação
- **[Swagger](https://swagger.io/)** - Documentação OpenAPI

### DevOps
- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers

### Testes
- **[Jest](https://jestjs.io/)** - Framework de testes
- **Bash Script** - Testes E2E automatizados

---

## 📁 Estrutura de Pastas

```
src/
├── domain/                      # Camada de Domínio
│   ├── adapters/                # Abstrações de serviços externos
│   │   ├── bcrypt.adapter.ts
│   │   ├── cache.adapter.ts
│   │   ├── jwt.adapter.ts
│   │   └── shipping.adapter.ts
│   ├── entities/                # Entidades de domínio
│   │   ├── user.entity.ts
│   │   ├── company.entity.ts
│   │   ├── address.entity.ts
│   │   ├── product.entity.ts
│   │   └── order.entity.ts
│   ├── enum/                    # Enumerações
│   ├── interfaces/              # Interfaces de I/O
│   └── repositories/            # Contratos de repositórios
│
├── use-cases/                   # Camada de Aplicação
│   ├── auth/                    # Login, Register
│   ├── users/                   # Create, Update
│   ├── companies/               # Create, Update
│   ├── addresses/               # Create, Update
│   ├── products/                # CRUD, Calculate Shipping
│   └── orders/                  # Create, Update Status
│
├── infra/                       # Camada de Infraestrutura
│   ├── commons/                 # Utilitários compartilhados
│   │   ├── decorators/          # @Public, @Roles, @CurrentUser
│   │   ├── filters/             # Exception filters
│   │   ├── guards/              # JWT, Roles guards
│   │   ├── hateoas/             # HATEOAS interfaces
│   │   ├── interceptors/        # Response interceptor
│   │   ├── logger/              # Logger service
│   │   ├── middlewares/         # Request logger
│   │   └── strategies/          # JWT strategy
│   ├── database/                # Prisma repositories
│   ├── integrations/            # Implementações concretas
│   │   ├── bcrypt/
│   │   ├── jwt/
│   │   ├── redis/
│   │   └── shipping/
│   └── modules/                 # Módulos NestJS
│
├── presentation/                # Camada de Apresentação
│   ├── controllers/             # Controllers REST
│   └── dtos/                    # Data Transfer Objects
│
├── app.module.ts                # Módulo raiz
└── main.ts                      # Bootstrap da aplicação

prisma/
├── schema.prisma                # Schema do banco de dados
└── config.ts                    # Configuração do Prisma

scripts/
└── e2e-test.sh                  # Script de testes E2E

docker/
└── Dockerfile                   # Build da aplicação
```

---

## 📋 Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** >= 24.x
- **Docker Compose** >= 2.x
- **jq** (para executar testes E2E)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/mateh3007/backend-test-api.git
cd backend-test-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp env.example .env
```

### 4. Inicie os serviços com Docker

```bash
docker-compose up -d
```

### 5. Execute as migrations do Prisma

```bash
npx prisma migrate dev
```

### 6. Gere o cliente Prisma

```bash
npx prisma generate
```

---

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```env
# API
NODE_ENV=development
API_PORT=3000

# Database (PostgreSQL)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=thera
DATABASE_PASSWORD=thera123
DATABASE_NAME=thera_db
DATABASE_URL="postgresql://thera:thera123@localhost:5432/thera_db?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1d

# Shipping API
SHIPPING_API_URL=https://showcommerce.com.br/api/calculadora-frete
```

---

## ▶️ Executando a Aplicação

### Desenvolvimento

```bash
# Inicia em modo watch
npm run start:dev
```

### Produção

```bash
# Build
npm run build

# Start
npm run start:prod
```

### Docker

```bash
# Inicia todos os serviços (API + PostgreSQL + Redis)
docker-compose up -d

# Visualizar logs
docker-compose logs -f api

# Parar serviços
docker-compose down
```

A API estará disponível em: `http://localhost:3000`

---

## 🗄 Banco de Dados

### PostgreSQL

O banco de dados PostgreSQL armazena todos os dados persistentes da aplicação.

#### Schema (Prisma)

```prisma
model User {
  id             String         @id @default(uuid())
  name           String
  email          String         @unique
  password       String
  phone          String
  stepOnboarding StepOnboarding @default(PROFILE)
  role           Role           @default(USER)
  companyId      String?
  // ...relations
}

model Company {
  id            String   @id @default(uuid())
  corporateName String
  cnpj          String   @unique
  phone         String
  email         String   @unique
  // ...relations
}

model Address {
  id              String          @id @default(uuid())
  country         String
  state           String
  city            String
  street          String
  number          String
  complement      String?
  zipCode         String
  addressableId   String
  addressableType AddressableType  // USER | COMPANY
  // ...relations
}

model Product {
  id           String     @id @default(uuid())
  name         String
  category     Category
  description  String
  price        Decimal
  stock        Int
  freeShipping Boolean
  sellerId     String
  sellerType   SellerType  // USER | COMPANY
  // ...relations
}

model Order {
  id              String      @id @default(uuid())
  productId       String
  productQuantity Int
  shippingCost    Decimal
  totalPrice      Decimal
  status          OrderStatus  // PENDING | CONFIRMED | CANCELLED
  sellerId        String
  sellerType      SellerType
  buyerId         String
  // ...relations
}
```

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset
```

### Prisma Studio

```bash
# Interface visual para o banco
npx prisma studio
```

---

## 🔴 Cache (Redis)

### Estratégia de Cache

A aplicação utiliza Redis para cache de dados frequentemente acessados:

| Recurso | Chave | TTL | Estratégia |
|---------|-------|-----|------------|
| Shipping | `shipping:{origin}:{destination}` | 1 hora | Cache de cálculos de frete |
| Products | `products:list:{filters}` | 5 min | Cache de listagem de produtos |
| User (Login) | `user:{email}` | 1 hora | Cache de dados do usuário |

### Invalidação de Cache

- **Criação de produto**: Invalida cache de listagem (`products:*`)
- **Atualização de produto**: Invalida cache de listagem (`products:*`)
- **Exclusão de produto**: Invalida cache de listagem (`products:*`)

### Implementação

```typescript
// Cache GET
const cached = await this.cacheAdapter.get<T>(key);
if (cached) {
  this.logger.log(`✅ Cache HIT - Key: ${key}`);
  return cached;
}

// Cache SET
await this.cacheAdapter.set(key, data, TTL);
this.logger.log(`📦 Cache SET - Key: ${key}`);

// Cache DELETE (pattern)
await this.cacheAdapter.deleteByPattern('products:*');
this.logger.log(`🗑️ Cache INVALIDATED - Pattern: products:*`);
```

### Logs de Cache

A aplicação gera logs detalhados sobre uso do cache:

```
✅ Cache HIT for shipping calculation - From: 01310100 To: 04538133
❌ Cache MISS for products list - Filters: {"category":"ELECTRONICS"}
📦 Cache SET for shipping - Key: shipping:01310100:04538133 - TTL: 3600s
🗑️ Cache INVALIDATED - Pattern: products:*
```

---

## 🔐 Autenticação

### JWT (JSON Web Token)

A API utiliza JWT para autenticação stateless:

```typescript
// Payload do Token
{
  sub: "user-uuid",
  email: "user@email.com",
  role: "USER",  // ou "COMPANY_OWNER"
  iat: 1234567890,
  exp: 1234654290  // Expira em 1 dia
}
```

### Fluxo de Autenticação

```
1. POST /auth/register → Cria usuário, retorna token
2. POST /auth/login → Valida credenciais, retorna token
3. Requisições autenticadas → Header: Authorization: Bearer <token>
```

### Guards e Decorators

```typescript
// Rota pública (sem autenticação)
@Public()
@Get('products')

// Rota protegida (requer autenticação)
@Get('profile')

// Rota com role específica
@Roles(RoleEnum.COMPANY_OWNER)
@Post('companies')

// Acessar usuário autenticado
@Get('me')
async getProfile(@CurrentUser() user: ICurrentUser) {
  return user;
}
```

### Roles

| Role | Permissões |
|------|------------|
| `USER` | CRUD próprio, Criar pedidos, Anunciar produtos |
| `COMPANY_OWNER` | Tudo de USER + Criar empresas |

---

## 🌐 API RESTful - Richardson Maturity Model

A API atende aos **4 níveis do Richardson Maturity Model**:

### Nível 0 - POX (Plain Old XML/JSON)

✅ A API utiliza HTTP como protocolo de comunicação, com JSON como formato de dados.

### Nível 1 - Recursos

✅ Recursos bem definidos com URIs semânticas:

```
/auth/register    → Recurso de registro
/auth/login       → Recurso de login
/users            → Recurso de usuários
/users/:id        → Usuário específico
/companies        → Recurso de empresas
/addresses        → Recurso de endereços
/products         → Recurso de produtos
/products/:id/shipping → Sub-recurso de frete
/orders           → Recurso de pedidos
/orders/:id/status → Sub-recurso de status
```

### Nível 2 - Verbos HTTP

✅ Uso semântico dos verbos HTTP:

| Verbo | Uso | Status Codes |
|-------|-----|--------------|
| `GET` | Leitura | 200 OK |
| `POST` | Criação | 201 Created |
| `PATCH` | Atualização parcial | 200 OK |
| `DELETE` | Remoção | 200 OK |

### Nível 3 - HATEOAS (Hypermedia)

✅ Respostas incluem links para navegação:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Produto",
    "_links": {
      "self": { "href": "/products/uuid", "method": "GET" },
      "update": { "href": "/products/uuid", "method": "PATCH" },
      "delete": { "href": "/products/uuid", "method": "DELETE" },
      "shipping": { "href": "/products/uuid/shipping", "method": "GET" }
    }
  },
  "timestamp": "2026-01-20T12:00:00.000Z",
  "path": "/products",
  "statusCode": 200
}
```

### Formato de Resposta Padrão

**Sucesso:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-01-20T12:00:00.000Z",
  "path": "/endpoint",
  "statusCode": 200
}
```

**Erro:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  },
  "timestamp": "2026-01-20T12:00:00.000Z",
  "path": "/endpoint",
  "statusCode": 404
}
```

---

## 📡 Endpoints

### Auth

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Registrar usuário | ❌ |
| POST | `/auth/login` | Login | ❌ |

### Users

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/users` | Criar usuário | ✅ COMPANY_OWNER |
| PATCH | `/users/:id` | Atualizar usuário | ✅ COMPANY_OWNER |

### Companies

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/companies` | Criar empresa | ✅ COMPANY_OWNER |
| PATCH | `/companies/:id` | Atualizar empresa | ✅ COMPANY_OWNER |

### Addresses

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/addresses` | Criar endereço | ✅ |
| PATCH | `/addresses/:id` | Atualizar endereço | ✅ |

### Products

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/products` | Listar produtos | ❌ |
| POST | `/products` | Criar produto | ✅ |
| PATCH | `/products/:id` | Atualizar produto | ✅ |
| DELETE | `/products/:id` | Excluir produto | ✅ |
| GET | `/products/:id/shipping` | Calcular frete | ❌ |

### Orders

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/orders` | Criar pedido | ✅ |
| PATCH | `/orders/:id/status` | Atualizar status | ✅ |

---

## 🧪 Testes

### Testes Unitários

```bash
# Executar todos os testes
npm run test

# Executar com coverage
npm run test:cov

# Executar em modo watch
npm run test:watch
```

### Testes E2E (Script Automatizado)

O projeto inclui um script completo de testes E2E que testa **todos os endpoints** e **todos os casos possíveis**.

#### Executar Testes E2E

```bash
# Certifique-se que a API está rodando
npm run start:dev

# Em outro terminal, execute o script
./scripts/e2e-test.sh

# Ou especificando outra URL
BASE_URL=http://localhost:4000 ./scripts/e2e-test.sh
```

#### Casos de Teste Cobertos

##### Auth (8 testes)
| Caso | Status Esperado |
|------|-----------------|
| Register - Sucesso | 201 |
| Register - Email existente | 409 |
| Register - Dados inválidos | 400 |
| Register - Campos faltando | 400 |
| Login - Sucesso | 200 |
| Login - Senha errada | 401 |
| Login - Email não existe | 401 |
| Login - Campos faltando | 400 |

##### Users (5 testes)
| Caso | Status Esperado |
|------|-----------------|
| Create - Sem token | 401 |
| Create - Role USER | 403 |
| Create - Token inválido | 401 |
| Update - Sem token | 401 |
| Update - Não encontrado | 403/404 |

##### Companies (4 testes)
| Caso | Status Esperado |
|------|-----------------|
| Create - Sem token | 401 |
| Create - Role USER | 403 |
| Create - Dados inválidos | 400/403 |
| Update - Sem token | 401 |

##### Addresses (6 testes)
| Caso | Status Esperado |
|------|-----------------|
| Create - Sem token | 401 |
| Create - Sucesso | 201 |
| Create - Duplicado | 409 |
| Create - Dados inválidos | 400 |
| Update - Sem token | 401 |
| Update - Não encontrado | 404 |

##### Products (14 testes)
| Caso | Status Esperado |
|------|-----------------|
| List - Público | 200 |
| List - Com filtros | 200 |
| List - Range de preço | 200 |
| Create - Sem token | 401 |
| Create - Sucesso | 201 |
| Create - Dados inválidos | 400 |
| Create - Preço negativo | 400 |
| Update - Sem token | 401 |
| Update - Sucesso | 200 |
| Update - Não encontrado | 404 |
| Shipping - Público | 200 |
| Shipping - Produto não existe | 404 |
| Shipping - Sem CEP | 400 |
| Delete - Sem token | 401 |

##### Orders (10 testes)
| Caso | Status Esperado |
|------|-----------------|
| Create - Sem token | 401 |
| Create - Sucesso | 201 |
| Create - Produto não existe | 404 |
| Create - Dados inválidos | 400 |
| Create - Estoque insuficiente | 400 |
| Update Status - Sem token | 401 |
| Update Status - Sucesso | 200 |
| Update Status - Não encontrado | 404 |

##### Validações Extras (8 testes)
| Caso | Descrição |
|------|-----------|
| HATEOAS - Login | Resposta contém `_links` |
| HATEOAS - Products | Resposta contém `_links` |
| Response Format | `success: true` |
| Response Format | Campo `data` presente |
| Response Format | Campo `timestamp` presente |
| Error Format | `success: false` |
| Error Format | Campo `error.code` presente |
| Error Format | Campo `error.message` presente |

#### Output dos Testes

```
╔══════════════════════════════════════════════════════════════╗
║     🧪 THERA CONSULTING API - E2E TEST SUITE                ║
╚══════════════════════════════════════════════════════════════╝

========================================
AUTH ENDPOINTS
========================================

--- POST /auth/register ---

✓ PASS - Register new user (Status: 201)
✓ PASS - Register with existing email returns 409 (Status: 409)
✓ PASS - Register with invalid data returns 400 (Status: 400)
...

========================================
TEST SUMMARY
========================================

Total Tests:  55
Passed:       53
Failed:       0

Success Rate: 96%

✅ All tests passed!
```

---

## 📚 Swagger

A documentação interativa da API está disponível em:

**Produção:**
```
http://44.201.13.168:3000/api/docs
```

**Desenvolvimento Local:**
```
http://localhost:3000/api/docs
```

### Recursos do Swagger

- 📖 Documentação completa de todos os endpoints
- 🔐 Autenticação JWT integrada
- 📝 Schemas de request/response
- 🧪 Interface para testar endpoints

---

## 📝 Logs

A aplicação gera logs estruturados para monitoramento:

### Request Logger

```
[Request] GET /products - 200 - 45ms
[Request] POST /auth/login - 200 - 123ms
[Request] POST /products - 401 - 5ms
```

### Cache Logger

```
✅ Cache HIT for shipping - From: 01310100 To: 04538133
❌ Cache MISS for products list
📦 Cache SET - Key: shipping:01310100:04538133 - TTL: 3600s
🗑️ Cache INVALIDATED - Pattern: products:*
```

### Application Logger

```
🚀 Application is running on: http://localhost:3000
📚 Swagger docs available at: http://localhost:3000/api/docs
```

---

## 🐳 Docker (Apenas para Desenvolvimento Local)

> **Nota:** Docker é usado apenas para desenvolvimento local. Em produção, a aplicação roda diretamente com **PM2** na EC2.

### Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| `api` | 3000 | API NestJS |
| `postgres` | 5432 | PostgreSQL |
| `redis` | 6379 | Redis |

### Comandos

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild após alterações
docker-compose up -d --build

# Limpar volumes (CUIDADO: apaga dados)
docker-compose down -v
```

---

## 🚀 Deploy em Produção

A aplicação está deployada na **AWS EC2** utilizando os seguintes serviços:

### Infraestrutura

| Serviço | Descrição | Uso |
|---------|-----------|-----|
| **AWS EC2** | Servidor de aplicação | Host da API NestJS |
| **Neon** | Database PostgreSQL | Banco de dados gerenciado |
| **Upstash** | Redis gerenciado | Cache distribuído |
| **PM2** | Process Manager | Gerenciamento de processos Node.js |

### URL da API em Produção

- **API Base:** `http://44.201.13.168:3000`
- **Swagger Docs:** `http://44.201.13.168:3000/api/docs`
- **Health Check:** `http://44.201.13.168:3000/health`

### Configuração do Ambiente

#### Variáveis de Ambiente Necessárias

```bash
# Ambiente
NODE_ENV=production
PORT=3000

# Database (Neon)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Redis (Upstash)
REDIS_REST_URL=https://your-redis.upstash.io
REDIS_REST_TOKEN=your-upstash-token

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=*

# Shipping API (opcional)
SHIPPING_API_URL=your-shipping-api-url
SHIPPING_API_KEY=your-shipping-api-key
```

### Processo de Deploy

#### 1. Preparação do Servidor EC2

```bash
# Conectar ao servidor EC2
ssh -i your-key.pem ubuntu@44.201.13.168

# Instalar Node.js (se necessário)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Instalar dependências do sistema
sudo apt-get update
sudo apt-get install -y git
```

#### 2. Clonar e Configurar o Repositório

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/thera-consulting-test.git
cd thera-consulting-test

# Criar arquivo .env com as variáveis de ambiente
cp .env.example .env
nano .env  # Editar com as credenciais corretas
```

#### 3. Configurar Neon Database

1. Acesse [Neon Console](https://console.neon.tech)
2. Crie um novo projeto PostgreSQL
3. Copie a connection string (DATABASE_URL)
4. Adicione ao arquivo `.env`

#### 4. Configurar Upstash Redis

1. Acesse [Upstash Console](https://console.upstash.com)
2. Crie um novo database Redis
3. Copie `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`
4. Adicione ao arquivo `.env` como `REDIS_REST_URL` e `REDIS_REST_TOKEN`

#### 5. Executar Deploy

```bash
# Executar script de deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

O script de deploy automaticamente:
- ✅ Instala dependências (`npm ci --production`)
- ✅ Gera cliente Prisma (`npx prisma generate`)
- ✅ Executa migrations (`npx prisma migrate deploy`)
- ✅ Faz build da aplicação (`npm run build`)
- ✅ Inicia/reinicia com PM2 (`pm2 reload`)

#### 6. Gerenciamento com PM2

```bash
# Ver status da aplicação
pm2 status

# Ver logs em tempo real
pm2 logs thera-api

# Reiniciar aplicação
pm2 restart thera-api

# Parar aplicação
pm2 stop thera-api

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração do PM2 (para iniciar após reboot)
pm2 save

# Configurar PM2 para iniciar no boot do sistema
pm2 startup
pm2 save
```

### Configuração do PM2

A aplicação utiliza o arquivo `ecosystem.config.js` com as seguintes configurações:

- **Modo:** Cluster (múltiplas instâncias)
- **Instâncias:** Máximo disponível (baseado em CPUs)
- **Memória:** Restart automático ao atingir 500MB
- **Logs:** Armazenados em `./logs/pm2-*.log`
- **Auto-restart:** Habilitado

### Monitoramento

#### Logs da Aplicação

```bash
# Logs do PM2
pm2 logs thera-api

# Logs de erro
tail -f logs/pm2-error.log

# Logs de saída
tail -f logs/pm2-out.log
```

#### Health Check

A aplicação expõe um endpoint de health check:

```bash
curl http://44.201.13.168:3000/health
```

### Atualização (Re-deploy)

Para atualizar a aplicação após mudanças no código:

```bash
# No servidor EC2
cd /path/to/thera-consulting-test

# Atualizar código
git pull origin main

# Executar deploy novamente
./scripts/deploy.sh
```

O PM2 fará um **reload sem downtime** (zero downtime deployment), mantendo a aplicação disponível durante a atualização.

### Segurança

- ✅ Firewall configurado para permitir apenas porta 3000
- ✅ HTTPS recomendado (usar Nginx como reverse proxy)
- ✅ Variáveis sensíveis em `.env` (não commitadas)
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado adequadamente

### Troubleshooting

#### Aplicação não inicia

```bash
# Verificar logs
pm2 logs thera-api --lines 100

# Verificar variáveis de ambiente
pm2 env 0

# Verificar se a porta está em uso
sudo lsof -i :3000
```

#### Erro de conexão com database

- Verificar `DATABASE_URL` no `.env`
- Verificar se o IP da EC2 está autorizado no Neon
- Verificar SSL mode na connection string

#### Erro de conexão com Redis

- Verificar `REDIS_REST_URL` e `REDIS_REST_TOKEN` no `.env`
- Verificar se o token do Upstash tem permissões de leitura/escrita

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request


---

## 👤 Autor

**Matheus Reis**

- GitHub: [@mateh3007](https://github.com/mateh3007)

