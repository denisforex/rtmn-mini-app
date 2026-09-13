import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import { defaultInventory, normalizeCart, readCart, readLanguage, readProfile, readTheme, readWishlist, writeTheme } from "./storage";

describe("local storage normalization", () => {
  it("removes invalid cart lines and caps all sizes against shared product stock", () => {
    const inventory = defaultInventory(products);
    inventory[1] = { quantity: 2 };

    expect(normalizeCart([
      { key: "1-S", id: 1, size: "S", qty: 20 },
      { key: "1-M", id: 1, size: "M", qty: 2 },
      { key: "unknown", id: 999, size: "S", qty: 1 },
      { key: "invalid-size", id: 1, size: "XXL", qty: 1 },
    ], products, inventory)).toEqual([
      expect.objectContaining({ key: "1-S", id: 1, size: "S", qty: 2 }),
    ]);
  });

  it("recovers safely from corrupted or stale persisted values", () => {
    localStorage.setItem("rtmn-cart", "not-json");
    localStorage.setItem("rtmn-wishlist", JSON.stringify([1, 1, 999, "1"]));
    localStorage.setItem("rtmn-profile", JSON.stringify({ name: 42, email: "x".repeat(200), language: "fr", notifications: "yes" }));
    localStorage.setItem("rtmn-lang", "fr");

    expect(readCart(products, defaultInventory(products))).toEqual([]);
    expect(readWishlist(products)).toEqual([1]);
    expect(readProfile()).toEqual({ name: "", email: "x".repeat(160), language: "en", notifications: true });
    expect(readLanguage()).toBe("en");
  });

  it("keeps a normalized local theme preference and defaults to light", () => {
    expect(readTheme()).toBe("light");
    writeTheme("dark");
    expect(readTheme()).toBe("dark");
    writeTheme("unexpected-value");
    expect(readTheme()).toBe("light");
  });
});
