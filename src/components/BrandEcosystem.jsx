import React, { useState } from "react";
import { Icon } from "./Icon";

const imageFor = (images, key) => images[key] || images.campaign;

export function CategoryNavigator({ items, images, onSelect }) {
  return <section className="brand-section category-navigator" id="shop-by-category" aria-labelledby="category-title">
    <div className="brand-section-heading"><span>RTMN / CATEGORIES</span><h2 id="category-title">SHOP BY<br />CATEGORY</h2></div>
    <div className="category-panels">{items.map((item, index) => <button key={item.id} className="category-panel" onClick={() => onSelect(item.id)}>
      <img src={imageFor(images, item.image)} alt="" loading="lazy" decoding="async" />
      <span className="category-panel-shade" />
      <span className="category-panel-number">0{index + 1}</span>
      <span className="category-panel-copy"><b>{item.label}</b><small>{item.note}</small><i>SHOP <Icon name="arrow" size={14} /></i></span>
    </button>)}</div>
  </section>;
}

export function CampaignFeature({ campaign, images, onOpen }) {
  return <section className="brand-section campaign-feature" id="campaigns" aria-labelledby="campaign-title">
    <img className="campaign-image" src={imageFor(images, campaign.image)} alt="RTMN Campaign 01 visual study" loading="lazy" decoding="async" />
    <div className="campaign-overlay" />
    <div className="campaign-copy"><span>{campaign.eyebrow}</span><h2 id="campaign-title">{campaign.title.split("\n").map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h2><p>{campaign.description}</p><button className="world-button world-button-primary" onClick={onOpen}><span>EXPLORE CAMPAIGN</span><Icon name="arrow" size={15} /></button></div>
  </section>;
}

export function ObjectLaboratory({ objects, materials, images, onOpenProduct }) {
  return <section className="brand-section object-laboratory" id="material-study" aria-labelledby="object-lab-title">
    <div className="brand-section-heading"><span>RTMN / OBJECTS</span><h2 id="object-lab-title">THE OBJECTS<br />HAVE A REASON.</h2><p>Each entry starts with material, construction and a fit that serves the object.</p></div>
    <div className="object-study-list">{objects.map(item => <button key={item.productId} onClick={() => onOpenProduct(item.productId)}><span>{item.object}</span><b>{item.title}</b><small>{item.note}</small><Icon name="arrow" size={15} /></button>)}</div>
    <div className="material-study-grid">{materials.map(item => <button key={item.id} className="material-study" onClick={() => onOpenProduct(item.productId)}>
      <img src={imageFor(images, item.image)} alt="" loading="lazy" decoding="async" />
      <span className="material-study-shade" />
      <span><small>{item.label}</small><b>{item.title}</b><i>{item.note}</i></span>
    </button>)}</div>
  </section>;
}

export function PhilosophySection({ items }) {
  const [active, setActive] = useState(items[0]?.id);
  const current = items.find(item => item.id === active) ?? items[0];
  return <section className="brand-section philosophy-section" id="rtmn-philosophy" aria-labelledby="philosophy-title">
    <div><span>RTMN / PHILOSOPHY</span><h2 id="philosophy-title">RAW TRUE<br />MODERN NEW</h2></div>
    <div className="philosophy-controls" role="tablist" aria-label="RTMN philosophy">{items.map(item => <button key={item.id} role="tab" aria-selected={current.id === item.id} className={current.id === item.id ? "active" : ""} onClick={() => setActive(item.id)}>{item.word}</button>)}</div>
    <p className="philosophy-statement" role="tabpanel">{current.statement}</p>
  </section>;
}

export function BrandIndex({ projects, stories, map, images, onOpenCampaign, onOpenStory, onNavigate }) {
  return <section className="brand-section brand-index" id="projects" aria-labelledby="projects-title">
    <div className="brand-index-head"><span>RTMN / PROJECT INDEX</span><h2 id="projects-title">A BRAND HAS<br />MORE THAN OBJECTS.</h2></div>
    <div className="project-records">{projects.map(project => <button key={project.id} className="project-record" onClick={() => onOpenCampaign(project.id)}><span>{project.type}</span><b>{project.title}</b><p>{project.note}</p><i>{project.action} <Icon name="arrow" size={15} /></i></button>)}</div>
    <div className="journal-header" id="journal"><span>RTMN / JOURNAL</span><p>Notes from materials, objects and visual studies.</p></div>
    <div className="journal-grid">{stories.map(story => <button key={story.id} className="journal-card" onClick={() => onOpenStory(story.id)}>
      <img src={imageFor(images, story.image)} alt="" loading="lazy" decoding="async" />
      <span className="journal-card-shade" />
      <span><small>{story.eyebrow}</small><b>{story.title.split("\n").map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</b><i>{story.summary}</i><em>READ NOTE <Icon name="arrow" size={14} /></em></span>
    </button>)}</div>
    <nav className="brand-map" aria-label="RTMN map"><span>RTMN MAP</span>{map.map(item => <button key={item.id} onClick={() => item.action === "campaign" ? onOpenCampaign("campaign-01") : onNavigate(item.target)}>{item.label}<Icon name="arrow" size={13} /></button>)}</nav>
  </section>;
}

export function SelectedObjects({ products, renderProduct }) {
  return <section className="brand-section selected-objects" id="selected-objects" aria-labelledby="selected-title">
    <div className="brand-section-heading"><span>RTMN / SELECTION</span><h2 id="selected-title">SELECTED<br />OBJECTS</h2><p>A concise read of the current RTMN language.</p></div>
    <div className="brand-product-grid">{products.map((product, index) => renderProduct(product, index))}</div>
  </section>;
}

export function DropSystem({ drop, onCurrent }) {
  return <section className="brand-section drop-system" id="drops" aria-labelledby="drop-title">
    <div><span>{drop.current.eyebrow}</span><h2 id="drop-title">{drop.current.title}</h2><p>{drop.current.note}</p><button className="text-button" onClick={onCurrent}>SHOP CURRENT DROP <Icon name="arrow" /></button></div>
    <div><span>{drop.next.eyebrow}</span><h2>{drop.next.title}</h2><p>{drop.next.note}</p><i>STATUS / OPEN</i></div>
  </section>;
}

export function CampaignPage({ campaign, products, images, renderProduct, onBack }) {
  return <main id="main-content" tabIndex="-1" className="brand-page campaign-page">
    <button className="brand-back" onClick={onBack}>← BACK TO RTMN</button>
    <section className="campaign-page-hero"><img src={imageFor(images, campaign.image)} alt="RTMN Campaign 01 visual study" /><div /><div><span>{campaign.eyebrow}</span><h1>{campaign.title.split("\n").map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h1><p>{campaign.description}</p></div></section>
    <section className="campaign-page-objects"><div className="brand-section-heading"><span>CAMPAIGN / OBJECTS</span><h2>THE ACTIVE<br />SELECTION</h2></div><div className="brand-product-grid">{products.map((product, index) => renderProduct(product, index))}</div></section>
  </main>;
}

export function JournalPage({ story, products, images, renderProduct, onBack }) {
  return <main id="main-content" tabIndex="-1" className="brand-page journal-page">
    <button className="brand-back" onClick={onBack}>← BACK TO JOURNAL</button>
    <article className="journal-page-article"><img src={imageFor(images, story.image)} alt="" /><div><span>{story.eyebrow}</span><h1>{story.title.split("\n").map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</h1><p>{story.body}</p></div></article>
    <section className="journal-related"><div className="brand-section-heading"><span>RELATED OBJECTS</span><h2>READ THE<br />OBJECT.</h2></div><div className="brand-product-grid">{products.map((product, index) => renderProduct(product, index))}</div></section>
  </main>;
}
