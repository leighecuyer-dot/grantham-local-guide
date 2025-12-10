import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Business, getCategoryIcon } from "@/types/business";
import { Badge } from "@/components/ui/badge";

interface BusinessCardProps {
  business: Business;
}

const TripAdvisorRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full ${
              i < fullStars
                ? "bg-[#00aa6c]"
                : i === fullStars && hasHalfStar
                ? "bg-gradient-to-r from-[#00aa6c] from-50% to-muted to-50%"
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
  return (
    <Link
      to={`/business/${business.slug}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {getCategoryIcon(business.category)} {business.category}
          </Badge>
          {business.featured && (
            <Badge className="bg-primary/10 text-primary border-0 text-xs">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {business.name}
        </h3>
        {business.tripadvisorRating && (
          <div className="mb-2">
            <TripAdvisorRating rating={business.tripadvisorRating} />
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {business.description}
        </p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="truncate">{business.address}</span>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
