const safeParse = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};

const safeWrite = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage is optional in this local MVP. */ }
};

export function readStoredArray(key) {
  const value = safeParse(key);
  return Array.isArray(value) ? value : [];
}

export function writeStoredArray(key, value) {
  safeWrite(key, Array.isArray(value) ? value : []);
}

export function defaultInventory(products) {
  return Object.fromEntries(products.map((product, index) => [product.id, { quantity: Math.max(0, 18 - index * 2) }]));
}

export function readInventory(products) {
  const fallback = defaultInventory(products);
  const value = safeParse("rtmn-inventory");
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  return Object.fromEntries(products.map((product) => {
    const quantity = Number(value[product.id]?.quantity);
    return [product.id, { quantity: Number.isFinite(quantity) ? Math.max(0, Math.min(99, Math.floor(quantity))) : fallback[product.id].quantity }];
  }));
}

export function readWishlist(products) {
  const allowed = new Set(products.map((product) => product.id));
  return [...new Set(readStoredArray("rtmn-wishlist").filter((id) => Number.isInteger(id) && allowed.has(id)))];
}

export function normalizeCart(items, products, inventory) {
  const productById = new Map(products.map((product) => [product.id, product]));
  const seen = new Set();
  const allocated = new Map();
  const source = Array.isArray(items) ? items : [];
  return source.flatMap((item) => {
    const product = productById.get(item?.id);
    const key = typeof item?.key === "string" ? item.key : "";
    const quantity = Number(item?.qty);
    const stock = inventory[product?.id]?.quantity ?? 0;
    const remaining = stock - (allocated.get(product?.id) ?? 0);
    if (!product || !key || seen.has(key) || !product.sizes.includes(item?.size) || !Number.isFinite(quantity) || remaining < 1) return [];
    seen.add(key);
    const qty = Math.max(1, Math.min(remaining, Math.floor(quantity)));
    allocated.set(product.id, (allocated.get(product.id) ?? 0) + qty);
    return [{ key, id: product.id, name: product.name, price: product.price, size: item.size, qty, tone: product.tone }];
  });
}

export function readCart(products, inventory) {
  return normalizeCart(readStoredArray("rtmn-cart"), products, inventory);
}

export function readProfile() {
  const value = safeParse("rtmn-profile");
  const text = (input, max = 80) => typeof input === "string" ? input.trim().slice(0, max) : "";
  return { name: text(value?.name), email: text(value?.email, 160), language: ["en", "de", "uk"].includes(value?.language) ? value.language : "en", notifications: Boolean(value?.notifications) };
}

export function readLanguage() {
  const language = localStorage.getItem("rtmn-lang");
  return ["en", "de", "uk"].includes(language) ? language : "en";
}

export function readTheme() {
  try { return localStorage.getItem("rtmn-theme") === "dark" ? "dark" : "light"; } catch { return "light"; }
}

export function writeTheme(theme) {
  try { localStorage.setItem("rtmn-theme", theme === "dark" ? "dark" : "light"); } catch { /* Theme preference is optional in this local MVP. */ }
}
