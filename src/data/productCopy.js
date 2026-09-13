const copy = {
  en: {
    categories: { All: "All", "T-Shirts": "T-Shirts", Hoodies: "Hoodies", Pants: "Pants", Jackets: "Jackets" },
    colors: { "Washed Black": "Washed black", "Faded Charcoal": "Faded charcoal", Stone: "Stone", "Off White": "Off-white", Graphite: "Graphite", "Heather Grey": "Heather grey" },
    fits: { Oversized: "Oversized", Relaxed: "Relaxed", Regular: "Regular", Boxy: "Boxy" },
    products: {
      1: { material: "100% heavyweight cotton", description: "A structured oversized tee with a dense hand-feel, dropped shoulders and a clean RTMN chest mark.", details: ["260 GSM cotton", "Dropped shoulder", "Unisex fit", "Made for daily wear"] },
      2: { material: "480 GSM brushed cotton", description: "Dense brushed cotton, a relaxed hood and a refined silhouette designed to stay in rotation.", details: ["480 GSM", "Brushed inside", "Ribbed cuffs", "Kangaroo pocket"] },
      3: { material: "Cotton ripstop", description: "Relaxed utility trousers with articulated pockets and a clean straight leg.", details: ["Cotton ripstop", "6 utility pockets", "Straight leg", "Adjustable hem"] },
      4: { material: "220 GSM cotton", description: "The everyday layer: compact jersey, regular fit and understated branding.", details: ["220 GSM", "Regular fit", "Soft touch", "Unisex fit"] },
      5: { material: "Cotton nylon blend", description: "A boxy outer layer with technical character and a clean front zip closure.", details: ["Cotton nylon", "Two-way zip", "Hidden pockets", "Boxy silhouette"] },
      6: { material: "420 GSM fleece", description: "Heavy fleece sweatpants with a straight relaxed leg and precise seam placement.", details: ["420 GSM", "Heavy fleece", "Elastic waist", "Relaxed leg"] },
    },
  },
  de: {
    categories: { All: "Alle", "T-Shirts": "T-Shirts", Hoodies: "Hoodies", Pants: "Hosen", Jackets: "Jacken" },
    colors: { "Washed Black": "Washed Black", "Faded Charcoal": "Verwaschenes Anthrazit", Stone: "Stone", "Off White": "Off-White", Graphite: "Graphit", "Heather Grey": "Meliertes Grau" },
    fits: { Oversized: "Oversized", Relaxed: "Locker", Regular: "Regular", Boxy: "Boxy" },
    products: {
      1: { material: "100 % schwere Baumwolle", description: "Strukturiertes Oversized-T-Shirt mit festem Griff, überschnittenen Schultern und klarem RTMN-Logo auf der Brust.", details: ["260 GSM Baumwolle", "Überschnittene Schulter", "Unisex-Fit", "Für den Alltag gemacht"] },
      2: { material: "480 GSM angeraute Baumwolle", description: "Dichte, angeraute Baumwolle, entspannte Kapuze und eine klare Silhouette, die dauerhaft Teil deiner Rotation bleibt.", details: ["480 GSM", "Innen angeraut", "Gerippte Bündchen", "Kängurutasche"] },
      3: { material: "Baumwoll-Ripstop", description: "Lockere Utility-Hose mit geformten Taschen und sauberem, geradem Bein.", details: ["Baumwoll-Ripstop", "6 Utility-Taschen", "Gerades Bein", "Verstellbarer Saum"] },
      4: { material: "220 GSM Baumwolle", description: "Die Schicht für jeden Tag: kompaktes Jersey, regulärer Fit und zurückhaltendes Branding.", details: ["220 GSM", "Regular Fit", "Weicher Griff", "Unisex-Fit"] },
      5: { material: "Baumwoll-Nylon-Mix", description: "Boxige Outer Layer mit technischem Charakter und einem klaren Frontreißverschluss.", details: ["Baumwoll-Nylon", "Zwei-Wege-Zipper", "Verdeckte Taschen", "Boxy-Silhouette"] },
      6: { material: "420 GSM Fleece", description: "Schwere Fleece-Sweatpants mit geradem, lockerem Bein und präziser Nahtführung.", details: ["420 GSM", "Schweres Fleece", "Elastischer Bund", "Locker fallendes Bein"] },
    },
  },
  uk: {
    categories: { All: "Усі", "T-Shirts": "Футболки", Hoodies: "Худі", Pants: "Штани", Jackets: "Куртки" },
    colors: { "Washed Black": "Вимитий чорний", "Faded Charcoal": "Вицвілий графіт", Stone: "Кам’яний", "Off White": "Молочно-білий", Graphite: "Графітовий", "Heather Grey": "Меланжевий сірий" },
    fits: { Oversized: "Oversized", Relaxed: "Вільна", Regular: "Класична", Boxy: "Boxy" },
    products: {
      1: { material: "100% щільна бавовна", description: "Структурована oversize-футболка зі щільною фактурою, спущеними плечима й чистим RTMN-знаком на грудях.", details: ["Бавовна 260 GSM", "Спущена лінія плеча", "Unisex-посадка", "Створена на щодень"] },
      2: { material: "Бавовна з начосом 480 GSM", description: "Щільна бавовна з начосом, вільний капюшон і вивірений силует для постійної ротації.", details: ["480 GSM", "Начіс усередині", "Ребристі манжети", "Кишеня-кенгуру"] },
      3: { material: "Бавовняний ripstop", description: "Вільні utility-штани з функціональними кишенями та чистою прямою лінією штанини.", details: ["Бавовняний ripstop", "6 функціональних кишень", "Пряма штанина", "Регульований низ"] },
      4: { material: "Бавовна 220 GSM", description: "Базовий шар на щодень: щільний jersey, класична посадка та стримане брендування.", details: ["220 GSM", "Класична посадка", "М’яка фактура", "Unisex-посадка"] },
      5: { material: "Суміш бавовни й нейлону", description: "Boxy-верхній шар із технічним характером і чистою передньою застібкою-блискавкою.", details: ["Бавовна й нейлон", "Двостороння блискавка", "Приховані кишені", "Boxy-силует"] },
      6: { material: "Фліс 420 GSM", description: "Щільні флісові штани з прямою вільною штанкою й точно вивіреними швами.", details: ["420 GSM", "Щільний фліс", "Еластичний пояс", "Вільна штанина"] },
    },
  },
};

export function categoryLabel(category, language) {
  return copy[language]?.categories[category] ?? category;
}

export function productText(product, language) {
  const localized = copy[language]?.products[product.id] ?? copy.en.products[product.id];
  return {
    category: categoryLabel(product.category, language),
    color: copy[language]?.colors[product.color] ?? product.color,
    fit: copy[language]?.fits[product.fit] ?? product.fit,
    material: localized.material,
    description: localized.description,
    details: localized.details,
  };
}
