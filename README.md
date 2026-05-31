# Parry Burger Express

Sistema web completo para **Parry Burger Express** (Corrientes): sitio público con menú, carrito, pedidos por WhatsApp y panel admin para gestionar productos, promos, pedidos y configuración — sin tocar código.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Route Handlers (App Router) |
| Base de datos | PostgreSQL (Neon) + Prisma ORM |
| Imágenes | Vercel Blob |
| Auth admin | JWT en cookie httpOnly |
| Deploy | Vercel |

---

## Requisitos

- Node.js 18+
- Cuenta [Neon](https://neon.tech) (PostgreSQL gratis)
- Cuenta [Vercel](https://vercel.com) (deploy)
- Cuenta Vercel Blob (para subir fotos en admin)

---

## Instalación local

### 1. Clonar e instalar

```bash
git clone <tu-repo>
cd parryburger
npm install
```

`postinstall` ejecuta `prisma generate` automáticamente.

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Completá `.env`:

```env
DATABASE_URL=postgresql://...@...neon.tech/parry?sslmode=require
DIRECT_URL=postgresql://...@...neon.tech/parry?sslmode=require
AUTH_SECRET=<generar con: openssl rand -base64 32>
BLOB_READ_WRITE_TOKEN=<desde Vercel Blob dashboard>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string Neon (pooler, con `?sslmode=require`) |
| `DIRECT_URL` | Misma DB sin pooler (requerido por Prisma para migraciones) |
| `AUTH_SECRET` | Secreto para firmar sesiones admin (mín. 32 caracteres) |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob para subir imágenes |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app (`http://localhost:3000` en dev) |

### 3. Base de datos

**Primera vez (desarrollo):**

```bash
npm run db:migrate    # aplica migraciones (crea tablas)
npm run db:seed       # carga admin, menú, promos, configuración
```

Alternativa rápida sin historial de migraciones:

```bash
npm run db:push
npm run db:seed
```

### 4. Levantar servidor

```bash
npm run dev
```

- Sitio público: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 5. Build de producción (local)

```bash
npm run build
npm run start
```

---

## Credenciales admin iniciales

Creadas por el seed (`npm run db:seed`):

| Campo | Valor |
|-------|-------|
| Email | `admin@parryburger.com` |
| Password | `admin123456` |

**Cambiá la contraseña antes de publicar en producción.**

### Cambiar contraseña admin

No hay pantalla UI todavía. Usá el script incluido:

```bash
npm run admin:hash-password -- admin@parryburger.com TuNuevaPasswordSegura
```

Requiere `DATABASE_URL` en `.env`.

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera Prisma Client + build Next.js |
| `npm run start` | Servidor producción (después de build) |
| `npm run lint` | ESLint |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | Migraciones en desarrollo (`migrate dev`) |
| `npm run db:deploy` | Migraciones en producción (`migrate deploy`) |
| `npm run db:push` | Sincronizar schema sin migración (solo dev) |
| `npm run db:seed` | Datos iniciales (admin, menú, promos, config) |
| `npm run db:studio` | Prisma Studio (explorar DB visualmente) |
| `npm run admin:hash-password` | Cambiar password del admin |

---

## Deploy en Vercel

### 1. Subir a GitHub

```bash
git add .
git commit -m "Parry Burger Express — release"
git push origin main
```

### 2. Importar en Vercel

1. [vercel.com/new](https://vercel.com/new) → Importar repo
2. Framework: **Next.js** (detectado automáticamente)
3. Build Command (recomendado para producción con DB):

```bash
prisma generate && prisma migrate deploy && next build
```

O dejá el default `npm run build` y ejecutá `npm run db:deploy` manualmente una vez post-deploy.

### 3. Variables de entorno en Vercel

En **Project → Settings → Environment Variables**, agregá:

| Variable | Production |
|----------|------------|
| `DATABASE_URL` | Connection string Neon (pooler) |
| `DIRECT_URL` | Connection string Neon (direct) |
| `AUTH_SECRET` | Generar nuevo (no reutilizar dev) |
| `BLOB_READ_WRITE_TOKEN` | Crear Blob Store en Vercel → token |
| `NEXT_PUBLIC_APP_URL` | `https://tu-dominio.vercel.app` |

**Integraciones recomendadas en Vercel:**

- Neon Postgres (auto-configura `DATABASE_URL`)
- Vercel Blob (auto-configura `BLOB_READ_WRITE_TOKEN`)

### 4. Primera vez en producción

Después del primer deploy exitoso:

```bash
# Desde tu máquina con DATABASE_URL de producción en .env
npm run db:deploy
npm run db:seed
npm run admin:hash-password -- admin@parryburger.com PasswordProduccionSegura
```

El seed es idempotente (`upsert`) — seguro ejecutarlo una vez.

### 5. Dominio custom (opcional)

Vercel → Domains → agregar dominio → actualizar `NEXT_PUBLIC_APP_URL`.

---

## Cómo administrar el negocio

### Productos

1. Admin → **Productos** → **+ Nuevo producto**
2. Completar nombre, precio, categoría
3. **Subir imagen** (JPG/PNG/WEBP, máx. 5 MB)
4. Activar/desactivar desde el listado
5. Los cambios se ven al instante en el sitio público

### Categorías

Admin → **Categorías** → crear/editar/ordenar. No se pueden eliminar si tienen productos.

### Promociones

Admin → **Promociones** → crear con imagen, precio y productos incluidos (opcional).

### Pedidos

Admin → **Pedidos** → filtrar por estado → abrir detalle → cambiar estado (NUEVO → PREPARANDO → EN_CAMINO → ENTREGADO).

### Configuración

Admin → **Configuración**:

- WhatsApp, redes, dirección, mapas
- Textos e imagen del hero
- Costo de envío
- Horarios, footer, métodos de pago

---

## Flujo del cliente (público)

1. Navega menú y promos (datos desde DB)
2. Agrega al carrito (persiste en `localStorage`)
3. Completa formulario de pedido
4. Sistema guarda pedido en DB + genera código `PB-YYYYMMDD-XXXX`
5. Abre WhatsApp con mensaje pre-armado
6. Seguimiento visual en sidebar (actualiza cada 30s)

---

## Checklist de prueba E2E

Ver [docs/E2E-CHECKLIST.md](docs/E2E-CHECKLIST.md) para validación completa punta a punta.

---

## Referencia visual legacy

`index.html` y `legacy/index.html` conservan el diseño original como referencia. **No borrar.**

---

## Estructura del proyecto

```
parryburger/
├── legacy/index.html      # Referencia visual
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/               # Rutas Next.js (público + admin + API)
│   ├── components/
│   ├── lib/
│   └── hooks/
├── docs/E2E-CHECKLIST.md
└── scripts/hash-password.ts
```

---

## Soporte / troubleshooting

| Problema | Solución |
|----------|----------|
| "Configuración no encontrada" en home | Ejecutar `npm run db:seed` |
| Login admin falla | Verificar seed + `AUTH_SECRET` |
| Upload imagen error 503 | Configurar `BLOB_READ_WRITE_TOKEN` |
| Build falla Prisma | Verificar `DATABASE_URL` en CI (solo si build incluye migrate) |
| Carrito vacío tras pedido | Comportamiento esperado (se limpia al confirmar) |

---

© Parry Burger Express — Corrientes, Argentina
