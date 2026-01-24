// Category-specific placeholder images
import cafePlaceholder from "@/assets/placeholders/cafe.jpg";
import restaurantPlaceholder from "@/assets/placeholders/restaurant.jpg";
import barbersPlaceholder from "@/assets/placeholders/barbers.jpg";
import beautyPlaceholder from "@/assets/placeholders/beauty.jpg";
import retailPlaceholder from "@/assets/placeholders/retail.jpg";
import tradesPlaceholder from "@/assets/placeholders/trades.jpg";
import kidsActivitiesPlaceholder from "@/assets/placeholders/kids-activities.jpg";
import servicesPlaceholder from "@/assets/placeholders/services.jpg";
import gymsFitnessPlaceholder from "@/assets/placeholders/gyms-fitness.jpg";
import sportClubsPlaceholder from "@/assets/placeholders/sport-clubs.jpg";
import hairdressersPlaceholder from "@/assets/placeholders/hairdressers.jpg";
import itTechnologyPlaceholder from "@/assets/placeholders/it-technology.jpg";
import hotelsAccommodationPlaceholder from "@/assets/placeholders/hotels-accommodation.jpg";
import healthWellbeingPlaceholder from "@/assets/placeholders/health-wellbeing.jpg";
import pubsBarsPlaceholder from "@/assets/placeholders/pubs-bars.jpg";

const categoryPlaceholders: Record<string, string> = {
  "Café": cafePlaceholder,
  "Restaurant": restaurantPlaceholder,
  "Barbers": barbersPlaceholder,
  "Beauty": beautyPlaceholder,
  "Retail": retailPlaceholder,
  "Trades": tradesPlaceholder,
  "Kids Activities": kidsActivitiesPlaceholder,
  "Services": servicesPlaceholder,
  "Gyms & Fitness": gymsFitnessPlaceholder,
  "Sport Clubs": sportClubsPlaceholder,
  "Hairdressers": hairdressersPlaceholder,
  "IT & Technology": itTechnologyPlaceholder,
  "Hotels & Accommodation": hotelsAccommodationPlaceholder,
  "Health & Wellbeing": healthWellbeingPlaceholder,
  "Pubs & Bars": pubsBarsPlaceholder,
};

// Default fallback if category not found
const defaultPlaceholder = servicesPlaceholder;

export const isPlaceholderImage = (image?: string | null): boolean => {
  const value = (image || "").trim();
  return (
    !value ||
    value.includes("placeholder") ||
    value.includes("unsplash.com")
  );
};

export const getCategoryPlaceholder = (category?: string): string => {
  if (!category) return defaultPlaceholder;
  return categoryPlaceholders[category] || defaultPlaceholder;
};

export const getBusinessImage = (image?: string | null, category?: string): string => {
  if (isPlaceholderImage(image)) {
    return getCategoryPlaceholder(category);
  }
  return image || getCategoryPlaceholder(category);
};
