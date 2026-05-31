# Checklist E2E — Parry Burger Express

Usá esta lista para validar el sistema completo antes de entregar o publicar en producción.

**Requisitos previos:** `.env` configurado, `npm run db:deploy` (o `db:migrate`), `npm run db:seed`, `npm run dev`.

---

## A. Admin — autenticación

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| A1 | Ir a `/admin/login` | Pantalla oscura con formulario | |
| A2 | Login con `admin@parryburger.com` / `admin123456` | Redirige a `/admin` dashboard | |
| A3 | Cerrar sesión (botón Salir) | Vuelve a login, rutas admin bloqueadas | |
| A4 | Intentar `/admin/productos` sin sesión | Redirect a login | |

---

## B. Admin — categorías

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| B1 | `/admin/categorias` → Nueva categoría | Formulario carga | |
| B2 | Crear categoría (ej. "Postres", orden 4) | Aparece en listado | |
| B3 | Editar categoría | Cambios guardados | |
| B4 | Activar/desactivar toggle | Estado cambia en listado | |
| B5 | Eliminar categoría **con productos** | Error claro, no elimina | |
| B6 | Eliminar categoría **sin productos** | Se elimina | |

---

## C. Admin — productos

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| C1 | `/admin/productos/nuevo` | Formulario con categorías del DB | |
| C2 | Crear producto (nombre, precio, categoría) | Aparece en listado | |
| C3 | Subir imagen (requiere `BLOB_READ_WRITE_TOKEN`) | Preview + URL guardada al crear | |
| C4 | Editar producto (precio, descripción) | Cambios persisten | |
| C5 | Desactivar producto | No aparece en web pública (`/api/public/menu`) | |
| C6 | Reactivar producto | Vuelve a aparecer en menú público | |
| C7 | Eliminar producto | Desaparece del listado admin | |

---

## D. Admin — promociones

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| D1 | `/admin/promociones/nueva` | Formulario con productos opcionales | |
| D2 | Crear promo con imagen | Aparece en listado y web pública | |
| D3 | Editar promo (precio, productos incluidos) | Cambios guardados | |
| D4 | Desactivar promo | No aparece en `/api/public/promos` | |
| D5 | Eliminar promo | Desaparece del listado | |

---

## E. Admin — configuración

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| E1 | `/admin/configuracion` | Carga datos actuales del negocio | |
| E2 | Cambiar WhatsApp (solo dígitos, ej. `543799999999`) | Guarda sin error | |
| E3 | Cambiar textos hero (3 líneas + descripción) | Se ven en home al recargar `/` | |
| E4 | Subir imagen hero | Hero actualizado en home | |
| E5 | Cambiar costo de envío | Carrito recalcula delivery | |
| E6 | Editar horarios y footer | Se ven en sección contacto/horarios | |
| E7 | Toggle método de pago inactivo | Desaparece del selector en carrito | |

---

## F. Web pública — carrito y pedido

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| F1 | Abrir `/` | Menú, promos y hero desde DB (no localStorage) | |
| F2 | Agregar producto al carrito (+) | Badge actualiza, toast "Agregado" | |
| F3 | Agregar promo al carrito | Item en carrito sidebar/drawer | |
| F4 | Recargar página | Carrito persiste (`parry_cart_v1` en localStorage) | |
| F5 | Completar formulario (nombre, tel, pago) | Validación si falta campo | |
| F6 | Delivery sin dirección | Error de validación | |
| F7 | ENVIAR PEDIDO | POST `/api/public/orders` → 201 | |
| F8 | Tras enviar | Abre WhatsApp (`wa.me`) con mensaje formateado | |
| F9 | Tras enviar | Muestra `orderCode` en seguimiento (sidebar) | |
| F10 | Tras enviar | Carrito se vacía | |

---

## G. Admin — pedidos

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| G1 | `/admin/pedidos` | Pedido recién creado visible | |
| G2 | Filtrar por estado "NUEVO" | Solo pedidos nuevos | |
| G3 | Abrir detalle del pedido | Items, total, pago, dirección, notas | |
| G4 | Botón WhatsApp cliente | Abre chat con teléfono/mensaje | |
| G5 | Cambiar estado → PREPARANDO | Badge actualizado | |
| G6 | Cambiar estado → EN_CAMINO → ENTREGADO | Flujo completo | |

---

## H. Seguimiento público

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| H1 | GET `/api/public/orders/{orderCode}` | JSON con status + timeline | |
| H2 | Sidebar "Seguí tu pedido" tras compra | Timeline refleja estado actual | |
| H3 | Cambiar estado en admin | Timeline se actualiza al refrescar (poll 30s) | |

---

## I. Producción / build

| # | Paso | Resultado esperado | ✓ |
|---|------|-------------------|---|
| I1 | `npm run build` | Exit code 0 | |
| I2 | `npm run start` + probar `/` y `/admin` | App funciona en modo producción | |
| I3 | Variables en Vercel configuradas | Ver README sección Deploy | |
| I4 | `npm run db:deploy` en producción | Tablas creadas/actualizadas | |
| I5 | Seed una sola vez en prod | Datos iniciales + cambiar password admin | |

---

## Variables de entorno requeridas

| Variable | Obligatoria | Uso |
|----------|-------------|-----|
| `DATABASE_URL` | Sí | Prisma / Neon (pooler) |
| `DIRECT_URL` | Sí | Migraciones Prisma |
| `AUTH_SECRET` | Sí | Sesión admin (JWT cookie) |
| `BLOB_READ_WRITE_TOKEN` | Sí* | Subida de imágenes admin |
| `NEXT_PUBLIC_APP_URL` | Recomendada | URL canónica (prod: `https://tudominio.com`) |

\* Sin Blob, el resto funciona; upload devuelve error 503.

---

## Credenciales iniciales (seed)

- **Email:** `admin@parryburger.com`
- **Password:** `admin123456`

Cambiar antes de publicar: `npm run admin:hash-password -- admin@parryburger.com TuNuevaPassword`

---

## Gaps conocidos (no bloquean MVP)

- No hay pantalla UI para cambiar contraseña (usar script CLI arriba).
- Seguimiento público por URL `/pedido/[code]` no implementado como página (solo API + sidebar).

---

*Última actualización: Fase 8*
