import React, { useEffect, useRef } from "react";
import { Icon } from "./Icon";
import heroWorld from "../assets/rtmn-world-hero-v2.png";
import otherSideWorld from "../assets/rtmn-world-other-side-v3.jpg";

const copy = {
  en: {
    heroStatement: "A visual system in motion.", explore: "Explore collection", heroNote: "The surface is only the beginning.",
    collectionEyebrow: "02 / COLLECTION", collectionTitle: "DROP 001", collectionBody: "A uniform for the distance between structure and instinct.", collectionCta: "View collection",
    storyTitle: "RAW TRUE\nMODERN NEW", storyCta: "Our story",
    otherTitle: "THE OTHER SIDE\nOF RTMN", otherBody: "Same world. Different direction.", otherCta: "Enter the other side",
  },
  de: {
    heroStatement: "A visual system in motion.", explore: "Explore collection", heroNote: "The surface is only the beginning.",
    collectionEyebrow: "02 / COLLECTION", collectionTitle: "DROP 001", collectionBody: "A uniform for the distance between structure and instinct.", collectionCta: "View collection",
    storyTitle: "RAW TRUE\nMODERN NEW", storyCta: "Our story",
    otherTitle: "THE OTHER SIDE\nOF RTMN", otherBody: "Same world. Different direction.", otherCta: "Enter the other side",
  },
  uk: {
    heroStatement: "A visual system in motion.", explore: "Explore collection", heroNote: "The surface is only the beginning.",
    collectionEyebrow: "02 / COLLECTION", collectionTitle: "DROP 001", collectionBody: "A uniform for the distance between structure and instinct.", collectionCta: "View collection",
    storyTitle: "RAW TRUE\nMODERN NEW", storyCta: "Our story",
    otherTitle: "THE OTHER SIDE\nOF RTMN", otherBody: "Same world. Different direction.", otherCta: "Enter the other side",
  },
};

const clamp = value => Math.min(1, Math.max(0, value));

function WorldEnvironment() {
  return (
    <div className="world-continuum" aria-hidden="true">
      <div className="world-photo world-photo-real" style={{ backgroundImage: `url(${heroWorld})` }} />
      <div className="world-photo world-photo-other" style={{ backgroundImage: `url(${otherSideWorld})` }} />
      <div className="world-vignette" />
      <div className="world-grain" />
    </div>
  );
}

export function RTMNJourney({ children }) {
  const root = useRef(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !window.matchMedia) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let listening = false;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const range = Math.max(1, element.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / range);
      const threshold = element.querySelector(".world-threshold");
      if (threshold) {
        const thresholdRect = threshold.getBoundingClientRect();
        const linePosition = thresholdRect.top + thresholdRect.height / 2;
        element.style.setProperty("--threshold-line-y", `${Math.round(linePosition)}px`);
      }
      element.style.setProperty("--journey", progress.toFixed(4));
      element.style.setProperty("--camera", `${Math.round((progress - .5) * -16)}px`);
      element.style.setProperty("--camera-y", `${Math.round((progress - .5) * 11)}px`);
      element.style.setProperty("--other-camera", `${Math.round((progress - .48) * 9)}px`);
      element.style.setProperty("--other-camera-y", `${Math.round((progress - .5) * -13)}px`);
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const stop = () => {
      if (listening) {
        window.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
        listening = false;
      }
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const configure = () => {
      stop();
      if (reduced.matches) {
        element.style.setProperty("--journey", "0");
        element.style.setProperty("--camera", "0px");
        element.style.setProperty("--camera-y", "0px");
        element.style.setProperty("--other-camera", "0px");
        element.style.setProperty("--other-camera-y", "0px");
        return;
      }
      listening = true;
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
      requestUpdate();
    };
    configure();
    reduced.addEventListener?.("change", configure);
    return () => { stop(); reduced.removeEventListener?.("change", configure); };
  }, []);
  return <main className="rtmn-journey" ref={root} id="main-content" tabIndex="-1"><WorldEnvironment /><div className="world-content">{children}</div></main>;
}

export function RTMNHero({ lang = "en", onExplore }) {
  const t = copy[lang] || copy.en;
  return <section className="world-hero" id="surface" data-world-scene="surface">
    <div className="hero-content">
      <h1>RTMN</h1>
      <p className="hero-manifest">RAW <i>/</i> TRUE <i>/</i> MODERN <i>/</i> NEW</p>
      <p className="hero-statement">{t.heroStatement}</p>
      <button className="world-button world-button-primary" onClick={onExplore}><span>{t.explore}</span><Icon name="arrow" size={15} /></button>
    </div>
    <p className="hero-note">{t.heroNote}</p>
  </section>;
}

export function RTMNCollection() {
  return <section className="world-collection world-threshold" id="collection" data-world-scene="collection" aria-label="Transition to the Other Side">
    <div className="world-threshold-seam" aria-hidden="true"><i /></div>
  </section>;
}

export function RTMNStory({ lang = "en", onOpen, children }) {
  const t = copy[lang] || copy.en;
  return <section className="world-story" id="story" data-world-scene="story">
    <div className="world-section-copy story-copy">
      <h2>{t.storyTitle.split("\n").map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h2>
      {onOpen && <button className="world-button" onClick={onOpen}><span>{t.storyCta}</span><Icon name="arrow" size={15} /></button>}
    </div>
    <div className="story-values">{children}</div>
  </section>;
}

export function RTMNOtherSide({ lang = "en", onOpen, onExplore }) {
  const t = copy[lang] || copy.en;
  return <section className="world-other-side" id="other-side" data-world-scene="other-side">
    <div className="other-copy"><h2>{t.otherTitle.split("\n").map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h2><p>{t.otherBody}</p><button className="world-button world-button-primary" onClick={onOpen || onExplore}><span>{t.otherCta}</span><Icon name="arrow" size={15} /></button></div>
    <p className="inverted-wordmark" aria-hidden="true">RTMN</p>
  </section>;
}
