import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4.5 4.2-6.5 8-6.5S18.5 16.5 20 21"/></>,
    heart: <path d="M20.8 8.4c0 5-8.8 10.1-8.8 10.1S3.2 13.4 3.2 8.4A4.5 4.5 0 0 1 12 6.1a4.5 4.5 0 0 1 8.8 2.3Z"/>,
    bag: <><path d="M5 8.5h14l-1 11H6l-1-11Z"/><path d="M9 8.5V6a3 3 0 0 1 6 0v2.5"/></>,
    arrow: <><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
    chevron: <path d="m7 9 5 5 5-5"/>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    minus: <path d="M5 12h14"/>,
    check: <path d="m5 12 4 4L19 7"/>,
    filter: <><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></>,
    grid: <><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    bolt: <path d="m13 2-9 12h7l-1 8 9-13h-7l1-7Z"/>,
    star: <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.7l6.2-.9L12 3Z"/>,
    truck: <><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    shield: <path d="M12 3 19 6v5c0 5-3.2 8-7 10-3.8-2-7-5-7-10V6l7-3Z"/>
  };
  return <svg {...common}>{paths[name] || paths.star}</svg>;
};

const products = [
  { id: 1, name: "Oversized Tee", category: "T-Shirts", price: 49.9, compareAt: 59.9, color: "Washed Black", tone: "black", badge: "NEW", sizes: ["XS","S","M","L","XL"], fit: "Oversized", material: "100% heavyweight cotton", description: "A structured oversized tee with a dense hand-feel, dropped shoulders and a clean RTMN chest mark.", details: ["260 GSM cotton", "Dropped shoulder", "Unisex fit", "Made for daily wear"] },
  { id: 2, name: "Heavyweight Hoodie", category: "Hoodies", price: 89.9, compareAt: null, color: "Faded Charcoal", tone: "charcoal", badge: "BESTSELLER", sizes: ["XS","S","M","L","XL"], fit: "Relaxed", material: "480 GSM brushed cotton", description: "Dense brushed cotton, a relaxed hood and a refined silhouette designed to stay in rotation.", details: ["480 GSM", "Brushed inside", "Ribbed cuffs", "Kangaroo pocket"] },
  { id: 3, name: "Utility Cargo", category: "Pants", price: 79.9, compareAt: 99.9, color: "Stone", tone: "stone", badge: "DROP 02", sizes: ["S","M","L","XL"], fit: "Relaxed", material: "Cotton ripstop", description: "Relaxed utility trousers with articulated pockets and a clean straight leg.", details: ["Cotton ripstop", "6 utility pockets", "Straight leg", "Adjustable hem"] },
  { id: 4, name: "Essential Tee", category: "T-Shirts", price: 39.9, compareAt: null, color: "Off White", tone: "cream", badge: "ESSENTIAL", sizes: ["XS","S","M","L","XL"], fit: "Regular", material: "220 GSM cotton", description: "The everyday layer: compact jersey, regular fit and understated branding.", details: ["220 GSM", "Regular fit", "Soft touch", "Unisex fit"] },
  { id: 5, name: "Zip Overshirt", category: "Jackets", price: 119.9, compareAt: null, color: "Graphite", tone: "graphite", badge: "NEW", sizes: ["S","M","L","XL"], fit: "Boxy", material: "Cotton nylon blend", description: "A boxy outer layer with technical character and a clean front zip closure.", details: ["Cotton nylon", "Two-way zip", "Hidden pockets", "Boxy silhouette"] },
  { id: 6, name: "Studio Sweatpants", category: "Pants", price: 74.9, compareAt: null, color: "Heather Grey", tone: "grey", badge: "RESTOCK", sizes: ["XS","S","M","L","XL"], fit: "Relaxed", material: "420 GSM fleece", description: "Heavy fleece sweatpants with a straight relaxed leg and precise seam placement.", details: ["420 GSM", "Heavy fleece", "Elastic waist", "Relaxed leg"] }
];

const cats = ["All", "T-Shirts", "Hoodies", "Pants", "Jackets"];

const copy = {
  en: {
    nav: { shop:"Shop", new:"New drop", tees:"T-Shirts", hoodies:"Hoodies", pants:"Pants" }, search:"Search", account:"Account", wishlist:"Wishlist", bag:"Bag", menu:"Menu", language:"Language",
    heroKicker:"RTMN / 002 · GERMANY", heroTitle:"YOUR UNIFORM\nYOUR RULES.", heroText:"Elevated essentials. Heavy materials. Clean silhouettes built for everyday movement.", heroPrimary:"Shop the new drop", heroSecondary:"Explore essentials", shipping:"Free shipping in Germany over €100", promo:"FREE SHIPPING IN GERMANY OVER €100", viewAll:"View all", featured:"Featured pieces", collection:"The latest edit", filters:"Filters", sort:"Sort", filterAll:"All", newest:"Newest", priceLow:"Price: low to high", priceHigh:"Price: high to low", soldOut:"Sold out",
    product:"Product", add:"Add to bag", selectSize:"Select size", sizeGuide:"Size guide", color:"Color", fit:"Fit", material:"Material", details:"Details", youMayLike:"You may also like", quickAdd:"Quick add", viewProduct:"View product", close:"Close",
    bagTitle:"Your bag", empty:"Your bag is waiting.", continue:"Continue shopping", subtotal:"Subtotal", shippingLabel:"Shipping", free:"FREE", total:"Total", checkout:"Checkout", remove:"Remove", decrease:"Decrease", increase:"Increase", freeShippingProgress:"Add {amount} to unlock free shipping", freeShippingUnlocked:"You unlocked free shipping", secure:"Secure checkout", delivery:"Germany · 2–4 business days",
    checkoutTitle:"Checkout", back:"Back", contact:"Contact", deliveryTo:"Deliver to Germany", first:"First name", last:"Last name", street:"Street", house:"No.", zip:"ZIP", city:"City", phone:"Phone", email:"Email", note:"Order confirmation is handled with you in Telegram.", placeOrder:"Place order", successTitle:"Order request received", successText:"Your RTMN request is in. We’ll confirm the order with you in Telegram.", backShop:"Back to shop",
    valuesTitle:"Built different.", valuesText:"RTMN is a Berlin-inspired wardrobe for people who care about shape, texture and consistency.", value1:"Heavy materials", value1t:"Dense fabrics chosen to hold their shape.", value2:"Small drops", value2t:"Focused collections, released in limited runs.", value3:"Designed in Germany", value3t:"Minimal, functional and made for repeat wear.",
    footerText:"Modern clothing for those who know their style.", footerShop:"Shop", footerHelp:"Help", footerLegal:"Legal", shippingInfo:"Shipping", returns:"Returns", contactUs:"Contact", privacy:"Privacy", imprint:"Imprint", footerNote:"© RTMN. Your style, your rules.",
    filtersTitle:"Refine", category:"Category", size:"Size", colorFilter:"Color", apply:"Apply filters", reset:"Reset", noResults:"No pieces found", clearFilters:"Clear filters", searchPlaceholder:"Search RTMN"
  },
  de: {
    nav: { shop:"Shop", new:"New Drop", tees:"T-Shirts", hoodies:"Hoodies", pants:"Hosen" }, search:"Suchen", account:"Konto", wishlist:"Wunschliste", bag:"Warenkorb", menu:"Menü", language:"Sprache",
    heroKicker:"RTMN / 002 · DEUTSCHLAND", heroTitle:"DEIN UNIFORM\nDEINE REGELN.", heroText:"Hochwertige Essentials. Schwere Materialien. Klare Silhouetten für jeden Tag.", heroPrimary:"New Drop shoppen", heroSecondary:"Essentials entdecken", shipping:"Kostenloser Versand in Deutschland ab 100 €", promo:"KOSTENLOSER VERSAND IN DEUTSCHLAND AB 100 €", viewAll:"Alle ansehen", featured:"Ausgewählte Pieces", collection:"Der aktuelle Edit", filters:"Filter", sort:"Sortieren", filterAll:"Alle", newest:"Neueste", priceLow:"Preis: niedrig → hoch", priceHigh:"Preis: hoch → niedrig", soldOut:"Ausverkauft",
    product:"Produkt", add:"In den Warenkorb", selectSize:"Größe wählen", sizeGuide:"Größenguide", color:"Farbe", fit:"Fit", material:"Material", details:"Details", youMayLike:"Das könnte dir gefallen", quickAdd:"Schnell hinzufügen", viewProduct:"Produkt ansehen", close:"Schließen",
    bagTitle:"Dein Warenkorb", empty:"Dein Warenkorb wartet.", continue:"Weiter shoppen", subtotal:"Zwischensumme", shippingLabel:"Versand", free:"KOSTENLOS", total:"Gesamt", checkout:"Zur Kasse", remove:"Entfernen", decrease:"Weniger", increase:"Mehr", freeShippingProgress:"Noch {amount} bis kostenloser Versand", freeShippingUnlocked:"Kostenloser Versand freigeschaltet", secure:"Sicherer Checkout", delivery:"Deutschland · 2–4 Werktage",
    checkoutTitle:"Checkout", back:"Zurück", contact:"Kontakt", deliveryTo:"Lieferung innerhalb Deutschlands", first:"Vorname", last:"Nachname", street:"Straße", house:"Nr.", zip:"PLZ", city:"Ort", phone:"Telefon", email:"E-Mail", note:"Die Bestellbestätigung erfolgt anschließend über Telegram.", placeOrder:"Bestellung senden", successTitle:"Bestellanfrage erhalten", successText:"Deine RTMN-Anfrage ist eingegangen. Wir bestätigen die Bestellung mit dir über Telegram.", backShop:"Zurück zum Shop",
    valuesTitle:"Anders gedacht.", valuesText:"RTMN ist eine Berlin-inspirierte Garderobe für Menschen mit Sinn für Form, Textur und Konsequenz.", value1:"Schwere Materialien", value1t:"Dichte Stoffe, die ihre Form behalten.", value2:"Kleine Drops", value2t:"Fokussierte Kollektionen in limitierten Runs.", value3:"Designed in Deutschland", value3t:"Minimal, funktional und für den Alltag.",
    footerText:"Moderne Kleidung für Menschen mit eigenem Stil.", footerShop:"Shop", footerHelp:"Hilfe", footerLegal:"Rechtliches", shippingInfo:"Versand", returns:"Retouren", contactUs:"Kontakt", privacy:"Datenschutz", imprint:"Impressum", footerNote:"© RTMN. Dein Style, deine Regeln.",
    filtersTitle:"Verfeinern", category:"Kategorie", size:"Größe", colorFilter:"Farbe", apply:"Filter anwenden", reset:"Zurücksetzen", noResults:"Keine Produkte gefunden", clearFilters:"Filter löschen", searchPlaceholder:"RTMN durchsuchen"
  },
  uk: {
    nav: { shop:"Магазин", new:"Новий дроп", tees:"Футболки", hoodies:"Худі", pants:"Штани" }, search:"Пошук", account:"Профіль", wishlist:"Обране", bag:"Кошик", menu:"Меню", language:"Мова",
    heroKicker:"RTMN / 002 · НІМЕЧЧИНА", heroTitle:"ТВІЙ УНІФОРМ\nТВОЇ ПРАВИЛА.", heroText:"Преміальні базові речі. Щільні матеріали. Чисті силуети на кожен день.", heroPrimary:"Дивитися новий дроп", heroSecondary:"Дивитися essentials", shipping:"Безкоштовна доставка по Німеччині від 100 €", promo:"БЕЗКОШТОВНА ДОСТАВКА ПО НІМЕЧЧИНІ ВІД 100 €", viewAll:"Дивитися все", featured:"Обрані речі", collection:"Актуальна добірка", filters:"Фільтри", sort:"Сортувати", filterAll:"Усі", newest:"Новинки", priceLow:"Ціна: від дешевих", priceHigh:"Ціна: від дорогих", soldOut:"Немає в наявності",
    product:"Товар", add:"Додати в кошик", selectSize:"Оберіть розмір", sizeGuide:"Таблиця розмірів", color:"Колір", fit:"Посадка", material:"Матеріал", details:"Деталі", youMayLike:"Тобі також сподобається", quickAdd:"Швидко додати", viewProduct:"Переглянути товар", close:"Закрити",
    bagTitle:"Твій кошик", empty:"Кошик поки порожній.", continue:"Продовжити покупки", subtotal:"Проміжна сума", shippingLabel:"Доставка", free:"БЕЗКОШТОВНО", total:"Разом", checkout:"Оформити", remove:"Видалити", decrease:"Зменшити", increase:"Збільшити", freeShippingProgress:"Ще {amount} до безкоштовної доставки", freeShippingUnlocked:"Безкоштовну доставку активовано", secure:"Захищене оформлення", delivery:"Німеччина · 2–4 робочі дні",
    checkoutTitle:"Оформлення", back:"Назад", contact:"Контактні дані", deliveryTo:"Доставка по Німеччині", first:"Ім’я", last:"Прізвище", street:"Вулиця", house:"№", zip:"Індекс", city:"Місто", phone:"Телефон", email:"E-mail", note:"Підтвердження замовлення відбувається з тобою в Telegram.", placeOrder:"Відправити замовлення", successTitle:"Запит на замовлення отримано", successText:"Ми отримали твій запит RTMN і підтвердимо замовлення через Telegram.", backShop:"Назад у магазин",
    valuesTitle:"Зроблено інакше.", valuesText:"RTMN — гардероб у дусі Берліна для тих, кому важливі форма, текстура та послідовність.", value1:"Щільні матеріали", value1t:"Тканини, які тримають форму.", value2:"Малі дропи", value2t:"Сфокусовані колекції малими тиражами.", value3:"Дизайн у Німеччині", value3t:"Мінімально, функціонально, на щодень.",
    footerText:"Сучасний одяг для тих, хто знає свій стиль.", footerShop:"Магазин", footerHelp:"Допомога", footerLegal:"Правове", shippingInfo:"Доставка", returns:"Повернення", contactUs:"Контакти", privacy:"Конфіденційність", imprint:"Impressum", footerNote:"© RTMN. Твій стиль, твої правила.",
    filtersTitle:"Налаштувати", category:"Категорія", size:"Розмір", colorFilter:"Колір", apply:"Застосувати", reset:"Скинути", noResults:"Товарів не знайдено", clearFilters:"Очистити фільтри", searchPlaceholder:"Пошук RTMN"
  }
};

const money = value => `€${value.toFixed(2)}`;

function App(){
  const [lang,setLang]=useState(()=>localStorage.getItem("rtmn-lang")||"en");
  const [view,setView]=useState("shop");
  const [category,setCategory]=useState("All");
  const [sort,setSort]=useState("newest");
  const [query,setQuery]=useState("");
  const [searchOpen,setSearchOpen]=useState(false);
  const [filterOpen,setFilterOpen]=useState(false);
  const [selected,setSelected]=useState(null);
  const [selectedSize,setSelectedSize]=useState("");
  const [wishlist,setWishlist]=useState(()=>{try{return JSON.parse(localStorage.getItem("rtmn-wishlist"))||[]}catch{return[]}});
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem("rtmn-cart"))||[]}catch{return[]}});
  const [menuOpen,setMenuOpen]=useState(false);
  const [checkout,setCheckout]=useState(false);
  const [success,setSuccess]=useState(false);

  const t=copy[lang];
  const count=cart.reduce((s,i)=>s+i.qty,0);
  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping=subtotal===0||subtotal>=100?0:4.99;
  const total=subtotal+shipping;

  useEffect(()=>{localStorage.setItem("rtmn-lang",lang); document.documentElement.lang=lang},[lang]);
  useEffect(()=>{localStorage.setItem("rtmn-wishlist",JSON.stringify(wishlist))},[wishlist]);
  useEffect(()=>{localStorage.setItem("rtmn-cart",JSON.stringify(cart))},[cart]);
  useEffect(()=>{const tg=window.Telegram?.WebApp;if(tg){tg.ready();tg.expand?.();tg.setHeaderColor?.("#f6f4ef");tg.setBackgroundColor?.("#f6f4ef");}},[]);
  useEffect(()=>{document.body.style.overflow=(selected||filterOpen||searchOpen||menuOpen||view!=="shop")?"hidden":""; return()=>document.body.style.overflow=""},[selected,filterOpen,searchOpen,menuOpen,view]);

  const filtered=useMemo(()=>{
    let list=products.filter(p=>category==="All"||p.category===category);
    if(query.trim()) list=list.filter(p=>`${p.name} ${p.category} ${p.color}`.toLowerCase().includes(query.toLowerCase()));
    if(sort==="priceLow") list=[...list].sort((a,b)=>a.price-b.price);
    if(sort==="priceHigh") list=[...list].sort((a,b)=>b.price-a.price);
    return list;
  },[category,query,sort]);

  const scrollTo=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMenuOpen(false)};
  const setCat=(c)=>{setCategory(c);setView("shop");setTimeout(()=>scrollTo("catalog"),30)};
  const toggleWishlist=id=>setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
  const add=(p,size)=>{if(!size)return; const key=`${p.id}-${size}`;setCart(c=>{const f=c.find(x=>x.key===key);return f?c.map(x=>x.key===key?{...x,qty:x.qty+1}:x):[...c,{key,id:p.id,name:p.name,price:p.price,size,qty:1,tone:p.tone}]});setSelected(null);setSelectedSize("");setView("cart");window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("light")};
  const updateQty=(key,delta)=>setCart(c=>c.map(x=>x.key===key?{...x,qty:Math.max(1,x.qty+delta)}:x));
  const remove=x=>setCart(c=>c.filter(i=>i.key!==x));
  const openProduct=p=>{setSelected(p);setSelectedSize("");};

  return <div className="site-shell">
    <div className="promo-bar">{t.promo}<span className="promo-dot">•</span> RTMN / 002</div>
    <header className="header">
      <button className="mobile-menu" onClick={()=>setMenuOpen(true)}><Icon name="menu"/></button>
      <button className="logo" onClick={()=>{setView("shop");window.scrollTo({top:0,behavior:"smooth"})}}>RTMN<span>.</span></button>
      <nav className="desktop-nav">
        <button className={category==="All"?"active":""} onClick={()=>setCat("All")}>{t.nav.shop}</button>
        <button onClick={()=>setCat("All")}>{t.nav.new}</button>
        <button onClick={()=>setCat("T-Shirts")}>{t.nav.tees}</button>
        <button onClick={()=>setCat("Hoodies")}>{t.nav.hoodies}</button>
        <button onClick={()=>setCat("Pants")}>{t.nav.pants}</button>
      </nav>
      <div className="header-actions">
        <button aria-label={t.search} onClick={()=>setSearchOpen(true)}><Icon name="search"/></button>
        <div className="lang-inline">{[["en","EN"],["de","DE"],["uk","UA"]].map(([k,v])=><button key={k} className={lang===k?"active":""} onClick={()=>setLang(k)}>{v}</button>)}</div>
        <button className="wishlist-action" aria-label={t.wishlist} onClick={()=>scrollTo("catalog")}><Icon name="heart"/><span>{wishlist.length}</span></button>
        <button className="cart-action" aria-label={t.bag} onClick={()=>setView("cart")}><Icon name="bag"/><span>{count}</span></button>
      </div>
    </header>

    {menuOpen && <div className="mobile-menu-panel" role="dialog"><div className="mobile-menu-head"><span>RTMN</span><button onClick={()=>setMenuOpen(false)}><Icon name="close"/></button></div><div className="mobile-links"><button onClick={()=>setCat("All")}>{t.nav.shop}</button><button onClick={()=>setCat("All")}>{t.nav.new}</button><button onClick={()=>setCat("T-Shirts")}>{t.nav.tees}</button><button onClick={()=>setCat("Hoodies")}>{t.nav.hoodies}</button><button onClick={()=>setCat("Pants")}>{t.nav.pants}</button></div><div className="mobile-lang"><span>{t.language}</span>{[["en","English"],["de","Deutsch"],["uk","Українська"]].map(([k,v])=><button key={k} className={lang===k?"active":""} onClick={()=>setLang(k)}>{v}</button>)}</div></div>}

    {view==="shop" && <main>
      <section className="hero">
        <div className="hero-media">
          <div className="hero-shape hero-shape-a"/><div className="hero-shape hero-shape-b"/><div className="hero-garment"><span>RTMN</span></div>
          <div className="hero-side-label">BERLIN / GERMANY / 2026</div>
          <div className="hero-side-vertical">EVERYDAY / ESSENTIALS</div>
        </div>
        <div className="hero-copy"><div className="eyebrow">{t.heroKicker}</div><h1>{t.heroTitle.split("\n").map((x,i)=><React.Fragment key={x}>{i>0&&<br/>}{x}</React.Fragment>)}</h1><p>{t.heroText}</p><div className="hero-buttons"><button className="button button-dark" onClick={()=>scrollTo("catalog")}>{t.heroPrimary}<Icon name="arrow"/></button><button className="button button-ghost" onClick={()=>scrollTo("story")}>{t.heroSecondary}</button></div><div className="hero-meta"><span>{t.shipping}</span><span>RTMN / 002</span></div></div>
      </section>

      <section className="ticker"><div>{["RTMN", "HEAVY MATERIALS", "SMALL DROPS", "DESIGNED IN GERMANY", "YOUR STYLE, YOUR RULES"].map((x,i)=><React.Fragment key={i}><span>{x}</span><b>✳</b></React.Fragment>)}</div></section>

      <section className="catalog-section" id="catalog">
        <div className="section-head"><div><div className="eyebrow">RTMN / SHOP</div><h2>{t.collection}</h2></div><button className="text-button" onClick={()=>setCategory("All")}>{t.viewAll}<Icon name="arrow"/></button></div>
        <div className="catalog-toolbar"><div className="category-tabs">{cats.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c==="All"?t.filterAll:c}</button>)}</div><div className="toolbar-right"><button className="toolbar-button" onClick={()=>setFilterOpen(true)}><Icon name="filter"/>{t.filters}</button><select value={sort} onChange={e=>setSort(e.target.value)} aria-label={t.sort}><option value="newest">{t.newest}</option><option value="priceLow">{t.priceLow}</option><option value="priceHigh">{t.priceHigh}</option></select></div></div>
        {filtered.length?<div className="product-grid">{filtered.map((p,i)=><ProductCard key={p.id} product={p} t={t} liked={wishlist.includes(p.id)} onLike={()=>toggleWishlist(p.id)} onOpen={()=>openProduct(p)} index={i}/>)}</div>:<div className="no-results"><div className="no-results-mark">RTMN</div><h3>{t.noResults}</h3><button className="button button-dark" onClick={()=>{setCategory("All");setQuery("")}}>{t.clearFilters}</button></div>}
      </section>

      <section className="statement"><div className="statement-mark">RTMN</div><div><div className="eyebrow">001 / PHILOSOPHY</div><h2>{t.valuesTitle}</h2><p>{t.valuesText}</p></div></section>

      <section className="value-grid" id="story">
        <Value icon="bolt" title={t.value1} text={t.value1t}/><Value icon="star" title={t.value2} text={t.value2t}/><Value icon="shield" title={t.value3} text={t.value3t}/>
      </section>

      <section className="editorial"><div className="editorial-copy"><div className="eyebrow">RTMN / EDIT 02</div><h2>Built for repeat wear.</h2><p>One wardrobe. Fewer compromises. Pieces that layer, move and stay relevant beyond one season.</p><button className="text-button" onClick={()=>scrollTo("catalog")}>{t.viewAll}<Icon name="arrow"/></button></div><div className="editorial-art"><div className="editorial-card card-one"><span>01</span><b>FORM</b></div><div className="editorial-card card-two"><span>02</span><b>TEXTURE</b></div><div className="editorial-card card-three"><span>03</span><b>MOTION</b></div></div></section>

      <section className="faq-strip"><div><div className="eyebrow">RTMN / DETAILS</div><h3>Designed to make everyday dressing easier.</h3></div><div className="faq-items"><details><summary>{t.shippingInfo}<Icon name="chevron"/></summary><p>{t.delivery}</p></details><details><summary>{t.returns}<Icon name="chevron"/></summary><p>Returns are handled individually with the RTMN team.</p></details><details><summary>{t.contactUs}<Icon name="chevron"/></summary><p>@RTMN_shop_bot in Telegram.</p></details></div></section>
    </main>}

    {view==="cart" && <CartView t={t} cart={cart} subtotal={subtotal} shipping={shipping} total={total} updateQty={updateQty} remove={remove} onShop={()=>setView("shop")} onCheckout={()=>setCheckout(true)} />}
    {checkout && <CheckoutView t={t} total={total} onBack={()=>setCheckout(false)} onSuccess={()=>{setCheckout(false);setSuccess(true);setCart([])}}/>}
    {success && <SuccessView t={t} onBack={()=>{setSuccess(false);setView("shop")}}/>}

    <footer className="footer"><div className="footer-top"><div className="footer-brand"><div className="footer-logo">RTMN<span>.</span></div><p>{t.footerText}</p><div className="footer-social"><span>IG</span><span>TT</span><span>TG</span></div></div><div className="footer-links"><FooterCol title={t.footerShop} items={[t.nav.shop,t.nav.new,t.nav.tees,t.nav.hoodies,t.nav.pants]}/><FooterCol title={t.footerHelp} items={[t.shippingInfo,t.returns,t.contactUs]}/><FooterCol title={t.footerLegal} items={[t.privacy,t.imprint]}/></div></div><div className="footer-bottom"><span>{t.footerNote}</span><span>DE / EN / UA</span></div></footer>

    {selected && <ProductModal product={selected} t={t} size={selectedSize} setSize={setSelectedSize} onClose={()=>setSelected(null)} onAdd={()=>add(selected,selectedSize)} liked={wishlist.includes(selected.id)} onLike={()=>toggleWishlist(selected.id)}/>} 
    {searchOpen && <SearchModal t={t} query={query} setQuery={setQuery} onClose={()=>setSearchOpen(false)} results={filtered.slice(0,5)} onOpen={openProduct}/>} 
    {filterOpen && <FilterDrawer t={t} category={category} setCategory={setCategory} onClose={()=>setFilterOpen(false)} onApply={()=>setFilterOpen(false)}/>} 
  </div>
}

function ProductCard({product,t,liked,onLike,onOpen,index}){return <article className="product-card" style={{"--delay":`${index*70}ms`}}><div className="product-visual-button"><button className="product-main-click" onClick={onOpen}><div className={`product-art ${product.tone}`}><div className="art-label">RTMN</div><div className="art-shadow"/></div></button><span className="product-badge">{product.badge}</span><span className="product-index">0{product.id}</span><button className={`heart-button ${liked?"liked":""}`} onClick={onLike}><Icon name="heart"/></button></div><div className="product-info"><div><div className="product-category">{product.category}</div><h3>{product.name}</h3><div className="product-sub">{product.color}</div></div><div className="product-price"><span>{money(product.price)}</span>{product.compareAt&&<del>{money(product.compareAt)}</del>}</div></div><div className="product-actions"><button onClick={onOpen}>{t.viewProduct}<Icon name="arrow"/></button><span>{product.sizes.length} sizes</span></div></article>}

function ProductModal({product,t,size,setSize,onClose,onAdd,liked,onLike}){useEffect(()=>{const onKey=e=>e.key==="Escape"&&onClose();window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[onClose]);return <div className="overlay" onMouseDown={onClose}><div className="product-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose}><Icon name="close"/></button><div className="modal-gallery"><div className={`product-art detail ${product.tone}`}><div className="art-label">RTMN</div><div className="art-shadow"/></div><div className="gallery-thumb-row"><div className={`gallery-thumb ${product.tone}`}/><div className={`gallery-thumb ${product.tone} alt`}/><div className={`gallery-thumb ${product.tone} closeup`}/></div></div><div className="modal-content"><div className="modal-eyebrow">{product.category} / {product.badge}</div><div className="modal-title-row"><div><h2>{product.name}</h2><p>{product.description}</p></div><button className={`heart-button ${liked?"liked":""}`} onClick={onLike}><Icon name="heart"/></button></div><div className="modal-price-line"><strong>{money(product.price)}</strong>{product.compareAt&&<del>{money(product.compareAt)}</del>}<span>DE</span></div><div className="spec-row"><span>{t.color}<b>{product.color}</b></span><span>{t.fit}<b>{product.fit}</b></span><span>{t.material}<b>{product.material}</b></span></div><div className="size-head"><b>{t.selectSize}</b><button>{t.sizeGuide}</button></div><div className="size-grid">{product.sizes.map(s=><button key={s} className={size===s?"active":""} onClick={()=>setSize(s)}>{s}</button>)}</div><button className="button button-dark full" onClick={onAdd} disabled={!size}>{size?t.add:t.selectSize}<Icon name="arrow"/></button><div className="detail-list">{product.details.map(d=><div key={d}><Icon name="check"/>{d}</div>)}</div><div className="modal-trust"><span><Icon name="truck"/> {t.delivery}</span><span><Icon name="shield"/> {t.secure}</span></div></div></div></div>}

function CartView({t,cart,subtotal,shipping,total,updateQty,remove,onShop,onCheckout}){return <main className="page-main"><section className="cart-layout"><div><div className="page-kicker">RTMN / BAG</div><h1>{t.bagTitle}</h1>{cart.length===0?<div className="empty-state"><div className="empty-art">RTMN</div><h2>{t.empty}</h2><p>{t.continue}</p><button className="button button-dark" onClick={onShop}>{t.continue}<Icon name="arrow"/></button></div>:<div className="cart-list">{cart.map(item=><div className="cart-row" key={item.key}><div className={`mini-art ${item.tone}`}><span>RTMN</span></div><div className="cart-row-main"><div><div className="cart-name">{item.name}</div><div className="cart-meta">{t.size}: {item.size}</div></div><button className="remove-button" onClick={()=>remove(item.key)}>{t.remove}</button><div className="qty-control"><button onClick={()=>updateQty(item.key,-1)}><Icon name="minus"/></button><span>{item.qty}</span><button onClick={()=>updateQty(item.key,1)}><Icon name="plus"/></button></div><strong>{money(item.price*item.qty)}</strong></div></div>)}</div>}</div>{cart.length>0&&<aside className="summary-card"><div className="free-shipping-box">{shipping===0?<><Icon name="check"/><span>{t.freeShippingUnlocked}</span></>:<><Icon name="truck"/><span>{t.freeShippingProgress.replace("{amount}",money(100-subtotal))}</span></>}</div><div className="summary-lines"><div><span>{t.subtotal}</span><b>{money(subtotal)}</b></div><div><span>{t.shippingLabel}</span><b>{shipping===0?t.free:money(shipping)}</b></div><div className="summary-total"><span>{t.total}</span><b>{money(total)}</b></div></div><button className="button button-dark full" onClick={onCheckout}>{t.checkout}<Icon name="arrow"/></button><button className="summary-back" onClick={onShop}>← {t.continue}</button></aside>}</section></main>}

function CheckoutView({t,total,onBack,onSuccess}){const [form,setForm]=useState({first:"",last:"",street:"",house:"",zip:"",city:"",phone:"",email:""});const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));const valid=Object.values(form).every(Boolean);return <div className="checkout-overlay"><div className="checkout-sheet"><div className="checkout-head"><button onClick={onBack}><Icon name="chevron"/> {t.back}</button><span>RTMN / CHECKOUT</span><b>{money(total)}</b></div><div className="checkout-content"><div><div className="page-kicker">{t.contact}</div><h1>{t.checkoutTitle}</h1><p>{t.note}</p></div><form onSubmit={e=>{e.preventDefault();if(valid)onSuccess()}}><div className="form-section"><h3>{t.contact}</h3><div className="form-grid two"><input required value={form.first} onChange={set("first")} placeholder={t.first}/><input required value={form.last} onChange={set("last")} placeholder={t.last}/></div><div className="form-grid three"><input required value={form.street} onChange={set("street")} placeholder={t.street}/><input required value={form.house} onChange={set("house")} placeholder={t.house}/><input required value={form.zip} onChange={set("zip")} placeholder={t.zip}/></div><input required value={form.city} onChange={set("city")} placeholder={t.city}/><input required value={form.phone} onChange={set("phone")} placeholder={t.phone} inputMode="tel"/><input required value={form.email} onChange={set("email")} placeholder={t.email} type="email"/></div><div className="delivery-box"><div><Icon name="truck"/><div><b>{t.deliveryTo}</b><span>{t.delivery}</span></div></div><strong>{money(total)}</strong></div><button className="button button-dark full" disabled={!valid} type="submit">{t.placeOrder}<Icon name="arrow"/></button></form></div></div></div>}

function SuccessView({t,onBack}){return <div className="success-screen"><div className="success-ring"><Icon name="check" size={32}/></div><div className="page-kicker">RTMN / {t.successTitle.toUpperCase()}</div><h1>{t.successTitle}</h1><p>{t.successText}</p><button className="button button-dark" onClick={onBack}>{t.backShop}<Icon name="arrow"/></button></div>}

function SearchModal({t,query,setQuery,onClose,results,onOpen}){return <div className="overlay"><div className="search-modal"><div className="search-head"><div className="search-input"><Icon name="search"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.searchPlaceholder}/></div><button onClick={onClose}><Icon name="close"/></button></div><div className="search-results">{results.length?results.map(p=><button key={p.id} onClick={()=>{onOpen(p);onClose()}}><div className={`search-art ${p.tone}`}/><div><span>{p.category}</span><b>{p.name}</b></div><strong>{money(p.price)}</strong></button>):<div className="search-empty">{t.noResults}</div>}</div></div></div>}
function FilterDrawer({t,category,setCategory,onClose,onApply}){return <div className="overlay overlay-right"><div className="filter-drawer"><div className="drawer-head"><span>{t.filtersTitle}</span><button onClick={onClose}><Icon name="close"/></button></div><div className="drawer-section"><label>{t.category}</label>{cats.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c==="All"?t.filterAll:c}<span>{category===c?<Icon name="check"/>:null}</span></button>)}</div><div className="drawer-section"><label>{t.size}</label><div className="size-pills">{["XS","S","M","L","XL"].map(s=><button key={s}>{s}</button>)}</div></div><div className="drawer-section"><label>{t.colorFilter}</label><div className="color-pills"><span className="color-dot black"/><span className="color-dot cream"/><span className="color-dot grey"/><span className="color-dot stone"/></div></div><button className="button button-dark full" onClick={onApply}>{t.apply}</button><button className="drawer-reset" onClick={()=>setCategory("All")}>{t.reset}</button></div></div>}
function Value({icon,title,text}){return <div className="value-card"><div className="value-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p></div>}
function FooterCol({title,items}){return <div><h4>{title}</h4>{items.map(i=><a href="#catalog" key={i}>{i}</a>)}</div>}

createRoot(document.getElementById("root")).render(<App/>);
