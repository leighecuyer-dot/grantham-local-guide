import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Business } from "@/types/business";
import { Badge } from "@/components/ui/badge";
import { useTown } from "@/contexts/TownContext";

interface BusinessCardProps {
  business: Business;
}

const TripAdvisorRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i < fullStars
                ? "bg-primary"
                : i === fullStars && hasHalfStar
                ? "bg-gradient-to-r from-primary from-50% to-muted to-50%"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
};

const BusinessCard = ({ business }: BusinessCardProps) => {
  const { townSlug } = useTown();

  return (
    <Link
      to={`/${townSlug}/business/${business.slug}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-200"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {business.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground border-0 text-xs">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
            {business.category}
          </span>
          {business.tripadvisorRating && (
            <TripAdvisorRating rating={business.tripadvisorRating} />
          )}
        </div>
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5">
          {business.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {business.description}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{business.address}</span>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
