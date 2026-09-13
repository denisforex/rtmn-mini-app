/**
 * Future backend contract. No network request is made until VITE_API_BASE_URL
 * is configured and a server is implemented.
 */
export const apiContract = {
  catalog: "GET /api/products",
  product: "GET /api/products/:slug",
  orderRequests: "POST /api/order-requests",
  inventory: "PATCH /api/admin/inventory/:productId",
  profile: "GET|PUT /api/me",
};

export function isApiConfigured() {
  return Boolean(import.meta.env.VITE_API_BASE_URL);
}
