import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const products = [
  { id: 1, name: "RTMN Oversized Tee", category: "T-Shirts", price: 49.9, color: "Black", sizes: ["S", "M", "L", "XL"], description: "Heavyweight cotton tee with an oversized silhouette and clean RTMN finish.", tone: "black", tag: "New" },
  { id: 2, name: "RTMN Heavy Hoodie", category: "Hoodies", price: 89.9, color: "Washed Black", sizes: ["S", "M", "L", "XL"], description: "Premium heavyweight hoodie with a relaxed fit and minimal branding.", tone: "charcoal", tag: "Bestseller" },
  { id: 3, name: "RTMN Cargo Pants", category: "Pants", price: 79.9, color: "Stone", sizes: ["S", "M", "L", "XL"], description: "Relaxed cargo trousers designed for everyday movement and structure.", tone: "stone", tag: "Drop 01" },
  { id: 4, name: "RTMN Essential Tee", category: "T-Shirts", price: 39.9, color: "White", sizes: ["S", "M", "L", "XL"], description: "Clean everyday tee with a premium hand feel and regular fit.", tone: "white", tag: "Essential" },
];

const categories = ["All", "T-Shirts", "Hoodies", "Pants"];

const copy = {
  en: {
    langName: "English", shop: "Shop", bag: "Bag", collection: "Collection", newDrop: "New drop", viewAll: "View all", all: "All", tees: "T-Shirts", hoodies: "Hoodies", pants: "Pants",
    heroKicker: "Berlin energy · Made for everywhere", heroTitle1: "WEAR", heroTitle2: "WHAT FEELS", heroTitle3: "LIKE YOU.", heroText: "Clean silhouettes, heavy fabrics and everyday pieces with attitude.", heroCta: "Shop the drop", shipping: "Free shipping in Germany over €100", featured: "Featured now", details: "Built for repeat wear.", details2: "Minimal by design. Distinct by choice.", add: "Add to bag", select: "Select a size", choose: "Choose size", close: "Close", color: "Color", size: "Size", subtotal: "Subtotal", shippingLabel: "Shipping", total: "Total", free: "FREE", checkout: "Checkout", yourBag: "Your bag", emptyBag: "Your bag is empty.", continue: "Continue shopping", remove: "Remove", quantity: "Quantity", delivery: "Germany · 2–4 business days", secure: "Secure checkout", first: "First name", last: "Last name", street: "Street", house: "No.", zip: "ZIP", city: "City", phone: "Phone", email: "Email", order: "Place order", orderNote: "Your order request will be confirmed with you by Telegram.", received: "Order received", thankYou: "Thank you.", receivedText: "Your RTMN order request has been received. We’ll contact you with the next steps.", backShop: "Back to shop", sold: "Limited release", menu: "Menu", language: "Language", bagEmptyShort: "Empty", footer: "RTMN — your style, your rules.", dropBadge: "RTMN / 001", promise1: "Heavyweight materials", promise2: "Designed in Germany", promise3: "Small-batch drops", footerNote: "© RTMN. Built for the ones who wear their own rules.",
    categoryNames: { All: "All", "T-Shirts": "T-Shirts", Hoodies: "Hoodies", Pants: "Pants" }, tagNames: { New: "New", Bestseller: "Bestseller", "Drop 01": "Drop 01", Essential: "Essential" }
  },
  de: {
    langName: "Deutsch", shop: "Shop", bag: "Warenkorb", collection: "Kollektion", newDrop: "New Drop", viewAll: "Alle ansehen", all: "Alle", tees: "T-Shirts", hoodies: "Hoodies", pants: "Hosen",
    heroKicker: "Berlin Vibes · Für überall gemacht", heroTitle1: "TRAG", heroTitle2: "WAS SICH", heroTitle3: "NACH DIR ANFÜHLT.", heroText: "Klare Silhouetten, schwere Stoffe und Everyday-Pieces mit Charakter.", heroCta: "Drop shoppen", shipping: "Kostenloser Versand in Deutschland ab 100 €", featured: "Jetzt entdecken", details: "Gemacht für jeden Tag.", details2: "Minimal im Design. Stark in der Aussage.", add: "In den Warenkorb", select: "Größe wählen", choose: "Größe auswählen", close: "Schließen", color: "Farbe", size: "Größe", subtotal: "Zwischensumme", shippingLabel: "Versand", total: "Gesamt", free: "KOSTENLOS", checkout: "Zur Kasse", yourBag: "Dein Warenkorb", emptyBag: "Dein Warenkorb ist leer.", continue: "Weiter shoppen", remove: "Entfernen", quantity: "Menge", delivery: "Deutschland · 2–4 Werktage", secure: "Sicherer Checkout", first: "Vorname", last: "Nachname", street: "Straße", house: "Nr.", zip: "PLZ", city: "Ort", phone: "Telefon", email: "E-Mail", order: "Bestellung senden", orderNote: "Deine Bestellung wird anschließend per Telegram mit dir bestätigt.", received: "Bestellung erhalten", thankYou: "Danke.", receivedText: "Deine RTMN-Bestellanfrage ist eingegangen. Wir melden uns mit den nächsten Schritten.", backShop: "Zurück zum Shop", sold: "Limitierter Release", menu: "Menü", language: "Sprache", bagEmptyShort: "Leer", footer: "RTMN — dein Style, deine Regeln.", dropBadge: "RTMN / 001", promise1: "Schwere Premium-Stoffe", promise2: "Designed in Deutschland", promise3: "Kleine Drops", footerNote: "© RTMN. Für alle, die ihre eigenen Regeln tragen.",
    categoryNames: { All: "Alle", "T-Shirts": "T-Shirts", Hoodies: "Hoodies", Pants: "Hosen" }, tagNames: { New: "Neu", Bestseller: "Bestseller", "Drop 01": "Drop 01", Essential: "Essential" }
  },
  uk: {
    langName: "Українська", shop: "Магазин", bag: "Кошик", collection: "Колекція", newDrop: "Новий дроп", viewAll: "Дивитися все", all: "Усі", tees: "Футболки", hoodies: "Худі", pants: "Штани",
    heroKicker: "Berlin energy · Створено для всюди", heroTitle1: "НОСИ", heroTitle2: "ТЕ, ЩО", heroTitle3: "ВІДЧУВАЄТЬСЯ ТОБОЮ.", heroText: "Чисті силуети, щільні тканини й речі на щодень із характером.", heroCta: "Дивитися дроп", shipping: "Безкоштовна доставка по Німеччині від 100 €", featured: "Зараз у фокусі", details: "Створено для постійного носіння.", details2: "Мінімалізм у дизайні. Характер у виборі.", add: "Додати в кошик", select: "Оберіть розмір", choose: "Оберіть розмір", close: "Закрити", color: "Колір", size: "Розмір", subtotal: "Підсумок", shippingLabel: "Доставка", total: "Разом", free: "БЕЗКОШТОВНО", checkout: "Оформити", yourBag: "Твій кошик", emptyBag: "Твій кошик порожній.", continue: "Продовжити покупки", remove: "Видалити", quantity: "Кількість", delivery: "Німеччина · 2–4 робочі дні", secure: "Захищене оформлення", first: "Ім’я", last: "Прізвище", street: "Вулиця", house: "№", zip: "Індекс", city: "Місто", phone: "Телефон", email: "E-mail", order: "Відправити замовлення", orderNote: "Після цього ми підтвердимо замовлення з тобою через Telegram.", received: "Замовлення отримано", thankYou: "Дякуємо.", receivedText: "Твій запит на замовлення RTMN отримано. Ми зв’яжемося з тобою щодо наступних кроків.", backShop: "Назад у магазин", sold: "Лімітований реліз", menu: "Меню", language: "Мова", bagEmptyShort: "Порожньо", footer: "RTMN — твій стиль, твої правила.", dropBadge: "RTMN / 001", promise1: "Щільні преміум-матеріали", promise2: "Дизайн у Німеччині", promise3: "Малі лімітовані дропи", footerNote: "© RTMN. Для тих, хто носить власні правила.",
    categoryNames: { All: "Усі", "T-Shirts": "Футболки", Hoodies: "Худі", Pants: "Штани" }, tagNames: { New: "Новинка", Bestseller: "Бестселер", "Drop 01": "Дроп 01", Essential: "База" }
  }
};

const money = (value) => `€${value.toFixed(2)}`;

function App() {
  const [tab, setTab] = useState("shop");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState("");
  const [lang, setLang] = useState(() => localStorage.getItem("rtmn-lang") || "en");
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rtmn-cart")) || []; } catch { return []; }
  });

  const t = copy[lang];
  const filtered = useMemo(() => category === "All" ? products : products.filter(p => p.category === category), [category]);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const shipping = total >= 100 || total === 0 ? 0 : 4.99;

  useEffect(() => localStorage.setItem("rtmn-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => {
    localStorage.setItem("rtmn-lang", lang);
    document.documentElement.lang = lang === "uk" ? "uk" : lang;
  }, [lang]);
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready(); tg.expand(); tg.setHeaderColor?.("#0a0a0a"); tg.setBackgroundColor?.("#f3f1ec");
    }
  }, []);

  function scrollToCatalog() { document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }
  function addToCart(product, chosenSize) {
    const itemKey = `${product.id}-${chosenSize}`;
    setCart(prev => {
      const found = prev.find(i => i.key === itemKey);
      return found ? prev.map(i => i.key === itemKey ? { ...i, qty: i.qty + 1 } : i) : [...prev, { key: itemKey, id: product.id, name: product.name, price: product.price, size: chosenSize, qty: 1, tone: product.tone }];
    });
    setSelected(null); setSize(""); setTab("cart");
  }
  function changeQty(key, delta) { setCart(prev => prev.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)); }
  function removeItem(key) { setCart(prev => prev.filter(i => i.key !== key)); }
  function setLanguage(next) { setLang(next); }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand-button" onClick={() => setTab("shop")} aria-label="RTMN home"><span className="brand-dot" />RTMN</button>
        <div className="top-actions">
          <div className="lang-switcher" role="group" aria-label={t.language}>
            {[["en", "EN"], ["de", "DE"], ["uk", "UA"]].map(([code, label]) => <button key={code} className={lang === code ? "active" : ""} onClick={() => setLanguage(code)}>{label}</button>)}
          </div>
          <button className="bag-btn" onClick={() => setTab("cart")} aria-label={t.bag}>
            <span className="bag-icon">↗</span><span className="bag-label">{t.bag}</span>{count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </header>

      {tab === "shop" && <>
        <main>
          <section className="hero">
            <div className="hero-grid" />
            <div className="hero-content">
              <div className="hero-kicker"><span>{t.dropBadge}</span><span>{t.heroKicker}</span></div>
              <h1>{t.heroTitle1}<br /><span>{t.heroTitle2}</span><br />{t.heroTitle3}</h1>
              <p>{t.heroText}</p>
              <div className="hero-actions"><button className="primary light" onClick={scrollToCatalog}>{t.heroCta}<span>↘</span></button><span className="micro-note">{t.shipping}</span></div>
            </div>
            <div className="hero-stamp"><span>01</span><span>/</span><span>RTMN</span></div>
          </section>

          <div className="ticker"><div>{Array.from({ length: 7 }).map((_, i) => <span key={i}>RTMN <b>✦</b> {t.newDrop}</span>)}</div></div>

          <section className="section" id="catalog">
            <div className="section-head">
              <div><div className="eyebrow">{t.collection}</div><h2>{t.featured}</h2></div>
              <button className="text-btn" onClick={() => setCategory("All")}>{t.viewAll}<span>↗</span></button>
            </div>
            <div className="chips">
              {categories.map(c => <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{t.categoryNames[c]}</button>)}
            </div>
            <div className="grid">
              {filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} onClick={() => { setSelected(product); setSize(""); }} t={t} />)}
            </div>
          </section>

          <section className="manifest section">
            <div className="manifest-card"><div className="eyebrow">RTMN MANIFEST</div><h3>{t.details}</h3><p>{t.details2}</p><div className="manifest-line" /></div>
            <div className="promise-grid">
              {[t.promise1, t.promise2, t.promise3].map((item, i) => <div className="promise" key={item}><span>0{i + 1}</span><strong>{item}</strong></div>)}
            </div>
          </section>
        </main>
        <Footer t={t} />
      </>}

      {tab === "cart" && <CartPage cart={cart} total={total} shipping={shipping} onBack={() => setTab("shop")} onCheckout={() => setTab("checkout")} onRemove={removeItem} onQty={changeQty} t={t} />}
      {tab === "checkout" && <Checkout cart={cart} total={total} shipping={shipping} onBack={() => setTab("cart")} onSuccess={() => { setCart([]); setTab("success"); }} t={t} />}
      {tab === "success" && <SuccessPage onBack={() => setTab("shop")} t={t} />}

      {tab !== "checkout" && tab !== "success" && <nav className="bottom-nav" aria-label={t.menu}>
        <button className={tab === "shop" ? "active" : ""} onClick={() => setTab("shop")}><span>⌂</span>{t.shop}</button>
        <button className={tab === "cart" ? "active" : ""} onClick={() => setTab("cart")}><span>◒</span>{t.bag}{count ? ` · ${count}` : ""}</button>
      </nav>}

      {selected && <ProductModal product={selected} size={size} setSize={setSize} onClose={() => setSelected(null)} onAdd={addToCart} t={t} />}
    </div>
  );
}

function ProductCard({ product, onClick, t, index }) {
  return <button className="product-card reveal" style={{ "--delay": `${index * 70}ms` }} onClick={onClick}>
    <div className="product-image-wrap"><ProductVisual tone={product.tone} /><span className="product-tag">{t.tagNames[product.tag]}</span><span className="product-arrow">↗</span></div>
    <div className="product-meta"><div><strong>{product.name}</strong><span>{product.color}</span></div><b>{money(product.price)}</b></div>
  </button>;
}

function ProductVisual({ tone, large = false }) {
  return <div className={`product-visual ${tone} ${large ? "large" : ""}`}>
    <div className="visual-noise" /><div className="mock-shirt"><span>RTMN</span></div><div className="visual-caption">RTMN / ESSENTIALS</div>
  </div>;
}

function ProductModal({ product, size, setSize, onClose, onAdd, t }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}>
    <button className="close" onClick={onClose} aria-label={t.close}>×</button>
    <ProductVisual tone={product.tone} large />
    <div className="modal-body">
      <div className="eyebrow">{t.categoryNames[product.category]}</div>
      <div className="modal-title-row"><div><h2>{product.name}</h2><p className="modal-color">{t.color}: {product.color}</p></div><div className="modal-price">{money(product.price)}</div></div>
      <p className="modal-description">{product.description}</p>
      <div className="label">{t.choose}</div>
      <div className="sizes">{product.sizes.map(s => <button key={s} className={size === s ? "selected" : ""} onClick={() => setSize(s)}>{s}</button>)}</div>
      <button className="primary full" disabled={!size} onClick={() => onAdd(product, size)}>{size ? t.add : t.select}<span>↗</span></button>
    </div>
  </div></div>;
}

function CartPage({ cart, total, shipping, onBack, onCheckout, onRemove, onQty, t }) {
  return <section className="section page cart-page"><div className="page-top"><button className="back-btn" onClick={onBack}>← {t.shop}</button><span className="eyebrow">RTMN / BAG</span></div><h2>{t.yourBag}</h2>
    {cart.length === 0 ? <div className="empty"><div className="empty-mark">RTMN</div><p>{t.emptyBag}</p><button className="primary" onClick={onBack}>{t.continue}</button></div> : <>
      <div className="cart-list">{cart.map(item => <div className="cart-item" key={item.key}><div className="mini-product"><div className={`mini-shape ${item.tone}`}><span>RTMN</span></div></div><div className="cart-info"><strong>{item.name}</strong><span>{t.size} {item.size}</span><div className="qty"><button onClick={() => onQty(item.key, -1)}>−</button><span>{item.qty}</span><button onClick={() => onQty(item.key, 1)}>+</button></div></div><div className="cart-right"><b>{money(item.price * item.qty)}</b><button className="remove" onClick={() => onRemove(item.key)}>{t.remove}</button></div></div>)}</div>
      <div className="summary"><div><span>{t.subtotal}</span><strong>{money(total)}</strong></div><div><span>{t.shippingLabel}</span><strong>{shipping === 0 ? t.free : money(shipping)}</strong></div><div className="summary-note">{t.delivery}</div><div className="grand"><span>{t.total}</span><strong>{money(total + shipping)}</strong></div><button className="primary full" onClick={onCheckout}>{t.checkout}<span>↗</span></button></div>
    </>}
  </section>;
}

function Checkout({ cart, total, shipping, onBack, onSuccess, t }) {
  const [form, setForm] = useState({ first: "", last: "", street: "", house: "", zip: "", city: "", phone: "", email: "" });
  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));
  const valid = Object.values(form).every(Boolean) && cart.length > 0;
  function submit(e) { e.preventDefault(); if (!valid) return; window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.("success"); onSuccess(); }
  return <section className="section page checkout"><div className="page-top"><button className="back-btn" onClick={onBack}>← {t.bag}</button><span className="eyebrow">RTMN / CHECKOUT</span></div><h2>{t.checkout}</h2><p className="muted">{t.orderNote}</p>
    <div className="secure-row"><span>◉ {t.secure}</span><span>{money(total + shipping)}</span></div>
    <form onSubmit={submit}><div className="two"><input value={form.first} onChange={set("first")} placeholder={t.first} /><input value={form.last} onChange={set("last")} placeholder={t.last} /></div><div className="two wide-street"><input value={form.street} onChange={set("street")} placeholder={t.street} /><input value={form.house} onChange={set("house")} placeholder={t.house} /></div><div className="two"><input value={form.zip} onChange={set("zip")} placeholder={t.zip} /><input value={form.city} onChange={set("city")} placeholder={t.city} /></div><input value={form.phone} onChange={set("phone")} placeholder={t.phone} inputMode="tel" /><input value={form.email} onChange={set("email")} placeholder={t.email} type="email" /><button className="primary full" type="submit" disabled={!valid}>{t.order}<span>↗</span></button></form>
  </section>;
}

function SuccessPage({ onBack, t }) {
  return <section className="section page success"><div className="success-orbit"><span>✓</span></div><div className="eyebrow">{t.received}</div><h2>{t.thankYou}</h2><p>{t.receivedText}</p><button className="primary" onClick={onBack}>{t.backShop}<span>↗</span></button></section>;
}

function Footer({ t }) {
  return <footer className="footer"><div><div className="footer-logo">RTMN</div><p>{t.footer}</p></div><div className="footer-note">{t.footerNote}</div></footer>;
}

createRoot(document.getElementById("root")).render(<App />);
