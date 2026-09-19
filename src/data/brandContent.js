// RTMN editorial content is intentionally data-led so new drops, projects and stories
// can be added without changing the storefront structure.

export const shopCategories = [
  { id: "Jackets", label: "JACKETS", note: "Outer layers with a defined shape.", image: "jacket" },
  { id: "Hoodies", label: "HOODIES", note: "Weight, softness and daily rotation.", image: "hoodie" },
  { id: "T-Shirts", label: "T-SHIRTS", note: "The base layer of the system.", image: "tee" },
  { id: "Pants", label: "BOTTOMS", note: "Utility and a clean line.", image: "cargo" },
];

export const campaigns = [
  {
    id: "campaign-01",
    eyebrow: "RTMN / CAMPAIGN 01",
    title: "DROP 001\nSURFACE STUDY",
    description: "A visual study for the first RTMN objects: weight, distance and a changing surface.",
    image: "campaign",
    productIds: [2, 5, 3],
  },
];

// Collections are separate from campaigns: a collection is the available
// product grouping, while a campaign is its visual record.
export const collections = [
  {
    id: "drop-001",
    eyebrow: "CURRENT COLLECTION",
    title: "DROP 001",
    note: "The first six RTMN objects, available in the current drop.",
    campaignId: "campaign-01",
    productIds: [1, 2, 3, 4, 5, 6],
  },
];

export const objectStudies = [
  { productId: 2, object: "OBJECT 002", title: "HEAVYWEIGHT HOODIE", note: "480 GSM brushed cotton. Relaxed fit." },
  { productId: 5, object: "OBJECT 005", title: "ZIP OVERSHIRT", note: "Cotton nylon blend. Boxy silhouette." },
  { productId: 3, object: "OBJECT 003", title: "UTILITY CARGO", note: "Cotton ripstop. Straight relaxed leg." },
];

export const materialStudies = [
  { id: "weight", label: "WEIGHT", title: "480 GSM BRUSHED COTTON", note: "Used in the Heavyweight Hoodie.", productId: 2, image: "material" },
  { id: "structure", label: "STRUCTURE", title: "COTTON RIPSTOP", note: "Used in the Utility Cargo.", productId: 3, image: "cargo" },
  { id: "finish", label: "FINISH", title: "COTTON NYLON BLEND", note: "Used in the Zip Overshirt.", productId: 5, image: "jacket" },
];

export const philosophy = [
  { id: "raw", word: "RAW", statement: "The material stays visible." },
  { id: "true", word: "TRUE", statement: "Objects do the work." },
  { id: "modern", word: "MODERN", statement: "Built for the present." },
  { id: "new", word: "NEW", statement: "The system remains open." },
];

export const projects = [
  {
    id: "campaign-01",
    type: "CAMPAIGN",
    title: "SURFACE STUDY",
    note: "An active visual record for Drop 001.",
    action: "OPEN CAMPAIGN",
  },
];

export const journalEntries = [
  {
    id: "material-note-01",
    eyebrow: "MATERIAL NOTE 01",
    title: "480 GSM\nBRUSHED COTTON",
    summary: "The weight behind OBJECT 002.",
    body: "The Heavyweight Hoodie uses 480 GSM brushed cotton, ribbed cuffs and a kangaroo pocket. Its relaxed fit is part of the object, not an afterthought.",
    image: "material",
    productIds: [2],
  },
  {
    id: "object-note-02",
    eyebrow: "OBJECT NOTE 02",
    title: "COTTON RIPSTOP\nUTILITY CARGO",
    summary: "A straight line with six utility pockets.",
    body: "The Utility Cargo is cut in cotton ripstop with articulated pockets, a straight leg and an adjustable hem. The detail is practical because the object is practical.",
    image: "cargo",
    productIds: [3],
  },
];

export const dropSystem = {
  current: { eyebrow: "CURRENT DROP", title: "DROP 001", note: "The current RTMN objects are available now." },
  next: { eyebrow: "NEXT DROP", title: "COMING SOON", note: "The next entry is announced when it is ready." },
};

export const brandMap = [
  { id: "objects", label: "OBJECTS", target: "selected-objects" },
  { id: "drops", label: "DROPS", target: "catalog" },
  { id: "campaigns", label: "CAMPAIGNS", action: "campaign" },
  { id: "materials", label: "MATERIALS", target: "material-study" },
  { id: "journal", label: "JOURNAL", target: "journal" },
  { id: "projects", label: "PROJECTS", target: "projects" },
  { id: "other-side", label: "OTHER SIDE", target: "other-side" },
];
