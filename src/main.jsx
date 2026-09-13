import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Icon } from "./components/Icon";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { categories, colors, products, sizes } from "./data/products";
import { categoryLabel, productText } from "./data/productCopy";
import { activeFilterCount, emptyFilters, filterProducts, searchProducts } from "./lib/catalog";
import { trackEvent } from "./lib/analytics";
import { money } from "./lib/money";
import { normalizeCart, readCart, readInventory, readLanguage, readProfile, readStoredArray, readTheme, readWishlist, writeStoredArray, writeTheme } from "./lib/storage";
import { initializeTelegram, telegramHaptic } from "./lib/telegram";
import hoodieMoss from "./assets/rtmn-hoodie-moss.png";
import teeStone from "./assets/rtmn-tee-stone.png";
import utilityWood from "./assets/rtmn-utility-wood.png";
import heroSoft from "./assets/rtmn-hero-soft.png";
import materialStudy from "./assets/rtmn-material-study.png";
import technicalJacket from "./assets/rtmn-technical-jacket.png";
import "./styles/rtmn-dark.css";

const productImages = {
  "T-Shirts": teeStone,
  Hoodies: hoodieMoss,
  Pants: utilityWood,
  Jackets: utilityWood,
};

const copy = {
  en: {
    nav: { home:"Home", shop:"Shop", collections:"Collections", new:"New drop", tees:"T-Shirts", hoodies:"Hoodies", pants:"Pants" }, search:"Search", account:"Account", wishlist:"Wishlist", bag:"Bag", menu:"Menu", language:"Language", themeToDark:"Use dark theme", themeToLight:"Use light theme",
    heroKicker:"RTMN / 002 · GERMANY", heroTitle:"YOUR UNIFORM\nYOUR RULES.", heroText:"RAW TRUE MODERN NEW.", heroPrimary:"Shop new drop", heroSecondary:"", shipping:"Free shipping in Germany over €100", promo:"FREE SHIPPING IN GERMANY OVER €100", viewAll:"View all", featured:"Selected pieces", collection:"New drop", filters:"Filters", sort:"Sort", filterAll:"All", newest:"Newest", priceLow:"Price: low to high", priceHigh:"Price: high to low", soldOut:"Sold out",
    product:"Product", add:"Add to bag", selectSize:"Select size", sizeGuide:"Size guide", color:"Color", fit:"Fit", material:"Material", details:"Details", youMayLike:"You may also like", quickAdd:"Quick add", viewProduct:"View product", close:"Close",
    bagTitle:"Your bag", empty:"Your bag is waiting.", continue:"Continue shopping", subtotal:"Subtotal", shippingLabel:"Shipping", free:"FREE", total:"Total", checkout:"Checkout", remove:"Remove", decrease:"Decrease", increase:"Increase", freeShippingProgress:"Add {amount} to unlock free shipping", freeShippingUnlocked:"You unlocked free shipping", secure:"Secure checkout", delivery:"Germany · 2–4 business days",
    checkoutTitle:"Checkout", back:"Back", contact:"Contact", deliveryTo:"Deliver to Germany", first:"First name", last:"Last name", street:"Street", house:"No.", zip:"ZIP", city:"City", phone:"Phone", email:"Email", note:"Order confirmation is handled with you in Telegram.", placeOrder:"Place order", successTitle:"Order request received", successText:"Your RTMN request is in. We’ll confirm the order with you in Telegram.", backShop:"Back to shop",
    valuesTitle:"Built different.", valuesText:"RTMN is a Berlin-inspired wardrobe for people who care about shape, texture and consistency.", value1:"Heavy materials", value1t:"Dense fabrics chosen to hold their shape.", value2:"Small drops", value2t:"Focused collections, released in limited runs.", value3:"Designed in Germany", value3t:"Minimal, functional and made for repeat wear.",
    footerText:"Modern clothing for those who know their style.", footerShop:"Shop", footerHelp:"Help", footerLegal:"Legal", shippingInfo:"Shipping", returns:"Returns", contactUs:"Contact", privacy:"Privacy", imprint:"Imprint", footerNote:"© RTMN. Your style, your rules.",
    filtersTitle:"Refine", category:"Category", size:"Size", colorFilter:"Color", price:"Price", availability:"Availability", allPrices:"All prices", under50:"Under €50", between50And100:"€50–€100", over100:"Over €100", allAvailability:"All availability", inStock:"In stock", apply:"Apply filters", reset:"Reset", noResults:"No pieces found", clearFilters:"Clear filters", searchPlaceholder:"Search RTMN", wishlistTitle:"Your wishlist", wishlistEmpty:"Your saved pieces will appear here.", accountTitle:"Your profile", save:"Save", saved:"Saved", admin:"Admin", adminTitle:"Inventory dashboard", inventory:"Inventory", quantity:"Quantity", controls:"Actions", localOnly:"Local MVP data only", adminDemoText:"These inventory controls are for UI testing only. They are not protected and do not update a live store.", orderSavedTitle:"Order request saved", orderSavedText:"Your request was saved on this device. RTMN will confirm availability and payment before any order is final.", orderReference:"Request", colorNames:{black:"Black",charcoal:"Charcoal",stone:"Stone",cream:"Cream",graphite:"Graphite",grey:"Grey"}
  },
  de: {
    nav: { home:"Start", shop:"Shop", collections:"Kollektionen", new:"New Drop", tees:"T-Shirts", hoodies:"Hoodies", pants:"Hosen" }, search:"Suchen", account:"Konto", wishlist:"Wunschliste", bag:"Warenkorb", menu:"Menü", language:"Sprache", themeToDark:"Dunkles Design aktivieren", themeToLight:"Helles Design aktivieren",
    heroKicker:"RTMN / 002 · DEUTSCHLAND", heroTitle:"DEINE UNIFORM\nDEINE REGELN.", heroText:"RAW TRUE MODERN NEW.", heroPrimary:"New Drop shoppen", heroSecondary:"", shipping:"Kostenloser Versand in Deutschland ab 100 €", promo:"KOSTENLOSER VERSAND IN DEUTSCHLAND AB 100 €", viewAll:"Alle ansehen", featured:"Ausgewählte Pieces", collection:"New Drop", filters:"Filter", sort:"Sortieren", filterAll:"Alle", newest:"Neueste", priceLow:"Preis: niedrig → hoch", priceHigh:"Preis: hoch → niedrig", soldOut:"Ausverkauft",
    product:"Produkt", add:"In den Warenkorb", selectSize:"Größe wählen", sizeGuide:"Größenguide", color:"Farbe", fit:"Fit", material:"Material", details:"Details", youMayLike:"Das könnte dir gefallen", quickAdd:"Schnell hinzufügen", viewProduct:"Produkt ansehen", close:"Schließen",
    bagTitle:"Dein Warenkorb", empty:"Dein Warenkorb wartet.", continue:"Weiter shoppen", subtotal:"Zwischensumme", shippingLabel:"Versand", free:"KOSTENLOS", total:"Gesamt", checkout:"Zur Kasse", remove:"Entfernen", decrease:"Weniger", increase:"Mehr", freeShippingProgress:"Noch {amount} bis kostenloser Versand", freeShippingUnlocked:"Kostenloser Versand freigeschaltet", secure:"Sicherer Checkout", delivery:"Deutschland · 2–4 Werktage",
    checkoutTitle:"Checkout", back:"Zurück", contact:"Kontakt", deliveryTo:"Lieferung innerhalb Deutschlands", first:"Vorname", last:"Nachname", street:"Straße", house:"Nr.", zip:"PLZ", city:"Ort", phone:"Telefon", email:"E-Mail", note:"Die Bestellbestätigung erfolgt anschließend über Telegram.", placeOrder:"Bestellung senden", successTitle:"Bestellanfrage erhalten", successText:"Deine RTMN-Anfrage ist eingegangen. Wir bestätigen die Bestellung mit dir über Telegram.", backShop:"Zurück zum Shop",
    valuesTitle:"Anders gedacht.", valuesText:"RTMN ist eine Berlin-inspirierte Garderobe für Menschen mit Sinn für Form, Textur und Konsequenz.", value1:"Schwere Materialien", value1t:"Dichte Stoffe, die ihre Form behalten.", value2:"Kleine Drops", value2t:"Fokussierte Kollektionen in limitierten Runs.", value3:"Designed in Deutschland", value3t:"Minimal, funktional und für den Alltag.",
    footerText:"Moderne Kleidung für Menschen mit eigenem Stil.", footerShop:"Shop", footerHelp:"Hilfe", footerLegal:"Rechtliches", shippingInfo:"Versand", returns:"Retouren", contactUs:"Kontakt", privacy:"Datenschutz", imprint:"Impressum", footerNote:"© RTMN. Your style, your rules.",
    filtersTitle:"Verfeinern", category:"Kategorie", size:"Größe", colorFilter:"Farbe", price:"Preis", availability:"Verfügbarkeit", allPrices:"Alle Preise", under50:"Unter 50 €", between50And100:"50–100 €", over100:"Über 100 €", allAvailability:"Alle Verfügbarkeiten", inStock:"Auf Lager", apply:"Filter anwenden", reset:"Zurücksetzen", noResults:"Keine Produkte gefunden", clearFilters:"Filter löschen", searchPlaceholder:"RTMN durchsuchen", wishlistTitle:"Deine Wunschliste", wishlistEmpty:"Deine gespeicherten Pieces erscheinen hier.", accountTitle:"Dein Profil", save:"Speichern", saved:"Gespeichert", admin:"Admin", adminTitle:"Inventar-Dashboard", inventory:"Inventar", quantity:"Menge", controls:"Aktionen", localOnly:"Nur lokale MVP-Daten", adminDemoText:"Diese Inventarsteuerung dient nur zum Testen der UI. Sie ist nicht geschützt und aktualisiert keinen Live-Shop.", orderSavedTitle:"Bestellanfrage gespeichert", orderSavedText:"Deine Anfrage wurde auf diesem Gerät gespeichert. RTMN bestätigt Verfügbarkeit und Zahlung, bevor eine Bestellung verbindlich wird.", orderReference:"Anfrage", colorNames:{black:"Schwarz",charcoal:"Anthrazit",stone:"Stein",cream:"Creme",graphite:"Graphit",grey:"Grau"}
  },
  uk: {
    nav: { home:"Головна", shop:"Магазин", collections:"Колекції", new:"Новий дроп", tees:"Футболки", hoodies:"Худі", pants:"Штани" }, search:"Пошук", account:"Профіль", wishlist:"Обране", bag:"Кошик", menu:"Меню", language:"Мова", themeToDark:"Увімкнути темну тему", themeToLight:"Увімкнути світлу тему",
    heroKicker:"RTMN / 002 · НІМЕЧЧИНА", heroTitle:"ТВІЙ УНІФОРМ\nТВОЇ ПРАВИЛА.", heroText:"RAW TRUE MODERN NEW.", heroPrimary:"Дивитися новий дроп", heroSecondary:"", shipping:"Безкоштовна доставка по Німеччині від 100 €", promo:"БЕЗКОШТОВНА ДОСТАВКА ПО НІМЕЧЧИНІ ВІД 100 €", viewAll:"Дивитися все", featured:"Обрані речі", collection:"Новий дроп", filters:"Фільтри", sort:"Сортувати", filterAll:"Усі", newest:"Новинки", priceLow:"Ціна: від дешевих", priceHigh:"Ціна: від дорогих", soldOut:"Немає в наявності",
    product:"Товар", add:"Додати в кошик", selectSize:"Оберіть розмір", sizeGuide:"Таблиця розмірів", color:"Колір", fit:"Посадка", material:"Матеріал", details:"Деталі", youMayLike:"Тобі також сподобається", quickAdd:"Швидко додати", viewProduct:"Переглянути товар", close:"Закрити",
    bagTitle:"Твій кошик", empty:"Кошик поки порожній.", continue:"Продовжити покупки", subtotal:"Проміжна сума", shippingLabel:"Доставка", free:"БЕЗКОШТОВНО", total:"Разом", checkout:"Оформити", remove:"Видалити", decrease:"Зменшити", increase:"Збільшити", freeShippingProgress:"Ще {amount} до безкоштовної доставки", freeShippingUnlocked:"Безкоштовну доставку активовано", secure:"Захищене оформлення", delivery:"Німеччина · 2–4 робочі дні",
    checkoutTitle:"Оформлення", back:"Назад", contact:"Контактні дані", deliveryTo:"Доставка по Німеччині", first:"Ім’я", last:"Прізвище", street:"Вулиця", house:"№", zip:"Індекс", city:"Місто", phone:"Телефон", email:"E-mail", note:"Підтвердження замовлення відбувається з тобою в Telegram.", placeOrder:"Відправити замовлення", successTitle:"Запит на замовлення отримано", successText:"Ми отримали твій запит RTMN і підтвердимо замовлення через Telegram.", backShop:"Назад у магазин",
    valuesTitle:"Зроблено інакше.", valuesText:"RTMN — гардероб у дусі Берліна для тих, кому важливі форма, текстура та послідовність.", value1:"Щільні матеріали", value1t:"Тканини, які тримають форму.", value2:"Малі дропи", value2t:"Сфокусовані колекції малими тиражами.", value3:"Дизайн у Німеччині", value3t:"Мінімально, функціонально, на щодень.",
    footerText:"Сучасний одяг для тих, хто знає свій стиль.", footerShop:"Магазин", footerHelp:"Допомога", footerLegal:"Правове", shippingInfo:"Доставка", returns:"Повернення", contactUs:"Контакти", privacy:"Конфіденційність", imprint:"Impressum", footerNote:"© RTMN. Your style, your rules.",
    filtersTitle:"Налаштувати", category:"Категорія", size:"Розмір", colorFilter:"Колір", price:"Ціна", availability:"Наявність", allPrices:"Усі ціни", under50:"До 50 €", between50And100:"50–100 €", over100:"Від 100 €", allAvailability:"Будь-яка наявність", inStock:"В наявності", apply:"Застосувати", reset:"Скинути", noResults:"Товарів не знайдено", clearFilters:"Очистити фільтри", searchPlaceholder:"Пошук RTMN", wishlistTitle:"Твоє обране", wishlistEmpty:"Тут з’являться збережені речі.", accountTitle:"Твій профіль", save:"Зберегти", saved:"Збережено", admin:"Адмін", adminTitle:"Панель залишків", inventory:"Залишки", quantity:"Кількість", controls:"Дії", localOnly:"Лише локальні MVP-дані", adminDemoText:"Ці елементи керування залишками призначені лише для перевірки UI. Вони не захищені й не оновлюють реальний магазин.", orderSavedTitle:"Заявку на замовлення збережено", orderSavedText:"Заявку збережено на цьому пристрої. RTMN підтвердить наявність і оплату, перш ніж замовлення стане остаточним.", orderReference:"Заявка", colorNames:{black:"Чорний",charcoal:"Вугільний",stone:"Кам’яний",cream:"Кремовий",graphite:"Графітовий",grey:"Сірий"}
  }
};

const commerceCopy = {
  en: { country:"Country", address:"Address", postalCode:"Postal code", shippingMethod:"Shipping method", standard:"Standard delivery · 2–4 business days", checkoutPreview:"Local checkout preview", previewNote:"No payment is taken and no order is sent from this frontend.", privacy:"Your details are used only in this browser preview and are not saved with the request.", required:"Complete this field.", emailError:"Enter a valid email address.", stockLeft:(quantity)=>quantity===1?"Only 1 left":`Only ${quantity} left`, maxStock:"Maximum available quantity reached", sizeGuideText:"Choose your usual size for a relaxed, everyday fit.", previewSaved:"Checkout preview saved", previewSavedText:"Your bag is unchanged. No payment or order was created.", recentlyViewed:"Recently viewed", preferences:"Preferences", notifications:"Product updates", savedPreferences:"Preferences saved locally", accountDemo:"Local account demo", accountDemoText:"Addresses, orders and security will connect when real accounts are available.", name:"Name", email:"Email", language:"Language" },
  de: { country:"Land", address:"Adresse", postalCode:"Postleitzahl", shippingMethod:"Versandart", standard:"Standardversand · 2–4 Werktage", checkoutPreview:"Lokale Checkout-Vorschau", previewNote:"Dieses Frontend nimmt keine Zahlung entgegen und sendet keine Bestellung.", privacy:"Deine Angaben werden nur für diese Browser-Vorschau verwendet und nicht mit der Anfrage gespeichert.", required:"Bitte dieses Feld ausfüllen.", emailError:"Bitte gib eine gültige E-Mail-Adresse ein.", stockLeft:(quantity)=>quantity===1?"Nur noch 1 verfügbar":`Nur noch ${quantity} verfügbar`, maxStock:"Maximal verfügbare Menge erreicht", sizeGuideText:"Wähle deine übliche Größe für einen entspannten Alltags-Fit.", previewSaved:"Checkout-Vorschau gespeichert", previewSavedText:"Dein Warenkorb bleibt unverändert. Es wurde keine Zahlung oder Bestellung erstellt.", recentlyViewed:"Zuletzt angesehen", preferences:"Einstellungen", notifications:"Produkt-Updates", savedPreferences:"Einstellungen lokal gespeichert", accountDemo:"Lokale Konto-Demo", accountDemoText:"Adressen, Bestellungen und Sicherheit werden verbunden, sobald echte Konten verfügbar sind.", name:"Name", email:"E-Mail", language:"Sprache" },
  uk: { country:"Країна", address:"Адреса", postalCode:"Поштовий індекс", shippingMethod:"Спосіб доставки", standard:"Стандартна доставка · 2–4 робочі дні", checkoutPreview:"Локальний preview оформлення", previewNote:"Цей frontend не приймає оплату та не надсилає замовлення.", privacy:"Дані використовуються лише для preview у цьому браузері й не зберігаються разом із заявкою.", required:"Заповніть це поле.", emailError:"Введіть коректну електронну адресу.", stockLeft:(quantity)=>quantity===1?"Залишився 1 товар":`Залишилося ${quantity} товари`, maxStock:"Досягнуто доступний залишок", sizeGuideText:"Обирайте звичний розмір для вільної посадки на щодень.", previewSaved:"Preview оформлення збережено", previewSavedText:"Кошик не змінено. Оплату чи замовлення не створено.", recentlyViewed:"Переглянуті раніше", preferences:"Налаштування", notifications:"Оновлення товарів", savedPreferences:"Налаштування збережено локально", accountDemo:"Локальне демо профілю", accountDemoText:"Адреси, замовлення й безпека стануть доступними після підключення справжніх акаунтів.", name:"Ім’я", email:"E-mail", language:"Мова" }
};

const homeCopy = {
  en: { editorialTitle: "Built for repeat wear.", editorialText: "One wardrobe. Fewer compromises. Pieces that layer, move and stay relevant beyond one season.", detailsTitle: "The essentials, made easier.", shippingText: "Germany delivery takes 2–4 business days. Orders over €100 ship free.", returnsText: "A return policy will be published before RTMN accepts live orders.", contactText: "Contact channels will be announced before launch. This local preview does not send messages." },
  de: { editorialTitle: "Für wiederholtes Tragen gemacht.", editorialText: "Eine Garderobe. Weniger Kompromisse. Pieces zum Layern, Bewegen und Tragen — weit über eine Saison hinaus.", detailsTitle: "Essentials, einfach gemacht.", shippingText: "Die Lieferung innerhalb Deutschlands dauert 2–4 Werktage. Ab 100 € ist sie kostenlos.", returnsText: "Eine Rückgaberichtlinie wird veröffentlicht, bevor RTMN Live-Bestellungen annimmt.", contactText: "Kontaktmöglichkeiten werden vor dem Launch bekannt gegeben. Diese lokale Vorschau sendet keine Nachrichten." },
  uk: { editorialTitle: "Створено, щоб носити знову.", editorialText: "Один гардероб. Менше компромісів. Речі, які легко поєднувати, рухатися в них і носити не один сезон.", detailsTitle: "Базові речі — без зайвого.", shippingText: "Доставка по Німеччині триває 2–4 робочі дні. Від 100 € — безкоштовно.", returnsText: "Умови повернення будуть опубліковані до запуску реальних замовлень RTMN.", contactText: "Канали зв’язку буде оголошено перед запуском. Це локальне демо не надсилає повідомлень." },
};

function useDialogFocus() {
  const dialogRef = useRef(null);
  const previousFocus = useRef(document.activeElement);
  useEffect(() => {
    const selector = "input, button, select, [tabindex]:not([tabindex='-1'])";
    const target = dialogRef.current?.querySelector(selector);
    target?.focus();
    const trapFocus = (event) => {
      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll(selector) ?? [])].filter((element) => !element.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialogRef.current?.addEventListener("keydown", trapFocus);
    return () => {
      dialogRef.current?.removeEventListener("keydown", trapFocus);
      if (previousFocus.current instanceof HTMLElement && document.contains(previousFocus.current)) previousFocus.current.focus();
    };
  }, []);
  return dialogRef;
}

function setMeta(name, content, property = false) {
  const attribute = property ? "property" : "name";
  let element = document.querySelector(`meta[${attribute}='${name}']`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.append(element);
  }
  element.setAttribute("content", content);
}

function App(){
  const [lang,setLang]=useState(readLanguage);
  const [theme,setTheme]=useState(readTheme);
  const [view,setView]=useState("shop");
  const [category,setCategory]=useState("All");
  const [collection,setCollection]=useState("all");
  const [sort,setSort]=useState("newest");
  const [filters,setFilters]=useState(emptyFilters);
  const [query,setQuery]=useState("");
  const [searchOpen,setSearchOpen]=useState(false);
  const [filterOpen,setFilterOpen]=useState(false);
  const [selected,setSelected]=useState(null);
  const [selectedSize,setSelectedSize]=useState("");
  const [inventory,setInventory]=useState(()=>readInventory(products));
  const [wishlist,setWishlist]=useState(()=>readWishlist(products));
  const [cart,setCart]=useState(()=>readCart(products,readInventory(products)));
  const [orderDrafts,setOrderDrafts]=useState(()=>readStoredArray("rtmn-order-drafts"));
  const [profile,setProfile]=useState(readProfile);
  const [recent,setRecent]=useState(()=>readStoredArray("rtmn-recently-viewed").filter((id)=>products.some((product)=>product.id===id)).slice(0,4));
  const [menuOpen,setMenuOpen]=useState(false);
  const [checkout,setCheckout]=useState(false);
  const [success,setSuccess]=useState(null);

  const t={...copy[lang],lang};
  const home=homeCopy[lang];
  const count=cart.reduce((s,i)=>s+i.qty,0);
  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping=subtotal===0||subtotal>=100?0:4.99;
  const total=subtotal+shipping;

  useEffect(()=>{try{localStorage.setItem("rtmn-lang",lang)}catch{}document.documentElement.lang=lang;const pageTitle=selected?`RTMN — ${selected.name}`:`RTMN — ${lang==='uk'?'Сучасні essentials':lang==='de'?'Moderne Essentials':'Modern Essentials'}`;const description=selected?productText(selected,lang).description:"RTMN — modern streetwear essentials designed in Germany.";document.title=pageTitle;setMeta("description",description);setMeta("og:title",pageTitle,true);setMeta("og:description",description,true)},[lang,selected]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;writeTheme(theme);setMeta("theme-color",theme==="dark"?"#0b0b0c":"#f5f2ec");initializeTelegram(theme)},[theme]);
  useEffect(()=>{writeStoredArray("rtmn-wishlist",wishlist)},[wishlist]);
  useEffect(()=>{writeStoredArray("rtmn-cart",cart)},[cart]);
  useEffect(()=>{writeStoredArray("rtmn-order-drafts",orderDrafts)},[orderDrafts]);
  useEffect(()=>{writeStoredArray("rtmn-recently-viewed",recent)},[recent]);
  useEffect(()=>{try{localStorage.setItem("rtmn-profile",JSON.stringify(profile))}catch{}},[profile]);
  useEffect(()=>{try{localStorage.setItem("rtmn-inventory",JSON.stringify(inventory))}catch{}},[inventory]);
  useEffect(()=>{setCart(current=>normalizeCart(current,products,inventory))},[inventory]);
  useEffect(()=>{document.body.style.overflow=(selected||filterOpen||searchOpen||menuOpen||checkout)?"hidden":""; return()=>document.body.style.overflow=""},[selected,filterOpen,searchOpen,menuOpen,checkout]);
  useEffect(()=>{const closeOnEscape=(event)=>{if(event.key!=="Escape")return;if(selected)setSelected(null);else if(filterOpen)setFilterOpen(false);else if(searchOpen)setSearchOpen(false);else if(menuOpen)setMenuOpen(false);else if(checkout)setCheckout(false)};window.addEventListener("keydown",closeOnEscape);return()=>window.removeEventListener("keydown",closeOnEscape)},[selected,filterOpen,searchOpen,menuOpen,checkout]);

  const catalogProducts=useMemo(()=>products.map(product=>({...product,inStock:(inventory[product.id]?.quantity??0)>0})),[inventory]);
  const filtered=useMemo(()=>{const catalog=filterProducts(catalogProducts,{category,query,filters,sort});return collection==="new"?catalog.filter(product=>product.badge==="NEW"):catalog},[catalogProducts,category,collection,query,filters,sort]);
  const searchResults=useMemo(()=>searchProducts(catalogProducts,query).slice(0,5),[catalogProducts,query]);
  const filterCount=activeFilterCount(filters);
  const recentProducts=useMemo(()=>recent.map((id)=>catalogProducts.find((product)=>product.id===id)).filter(Boolean),[recent,catalogProducts]);
  const relatedProducts=useMemo(()=>selected?catalogProducts.filter(product=>product.id!==selected.id).sort((a,b)=>(a.category===selected.category?0:1)-(b.category===selected.category?0:1)).slice(0,3):[],[selected,catalogProducts]);

  const scrollTo=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMenuOpen(false)};
  const setCat=(c)=>{setCollection("all");setCategory(c);trackEvent("catalog_category_selected",{category:c});setView("shop");setTimeout(()=>scrollTo("catalog"),30)};
  const setNewDrop=()=>{setCollection("new");setCategory("All");trackEvent("catalog_collection_selected",{collection:"new"});setView("shop");setTimeout(()=>scrollTo("catalog"),30)};
  const toggleFilter=(field,value)=>setFilters(current=>({...current,[field]:current[field].includes(value)?current[field].filter(item=>item!==value):[...current[field],value]}));
  const toggleWishlist=id=>setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
  const add=(p,size)=>{if(!size||!p.inStock)return;const max=inventory[p.id]?.quantity??0;const allocated=cart.filter(item=>item.id===p.id).reduce((sum,item)=>sum+item.qty,0);if(allocated>=max)return;const key=`${p.id}-${size}`;setCart(c=>{const f=c.find(x=>x.key===key);return f?c.map(x=>x.key===key?{...x,qty:x.qty+1}:x):[...c,{key,id:p.id,name:p.name,price:p.price,size,qty:1,tone:p.tone}]});trackEvent("cart_item_added",{productId:p.id,size});setSelected(null);setSelectedSize("");setView("cart");telegramHaptic("light")};
  const updateQty=(key,delta)=>setCart(c=>c.map(x=>{if(x.key!==key)return x;const stock=inventory[x.id]?.quantity??0;const otherQty=c.filter(item=>item.id===x.id&&item.key!==x.key).reduce((sum,item)=>sum+item.qty,0);const maxForLine=Math.max(0,stock-otherQty);if(delta>0&&x.qty>=maxForLine)return x;return {...x,qty:Math.max(1,Math.min(maxForLine,x.qty+delta))}}).filter(x=>(inventory[x.id]?.quantity??0)>0));
  const remove=x=>setCart(c=>c.filter(i=>i.key!==x));
  const openProduct=p=>{setRecent(current=>[p.id,...current.filter((id)=>id!==p.id)].slice(0,4));setSelected(p);setSelectedSize("");};
  const submitOrder=()=>{const order={id:`RTMN-${Date.now().toString(36).toUpperCase()}`,createdAt:new Date().toISOString(),status:"local_preview",items:cart,total};setOrderDrafts(orders=>[order,...orders].slice(0,10));trackEvent("checkout_preview_saved",{orderId:order.id,total});setCheckout(false);setSuccess(order);};
  const updateInventory=(productId,delta)=>setInventory(current=>({...current,[productId]:{quantity:Math.max(0,Math.min(99,(current[productId]?.quantity??0)+delta))}}));

  return <div className="site-shell">
    <div className="promo-bar">{t.promo}<span className="promo-dot">•</span> RTMN / 002</div>
    <header className="header">
      <button className="mobile-menu" aria-label={t.menu} onClick={()=>setMenuOpen(true)}><Icon name="menu"/></button>
      <button className="logo" onClick={()=>{setView("shop");window.scrollTo({top:0,behavior:"smooth"})}}>RTMN<span>.</span></button>
      <nav className="desktop-nav">
        <button className={collection==="all"&&category==="All"?"active":""} onClick={()=>setCat("All")}>{t.nav.shop}</button>
        <button onClick={()=>{setView("shop");setTimeout(()=>scrollTo("catalog"),30)}}>{t.nav.collections}</button>
        <button className={collection==="new"?"active":""} onClick={setNewDrop}>{t.nav.new}</button>
      </nav>
      <div className="header-actions">
        <button aria-label={t.search} onClick={()=>setSearchOpen(true)}><Icon name="search"/></button>
        <div className="lang-inline">{[["en","EN"],["de","DE"],["uk","UA"]].map(([k,v])=><button key={k} className={lang===k?"active":""} onClick={()=>setLang(k)}>{v}</button>)}</div>
        <button className="theme-toggle" aria-label={theme==="light"?t.themeToDark:t.themeToLight} onClick={()=>setTheme(current=>current==="light"?"dark":"light")}><Icon name={theme==="light"?"moon":"sun"}/></button>
        <button className="account-action" aria-label={t.account} onClick={()=>setView("account")}><Icon name="user"/></button>
        <button className="wishlist-action" aria-label={t.wishlist} onClick={()=>setView("wishlist")}><Icon name="heart"/><span>{wishlist.length}</span></button>
        <button className="cart-action" aria-label={t.bag} onClick={()=>setView("cart")}><Icon name="bag"/><span>{count}</span></button>
      </div>
    </header>

    {menuOpen && <MobileMenu
      t={t}
      lang={lang}
      setLang={setLang}
      count={count}
      onClose={() => setMenuOpen(false)}
      onView={setView}
      onCategory={setCat}
      onNew={setNewDrop}
    />}

    {view==="shop" && <main>
      <section className="hero">
        <div className="hero-media">
          <img className="hero-editorial-image" src={heroSoft} alt="RTMN graphite overshirt in a light stone studio" />
          <div className="hero-side-label">BERLIN / GERMANY / 2026</div>
          <div className="hero-side-vertical">EVERYDAY / ESSENTIALS</div>
        </div>
        <div className="hero-copy"><div className="eyebrow">RTMN / DROP 002</div><h1>YOUR UNIFORM.<br/>YOUR RULES.</h1><p>{t.heroText}</p><div className="hero-buttons"><button className="button button-dark" onClick={()=>scrollTo("catalog")}>{t.heroPrimary}<Icon name="arrow"/></button></div><div className="hero-meta"><span>{t.shipping}</span><span>DESIGNED IN GERMANY</span></div></div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-head"><div><div className="eyebrow">RTMN / SHOP</div><h2>{t.collection}</h2></div><button className="text-button" onClick={()=>setCategory("All")}>{t.viewAll}<Icon name="arrow"/></button></div>
        <div className="catalog-toolbar"><div className="category-tabs"><button className={collection==="new"?"active":""} onClick={setNewDrop}>{t.nav.new}</button>{categories.map(c=><button key={c} className={collection==="all"&&category===c?"active":""} onClick={()=>setCat(c)}>{categoryLabel(c,lang)}</button>)}</div><div className="toolbar-right"><button className="toolbar-button" onClick={()=>setFilterOpen(true)}><Icon name="filter"/>{t.filters}{filterCount>0&&<span className="filter-count">{filterCount}</span>}</button><select value={sort} onChange={e=>setSort(e.target.value)} aria-label={t.sort}><option value="newest">{t.newest}</option><option value="priceLow">{t.priceLow}</option><option value="priceHigh">{t.priceHigh}</option></select></div></div>
        {filtered.length?<div className="product-grid">{filtered.map((p,i)=><ProductCard key={p.id} product={p} t={t} liked={wishlist.includes(p.id)} onLike={()=>toggleWishlist(p.id)} onOpen={()=>openProduct(p)} index={i}/>)}</div>:<div className="no-results"><div className="no-results-mark">RTMN</div><h3>{t.noResults}</h3><button className="button button-dark" onClick={()=>{setCollection("all");setCategory("All");setQuery("")}}>{t.clearFilters}</button></div>}
      </section>

      {recentProducts.length>0&&<section className="catalog-section recent-section"><div className="section-head"><div><div className="eyebrow">RTMN / HISTORY</div><h2>{commerceCopy[lang].recentlyViewed}</h2></div></div><div className="product-grid">{recentProducts.map((p,i)=><ProductCard key={p.id} product={p} t={t} liked={wishlist.includes(p.id)} onLike={()=>toggleWishlist(p.id)} onOpen={()=>openProduct(p)} index={i}/>)}</div></section>}

      <section className="statement"><div className="statement-mark">RTMN</div><div><div className="eyebrow">RAW TRUE MODERN NEW</div><h2>{t.valuesTitle}</h2><p>{t.valuesText}</p></div></section>

      <section className="value-grid" id="story">
        <Value icon="bolt" title={t.value1} text={t.value1t}/><Value icon="star" title={t.value2} text={t.value2t}/><Value icon="shield" title={t.value3} text={t.value3t}/>
      </section>

      <section className="editorial"><div className="editorial-copy"><div className="eyebrow">RTMN / EDIT 02</div><h2>{home.editorialTitle}</h2><p>{home.editorialText}</p><button className="text-button" onClick={()=>scrollTo("catalog")}>{t.viewAll}<Icon name="arrow"/></button></div><div className="editorial-art"><button className="editorial-image-card material" onClick={()=>setCat("Hoodies")}><img src={materialStudy} alt="RTMN graphite crewneck" loading="lazy"/><span>01</span><b>MATERIAL STUDY</b></button><button className="editorial-image-card technical" onClick={()=>setCat("Jackets")}><img src={technicalJacket} alt="RTMN technical jacket" loading="lazy"/><span>02</span><b>UTILITY / 02</b></button></div></section>

      <InfoPanel t={t} home={home} />
    </main>}

    {view==="cart" && <CartView t={t} ui={commerceCopy[lang]} cart={cart} inventory={inventory} subtotal={subtotal} shipping={shipping} total={total} updateQty={updateQty} remove={remove} onShop={()=>setView("shop")} onCheckout={()=>setCheckout(true)} />}
    {view==="wishlist" && <WishlistView t={t} items={catalogProducts.filter(product=>wishlist.includes(product.id))} onOpen={openProduct} onRemove={toggleWishlist} onShop={()=>setView("shop")}/>}
    {view==="account" && <AccountView t={t} ui={commerceCopy[lang]} profile={profile} setProfile={setProfile} lang={lang} setLang={setLang} onAdmin={()=>setView("admin")} onShop={()=>setView("shop")}/>}
    {view==="admin" && <AdminView t={t} products={catalogProducts} inventory={inventory} updateInventory={updateInventory} onShop={()=>setView("shop")}/>}
    {checkout && <CheckoutView t={t} ui={commerceCopy[lang]} cart={cart} subtotal={subtotal} shipping={shipping} total={total} onBack={()=>setCheckout(false)} onSuccess={submitOrder}/>}
    {success && <SuccessView t={t} ui={commerceCopy[lang]} order={success} onBack={()=>{setSuccess(null);setView("cart")}}/>}

    <footer className="footer"><div className="footer-top"><div className="footer-brand"><div className="footer-logo">RTMN<span>.</span></div><p>{t.footerText}</p><div className="footer-local">LOCAL FRONTEND PREVIEW</div></div><div className="footer-links"><FooterCol title={t.footerShop} items={[t.nav.shop,t.nav.new,t.nav.tees,t.nav.hoodies,t.nav.pants]}/><FooterCol title={t.footerHelp} items={[t.shippingInfo,t.returns,t.contactUs]}/><FooterCol title={t.footerLegal} items={[t.privacy,t.imprint]}/></div></div><div className="footer-bottom"><span>{t.footerNote}</span><span>DE / EN / UA</span></div></footer>

    <nav className="mobile-bottom-nav" aria-label={t.menu}>
      <button className={view==="shop"?"active":""} onClick={()=>{setView("shop");window.scrollTo({top:0,behavior:"smooth"})}}><Icon name="home"/>{t.nav.home}</button>
      <button onClick={()=>setCat("All")}><Icon name="grid"/>{t.nav.shop}</button>
      <button onClick={()=>setSearchOpen(true)}><Icon name="search"/>{t.search}</button>
      <button className={view==="wishlist"?"active":""} onClick={()=>setView("wishlist")}><span className="mobile-nav-icon"><Icon name="heart"/>{wishlist.length>0&&<b>{wishlist.length}</b>}</span>{t.wishlist}</button>
      <button className={view==="account"?"active":""} onClick={()=>setView("account")}><Icon name="user"/>{t.account}</button>
      <button className={view==="cart"?"active":""} onClick={()=>setView("cart")}><span className="mobile-nav-icon"><Icon name="bag"/>{count>0&&<b>{count}</b>}</span>{t.bag}</button>
    </nav>

    {selected && <ProductModal
      product={selected}
      t={t}
      ui={commerceCopy[lang]}
      available={Math.max(0, (inventory[selected.id]?.quantity ?? 0) - cart.filter(item => item.id === selected.id).reduce((sum, item) => sum + item.qty, 0))}
      related={relatedProducts}
      size={selectedSize}
      setSize={setSelectedSize}
      onClose={() => setSelected(null)}
      onAdd={() => add(selected, selectedSize)}
      liked={wishlist.includes(selected.id)}
      onLike={() => toggleWishlist(selected.id)}
      onOpenRelated={openProduct}
    />}
    {searchOpen && <SearchModal t={t} query={query} setQuery={setQuery} onClose={()=>setSearchOpen(false)} results={searchResults} onOpen={openProduct}/>}
    {filterOpen && <FilterDrawer t={t} category={category} setCategory={setCategory} filters={filters} toggleFilter={toggleFilter} setFilters={setFilters} onClose={()=>setFilterOpen(false)} onApply={()=>setFilterOpen(false)}/>}
  </div>
}

function ProductCard({product,t,liked,onLike,onOpen,index}){
  const text=productText(product,t.lang);
  const sizeCount=t.lang==="de"?`${product.sizes.length} Größen`:t.lang==="uk"?`${product.sizes.length} розмірів`:`${product.sizes.length} sizes`;
  const image=productImages[product.category] ?? teeStone;
  return <article className="product-card" style={{"--delay":`${index*70}ms`}}>
    <div className="product-visual-button">
      <button className="product-main-click" onClick={onOpen} aria-label={`${t.viewProduct}: ${product.name}`}>
        <div className={`product-art ${product.tone}`}><img src={image} alt={`${product.name} — RTMN`} loading="lazy"/></div>
      </button>
      <span className="product-index">0{product.id}</span>
      <button aria-label={t.wishlist} className={`heart-button ${liked?"liked":""}`} onClick={onLike}><Icon name="heart"/></button>
    </div>
    <div className="product-info"><div><div className="product-category">{text.category}</div><h3>{product.name}</h3><div className="product-sub">{text.color}</div></div><div className="product-price"><span>{money(product.price)}</span>{product.compareAt&&<del>{money(product.compareAt)}</del>}</div></div>
    <div className="product-actions"><button onClick={onOpen}>{t.viewProduct}<Icon name="arrow"/></button><span>{product.inStock?sizeCount:t.soldOut}</span></div>
  </article>
}

function MobileMenu({t,lang,setLang,count,onClose,onView,onCategory,onNew}){
  const dialogRef=useDialogFocus();
  const openView=view=>{onView(view);onClose();};
  const openCategory=category=>{onCategory(category);onClose();};
  return <div ref={dialogRef} className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label={t.menu}><div className="mobile-menu-head"><span>RTMN</span><button aria-label={t.close} onClick={onClose}><Icon name="close"/></button></div><div className="mobile-quick-links"><button onClick={()=>openView("wishlist")}>{t.wishlist}</button><button onClick={()=>openView("cart")}>{t.bag} ({count})</button><button onClick={()=>openView("account")}>{t.account}</button></div><div className="mobile-links"><button onClick={()=>openCategory("All")}>{t.nav.shop}</button><button onClick={()=>{onNew();onClose()}}>{t.nav.new}</button><button onClick={()=>openCategory("T-Shirts")}>{t.nav.tees}</button><button onClick={()=>openCategory("Hoodies")}>{t.nav.hoodies}</button><button onClick={()=>openCategory("Pants")}>{t.nav.pants}</button><button onClick={()=>openCategory("Jackets")}>{categoryLabel("Jackets",lang)}</button></div><div className="mobile-lang"><span>{t.language}</span>{[["en","English"],["de","Deutsch"],["uk","Українська"]].map(([code,label])=><button key={code} className={lang===code?"active":""} onClick={()=>setLang(code)}>{label}</button>)}</div></div>
}

function ProductModal({product,t,ui,available,related,size,setSize,onClose,onAdd,liked,onLike,onOpenRelated}){
  const text=productText(product,t.lang);
  const dialogRef=useDialogFocus();
  const [gallery,setGallery]=useState("product");
  const image=productImages[product.category] ?? teeStone;
  useEffect(()=>{const onKey=e=>e.key==="Escape"&&onClose();window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[onClose]);
  useEffect(()=>setGallery("product"),[product.id]);
  const canAdd=product.inStock&&available>0;
  return <div className="overlay" onMouseDown={onClose}>
    <div ref={dialogRef} className="product-modal" role="dialog" aria-modal="true" aria-label={product.name} onMouseDown={e=>e.stopPropagation()}>
      <button className="modal-close" aria-label={t.close} onClick={onClose}><Icon name="close"/></button>
      <div className="modal-gallery">
        <div className="gallery-stage">
          {gallery==="product"&&<img src={image} alt={`${product.name} — RTMN`}/>}
          {gallery==="fabric"&&<div className="gallery-information fabric-slide"><div><span>RTMN / MATERIAL</span><strong>{text.material}</strong><p>{text.details[0]} · {text.fit}</p></div></div>}
          {gallery==="specs"&&<div className="gallery-information spec-slide"><span>RTMN / SPEC</span><strong>{product.name}</strong><div><b>{t.material}<em>{text.material}</em></b><b>{t.fit}<em>{text.fit}</em></b><b>{t.size}<em>{product.sizes.join(" · ")}</em></b></div></div>}
        </div>
        <div className="gallery-thumb-row" role="tablist" aria-label={`${product.name} gallery`}>
          <button className={gallery==="product"?"active":""} role="tab" aria-selected={gallery==="product"} onClick={()=>setGallery("product")}><img src={image} alt=""/></button>
          <button className={gallery==="fabric"?"active":""} role="tab" aria-selected={gallery==="fabric"} onClick={()=>setGallery("fabric")}>FABRIC</button>
          <button className={gallery==="specs"?"active":""} role="tab" aria-selected={gallery==="specs"} onClick={()=>setGallery("specs")}>SPEC</button>
        </div>
      </div>
      <div className="modal-content"><div className="modal-eyebrow">{text.category} / {product.badge}</div><div className="modal-title-row"><div><h2>{product.name}</h2><p>{text.description}</p></div><button aria-label={t.wishlist} className={`heart-button ${liked?"liked":""}`} onClick={onLike}><Icon name="heart"/></button></div><div className="modal-price-line"><strong>{money(product.price)}</strong>{product.compareAt&&<del>{money(product.compareAt)}</del>}<span>{canAdd?ui.stockLeft(available):t.soldOut}</span></div><div className="spec-row"><span>{t.color}<b>{text.color}</b></span><span>{t.fit}<b>{text.fit}</b></span><span>{t.material}<b>{text.material}</b></span></div><div className="size-head"><b>{t.selectSize}</b><details className="size-guide"><summary>{t.sizeGuide}</summary><p>{ui.sizeGuideText}</p></details></div><div className="size-grid">{product.sizes.map(s=><button key={s} className={size===s?"active":""} onClick={()=>setSize(s)}>{s}</button>)}</div><button className="button button-dark full" onClick={onAdd} disabled={!size||!canAdd}>{canAdd?(size?t.add:t.selectSize):t.soldOut}<Icon name="arrow"/></button><div className="detail-list">{text.details.map(d=><div key={d}><Icon name="check"/>{d}</div>)}</div><section className="related-products" aria-label={t.youMayLike}><h3>{t.youMayLike}</h3><div>{related.map(item=>{const relatedText=productText(item,t.lang);return <button key={item.id} onClick={()=>onOpenRelated(item)}><span><small>{relatedText.category}</small><b>{item.name}</b></span><strong>{money(item.price)}<Icon name="arrow" size={14}/></strong></button>})}</div></section><div className="modal-trust"><span><Icon name="truck"/> {t.delivery}</span><span><Icon name="shield"/> {t.secure}</span></div></div>
    </div>
  </div>
}

function CartView({t,ui,cart,inventory,subtotal,shipping,total,updateQty,remove,onShop,onCheckout}){return <main className="page-main"><section className="cart-layout"><div><div className="page-kicker">RTMN / BAG</div><h1>{t.bagTitle}</h1>{cart.length===0?<div className="empty-state"><div className="empty-art">RTMN</div><h2>{t.empty}</h2><p className="dialog-note">{ui.previewNote}</p><button className="button button-dark" onClick={onShop}>{t.continue}<Icon name="arrow"/></button></div>:<div className="cart-list">{cart.map(item=>{const stock=inventory[item.id]?.quantity??0;const otherQty=cart.filter(line=>line.id===item.id&&line.key!==item.key).reduce((sum,line)=>sum+line.qty,0);const maxForLine=Math.max(0,stock-otherQty);return <div className="cart-row" key={item.key}><div className={`mini-art ${item.tone}`}><span>RTMN</span></div><div className="cart-row-main"><div><div className="cart-name">{item.name}</div><div className="cart-meta">{t.size}: {item.size}</div>{stock<=3&&<div className={`stock-note ${stock===0?"sold":"low"}`}>{stock===0?t.soldOut:ui.stockLeft(stock)}</div>}</div><button className="remove-button" onClick={()=>remove(item.key)}>{t.remove}</button><div className="qty-control"><button aria-label={t.decrease} onClick={()=>updateQty(item.key,-1)} disabled={item.qty<=1}><Icon name="minus"/></button><span>{item.qty}</span><button aria-label={item.qty>=maxForLine?ui.maxStock:t.increase} onClick={()=>updateQty(item.key,1)} disabled={item.qty>=maxForLine}><Icon name="plus"/></button></div><strong>{money(item.price*item.qty)}</strong></div></div>})}</div>}</div>{cart.length>0&&<aside className="summary-card"><div className="free-shipping-box">{shipping===0?<><Icon name="check"/><span>{t.freeShippingUnlocked}</span></>:<><Icon name="truck"/><span>{t.freeShippingProgress.replace("{amount}",money(100-subtotal))}</span></>}</div><div className="summary-lines"><div><span>{t.subtotal}</span><b>{money(subtotal)}</b></div><div><span>{t.shippingLabel}</span><b>{shipping===0?t.free:money(shipping)}</b></div><div className="summary-total"><span>{t.total}</span><b>{money(total)}</b></div></div><p className="dialog-note">{ui.checkoutPreview} · {ui.previewNote}</p><button className="button button-dark full" onClick={onCheckout}>{t.checkout}<Icon name="arrow"/></button><button className="summary-back" onClick={onShop}>← {t.continue}</button></aside>}</section></main>}

function CheckoutView({t,ui,cart,subtotal,shipping,total,onBack,onSuccess}){
  const dialogRef=useDialogFocus();
  const [form,setForm]=useState({first:"",last:"",email:"",phone:"",country:"Germany",city:"",address:"",postalCode:"",shipping:"standard"});
  const [errors,setErrors]=useState({});
  const set=key=>event=>{setForm(current=>({...current,[key]:event.target.value}));setErrors(current=>({...current,[key]:""}))};
  const submit=event=>{event.preventDefault();const next={};["first","last","phone","country","city","address","postalCode"].forEach(key=>{if(!form[key].trim())next[key]=ui.required});if(!/^\S+@\S+\.\S+$/.test(form.email))next.email=ui.emailError;setErrors(next);if(Object.keys(next).length===0)onSuccess()};
  const field=(key,label,type="text")=><label className={errors[key]?"field invalid":"field"}><span>{label}</span><input type={type} value={form[key]} onChange={set(key)} aria-invalid={Boolean(errors[key])} autoComplete={key==="email"?"email":undefined}/>{errors[key]&&<small role="alert">{errors[key]}</small>}</label>;
  return <div ref={dialogRef} className="checkout-overlay" role="dialog" aria-modal="true" aria-label={ui.checkoutPreview}>
    <div className="checkout-sheet">
      <div className="checkout-head"><button onClick={onBack}><Icon name="chevron"/> {t.back}</button><span>RTMN / CHECKOUT</span><b>{money(total)}</b></div>
      <div className="checkout-content">
        <div className="checkout-form-column">
          <div className="checkout-intro"><div className="page-kicker">{ui.checkoutPreview}</div><h1>{t.checkoutTitle}</h1><p>{ui.previewNote}</p><p className="dialog-note">{ui.privacy}</p></div>
          <form noValidate onSubmit={submit}><div className="form-section"><h3>{t.contact}</h3><div className="form-grid two">{field("first",t.first)}{field("last",t.last)}</div>{field("email",t.email,"email")}{field("phone",t.phone,"tel")}<div className="form-grid two">{field("country",ui.country)}{field("city",t.city)}</div>{field("address",ui.address)}<div className="form-grid two">{field("postalCode",ui.postalCode)}<label className="field"><span>{ui.shippingMethod}</span><select value={form.shipping} onChange={set("shipping")}><option value="standard">{ui.standard}</option></select></label></div></div><div className="delivery-box"><div><Icon name="truck"/><div><b>{ui.standard}</b><span>{t.delivery}</span></div></div></div><button className="button button-dark full" type="submit">{t.checkout}<Icon name="arrow"/></button></form>
        </div>
        <aside className="checkout-summary" aria-label={t.bagTitle}><div className="page-kicker">{t.bagTitle}</div><div className="checkout-summary-items">{cart.map(item=><div key={item.key}><span><b>{item.name}</b><small>{t.size}: {item.size} · ×{item.qty}</small></span><strong>{money(item.price*item.qty)}</strong></div>)}</div><div className="summary-lines"><div><span>{t.subtotal}</span><b>{money(subtotal)}</b></div><div><span>{t.shippingLabel}</span><b>{shipping===0?t.free:money(shipping)}</b></div><div className="summary-total"><span>{t.total}</span><b>{money(total)}</b></div></div></aside>
      </div>
    </div>
  </div>
}

function SuccessView({t,ui,order,onBack}){return <div className="success-screen" role="status" aria-live="polite"><div className="success-ring"><Icon name="check" size={32}/></div><div className="page-kicker">RTMN / LOCAL PREVIEW</div><h1>{ui.previewSaved}</h1><p>{ui.previewSavedText}</p><p className="order-reference">{t.orderReference}: <b>{order.id}</b></p><button className="button button-dark" onClick={onBack}>{t.backShop}<Icon name="arrow"/></button></div>}

function WishlistView({t,items,onOpen,onRemove,onShop}){return <main className="page-main wishlist-page"><div className="page-kicker">RTMN / WISHLIST</div><h1>{t.wishlistTitle}</h1>{items.length?<div className="product-grid">{items.map((product,index)=><ProductCard key={product.id} product={product} t={t} liked onLike={()=>onRemove(product.id)} onOpen={()=>onOpen(product)} index={index}/>)}</div>:<div className="empty-state"><div className="empty-art">RTMN</div><h2>{t.wishlistEmpty}</h2><button className="button button-dark" onClick={onShop}>{t.continue}<Icon name="arrow"/></button></div>}</main>}

function AccountView({t,ui,profile,setProfile,lang,setLang,onAdmin,onShop}){const [saved,setSaved]=useState(false);const update=key=>event=>{setSaved(false);setProfile(current=>({...current,[key]:event.target.value}))};const chooseLanguage=language=>{setSaved(false);setLang(language);setProfile(current=>({...current,language}))};return <main className="page-main account-page"><div className="page-kicker">RTMN / ACCOUNT</div><h1>{t.accountTitle}</h1><p className="mvp-note"><b>{ui.accountDemo}</b> · {ui.accountDemoText}</p><form className="account-form" onSubmit={event=>{event.preventDefault();setSaved(true);trackEvent("profile_saved")}}><label>{ui.name}<input value={profile.name} onChange={update("name")} autoComplete="name"/></label><label>{ui.email}<input type="email" value={profile.email} onChange={update("email")} autoComplete="email"/></label><fieldset className="account-preferences"><legend>{ui.preferences}</legend><label className="preference-toggle"><input type="checkbox" checked={profile.notifications} onChange={event=>{setSaved(false);setProfile(current=>({...current,notifications:event.target.checked}))}}/><span>{ui.notifications}</span></label><div className="language-preference"><span>{ui.language}</span><div>{[["en","EN"],["de","DE"],["uk","UA"]].map(([code,label])=><button type="button" key={code} className={lang===code?"active":""} onClick={()=>chooseLanguage(code)}>{label}</button>)}</div></div></fieldset><button className="button button-dark" type="submit">{saved?t.saved:t.save}</button>{saved&&<p className="form-saved" role="status">{ui.savedPreferences}</p>}</form><div className="account-actions"><button className="text-button" onClick={onAdmin}>{t.admin}<Icon name="arrow"/></button><button className="text-button" onClick={onShop}>{t.continue}<Icon name="arrow"/></button></div></main>}

function AdminView({t,products,inventory,updateInventory,onShop}){return <main className="page-main admin-page"><div className="page-kicker">RTMN / ADMIN DEMO</div><div className="admin-heading"><div><h1>{t.adminTitle}</h1><p className="mvp-note"><b>{t.localOnly}</b><br/>{t.adminDemoText}</p></div><button className="button button-ghost" onClick={onShop}>{t.continue}</button></div><div className="inventory-table" role="table" aria-label={t.inventory}><div className="inventory-row inventory-head" role="row"><span>{t.product}</span><span>{t.quantity}</span><span>{t.controls}</span></div>{products.map(product=><div className="inventory-row" role="row" key={product.id}><span>{product.name}<small>{product.inStock?t.inStock:t.soldOut}</small></span><b aria-live="polite">{inventory[product.id]?.quantity??0}</b><div><button aria-label={`Decrease ${product.name}`} onClick={()=>updateInventory(product.id,-1)}><Icon name="minus"/></button><button aria-label={`Increase ${product.name}`} onClick={()=>updateInventory(product.id,1)}><Icon name="plus"/></button></div></div>)}</div></main>}

function SearchModal({t,query,setQuery,onClose,results,onOpen}){const dialogRef=useDialogFocus();return <div className="overlay" onMouseDown={onClose}><div ref={dialogRef} className="search-modal" role="dialog" aria-modal="true" aria-label={t.search} onMouseDown={event=>event.stopPropagation()}><div className="search-head"><div className="search-input"><Icon name="search"/><input autoFocus aria-label={t.search} value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.searchPlaceholder}/></div><button aria-label={t.close} onClick={onClose}><Icon name="close"/></button></div><div className="search-results">{results.length?results.map(p=>{const text=productText(p,t.lang);return <button key={p.id} onClick={()=>{onOpen(p);onClose()}}><img className="search-art" src={productImages[p.category] ?? teeStone} alt=""/><div><span>{text.category}</span><b>{p.name}</b></div><strong>{money(p.price)}</strong></button>}):<div className="search-empty">{t.noResults}</div>}</div></div></div>}
function FilterDrawer({t,category,setCategory,filters,toggleFilter,setFilters,onClose,onApply}){
  const dialogRef=useDialogFocus();
  const prices=[['all',t.allPrices],['under50',t.under50],['50to100',t.between50And100],['over100',t.over100]];
  const availability=[['all',t.allAvailability],['inStock',t.inStock]];
  const reset=()=>{setCategory('All');setFilters(emptyFilters());};
  return <div className="overlay overlay-right" onMouseDown={onClose}>
    <aside ref={dialogRef} className="filter-drawer" role="dialog" aria-modal="true" aria-label={t.filtersTitle} onMouseDown={event=>event.stopPropagation()}>
      <div className="drawer-head"><span>{t.filtersTitle}</span><button aria-label={t.close} onClick={onClose}><Icon name="close"/></button></div>
      <div className="drawer-section"><label>{t.category}</label>{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{categoryLabel(c,t.lang)}<span>{category===c?<Icon name="check"/>:null}</span></button>)}</div>
      <div className="drawer-section"><label>{t.size}</label><div className="size-pills">{sizes.map(size=><button key={size} className={filters.sizes.includes(size)?"active":""} aria-pressed={filters.sizes.includes(size)} onClick={()=>toggleFilter('sizes',size)}>{size}</button>)}</div></div>
      <div className="drawer-section"><label>{t.colorFilter}</label><div className="color-pills">{colors.map(color=><button key={color} className={`color-dot ${color} ${filters.colors.includes(color)?'active':''}`} aria-label={t.colorNames[color]} aria-pressed={filters.colors.includes(color)} onClick={()=>toggleFilter('colors',color)}/>)}</div></div>
      <div className="drawer-section"><label>{t.price}</label><div className="filter-choice-list">{prices.map(([value,label])=><button key={value} className={filters.price===value?'active':''} onClick={()=>setFilters(current=>({...current,price:value}))}>{label}<span>{filters.price===value?<Icon name="check"/>:null}</span></button>)}</div></div>
      <div className="drawer-section"><label>{t.availability}</label><div className="filter-choice-list">{availability.map(([value,label])=><button key={value} className={filters.availability===value?'active':''} onClick={()=>setFilters(current=>({...current,availability:value}))}>{label}<span>{filters.availability===value?<Icon name="check"/>:null}</span></button>)}</div></div>
      <button className="button button-dark full" onClick={onApply}>{t.apply}</button><button className="drawer-reset" onClick={reset}>{t.reset}</button>
    </aside>
  </div>
}
function InfoPanel({t,home}){
  const [active,setActive]=useState("shipping");
  const items=[
    {id:"shipping",label:t.shippingInfo,text:home.shippingText},
    {id:"returns",label:t.returns,text:home.returnsText},
    {id:"contact",label:t.contactUs,text:home.contactText},
  ];
  const current=items.find(item=>item.id===active)??items[0];
  return <section className="faq-strip" id="details"><div><div className="eyebrow">RTMN / DETAILS</div><h3>{home.detailsTitle}</h3></div><div className="info-menu"><div className="info-menu-list" role="tablist" aria-label={home.detailsTitle}>{items.map(item=><button key={item.id} id={"details-tab-"+item.id} className={current.id===item.id?"active":""} role="tab" aria-selected={current.id===item.id} aria-controls={"details-panel-"+item.id} onMouseEnter={()=>setActive(item.id)} onFocus={()=>setActive(item.id)} onClick={()=>setActive(item.id)}><span>{item.label}</span><Icon name="arrow" size={15}/></button>)}</div><div className="info-panel" id={"details-panel-"+current.id} role="tabpanel" aria-labelledby={"details-tab-"+current.id}><span>RTMN / {current.id.toUpperCase()}</span><p>{current.text}</p></div></div></section>
}
function Value({icon,title,text}){return <div className="value-card"><div className="value-icon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p></div>}
function FooterCol({title,items}){return <div><h4>{title}</h4>{items.map(i=><span key={i}>{i}</span>)}</div>}

createRoot(document.getElementById("root")).render(<ErrorBoundary><App/></ErrorBoundary>);
