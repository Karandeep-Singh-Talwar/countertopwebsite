export interface SlabProduct {
  id: string;
  name: string;
  category: 'Quartz' | 'Quartzite' | 'Marble' | 'Granite' | 'Porcelain' | 'Tile';
  colorGroup: 'white' | 'beige' | 'gray' | 'black' | 'gold' | 'green';
  colorLabel: string;
  pricePerSqFt: number;
  originalPrice?: number;
  thickness: string;
  finish: 'Polished' | 'Honed' | 'Leathered' | 'Brushed' | 'Velvet Matte';
  durabilityRating: number; // 1-5
  heatResistance: string; // e.g., 'High (up to 450°F)'
  stainResistance: string; // 'Exceptional' | 'High' | 'Medium'
  origin: string;
  image: string;
  description: string;
  bestFor: string[];
  trending?: boolean;
  newArrival?: boolean;
  brandPartner?: string;
}

export interface TileProduct {
  id: string;
  name: string;
  style: 'Zellige' | 'Subway' | 'Fluted' | 'Hexagon' | 'Chevron' | 'Terrazzo';
  colorGroup: string;
  pricePerSqFt: number;
  finish: string;
  dimensions: string;
  image: string;
  description: string;
  matchingCountertops: string[];
}

export interface TransformationCase {
  id: string;
  title: string;
  homeowner: string;
  city: string;
  date: string;
  material: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  beforeCostQuote: number;
  veronaCost: number;
  savingsPercentage: number;
  review: string;
  rating: number;
  roomType: string;
}

export const SLAB_PRODUCTS: SlabProduct[] = [
  {
    id: 'calacatta-gold-quartz',
    name: 'Calacatta Gold Supreme',
    category: 'Quartz',
    colorGroup: 'white',
    colorLabel: 'Warm White with Gold Veining',
    pricePerSqFt: 68,
    originalPrice: 89,
    thickness: '3cm (1 1/4")',
    finish: 'Polished',
    durabilityRating: 5,
    heatResistance: 'Up to 300°F (trivet recommended)',
    stainResistance: 'Exceptional (Zero Porosity)',
    origin: 'Direct Fabricated • Cambria Grade',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    description: 'Dramatic ribbons of warm taupe, honey gold, and cool slate cascade across a luminous milky white field. The undisputed king of luxury kitchen islands.',
    bestFor: ['Kitchen Islands', 'Full Height Backsplash', 'Primary Vanities'],
    trending: true,
    brandPartner: 'Silestone by Cosentino',
  },
  {
    id: 'taj-mahal-quartzite',
    name: 'Taj Mahal Exotic Quartzite',
    category: 'Quartzite',
    colorGroup: 'gold',
    colorLabel: 'Ethereal Cream & Soft Bronze',
    pricePerSqFt: 88,
    originalPrice: 115,
    thickness: '3cm (1 1/4")',
    finish: 'Leathered',
    durabilityRating: 5,
    heatResistance: 'Extreme (Direct Pot Heat Safe up to 600°F)',
    stainResistance: 'High (Natural Dense Crystalline)',
    origin: 'Ceara, Brazil',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    description: '100% natural Brazilian quartzite with the soft luminous warmth of marble and the diamond hardness of granite. Ultra-resistant to lemon acid, wine, and scratches.',
    bestFor: ['Chefs Kitchens', 'Outdoor BBQ Islands', 'Waterfall Edges'],
    trending: true,
    brandPartner: 'MSI Natural Stone',
  },
  {
    id: 'nero-marquina-marble',
    name: 'Nero Marquina Grand Noir',
    category: 'Marble',
    colorGroup: 'black',
    colorLabel: 'Deep Obsidian with Electric White Veins',
    pricePerSqFt: 79,
    originalPrice: 98,
    thickness: '2cm & 3cm',
    finish: 'Honed',
    durabilityRating: 4,
    heatResistance: 'High (Natural Stone)',
    stainResistance: 'Protected with Verona Nano-Seal',
    origin: 'Markina-Xemein, Spain',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    description: 'Deep midnight black with striking, electric-white calcite lightning streaks. Adds monumental drama and European high-fashion flair to bars and architectural islands.',
    bestFor: ['Cocktail Wet Bars', 'Powder Room Vanities', 'Fireplace Surrounds'],
    newArrival: true,
    brandPartner: 'Verona Quarry Direct',
  },
  {
    id: 'super-white-dolomite',
    name: 'Mont Blanc Dolomitic Quartzite',
    category: 'Quartzite',
    colorGroup: 'white',
    colorLabel: 'Alpine White & Charcoal Drift',
    pricePerSqFt: 84,
    originalPrice: 105,
    thickness: '3cm',
    finish: 'Polished',
    durabilityRating: 5,
    heatResistance: 'Extreme (550°F)',
    stainResistance: 'High',
    origin: 'Minas Gerais, Brazil',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
    description: 'Often called Super White, this Brazilian natural stone delivers the pure aesthetics of Calacatta with significantly higher scratch resistance.',
    bestFor: ['Modern Farmhouse Kitchens', 'Master Bath Ensuites', 'Butler Pantries'],
    trending: true,
    brandPartner: 'Dekton Ultra-Compact',
  },
  {
    id: 'dekton-laurent-porcelain',
    name: 'Laurent Sintered Ultra-Porcelain',
    category: 'Porcelain',
    colorGroup: 'black',
    colorLabel: 'Dark Umber with Gold-Oxide Veins',
    pricePerSqFt: 92,
    originalPrice: 120,
    thickness: '1.2cm & 2cm',
    finish: 'Velvet Matte',
    durabilityRating: 5,
    heatResistance: 'Ultra (Torch & Boiling Pan Safe 800°F+)',
    stainResistance: 'Impervious (100% Non-Porous)',
    origin: 'Almeria, Spain',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
    description: 'Sintered particle technology combining 20 natural minerals subjected to 25,000 tons of pressure. Zero staining from turmeric, red wine, or direct sun UV.',
    bestFor: ['Indoor/Outdoor Seamless Flow', 'Induction Cooktop Integration', 'Modern Penthouses'],
    newArrival: true,
    brandPartner: 'Dekton by Cosentino',
  },
  {
    id: 'carrara-bianco-marble',
    name: 'Authentic Bianco Carrara C',
    category: 'Marble',
    colorGroup: 'white',
    colorLabel: 'Pristine White with Soft Feathered Grey',
    pricePerSqFt: 58,
    originalPrice: 76,
    thickness: '3cm',
    finish: 'Honed',
    durabilityRating: 4,
    heatResistance: 'High',
    stainResistance: 'Protected with Verona Permashield',
    origin: 'Carrara, Tuscany, Italy',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80',
    description: 'The historic stone of Michelangelo. Soft, hazy dove-gray veining across a clean white ground gives your space timeless Italian prestige.',
    bestFor: ['Baking Stations', 'Primary Bath Vanity', 'French Bistro Islands'],
    brandPartner: 'Verona Italian Mill Direct',
  },
  {
    id: 'black-galaxy-granite',
    name: 'Black Galaxy Stellar Granite',
    category: 'Granite',
    colorGroup: 'black',
    colorLabel: 'Gloss Black with Copper Bronzite Flecks',
    pricePerSqFt: 52,
    originalPrice: 68,
    thickness: '3cm',
    finish: 'Polished',
    durabilityRating: 5,
    heatResistance: 'Extreme (600°F)',
    stainResistance: 'Very High',
    origin: 'Ongole, Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    description: 'A deep black natural granite embedded with glistening copper and golden bronzite crystalline specks that catch ambient chandelier light.',
    bestFor: ['Heavy-Duty Family Kitchens', 'Rental & Investment Properties', 'Wet Bars'],
    brandPartner: 'Verona Global Granite',
  },
  {
    id: 'alaska-white-granite',
    name: 'Alaska White Frost Granite',
    category: 'Granite',
    colorGroup: 'gray',
    colorLabel: 'Frost White with Silver Mica & Taupe Quartz',
    pricePerSqFt: 56,
    originalPrice: 72,
    thickness: '3cm',
    finish: 'Polished',
    durabilityRating: 5,
    heatResistance: 'Extreme',
    stainResistance: 'High',
    origin: 'Espirito Santo, Brazil',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    description: 'A frost-white natural granite with pale silver feldspar crystals, subtle onyx ribbons, and translucent quartz inclusions that provide deep visual texture.',
    bestFor: ['Oak & Maple Cabinetry', 'Bright Open Concept Living', 'Rental Remodels'],
    brandPartner: 'Verona Natural Stone',
  },
  {
    id: 'verde-alpi-marble',
    name: 'Verde Alpi Emerald Marble',
    category: 'Marble',
    colorGroup: 'green',
    colorLabel: 'Forest Emerald with Seafoam Veins',
    pricePerSqFt: 96,
    originalPrice: 125,
    thickness: '2cm & 3cm',
    finish: 'Leathered',
    durabilityRating: 4,
    heatResistance: 'High',
    stainResistance: 'Sealed',
    origin: 'Aosta Valley, Italian Alps',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    description: 'Coveted by top architects worldwide. Rich deep serpentinite emerald with dramatic crystalline web veining that turns any island into high art.',
    bestFor: ['Statement Islands', 'Executive Library Bars', 'Luxury Powder Rooms'],
    newArrival: true,
    brandPartner: 'Verona Exclusive Slabs',
  },
];

export const TILE_PRODUCTS: TileProduct[] = [
  {
    id: 'moroccan-zellige-creme',
    name: 'Artisan Zellige Glazed Terracotta',
    style: 'Zellige',
    colorGroup: 'white',
    pricePerSqFt: 18,
    finish: 'Gloss Hand-Molded',
    dimensions: '4" x 4"',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic undulating hand-glazed Moroccan tiles that ripple with organic light reflection and subtle pearlescent tone variation.',
    matchingCountertops: ['calacatta-gold-quartz', 'taj-mahal-quartzite'],
  },
  {
    id: 'fluted-carrara-subway',
    name: 'Fluted Architectural Marble 3D',
    style: 'Fluted',
    colorGroup: 'gray',
    pricePerSqFt: 24,
    finish: 'Honed Matte 3D Reeded',
    dimensions: '3" x 12"',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description: 'Precision waterjet grooved natural Italian marble tiles adding tactile shadows and vertical architectural rhythm behind countertops.',
    matchingCountertops: ['carrara-bianco-marble', 'super-white-dolomite'],
  },
  {
    id: 'noir-basalt-chevron',
    name: 'Volcanic Basalt Chevron Mosaic',
    style: 'Chevron',
    colorGroup: 'black',
    pricePerSqFt: 22,
    finish: 'Brushed Micro-Pores',
    dimensions: '12" x 12" Mesh Sheet',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Interlocking matte volcanic black stone arranged in sharp Parisian chevron pattern for bold, moody backsplashes and shower accent walls.',
    matchingCountertops: ['nero-marquina-marble', 'dekton-laurent-porcelain'],
  },
  {
    id: 'venetian-terrazzo-bianco',
    name: 'Venetian Micro-Aggregate Terrazzo',
    style: 'Terrazzo',
    colorGroup: 'white',
    pricePerSqFt: 19,
    finish: 'Silky Matte',
    dimensions: '8" x 8"',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    description: 'Infused with chips of Carrara marble, warm ochre, and quartz aggregate. Mid-century European elegance that will never date.',
    matchingCountertops: ['calacatta-gold-quartz', 'alaska-white-granite'],
  },
];

export const TRANSFORMATION_CASES: TransformationCase[] = [
  {
    id: 'case-austin-miller',
    title: 'Outdated Oak & Laminate to Mitered Waterfall Calacatta',
    homeowner: 'Christopher & Evelyn M.',
    city: 'Austin, TX',
    date: 'March 2026',
    material: 'Calacatta Gold Supreme Quartz (3cm)',
    category: 'Full Kitchen & 10ft Waterfall Island',
    beforeImage: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
    beforeCostQuote: 10850,
    veronaCost: 7890,
    savingsPercentage: 27,
    review: 'Two local showrooms quoted us over $10.5k with a 7-week fabrication backlog. Verona did 3D laser templating Tuesday, cut the mitered waterfall on Thursday, and finished installation Friday noon. Saved nearly $3,000!',
    rating: 5,
    roomType: 'Kitchen Remodel',
  },
  {
    id: 'case-denver-harrison',
    title: '1990s Tile Counters to Seamless Taj Mahal Quartzite',
    homeowner: 'David & Sarah H.',
    city: 'Denver, CO',
    date: 'February 2026',
    material: 'Taj Mahal Exotic Brazilian Quartzite',
    category: 'Gourmet Kitchen & Beverage Wet Bar',
    beforeImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    beforeCostQuote: 13400,
    veronaCost: 9650,
    savingsPercentage: 28,
    review: 'The leathered Taj Mahal is bulletproof. Hot Dutch ovens straight out of the 450°F oven go right on it with zero marks. The bookmatched veining on the island is museum-quality.',
    rating: 5,
    roomType: 'Kitchen & Bar Remodel',
  },
  {
    id: 'case-dallas-vargas',
    title: 'Primary Master Bath Spa Remodel with Nero Marquina',
    homeowner: 'Elena & Marcus V.',
    city: 'Dallas, TX',
    date: 'January 2026',
    material: 'Nero Marquina Honed Marble + Fluted Subway Tile',
    category: 'Double Floating Vanity & Walk-in Shower Ledges',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    beforeCostQuote: 8200,
    veronaCost: 5900,
    savingsPercentage: 28,
    review: 'Booking our design call on the site was painless. We uploaded our vanity dimensions, chose Nero Marquina with eased edges, and their design consultant walked us through slab layout on Zoom.',
    rating: 5,
    roomType: 'Master Bathroom',
  },
];

export const EDGE_PROFILES = [
  { id: 'eased', name: 'Straight Eased (Modern)', pricePerLinearFt: 0, description: 'Clean, crisp 90-degree look with a subtle rounded micro-bevel to prevent chipping. Most popular in modern homes.' },
  { id: 'demi-bullnose', name: 'Demi Bullnose', pricePerLinearFt: 12, description: 'Gentle curve along the top edge while remaining flat underneath. Smooth to touch and easy to wipe down.' },
  { id: 'full-bullnose', name: 'Full Bullnose', pricePerLinearFt: 16, description: 'Completely rounded semicircle from top to bottom. Classic, kid-safe, and timeless in traditional homes.' },
  { id: 'ogee', name: 'Signature Ogee', pricePerLinearFt: 22, description: 'An elegant S-shaped architectural profile favored for formal kitchen islands and traditional marble.' },
  { id: 'mitered-waterfall', name: 'Mitered Waterfall (2" - 3")', pricePerLinearFt: 34, description: 'Creates the dramatic illusion of an ultra-thick monolithic stone slab cascading down the side of the cabinetry.' },
];

export const BRAND_PARTNERS = [
  { name: 'Cambria Quartz', logoText: 'CAMBRIA', desc: 'American Made Luxury Quartz' },
  { name: 'Caesarstone', logoText: 'caesarstone', desc: 'Engineered Stone Surfaces' },
  { name: 'Silestone', logoText: 'SILESTONE', desc: 'HybriQ+ Carbon Neutral Tech' },
  { name: 'Dekton', logoText: 'DEKTON', desc: 'Ultra-Compact Architectural Slabs' },
  { name: 'MSI Surfaces', logoText: 'MSI SURFACES', desc: 'Worldwide Natural Stone' },
  { name: 'Daltile', logoText: 'daltile', desc: 'America’s Architectural Tile & Stone' },
  { name: 'Vicostone', logoText: 'VICOSTONE', desc: 'High-Purity Quartz Surfaces' },
];

export const COMPARISON_ROWS = [
  {
    feature: 'Average Turnaround (Template to Install)',
    traditional: '4 to 8 weeks of waiting',
    bigBox: '6 to 10 weeks with 3rd party brokers',
    verona: '5 to 7 Business Days Guaranteed',
  },
  {
    feature: 'Slab Yard Transparency',
    traditional: 'Drive to 5+ yards, hidden pricing tiers',
    bigBox: 'Only 6-8 generic samples on a display wall',
    verona: 'Live 100+ slab digital catalog + factory-direct pricing',
  },
  {
    feature: 'Precision Templating',
    traditional: 'Hand measurement or old wooden sticks',
    bigBox: 'Subcontractor tape measure',
    verona: 'Pro 3D Laser Templating accurate to 1/32"',
  },
  {
    feature: 'Cost & Middleman Markups',
    traditional: 'Showroom markups + independent fabricator fees',
    bigBox: 'Retail markups + contractor commission layers',
    verona: 'Factory-Direct Mill Pricing (Save avg. $2,400 per kitchen)',
  },
  {
    feature: '1-on-1 Stone Design Consultation',
    traditional: 'Rushed counter staff at slab yard',
    bigBox: 'General department aisle worker',
    verona: 'Dedicated Interior Stone Specialist on Zoom or In-Home',
  },
  {
    feature: 'Warranty & Stain Protection',
    traditional: 'Varies by fabricator, often 1-year limited',
    bigBox: 'Complicated manufacturer pass-through',
    verona: '15-Year Transferable Stain & Workmanship Warranty',
  },
];
