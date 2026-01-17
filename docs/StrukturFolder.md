
# Struktur Folder — Hysteria

Berikut struktur folder project Hysteria yang menggunakan arsitektur modular:

```
hysteria/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard pages
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── api/                      # API Routes (Next.js route handlers)
│   │   └── auth/                 # Auth endpoints
│   │       ├── login/
│   │       │   └── router.js
│   │       ├── logout/
│   │       │   └── router.js
│   │       └── refresh/
│   │           └── router.js
│   ├── auth/                     # Auth pages
│   │   └── login/
│   │       └── page.jsx
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
│
├── components/                   # Reusable UI components
│   └── (komponen UI akan ditambahkan di sini)
│
├── config/                       # Konfigurasi aplikasi
│   ├── auth.config.js            # Konfigurasi authentication
│   └── cookie.config.js          # Konfigurasi cookies
│
├── lib/                          # Utilities & helper functions
│   ├── cookies.js                # Cookie management utilities
│   ├── hash.js                   # Password hashing utilities
│   ├── jwt.js                    # JWT token utilities
│   ├── prisma.js                 # Prisma client singleton
│   └── response.js               # Standard API response helpers
│
├── middleware/                   # Next.js middleware
│   └── auth.middleware.js        # Authentication middleware
│
├── modules/                      # Modular business logic (Domain-Driven Design)
│   ├── (modul yang lainnya)/.....
│   ├── admin/                    # Admin module
│   ├── auth/                     # Authentication & authorization module
│   │   ├── index.js              # Module exports
│   │   ├── domain/               # Domain constants & business rules
│   │   │   ├── role.constants.js
│   │   │   └── status.constants.js
│   │   ├── guards/               # Authorization guards
│   │   │   ├── role.guard.js
│   │   │   └── status.guard.js
│   │   ├── repositories/         # Data access layer (Prisma queries)
│   │   │   ├── refresh-token.repository.js
│   │   │   ├── role.repository.js
│   │   │   ├── status.repository.js
│   │   │   └── user.repository.js
│   │   ├── services/             # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── password.service.js
│   │   │   ├── refresh-token.service.js
│   │   │   └── token.service.js
│   │   └── validators/           # Input validation schemas
│   │       └── login.validator.js
│   └── user/                     # User management module 
│
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   ├── seed/                     # Database seeders
│   │   ├── 001-create-test-pg.js
│   │   ├── 002-test-pg.js
│   │   ├── 003-create-more-test-pg.js
│   │   ├── 004-seed-roles.js
│   │   ├── 005-seed-statuses.js
│   │   └── index.js
│   ├── generated/                # Generated Prisma Client types
│   ├── PanduanMigration.md       # Migration guide
│   └── PanduanSeed.md            # Seeding guide
│
├── public/                       # Static assets (images, fonts, icons)
│
├── services/                     # External API services (untuk integrasi pihak ketiga)
│
├── test/                         # Unit / integration / e2e tests
│
├── docs/                         # Dokumentasi internal
│   ├── note.md
│   └── StrukturFolder.md
│
├── EXP/                          # Experimental / sandbox code
│   └── db.js
│
└── konfigurasi proyek            # package.json, tsconfig.json, next.config.mjs, dll

```

## Penjelasan Arsitektur

### Arsitektur Modular (Module Pattern)

Project Hysteria menggunakan arsitektur modular yang membagi aplikasi berdasarkan domain bisnis. Setiap modul adalah unit independen yang menangani satu area fungsionalitas.

**Struktur Modul:**

```
modules/<nama-modul>/
├── index.js              # Barrel export untuk module
├── domain/               # Domain constants & business rules
├── guards/               # Authorization & validation guards
├── repositories/         # Data access layer (Prisma queries)
├── services/             # Business logic layer
└── validators/           # Input validation (Zod/Joi schemas)
```

**Lapisan Arsitektur (Layered Architecture):**

1. **Presentation Layer** (`app/`) — Next.js pages & API routes
2. **Business Logic Layer** (`modules/*/services/`) — Use cases & orchestration
3. **Data Access Layer** (`modules/*/repositories/`) — Database queries via Prisma
4. **Domain Layer** (`modules/*/domain/`) — Business rules & constants

**Flow Data:**
```
User Request → API Route → Service → Repository → Database
                    ↓           ↓           ↓
              Validator    Guards    Prisma Client
```

### Folder Utama & Tanggung Jawab

#### `app/` — Next.js App Router
- **Pages**: File `page.jsx` untuk routing
- **Layouts**: File `layout.jsx` untuk layout wrapper
- **API Routes**: File di `app/api/*/router.js` untuk backend endpoints
- Gunakan route groups `(name)` jika ingin grouping tanpa mempengaruhi URL

#### `modules/` — Domain Modules (DDD)
**Module Auth contoh implementasi:**
- `domain/` — Konstanta & enum (ROLE, STATUS, error codes)
- `guards/` — Middleware untuk authorization checks
- `repositories/` — Query database menggunakan Prisma
- `services/` — Business logic (login flow, token generation)
- `validators/` — Schema validation untuk input

**Prinsip:**
- Setiap module harus independen dan reusable
- Repository hanya berkomunikasi dengan database
- Service mengorkestrasikan flow dan business rules
- Guards melakukan authorization checks
- Validators memvalidasi input sebelum masuk ke service

#### `lib/` — Shared Utilities
- `prisma.js` — Singleton Prisma Client (mencegah multiple connections)
- `jwt.js` — JWT token generation & verification
- `hash.js` — Password hashing (bcrypt/argon2)
- `cookies.js` — Cookie management helpers
- `response.js` — Standard API response format

**Pattern:**
```js
// lib/response.js
export const success = (data, message) => ({ success: true, data, message });
export const error = (message, code) => ({ success: false, error: message, code });
```

#### `config/` — Configuration Files
- Konfigurasi yang tidak berubah per environment
- Auth settings, cookie options, app constants
- **Jangan simpan secrets** — gunakan `.env` untuk sensitive data

#### `middleware/` — Next.js Middleware
- Global middleware yang dijalankan sebelum request masuk ke route
- Auth middleware untuk protected routes
- Rate limiting, logging, request validation

#### `components/` — React Components
**Rekomendasi struktur:**
```
components/
├── ui/              # Primitives (Button, Input, Card, Modal)
├── forms/           # Form components (LoginForm, RegisterForm)
├── layouts/         # Layout components (Header, Footer, Sidebar)
└── features/        # Feature-specific components
    ├── auth/
    └── admin/
```

#### `prisma/` — Database Management
- `schema.prisma` — Database schema definition
- `migrations/` — Version-controlled database changes
- `seed/` — Database seeding scripts (numbered untuk urutan)
- `generated/` — Auto-generated Prisma Client types

**Migration workflow:**
```bash
npx prisma migrate dev --name nama_migration
npx prisma migrate deploy  # Production
```

### Best Practices

#### 1. Module Independence
```js
// ✅ Good: Module self-contained
// modules/auth/index.js
export { AuthService } from './services/auth.service.js';
export { UserRepository } from './repositories/user.repository.js';

// ❌ Bad: Circular dependencies antar module
// modules/auth/services/auth.service.js
import { ProductService } from '../../product/services/product.service.js';
```

#### 2. Repository Pattern
```js
// ✅ Good: Repository handles all DB queries
// modules/auth/repositories/user.repository.js
export class UserRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }
}

// ❌ Bad: Direct Prisma calls in service
// modules/auth/services/auth.service.js
const user = await prisma.user.findUnique({ where: { email } });
```

#### 3. Service Layer
```js
// ✅ Good: Service orchestrates business logic
export class AuthService {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('User not found');
    
    const valid = await this.passwordService.verify(password, user.password);
    if (!valid) throw new Error('Invalid password');
    
    return this.tokenService.generate(user);
  }
}
```

#### 4. Validation First
```js
// ✅ Good: Validate di API route sebelum service
// app/api/auth/login/router.js
export async function POST(request) {
  const body = await request.json();
  const validated = loginValidator.parse(body); // Zod/Joi
  
  const result = await authService.login(validated);
  return Response.json(result);
}
```

#### 5. Error Handling
```js
// lib/response.js
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Di service
throw new AppError('Invalid credentials', 401);
```

### Naming Conventions

- **Files**: `kebab-case.js` (user-repository.js, auth-service.js)
- **Components**: `PascalCase.jsx` (LoginForm.jsx, UserCard.jsx)
- **Functions/Variables**: `camelCase` (getUserById, isAuthenticated)
- **Constants**: `UPPER_SNAKE_CASE` (DEFAULT_ROLE, MAX_ATTEMPTS)
- **Classes**: `PascalCase` (UserRepository, AuthService)

### Import/Export Pattern

```js
// ✅ Barrel exports untuk cleaner imports
// modules/auth/index.js
export * from './services/auth.service.js';
export * from './repositories/user.repository.js';
export * from './guards/role.guard.js';

// Usage
import { AuthService, UserRepository, roleGuard } from '@/modules/auth';

// ❌ Avoid deep imports di banyak tempat
import { AuthService } from '@/modules/auth/services/auth.service.js';
```

### Migration & Development Flow

1. **Schema Changes**: Edit `prisma/schema.prisma`
2. **Create Migration**: `npx prisma migrate dev --name change_name`
3. **Update Repository**: Adjust queries jika ada perubahan schema
4. **Update Service**: Adjust business logic jika perlu
5. **Update API Route**: Adjust endpoint jika ada breaking changes
6. **Update Frontend**: Adjust UI components

### Perbandingan dengan Arsitektur Lain

**Hysteria (Modular + DDD)** vs **Feature-First**:

| Aspek | Hysteria (Current) | Feature-First |
|-------|-------------------|---------------|
| Struktur | `modules/<domain>` | `features/<feature>` |
| Fokus | Business domain | User features |
| Backend Logic | Terpisah jelas (repo, service) | Lebih flexible |
| Scalability | Excellent untuk apps kompleks | Good untuk medium apps |
| Learning Curve | Medium-High | Low-Medium |

**Kapan pakai Modular (Hysteria):**
- Multi-role apps (admin, user, seller)
- Complex business rules
- Large team dengan domain experts

**Kapan pakai Feature-First:**
- Prototype atau MVP
- Small to medium apps
- Team kecil yang butuh velocity

---

## Summary

Project Hysteria menggunakan **modular architecture** dengan clear separation of concerns:
- **Presentation** → `app/` (Next.js pages & API)
- **Business Logic** → `modules/*/services/`
- **Data Access** → `modules/*/repositories/`
- **Domain Rules** → `modules/*/domain/`
- **Shared Utils** → `lib/`, `config/`

Struktur ini mendukung skalabilitas, maintainability, dan testing yang baik untuk aplikasi enterprise-level.

