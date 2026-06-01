export function getIncludedProductNames(
  products: { name: string }[] | undefined,
): string[] {
  if (!products?.length) return [];
  return products.map((product) => product.name).filter(Boolean);
}

export function formatIncludesLine(names: string[]): string | null {
  if (!names.length) return null;
  return `Incluye: ${names.join(", ")}`;
}
