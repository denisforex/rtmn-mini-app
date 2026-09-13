import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import { activeFilterCount, emptyFilters, filterProducts } from "./catalog";

describe("catalog filters", () => {
  it("combines category, size, color and price filters", () => {
    const result = filterProducts(products, {
      category: "Pants",
      filters: { sizes: ["S"], colors: ["stone"], price: "50to100", availability: "inStock" },
    });

    expect(result.map((product) => product.slug)).toEqual(["utility-cargo"]);
  });

  it("filters price bands and keeps the source order for newest", () => {
    expect(filterProducts(products, { filters: { ...emptyFilters(), price: "under50" } }).map((product) => product.id)).toEqual([1, 4]);
    expect(filterProducts(products, { filters: { ...emptyFilters(), price: "over100" } }).map((product) => product.id)).toEqual([5]);
  });

  it("sorts only after applying filters", () => {
    const result = filterProducts(products, { filters: { ...emptyFilters(), price: "50to100" }, sort: "priceHigh" });
    expect(result.map((product) => product.price)).toEqual([89.9, 79.9, 74.9]);
  });

  it("counts only non-default filters", () => {
    expect(activeFilterCount(emptyFilters())).toBe(0);
    expect(activeFilterCount({ sizes: ["M"], colors: ["black", "stone"], price: "under50", availability: "inStock" })).toBe(5);
  });
});
