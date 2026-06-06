// Carrito simbólico compartido entre /tienda y /carrito (demo, localStorage).
// Mapa slug → cantidad. Sin pagos reales.

export type CartMap = Record<string, number>;

const KEY = "rufias-cart";

export function readCart(): CartMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as CartMap;
  } catch {
    return {};
  }
}

export function writeCart(cart: CartMap): void {
  window.localStorage.setItem(KEY, JSON.stringify(cart));
}

export function cartCount(cart: CartMap): number {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}
