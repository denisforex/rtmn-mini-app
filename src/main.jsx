import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const products = [
  {
    id: 1,
    name: "RTMN Oversized Tee",
    category: "T-Shirts",
    price: 49.9,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    description: "Heavyweight cotton tee with an oversized silhouette and clean RTMN finish.",
    tone: "black"
  },
  {
    id: 2,
    name: "RTMN Heavy Hoodie",
    category: "Hoodies",
    price: 89.9,
    color: "Washed Black",
    sizes: ["S", "M", "L", "XL"],
    description: "Premium heavyweight hoodie with a relaxed fit and minimal branding.",
    tone: "charcoal"
  },
  {
    id: 3,
    name: "RTMN Cargo Pants",
    category: "Pants",
    price: 79.9,
    color: "Stone",
    sizes: ["S", "M", "L", "XL"],
    description: "Relaxed cargo trousers designed for everyday movement and structure.",
    tone: "stone"
  },
  {
    id: 4,
    name: "RTMN Essential Tee",
    category: "T-Shirts",
    price: 39.9,
    color: "White",
    sizes: ["S", "M", "L", "XL"],
    description: "Clean everyday tee with a premium hand feel and regular fit.",
    tone: "white"
  }
];

const categories = ["All", "T-Shirts", "Hoodies", "Pants"];

function App() {
  const [tab, setTab] = useState("shop");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState("");
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rtmn-cart")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("rtmn-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor?.("#0b0b0b");
      tg.setBackgroundColor?.("#f5f5f2");
    }
  }, []);

  const filtered = useMemo(
    () => category === "All" ? products : products.filter(p => p.category === category),
    [category]
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(product, chosenSize) {
    const itemKey = `${product.id}-${chosenSize}`;
    setCart(prev => {
      const found = prev.find(i => i.key === itemKey);
      if (found) return prev.map(i => i.key === itemKey ? {...i, qty: i.qty + 1} : i);
      return [...prev, {key: itemKey, id: product.id, name: product.name, price: product.price, size: chosenSize, qty: 1}];
    });
    setSelected(null);
    setSize("");
    setTab("cart");
  }

  function removeItem(key) {
    setCart(prev => prev.filter(i => i.key !== key));
  }

  function changeQty(key, delta) {
    setCart(prev => prev.map(i => i.key === key ? {...i, qty: Math.max(1, i.qty + delta)} : i));
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">RTMN</div>
        <button className="icon-btn" onClick={() => setTab("cart")} aria-label="Cart">
          🛒<span className="badge">{count}</span>
        </button>
      </header>

      {tab === "shop" && (
        <>
          <section className="hero">
            <div className="eyebrow">RTMN / 001</div>
            <h1>WEAR<br/><span>WHAT FEELS</span><br/>LIKE YOU.</h1>
            <p>Modern essentials. Germany-wide delivery.</p>
            <button className="primary" onClick={() => document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"})}>
              SHOP NEW DROP
            </button>
          </section>

          <section className="section" id="catalog">
            <div className="section-head">
              <div>
                <div className="eyebrow">COLLECTION</div>
                <h2>NEW DROP</h2>
              </div>
            </div>

            <div className="chips">
              {categories.map(c => (
                <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>

            <div className="grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => setSelected(product)} />
              ))}
            </div>
          </section>
        </>
      )}

      {tab === "cart" && (
        <section className="section cart-page">
          <div className="eyebrow">RTMN / BAG</div>
          <h2>YOUR BAG</h2>

          {cart.length === 0 ? (
            <div className="empty">
              <div className="empty-mark">RTMN</div>
              <p>Your bag is empty.</p>
              <button className="primary" onClick={() => setTab("shop")}>CONTINUE SHOPPING</button>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {cart.map(item => (
                  <div className="cart-item" key={item.key}>
                    <div className="mini-product"><span>RTMN</span></div>
                    <div className="cart-info">
                      <strong>{item.name}</strong>
                      <span>Size {item.size}</span>
                      <div className="qty">
                        <button onClick={() => changeQty(item.key, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => changeQty(item.key, 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-price">€{(item.price * item.qty).toFixed(2)}</div>
                    <button className="remove" onClick={() => removeItem(item.key)}>×</button>
                  </div>
                ))}
              </div>

              <div className="summary">
                <div><span>Subtotal</span><strong>€{total.toFixed(2)}</strong></div>
                <div><span>Shipping</span><strong>{total >= 100 ? "FREE" : "€4.99"}</strong></div>
                <div className="grand"><span>Total</span><strong>€{(total + (total >= 100 ? 0 : 4.99)).toFixed(2)}</strong></div>
                <button className="primary" onClick={() => setTab("checkout")}>CHECKOUT</button>
              </div>
            </>
          )}
        </section>
      )}

      {tab === "checkout" && (
        <Checkout cart={cart} total={total} onBack={() => setTab("cart")} onSuccess={() => {setCart([]); setTab("success");}} />
      )}

      {tab === "success" && (
        <section className="section success">
          <div className="success-icon">✓</div>
          <div className="eyebrow">ORDER RECEIVED</div>
          <h2>THANK YOU.</h2>
          <p>Your RTMN order request has been received. We'll contact you with the next steps.</p>
          <button className="primary" onClick={() => setTab("shop")}>BACK TO SHOP</button>
        </section>
      )}

      <nav className="bottom-nav">
        <button className={tab === "shop" ? "active" : ""} onClick={() => setTab("shop")}><span>⌂</span>Shop</button>
        <button className={tab === "cart" ? "active" : ""} onClick={() => setTab("cart")}><span>🛒</span>Bag {count ? `(${count})` : ""}</button>
      </nav>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <ProductVisual tone={selected.tone} large />
            <div className="modal-body">
              <div className="eyebrow">{selected.category}</div>
              <h2>{selected.name}</h2>
              <div className="modal-price">€{selected.price.toFixed(2)}</div>
              <p>{selected.description}</p>
              <div className="label">SELECT SIZE</div>
              <div className="sizes">
                {selected.sizes.map(s => <button key={s} className={size === s ? "selected" : ""} onClick={() => setSize(s)}>{s}</button>)}
              </div>
              <button className="primary full" disabled={!size} onClick={() => addToCart(selected, size)}>
                {size ? "ADD TO BAG" : "SELECT A SIZE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({product, onClick}) {
  return (
    <button className="product-card" onClick={onClick}>
      <ProductVisual tone={product.tone} />
      <div className="product-meta">
        <div>
          <strong>{product.name}</strong>
          <span>{product.color}</span>
        </div>
        <b>€{product.price.toFixed(2)}</b>
      </div>
    </button>
  );
}

function ProductVisual({tone, large=false}) {
  return <div className={`product-visual ${tone} ${large ? "large" : ""}`}>
    <div className="mock-shirt">
      <span>RTMN</span>
    </div>
    <div className="visual-caption">RTMN / ESSENTIALS</div>
  </div>
}

function Checkout({cart, total, onBack, onSuccess}) {
  const [form, setForm] = useState({first:"", last:"", street:"", house:"", zip:"", city:"", phone:"", email:""});
  const shipping = total >= 100 ? 0 : 4.99;
  const finalTotal = total + shipping;

  function update(k,v){setForm({...form,[k]:v});}
  function submit(e){
    e.preventDefault();
    if(Object.values(form).some(v => !v.trim())) return;
    const tg = window.Telegram?.WebApp;
    if (tg?.showAlert) tg.showAlert("Order received — RTMN will contact you shortly.");
    onSuccess();
  }

  return (
    <section className="section checkout">
      <button className="back" onClick={onBack}>← BACK TO BAG</button>
      <div className="eyebrow">RTMN / CHECKOUT</div>
      <h2>DELIVERY</h2>
      <p className="muted">Germany 🇩🇪</p>
      <form onSubmit={submit}>
        <div className="two">
          <input placeholder="First name" value={form.first} onChange={e=>update("first",e.target.value)} />
          <input placeholder="Last name" value={form.last} onChange={e=>update("last",e.target.value)} />
        </div>
        <div className="two">
          <input placeholder="Street" value={form.street} onChange={e=>update("street",e.target.value)} />
          <input placeholder="House no." value={form.house} onChange={e=>update("house",e.target.value)} />
        </div>
        <div className="two">
          <input placeholder="Postal code" value={form.zip} onChange={e=>update("zip",e.target.value)} />
          <input placeholder="City" value={form.city} onChange={e=>update("city",e.target.value)} />
        </div>
        <input placeholder="Phone" value={form.phone} onChange={e=>update("phone",e.target.value)} />
        <input type="email" placeholder="Email" value={form.email} onChange={e=>update("email",e.target.value)} />

        <div className="summary">
          <div><span>Subtotal</span><strong>€{total.toFixed(2)}</strong></div>
          <div><span>Shipping</span><strong>{shipping === 0 ? "FREE" : "€4.99"}</strong></div>
          <div className="grand"><span>Total</span><strong>€{finalTotal.toFixed(2)}</strong></div>
        </div>
        <button className="primary full" type="submit">PLACE ORDER</button>
      </form>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
