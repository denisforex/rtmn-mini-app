import React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RTMNJourney, RTMNOtherSide } from "./RTMNWorld";

function motionEnvironment(reduced = false) {
  const media = { matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  const frames = [];
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  vi.stubGlobal("requestAnimationFrame", vi.fn((callback) => { frames.push(callback); return frames.length; }));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  return { media, frames };
}

afterEach(() => vi.unstubAllGlobals());

describe("RTMN continuous world", () => {
  it("renders one inert environment around all storefront content", () => {
    motionEnvironment();
    const { container } = render(<RTMNJourney><section>Objects remain inside the field.</section></RTMNJourney>);
    expect(container.querySelectorAll(".world-continuum")).toHaveLength(1);
    expect(container.querySelector(".world-continuum")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Objects remain inside the field.")).toBeVisible();
  });

  it("maps page scroll to one journey variable instead of per-section animation values", () => {
    const motion = motionEnvironment();
    const { container } = render(<RTMNJourney><section data-world-scene>Objects</section></RTMNJourney>);
    const journey = container.querySelector(".rtmn-journey");
    Object.defineProperty(journey, "offsetHeight", { configurable: true, value: 1800 });
    vi.spyOn(journey, "getBoundingClientRect").mockReturnValue({ top: -450 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      motion.frames.at(-1)();
    });
    expect(journey.style.getPropertyValue("--journey")).toBe((450 / (1800 - window.innerHeight)).toFixed(4));
    expect(journey.style.getPropertyValue("--camera")).not.toBe("");
    expect(container.querySelector("section").style.getPropertyValue("--drift")).toBe("");
  });

  it("stops the camera when reduced motion is requested", () => {
    const motion = motionEnvironment(true);
    const listen = vi.spyOn(window, "addEventListener");
    const { container } = render(<RTMNJourney><section>Objects</section></RTMNJourney>);
    const journey = container.querySelector(".rtmn-journey");
    expect(listen.mock.calls.filter(([event]) => event === "scroll")).toHaveLength(0);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(journey.style.getPropertyValue("--journey")).toBe("0");
    expect(journey.style.getPropertyValue("--camera")).toBe("0px");
    expect(motion.media.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("keeps the Other Side CTA in its English brand language", async () => {
    const user = userEvent.setup();
    const explore = vi.fn();
    render(<RTMNOtherSide lang="uk" onExplore={explore} />);
    expect(screen.getByRole("heading", { name: "THE OTHER SIDE OF RTMN" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "View current objects" }));
    expect(explore).toHaveBeenCalledOnce();
  });
});
