import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeTelegram } from "./telegram";

afterEach(() => {
  delete window.Telegram;
});

describe("Telegram Mini App theme bridge", () => {
  it("uses the active local theme for Telegram shell colors", () => {
    const ready = vi.fn();
    const expand = vi.fn();
    const setHeaderColor = vi.fn();
    const setBackgroundColor = vi.fn();
    window.Telegram = { WebApp: { ready, expand, setHeaderColor, setBackgroundColor } };

    expect(initializeTelegram("light")).toBe(true);
    expect(setHeaderColor).toHaveBeenLastCalledWith("#f5f2ec");
    expect(setBackgroundColor).toHaveBeenLastCalledWith("#f5f2ec");

    initializeTelegram("dark");
    expect(setHeaderColor).toHaveBeenLastCalledWith("#0b0b0c");
    expect(setBackgroundColor).toHaveBeenLastCalledWith("#0b0b0c");
    expect(ready).toHaveBeenCalled();
    expect(expand).toHaveBeenCalled();
  });
});
