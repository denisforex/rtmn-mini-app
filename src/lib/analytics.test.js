import { beforeEach, describe, expect, it } from "vitest";
import { readAnalyticsEvents, trackEvent } from "./analytics";

describe("local analytics", () => {
  beforeEach(() => localStorage.clear());

  it("records a bounded local event payload", () => {
    trackEvent("cart_item_added", { productId: 1, size: "S" });
    expect(readAnalyticsEvents()).toEqual([expect.objectContaining({ name: "cart_item_added", properties: { productId: 1, size: "S" } })]);
  });
});
