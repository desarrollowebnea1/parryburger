import type { DeliveryType, OrderStatus } from "@prisma/client";

export type PublicPaymentMethod = {
  id: string;
  label: string;
  active: boolean;
};

export type PublicOpeningHour = {
  id: string;
  label: string;
  days: string;
  hours: string;
};

export type PublicSettings = {
  businessName: string;
  slogan: string | null;
  whatsappNumber: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  address: string | null;
  mapsUrl: string | null;
  mapsEmbedUrl: string | null;
  deliveryCost: number;
  heroTag: string | null;
  heroTitleLine1: string | null;
  heroTitleLine2: string | null;
  heroTitleLine3: string | null;
  heroDescription: string | null;
  heroImageUrl: string | null;
  heroImagePosition: string;
  footerText: string | null;
  openingHours: PublicOpeningHour[];
  paymentMethods: PublicPaymentMethod[];
};

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  imagePosition: string;
  featured: boolean;
  sortOrder: number;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  products: PublicProduct[];
};

export type PublicPromo = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  imagePosition: string;
  featured: boolean;
  sortOrder: number;
  products: PublicProduct[];
};

export type PublicOrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  productId: string | null;
  promoId: string | null;
};

export type PublicOrder = {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  address: string | null;
  zone: string | null;
  paymentMethod: string;
  notes: string | null;
  subtotal: number;
  deliveryCost: number;
  total: number;
  status: OrderStatus;
  items: PublicOrderItem[];
  createdAt: string;
};

export type OrderTimelineEntry = {
  status: OrderStatus;
  label: string;
  at: string | null;
  completed: boolean;
  current: boolean;
};

export type PublicOrderTrackingItem = {
  name: string;
  quantity: number;
  subtotal: number;
  productId: string | null;
  promoId: string | null;
};

export type PublicOrderTracking = {
  orderCode: string;
  status: OrderStatus;
  deliveryType: DeliveryType;
  paymentMethod: string;
  address: string | null;
  zone: string | null;
  notes: string | null;
  subtotal: number;
  deliveryCost: number;
  total: number;
  items: PublicOrderTrackingItem[];
  businessName: string;
  whatsappNumber: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEntry[];
};

export type CreateOrderResponse = {
  orderCode: string;
  whatsappUrl: string;
  order: PublicOrder;
};
