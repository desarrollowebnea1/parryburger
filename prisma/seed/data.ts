/**
 * Datos iniciales extraídos de legacy/index.html
 * (DEFAULTS, DEFAULTS_MENU, DEFAULTS_PROMOS, IMG y hero estático).
 */

export const SEED_IMAGES = {
  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  mila: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  pizza:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  pepsi:
    "https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?w=400&q=80",
  lomito:
    "https://images.unsplash.com/photo-1621510456681-2330135e5871?w=400&q=80",
  promo:
    "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&q=80",
  hero:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=720&q=85",
} as const;

export const SEED_ADMIN = {
  email: "admin@parryburger.com",
  password: "admin123456",
  name: "Administrador",
} as const;

export const SEED_CATEGORIES = [
  { name: "Hamburguesas", slug: "hamburguesas", sortOrder: 0 },
  { name: "Milanesas", slug: "milanesas", sortOrder: 1 },
  { name: "Pizzas", slug: "pizzas", sortOrder: 2 },
  { name: "Bebidas", slug: "bebidas", sortOrder: 3 },
] as const;

export const SEED_PRODUCTS = [
  {
    legacyId: "m1",
    name: "Parry Burger",
    slug: "parry-burger",
    description: "Carne, cheddar, lechuga, tomate y salsa parry.",
    price: 7200,
    categorySlug: "hamburguesas",
    imageUrl: SEED_IMAGES.burger,
    sortOrder: 0,
    featured: true,
  },
  {
    legacyId: "m2",
    name: "Milanesa Napolitana",
    slug: "milanesa-napolitana",
    description: "Milanesa, jamón, muzarella, rodajas de tomate y orégano.",
    price: 9800,
    categorySlug: "milanesas",
    imageUrl: SEED_IMAGES.mila,
    sortOrder: 0,
    featured: true,
  },
  {
    legacyId: "m3",
    name: "Sandwich Lomito",
    slug: "sandwich-lomito",
    description: "Lomito completo, jamón, queso, huevo y vegetales.",
    price: 8900,
    categorySlug: "hamburguesas",
    imageUrl: SEED_IMAGES.lomito,
    sortOrder: 1,
    featured: false,
  },
  {
    legacyId: "m4",
    name: "Pizza Muzzarella",
    slug: "pizza-muzzarella",
    description: "Muzzarella, tomate, aceitunas y orégano.",
    price: 10500,
    categorySlug: "pizzas",
    imageUrl: SEED_IMAGES.pizza,
    sortOrder: 0,
    featured: true,
  },
  {
    legacyId: "m5",
    name: "Pepsi 350ml",
    slug: "pepsi-350ml",
    description: "Gaseosa Pepsi lata 350ml.",
    price: 2000,
    categorySlug: "bebidas",
    imageUrl: SEED_IMAGES.pepsi,
    sortOrder: 0,
    featured: false,
  },
] as const;

export const SEED_PROMOS = [
  {
    legacyId: "p1",
    title: "PROMO DEL DÍA",
    slug: "promo-del-dia",
    description: "Hamburguesa completa + papas + gaseosa",
    price: 8500,
    imageUrl: SEED_IMAGES.promo,
    sortOrder: 0,
    productLegacyIds: ["m1"],
  },
  {
    legacyId: "p2",
    title: "MILANESA XL",
    slug: "milanesa-xl",
    description: "Milanesa napolitana XL + papas + gaseosa",
    price: 12900,
    imageUrl: SEED_IMAGES.mila,
    sortOrder: 1,
    productLegacyIds: ["m2"],
  },
  {
    legacyId: "p3",
    title: "PIZZAS",
    slug: "promo-pizzas",
    description: "Muzzarella 8 porciones",
    price: 10500,
    imageUrl: SEED_IMAGES.pizza,
    sortOrder: 2,
    productLegacyIds: ["m4"],
  },
] as const;

export const SEED_SETTINGS = {
  businessName: "Parry Burger Express",
  slogan: "Sabores que te encantan. Pedí por WhatsApp.",
  whatsappNumber: "543511234567",
  instagramUrl: "https://instagram.com/parrybur.ex",
  facebookUrl: "https://facebook.com/ParryBurgerExpress",
  address: "Av 3 de Abril y Chaco, Corrientes",
  mapsUrl:
    "https://maps.google.com/maps?q=Av+3+de+Abril+y+Chaco,+Corrientes,+Argentina",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Av+3+de+Abril+y+Chaco,+Corrientes,+Argentina&output=embed",
  deliveryCost: 1500,
  heroTag: "🔥 Corrientes Capital · Delivery y Retiro",
  heroTitleLine1: "SABORES",
  heroTitleLine2: "QUE TE",
  heroTitleLine3: "ENCANTAN",
  heroDescription:
    "Las mejores burgers, milanesas y pizzas hechas con ingredientes de primera calidad.",
  heroImageUrl: SEED_IMAGES.hero,
  footerText: "© 2026 Parry Burger Express. Todos los derechos reservados.",
  openingHoursJson: [
    {
      id: "h1",
      label: "MEDIODÍA",
      days: "Lunes a Sábado",
      hours: "11:39 a 14:00 hs",
    },
    {
      id: "h2",
      label: "NOCHE",
      days: "Lunes a Lunes",
      hours: "A partir de las 20:00 hs",
    },
  ],
  paymentMethodsJson: [
    { id: "efectivo", label: "Efectivo", active: true },
    { id: "transferencia", label: "Transferencia", active: true },
    { id: "mercado-pago", label: "Mercado Pago", active: true },
  ],
} as const;
