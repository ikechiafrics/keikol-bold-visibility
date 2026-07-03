import locLagos from "@/assets/loc-lagos.jpg";
import locAbuja from "@/assets/loc-abuja.jpg";
import locPh from "@/assets/loc-ph.jpg";
import locKano from "@/assets/loc-kano.jpg";
import heroImg from "@/assets/hero-billboard.jpg";
import portfolioRealEstate from "@/assets/portfolio-real-estate.jpg";
import portfolioRestaurant from "@/assets/portfolio-restaurant.jpg";
import portfolioTelecom from "@/assets/portfolio-telecom.jpg";
import portfolioFmcg from "@/assets/portfolio-fmcg.jpg";
import portfolioFashion from "@/assets/portfolio-fashion.jpg";
import portfolioEducation from "@/assets/portfolio-education.jpg";


export type Availability = "Available" | "Coming Soon" | "Available Soon";
export type BillboardType = "Digital Billboard" | "Static Billboard" | "Premium Static Billboard";

export type SizeCategory = "Small" | "Medium" | "Large" | "Extra Large";
export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

export interface Billboard {
  id: string;
  city: string;
  area: string;
  landmark: string;
  billboardType: BillboardType;
  size: string;
  sizeCategory: SizeCategory;
  estimatedDailyImpressions: string;
  dailyImpressionsNumeric: number;
  availability: Availability;
  priceRange: string;
  priceTier: PriceTier;
  priceMonthlyNGN: number;
  lighting: string;
  description: string;
  recommendedIndustries: string[];
  bestFor: string[];
  nearbyLandmarks: string[];
  image: string;
  gallery: string[];
  tags: string[];
  coordinates: { lat: number; lng: number };
  /** ISO date strings (YYYY-MM-DD) representing booked dates in the next ~120 days. */
  bookedDates: string[];
}

// Helper to generate booked-date arrays deterministically per billboard.
function bookedFor(seed: number, density: number): string[] {
  const out: string[] = [];
  const start = new Date(Date.UTC(2026, 6, 1)); // July 1, 2026 (project "today")
  for (let i = 0; i < 120; i++) {
    // deterministic pseudo-random
    const v = Math.sin(seed * 9301 + i * 49297) * 233280;
    const r = v - Math.floor(v);
    if (r < density) {
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i);
      out.push(d.toISOString().slice(0, 10));
    }
  }
  return out;
}

export const BILLBOARDS: Billboard[] = [
  {
    id: "lagos-lekki-expressway",
    city: "Lagos",
    area: "Lekki Expressway",
    landmark: "Lekki Toll Gate corridor",
    billboardType: "Digital Billboard",
    size: "48ft x 14ft",
    sizeCategory: "Extra Large",
    estimatedDailyImpressions: "120,000+",
    dailyImpressionsNumeric: 120000,
    availability: "Available",
    priceRange: "Contact for pricing",
    priceTier: "$$$$",
    priceMonthlyNGN: 12000000,
    lighting: "Digital display / 24-hour visibility",
    description:
      "This premium billboard location gives brands strong visibility along one of Lagos' most active commercial and commuter corridors. It is ideal for businesses that want to reach professionals, residents, shoppers, and daily commuters.",
    recommendedIndustries: ["Real Estate", "Banking", "Telecom", "Restaurants", "FMCG", "Fashion"],
    bestFor: ["Product launches", "Premium brand awareness", "Real estate campaigns", "High-visibility consumer campaigns"],
    nearbyLandmarks: ["Lekki Toll Gate", "Ikoyi Link Bridge", "The Palms Shopping Mall", "Circle Mall", "Chevron Roundabout"],
    image: locLagos,
    gallery: [locLagos, heroImg, locAbuja],
    tags: ["Lagos", "Digital", "Available", "Premium Visibility", "High Traffic"],
    coordinates: { lat: 6.4361, lng: 3.4736 },
    bookedDates: bookedFor(1, 0.45),
  },
  {
    id: "abuja-central-business-district",
    city: "Abuja",
    area: "Central Business District",
    landmark: "CBD business corridor",
    billboardType: "Static Billboard",
    size: "40ft x 12ft",
    sizeCategory: "Large",
    estimatedDailyImpressions: "85,000+",
    dailyImpressionsNumeric: 85000,
    availability: "Available",
    priceRange: "Contact for pricing",
    priceTier: "$$$",
    priceMonthlyNGN: 7500000,
    lighting: "Illuminated",
    description:
      "This location is positioned for visibility in Abuja's business environment, making it suitable for brands that want credibility, corporate presence, and professional audience reach.",
    recommendedIndustries: ["Finance", "Government Campaigns", "Technology", "Real Estate", "Events"],
    bestFor: ["Corporate campaigns", "Public awareness", "Financial services", "Premium brand positioning"],
    nearbyLandmarks: ["Federal Secretariat", "Central Bank of Nigeria", "Eagle Square", "Transcorp Hilton", "Silverbird Cinemas"],
    image: locAbuja,
    gallery: [locAbuja, heroImg, locLagos],
    tags: ["Abuja", "Static", "Available", "Corporate Visibility", "Business District"],
    coordinates: { lat: 9.0563, lng: 7.4954 },
    bookedDates: bookedFor(2, 0.3),
  },
  {
    id: "port-harcourt-aba-road",
    city: "Port Harcourt",
    area: "Aba Road",
    landmark: "High-traffic commercial road",
    billboardType: "Digital Billboard",
    size: "48ft x 14ft",
    sizeCategory: "Extra Large",
    estimatedDailyImpressions: "70,000+",
    dailyImpressionsNumeric: 70000,
    availability: "Coming Soon",
    priceRange: "Contact for pricing",
    priceTier: "$$$",
    priceMonthlyNGN: 6500000,
    lighting: "Digital display",
    description:
      "This billboard placement is designed for visibility along one of Port Harcourt's active commercial routes, helping brands reach commuters, shoppers, and local businesses.",
    recommendedIndustries: ["FMCG", "Telecom", "Restaurants", "Events", "Education"],
    bestFor: ["Retail promotions", "Local awareness", "Food campaigns", "Education campaigns", "Consumer brand visibility"],
    nearbyLandmarks: ["Garrison Junction", "Artillery Junction", "GRA Phase 2", "Mile 1 Market", "Rumuola Junction"],
    image: locPh,
    gallery: [locPh, heroImg, locKano],
    tags: ["Port Harcourt", "Digital", "Coming Soon", "Commercial Road", "Consumer Visibility"],
    coordinates: { lat: 4.8156, lng: 7.0498 },
    bookedDates: bookedFor(3, 0.85),
  },
  {
    id: "kano-commercial-district",
    city: "Kano",
    area: "Commercial District",
    landmark: "Major commercial corridor",
    billboardType: "Static Billboard",
    size: "40ft x 12ft",
    sizeCategory: "Large",
    estimatedDailyImpressions: "60,000+",
    dailyImpressionsNumeric: 60000,
    availability: "Coming Soon",
    priceRange: "Contact for pricing",
    priceTier: "$$",
    priceMonthlyNGN: 4200000,
    lighting: "Illuminated",
    description:
      "This billboard gives brands access to a busy commercial environment, making it suitable for businesses that want strong local visibility and repeated daily exposure.",
    recommendedIndustries: ["Retail", "FMCG", "Banking", "Education", "Events"],
    bestFor: ["Mass-market awareness", "Retail campaigns", "Product visibility", "Local business promotion"],
    nearbyLandmarks: ["Kantin Kwari Market", "Sabon Gari Market", "Ado Bayero Mall", "Kano Emir's Palace", "Murtala Mohammed Way"],
    image: locKano,
    gallery: [locKano, heroImg, locPh],
    tags: ["Kano", "Static", "Coming Soon", "Retail Visibility", "Commercial District"],
    coordinates: { lat: 12.0022, lng: 8.5919 },
    bookedDates: bookedFor(4, 0.9),
  },
  {
    id: "lagos-victoria-island",
    city: "Lagos",
    area: "Victoria Island",
    landmark: "Business and lifestyle district",
    billboardType: "Premium Static Billboard",
    size: "40ft x 12ft",
    sizeCategory: "Large",
    estimatedDailyImpressions: "95,000+",
    dailyImpressionsNumeric: 95000,
    availability: "Available",
    priceRange: "Contact for pricing",
    priceTier: "$$$$",
    priceMonthlyNGN: 10500000,
    lighting: "Illuminated",
    description:
      "This location is ideal for premium brands seeking visibility in one of Lagos' major business and lifestyle districts. It is suited for campaigns that need credibility, elegance, and strong brand positioning.",
    recommendedIndustries: ["Luxury Brands", "Finance", "Real Estate", "Technology", "Hospitality"],
    bestFor: ["Premium campaigns", "Corporate branding", "Luxury visibility", "Hospitality and lifestyle promotion"],
    nearbyLandmarks: ["Eko Hotel & Suites", "Landmark Beach", "Civic Centre", "Oniru Market", "Muri Okunola Park"],
    image: locLagos,
    gallery: [locLagos, heroImg, locAbuja],
    tags: ["Lagos", "Premium Static", "Available", "Luxury Visibility", "Business District"],
    coordinates: { lat: 6.4281, lng: 3.4219 },
    bookedDates: bookedFor(5, 0.55),
  },
  {
    id: "abuja-airport-road",
    city: "Abuja",
    area: "Airport Road",
    landmark: "Airport route visibility",
    billboardType: "Digital Billboard",
    size: "48ft x 14ft",
    sizeCategory: "Extra Large",
    estimatedDailyImpressions: "90,000+",
    dailyImpressionsNumeric: 90000,
    availability: "Available Soon",
    priceRange: "Contact for pricing",
    priceTier: "$$$",
    priceMonthlyNGN: 8000000,
    lighting: "Digital display",
    description:
      "This billboard placement is designed for high-value route visibility, reaching travelers, professionals, government traffic, and event audiences moving through Abuja's airport corridor.",
    recommendedIndustries: ["Travel", "Hospitality", "Telecom", "Government Campaigns", "Events"],
    bestFor: ["Travel campaigns", "Hospitality promotions", "National visibility", "Event campaigns", "Government/public messaging"],
    nearbyLandmarks: ["Nnamdi Azikiwe Airport", "Lugbe District", "Gwagwalada Junction", "Airport Expressway", "Sheraton Hotel"],
    image: locAbuja,
    gallery: [locAbuja, heroImg, locLagos],
    tags: ["Abuja", "Digital", "Available Soon", "Airport Route", "Travel Visibility"],
    coordinates: { lat: 8.9891, lng: 7.3849 },
    bookedDates: bookedFor(6, 0.65),
  },
];

export function getBillboardById(id: string): Billboard | undefined {
  return BILLBOARDS.find((b) => b.id === id);
}

export const CITIES = ["All", "Lagos", "Abuja", "Port Harcourt", "Kano"] as const;
export const BILLBOARD_TYPES = ["All", "Digital Billboard", "Static Billboard", "Premium Static Billboard"] as const;
export const AVAILABILITIES = ["All", "Available", "Coming Soon", "Available Soon"] as const;
export const SIZE_CATEGORIES = ["All", "Small", "Medium", "Large", "Extra Large"] as const;
export const PRICE_TIERS = ["All", "$", "$$", "$$$", "$$$$"] as const;
export const INDUSTRY_FILTERS = [
  "All",
  "Real Estate",
  "Banking",
  "Telecom",
  "Restaurants",
  "FMCG",
  "Fashion",
  "Education",
  "Events",
  "Technology",
] as const;

export const PORTFOLIO_SAMPLES = [
  {
    img: portfolioRealEstate,
    title: "Real Estate Launch",
    location: "Lagos",
    campaignType: "Billboard Awareness Campaign",
    category: "Real Estate",
    description:
      "A premium billboard campaign designed to promote a new property development to commuters, investors, and local buyers.",
  },
  {
    img: portfolioRestaurant,
    title: "Restaurant Promotion",
    location: "Abuja",
    campaignType: "Local Visibility Campaign",
    category: "Restaurant",
    description:
      "A high-traffic outdoor campaign designed to drive awareness for a restaurant opening or seasonal menu promotion.",
  },
  {
    img: portfolioTelecom,
    title: "Telecom Brand Push",
    location: "Port Harcourt",
    campaignType: "High-Reach Media Campaign",
    category: "Telecom",
    description:
      "A mass visibility campaign built for telecom offers, brand recall, and customer acquisition.",
  },
  {
    img: portfolioFmcg,
    title: "FMCG Product Launch",
    location: "Kano",
    campaignType: "Consumer Awareness Campaign",
    category: "FMCG",
    description:
      "A campaign designed to support product recognition and retail demand in busy commercial areas.",
  },
  {
    img: portfolioFashion,
    title: "Fashion Collection Drop",
    location: "Victoria Island",
    campaignType: "Lifestyle Visibility Campaign",
    category: "Fashion",
    description:
      "A premium visual campaign for fashion brands looking to create aspiration and high-end brand presence.",
  },
  {
    img: portfolioEducation,
    title: "Education Admissions Campaign",
    location: "Abuja",
    campaignType: "Public Awareness Campaign",
    category: "Education",
    description:
      "A campaign concept for schools and training institutions promoting admissions or new programs.",
  },
];


export { heroImg };
