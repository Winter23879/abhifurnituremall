export interface Hotspot {
  id: string;
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  productId: string;
  title: string;
  priceNote: string;
}

export interface ArchitecturalSpace {
  id: string;
  title: string;
  japaneseSubtitle: string;
  location: string;
  architect: string;
  concept: string;
  image: string;
  hotspots: Hotspot[];
}

export const SPACES: ArchitecturalSpace[] = [
  {
    id: 'amaravati-pavilion',
    title: 'Amaravati Courtyard Pavilion',
    japaneseSubtitle: 'విజయవాడ · సామరస్యం',
    location: 'Vijayawada, Andhra Pradesh',
    architect: 'Studio Kanso Architects',
    concept: 'An open-air living sanctuary where indoor warmth meets shaded courtyard greenery along the Krishna River corridor. Low furniture proportions frame continuous horizontal views.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    hotspots: [
      {
        id: 'hs-1',
        xPercent: 32,
        yPercent: 62,
        productId: 'komorebi-lounge-chair',
        title: 'Komorebi Lounge Chair in White Oak & Bouclé',
        priceNote: '₹44,500',
      },
      {
        id: 'hs-2',
        xPercent: 54,
        yPercent: 74,
        productId: 'yugen-travertine-coffee-table',
        title: 'Yūgen Honed Travertine Table',
        priceNote: '₹49,500',
      },
      {
        id: 'hs-3',
        xPercent: 78,
        yPercent: 48,
        productId: 'tsuki-washi-pendant',
        title: 'Tsuki Washi Pendant Luminaire',
        priceNote: '₹18,500',
      },
    ],
  },
  {
    id: 'vizag-coastal',
    title: 'Visakhapatnam Coastal Residence',
    japaneseSubtitle: 'విశాఖపట్నం · వెలుగు',
    location: 'Visakhapatnam, Andhra Pradesh',
    architect: 'Mette Lind & Sørensen',
    concept: 'Flooded with diffused Bay of Bengal coastal light, this high-ceilinged Beach Road residence pairs natural timber floors with warm terracotta textures and tactile rush seating.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1600&q=80',
    hotspots: [
      {
        id: 'hs-4',
        xPercent: 42,
        yPercent: 65,
        productId: 'sora-dining-table',
        title: 'Sora Minimalist Dining Table',
        priceNote: '₹84,500',
      },
      {
        id: 'hs-5',
        xPercent: 68,
        yPercent: 72,
        productId: 'shiori-woven-bench',
        title: 'Shiori Woven Paper Cord Bench',
        priceNote: '₹24,500',
      },
      {
        id: 'hs-6',
        xPercent: 20,
        yPercent: 52,
        productId: 'kanso-sculptural-bookshelf',
        title: 'Kanso Architectural Bookshelf',
        priceNote: '₹72,000',
      },
    ],
  },
  {
    id: 'araku-timber',
    title: 'Araku Valley Forest Haven',
    japaneseSubtitle: 'అరకు · ప్రశాంతత',
    location: 'Araku Valley, Andhra Pradesh',
    architect: 'Takashi Oki & Associates',
    concept: 'Nestled in the Eastern Ghats coffee hills of Andhra Pradesh, this bedroom suite highlights natural lime plaster walls, aromatic Hinoki timber joinery, and grounded low-slung lines.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    hotspots: [
      {
        id: 'hs-7',
        xPercent: 48,
        yPercent: 68,
        productId: 'asahi-platform-bed',
        title: 'Asahi Floating Platform Bed with Tatami',
        priceNote: '₹1,05,000',
      },
      {
        id: 'hs-8',
        xPercent: 82,
        yPercent: 60,
        productId: 'nara-architectural-credenza',
        title: 'Nara Architectural Credenza',
        priceNote: '₹96,000',
      },
    ],
  },
];
