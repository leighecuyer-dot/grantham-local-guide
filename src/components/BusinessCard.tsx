import { Link } from "react-router-dom";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { Business, getCategoryIcon } from "@/types/business";
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
            className={`w-3 h-3 rounded-full ${
              i < fullStars
                ? "bg-[#00aa6c]"
                : i === fullStars && hasHalfStar
                ? "bg-gradient-to-r from-[#00aa6c] from-50% to-muted to-50%"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
};

const BusinessCard = ({ business }: BusinessCardProps) => {
  const { townSlug } = useTown();

  return (
    <Link
      to={`/${townSlug}/business/${business.slug}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {business.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground border-0 shadow-md">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm text-foreground border-0 shadow-sm">
            {getCategoryIcon(business.category)} {business.category}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
            {business.name}
          </h3>
          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
        </div>
        {business.tripadvisorRating && (
          <div className="mb-3">
            <TripAdvisorRating rating={business.tripadvisorRating} />
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {business.description}
        </p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="truncate">{business.address}</span>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
