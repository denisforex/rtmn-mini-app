import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Capture the real entrypoint's App without changing production startup code.
const entry = vi.hoisted(() => ({ element: null }));
vi.mock("react-dom/client", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createRoot: (container, options) => container === null
      ? { render: (element) => { entry.element = element; } }
      : actual.createRoot(container, options),
  };
});
await import("./main.jsx");

function mount() {
  return render(entry.element);
}

function card(name) {
  const catalog = document.querySelector("#catalog") ?? document;
  return within(catalog).getByRole("heading", { name, level: 3 }).closest("article");
}

async function addTee(user, size = "S") {
  await user.click(within(card("Oversized Tee")).getByRole("button", { name: "View product" }));
  await user.click(screen.getByRole("button", { name: size, exact: true }));
  await user.click(screen.getByRole("button", { name: "Add to bag" }));
}

describe("RTMN baseline", () => {
  it("renders six products and filters by category", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    expect(container.querySelectorAll("article")).toHaveLength(6);
    await user.click(within(container.querySelector(".category-tabs")).getByRole("button", { name: "Hoodies" }));
    expect(container.querySelectorAll("article")).toHaveLength(1);
    expect(card("Heavyweight Hoodie")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All", exact: true }));
    expect(container.querySelectorAll("article")).toHaveLength(6);
  });

  it("opens a real New drop scope instead of routing to the full catalog", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await user.click(within(container.querySelector(".desktop-nav")).getByRole("button", { name: "New drop" }));
    expect(container.querySelectorAll("article")).toHaveLength(2);
    expect(card("Oversized Tee")).toBeInTheDocument();
    expect(card("Zip Overshirt")).toBeInTheDocument();
  });

  it("searches the catalog and displays an empty result", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await user.click(document.querySelector(".header-actions button[aria-label='Search']"));
    const search = screen.getByPlaceholderText("Search RTMN");
    await user.type(search, "hoodie");
    expect(within(container.querySelector(".search-results")).getAllByRole("button")).toHaveLength(1);
    expect(within(container.querySelector(".search-results")).getByText("Heavyweight Hoodie")).toBeInTheDocument();
    await user.clear(search);
    await user.type(search, "nonexistent-piece");
    expect(within(container.querySelector(".search-results")).getByText("No pieces found")).toBeInTheDocument();
  });

  it("sorts prices in both directions", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await user.selectOptions(screen.getByRole("combobox"), "priceLow");
    expect(container.querySelector("article h3")).toHaveTextContent("Essential Tee");
    await user.selectOptions(screen.getByRole("combobox"), "priceHigh");
    expect(container.querySelector("article h3")).toHaveTextContent("Zip Overshirt");
  });

  it("applies and resets size and color filters from the drawer", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await user.click(screen.getByRole("button", { name: "Refine", exact: true }));
    const drawer = screen.getByRole("dialog", { name: "Refine" });
    await user.click(within(drawer).getByRole("button", { name: "S", exact: true }));
    await user.click(within(drawer).getByRole("button", { name: "Stone" }));
    await user.click(within(drawer).getByRole("button", { name: "Apply filters", exact: true }));
    expect(container.querySelectorAll("article")).toHaveLength(1);
    expect(card("Utility Cargo")).toBeInTheDocument();
    expect(screen.getByText("2", { selector: ".filter-count" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Refine/ }));
    await user.click(screen.getByRole("button", { name: "Reset", exact: true }));
    await user.click(screen.getByRole("button", { name: "Apply filters", exact: true }));
    expect(container.querySelectorAll("article")).toHaveLength(6);
  });

  it.each([["DE", "de", "New Drop"], ["UA", "uk", "Новий дроп"], ["EN", "en", "New drop"]])(
    "persists locale %s across remounts", async (button, locale, title) => {
      const user = userEvent.setup();
      const first = mount();
      await user.click(screen.getByRole("button", { name: button, exact: true }));
      expect(document.documentElement.lang).toBe(locale);
      expect(localStorage.getItem("rtmn-lang")).toBe(locale);
      first.unmount();
      mount();
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    },
  );

  it("requires a size and closes product details with Escape", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await user.click(within(card("Oversized Tee")).getByRole("button", { name: "View product" }));
    expect(screen.getByRole("button", { name: "Select size" })).toBeDisabled();
    await user.keyboard("{Escape}");
    expect(container.querySelector(".product-modal")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("updates document metadata while a product is open", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(within(card("Oversized Tee")).getByRole("button", { name: "View product" }));
    expect(document.title).toBe("RTMN — Oversized Tee");
    expect(document.querySelector("meta[name='description']")).toHaveAttribute("content", expect.stringContaining("structured oversized tee"));
  });

  it("returns keyboard focus to the dialog trigger after closing search", async () => {
    const user = userEvent.setup();
    mount();
    const trigger = document.querySelector(".header-actions button[aria-label='Search']");
    trigger.focus();
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("keeps wishlist, bag and account one tap away in the mobile navigation", () => {
    mount();
    const mobileNav = screen.getByRole("navigation", { name: "Menu" });
    expect(within(mobileNav).getByRole("button", { name: "Wishlist" })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("button", { name: "Bag" })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("button", { name: "Account" })).toBeInTheDocument();
  });

  it("persists cart variants, updates totals, and removes a line", async () => {
    const user = userEvent.setup();
    const first = mount();
    await addTee(user);
    expect(screen.getByRole("heading", { name: "Your bag" })).toBeInTheDocument();
    expect(screen.getByText("€54.89")).toBeInTheDocument();
    const quantity = first.container.querySelector(".qty-control");
    await user.click(within(quantity).getAllByRole("button")[1]);
    expect(screen.getByText("€104.79")).toBeInTheDocument();
    await user.click(within(quantity).getAllByRole("button")[1]);
    expect(screen.getByText("You unlocked free shipping")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("rtmn-cart"))[0]).toMatchObject({ id: 1, size: "S", qty: 3 });
    first.unmount();
    mount();
    await user.click(screen.getByRole("button", { name: "Bag", exact: true }));
    expect(screen.getByText("Oversized Tee")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.getByText("Your bag is waiting.")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("rtmn-cart"))).toEqual([]);
  });

  it("keeps different sizes as separate cart lines", async () => {
    const user = userEvent.setup();
    mount();
    await addTee(user, "S");
    await user.click(screen.getByRole("button", { name: /Continue shopping/ }));
    await addTee(user, "M");
    expect(JSON.parse(localStorage.getItem("rtmn-cart"))).toEqual([
      expect.objectContaining({ size: "S", qty: 1 }),
      expect.objectContaining({ size: "M", qty: 1 }),
    ]);
  });

  it("never exceeds a product's shared inventory across sizes", async () => {
    localStorage.setItem("rtmn-inventory", JSON.stringify({ 1: { quantity: 1 } }));
    const user = userEvent.setup();
    mount();
    await addTee(user, "S");
    await user.click(screen.getByRole("button", { name: /Continue shopping/ }));
    await user.click(within(card("Oversized Tee")).getByRole("button", { name: "View product" }));
    await user.click(screen.getByRole("button", { name: "M", exact: true }));
    expect(screen.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(JSON.parse(localStorage.getItem("rtmn-cart"))).toEqual([
      expect.objectContaining({ id: 1, size: "S", qty: 1 }),
    ]);
  });

  it("persists wishlist selections", async () => {
    const user = userEvent.setup();
    const first = mount();
    await user.click(card("Oversized Tee").querySelector(".heart-button"));
    expect(JSON.parse(localStorage.getItem("rtmn-wishlist"))).toEqual([1]);
    first.unmount();
    mount();
    expect(card("Oversized Tee").querySelector(".heart-button")).toHaveClass("liked");
  });

  it("opens the wishlist screen and removes a saved product", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await user.click(card("Oversized Tee").querySelector(".heart-button"));
    await user.click(container.querySelector(".wishlist-action"));
    expect(screen.getByRole("heading", { name: "Your wishlist" })).toBeInTheDocument();
    expect(container.querySelectorAll("article")).toHaveLength(1);
    await user.click(card("Oversized Tee").querySelector(".heart-button"));
    expect(screen.getByText("Your saved pieces will appear here.")).toBeInTheDocument();
  });

  it("saves a local profile and updates inventory from the admin dashboard", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(document.querySelector(".header-actions button[aria-label='Account']"));
    await user.type(screen.getByLabelText("Name"), "RTMN Tester");
    await user.type(screen.getByLabelText("Email"), "tester@example.com");
    await user.click(screen.getByRole("button", { name: "Save", exact: true }));
    expect(JSON.parse(localStorage.getItem("rtmn-profile"))).toMatchObject({ name: "RTMN Tester", email: "tester@example.com", language: "en", notifications: false });
    await user.click(screen.getByRole("button", { name: "Admin", exact: true }));
    expect(screen.getByRole("heading", { name: "Inventory dashboard" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Decrease Oversized Tee" }));
    expect(JSON.parse(localStorage.getItem("rtmn-inventory"))[1]).toEqual({ quantity: 17 });
  });

  it("blocks incomplete checkout and preserves the cart when returning", async () => {
    const user = userEvent.setup();
    mount();
    await addTee(user);
    await user.click(screen.getByRole("button", { name: "Checkout", exact: true }));
    await user.click(screen.getAllByRole("button", { name: "Checkout", exact: true }).at(-1));
    expect(screen.getAllByRole("alert")).not.toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "Back", exact: true }));
    expect(screen.getByRole("heading", { name: "Your bag" })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("rtmn-cart"))).toHaveLength(1);
  });

  it("saves a completed order request locally without pretending it is paid", async () => {
    const user = userEvent.setup();
    mount();
    await addTee(user);
    await user.click(screen.getByRole("button", { name: "Checkout", exact: true }));
    const fields = [["First name", "Test"], ["Last name", "Buyer"], ["Address", "Sample Street 1"], ["Postal code", "10115"], ["City", "Berlin"], ["Phone", "+491234567"], ["Email", "test@example.com"]];
    for (const [label, value] of fields) await user.type(screen.getByLabelText(label), value);
    await user.click(screen.getAllByRole("button", { name: "Checkout", exact: true }).at(-1));
    expect(screen.getByRole("heading", { name: "Checkout preview saved" })).toBeInTheDocument();
    expect(screen.getByText(/No payment or order was created/i)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("rtmn-order-drafts"))[0]).toMatchObject({ status: "local_preview", total: 54.89 });
    expect(JSON.parse(localStorage.getItem("rtmn-cart"))).toHaveLength(1);
  });

  it("initializes Telegram and triggers feedback when adding a product", async () => {
    const webApp = { ready: vi.fn(), expand: vi.fn(), setHeaderColor: vi.fn(), setBackgroundColor: vi.fn(), HapticFeedback: { impactOccurred: vi.fn() } };
    vi.stubGlobal("Telegram", { WebApp: webApp });
    const user = userEvent.setup();
    mount();
    expect(webApp.ready).toHaveBeenCalledOnce();
    expect(webApp.expand).toHaveBeenCalledOnce();
    await addTee(user);
    expect(webApp.HapticFeedback.impactOccurred).toHaveBeenCalledWith("light");
  });
});
