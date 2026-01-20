export type Category =
  | "Café"
  | "Restaurant"
  | "Pubs & Bars"
  | "Barbers"
  | "Hairdressers"
  | "Beauty"
  | "Retail"
  | "Trades"
  | "Kids Activities"
  | "Services"
  | "Gyms & Fitness"
  | "Sport Clubs"
  | "IT & Technology"
  | "Hotels & Accommodation"
  | "Health & Wellbeing";

export type BusinessTag = "Independent" | "Family-run" | "Local favourite" | "Hidden gem" | "Award-winning" | "Eco-friendly";

export const BUSINESS_TAGS: BusinessTag[] = [
  "Independent",
  "Family-run",
  "Local favourite",
  "Hidden gem",
  "Award-winning",
  "Eco-friendly",
];

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  address: string;
  website?: string;
  phone?: string;
  instagram?: string;
  email?: string;
  image: string;
  featured: boolean;
  tripadvisorRating?: number;
  tripadvisorUrl?: string;
  googleRating?: number;
  googleReviewsUrl?: string;
  tags?: BusinessTag[];
  views?: number;
  createdAt?: string;
}

export const CATEGORIES: Category[] = [
  "Café",
  "Restaurant",
  "Pubs & Bars",
  "Barbers",
  "Hairdressers",
  "Beauty",
  "Retail",
  "Trades",
  "Kids Activities",
  "Services",
  "Gyms & Fitness",
  "Sport Clubs",
  "IT & Technology",
  "Hotels & Accommodation",
  "Health & Wellbeing",
];

export const getCategorySlug = (category: Category): string => {
  return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
};

export const getCategoryFromSlug = (slug: string): Category | undefined => {
  return CATEGORIES.find((cat) => getCategorySlug(cat) === slug);
};

export const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    "Café": "☕",
    "Restaurant": "🍽️",
    "Pubs & Bars": "🍺",
    "Barbers": "✂️",
    "Hairdressers": "💇",
    "Beauty": "💅",
    "Retail": "🛍️",
    "Trades": "🔧",
    "Kids Activities": "🎨",
    "Services": "📋",
    "Gyms & Fitness": "💪",
    "Sport Clubs": "⚽",
    "IT & Technology": "💻",
    "Hotels & Accommodation": "🏨",
    "Health & Wellbeing": "🧘",
  };
  return icons[category];
};
