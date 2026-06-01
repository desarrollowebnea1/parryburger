export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Categorías", href: "/admin/categorias" },
  { label: "Promociones", href: "/admin/promociones" },
  { label: "Pedidos", href: "/admin/pedidos" },
  { label: "Configuración", href: "/admin/configuracion" },
] as const;

export function isAdminNavActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}
