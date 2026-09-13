export const emptyFilters = () => ({ sizes: [], colors: [], price: "all", availability: "all" });

const priceMatches = (price, range) => {
  if (range === "under50") return price < 50;
  if (range === "50to100") return price >= 50 && price <= 100;
  if (range === "over100") return price > 100;
  return true;
};

export function filterProducts(products, { category = "All", query = "", filters = emptyFilters(), sort = "newest" }) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const list = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesQuery = !normalizedQuery || [product.name, product.category, product.color, product.fit, product.material]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery);
    const matchesSize = filters.sizes.length === 0 || product.sizes.some((size) => filters.sizes.includes(size));
    const matchesColor = filters.colors.length === 0 || filters.colors.includes(product.tone);
    const matchesPrice = priceMatches(product.price, filters.price);
    const matchesAvailability = filters.availability !== "inStock" || product.inStock;
    return matchesCategory && matchesQuery && matchesSize && matchesColor && matchesPrice && matchesAvailability;
  });
  if (sort === "priceLow") return [...list].sort((left, right) => left.price - right.price);
  if (sort === "priceHigh") return [...list].sort((left, right) => right.price - left.price);
  return list;
}

export function searchProducts(products, query) {
  return filterProducts(products, { query, filters: emptyFilters() });
}

export function activeFilterCount(filters) {
  return filters.sizes.length + filters.colors.length + (filters.price !== "all" ? 1 : 0) + (filters.availability !== "all" ? 1 : 0);
}
