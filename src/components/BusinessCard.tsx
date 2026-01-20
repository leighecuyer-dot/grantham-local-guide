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
      <img 
        src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logoset_solid_green.svg" 
        alt="TripAdvisor" 
        className="h-4 w-4"
      />
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
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

const GoogleRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1.5">
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <div className="flex items-center gap-0.5">
        <Star className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />
        <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
};

const tagColors: Record<string, string> = {
  "Independent": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Family-run": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Local favourite": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Hidden gem": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Award-winning": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "Eco-friendly": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const BusinessCard = ({ business }: BusinessCardProps) => {
  const { townSlug } = useTown();

  return (
    <Link
      to={`/${townSlug}/business/${business.slug}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {business.featured && (
            <Badge className="bg-primary text-primary-foreground border-0 text-xs">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
        </div>
        {/* Tags overlay at bottom */}
        {business.tags && business.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {business.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm ${tagColors[tag] || "bg-muted/80 text-foreground"}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
            {business.category}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {business.tripadvisorRating && (
            <TripAdvisorRating rating={business.tripadvisorRating} />
          )}
          {business.googleRating && (
            <GoogleRating rating={business.googleRating} />
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
