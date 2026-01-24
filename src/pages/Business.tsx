import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Globe, Phone, Instagram, ExternalLink, Star, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import AdBanner from "@/components/AdBanner";
import SEOHead from "@/components/SEOHead";
import OpeningHours from "@/components/OpeningHours";
import VerifiedBadge from "@/components/VerifiedBadge";
import FavoriteButton from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBusinessBySlug, useBusinessesByCategory } from "@/hooks/useBusinesses";
import { getCategoryIcon, getCategorySlug } from "@/types/business";
import { useTown } from "@/contexts/TownContext";
import { getBusinessImage } from "@/lib/categoryPlaceholders";
const TripAdvisorRating = ({ rating, url }: { rating: number; url?: string }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const RatingContent = () => (
    <div className="flex items-center gap-2.5">
      <img 
        src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logoset_solid_green.svg" 
        alt="TripAdvisor" 
        className="h-5 w-5"
      />
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full ${
              i < fullStars
                ? "bg-[#00aa6c]"
                : i === fullStars && hasHalfStar
                ? "bg-gradient-to-r from-[#00aa6c] from-50% to-muted to-50%"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-base font-bold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">on Tripadvisor</span>
    </div>
  );
  
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex hover:opacity-80 transition-opacity"
      >
        <RatingContent />
      </a>
    );
  }
  
  return <RatingContent />;
};

const GoogleRating = ({ rating, url }: { rating: number; url?: string }) => {
  const RatingContent = () => (
    <div className="flex items-center gap-2.5">
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <div className="flex items-center gap-1">
        <Star className="w-5 h-5 fill-[#FBBC05] text-[#FBBC05]" />
        <span className="text-base font-bold text-foreground">{rating.toFixed(1)}</span>
      </div>
      <span className="text-sm text-muted-foreground">on Google</span>
    </div>
  );
  
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex hover:opacity-80 transition-opacity"
      >
        <RatingContent />
      </a>
    );
  }
  
  return <RatingContent />;
};

const Business = () => {
  const { slug } = useParams<{ slug: string }>();
  const { town, townSlug } = useTown();
  const { data: business, isLoading } = useBusinessBySlug(slug || "");
  const { data: categoryBusinesses = [] } = useBusinessesByCategory(
    business?.category || "Café",
    townSlug
  );

  // Get related businesses (same category, excluding current)
  const relatedBusinesses = categoryBusinesses
    .filter((b) => b.id !== business?.id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading business...</p>
        </div>
      </Layout>
    );
  }

  if (!business) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Business Not Found
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Sorry, we couldn't find that business.
          </p>
          <Button asChild size="lg">
            <Link to={`/${townSlug}/categories`}>Browse Directory</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const encodedAddress = encodeURIComponent(business.address);

  return (
    <Layout>
      <SEOHead
        title={`${business.name} | ${business.category} in ${town.name}`}
        description={business.description.substring(0, 155)}
        keywords={`${business.name}, ${business.category.toLowerCase()}, ${town.name}, local business`}
        ogImage={business.image}
      />
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 lg:h-[28rem] overflow-hidden bg-muted">
        <img
          src={getBusinessImage(business.image, business.category)}
          alt={business.name}
          className="w-full h-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container">
          <Button asChild variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
            <Link to={`/${townSlug}/category/${getCategorySlug(business.category)}`}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to {business.category}
            </Link>
          </Button>

          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 opacity-0 animate-slide-in-left">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge variant="secondary" className="text-sm px-4 py-1.5 rounded-full">
                  {getCategoryIcon(business.category)} {business.category}
                </Badge>
                {business.featured && (
                  <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 rounded-full">
                    <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    Featured
                  </Badge>
                )}
                {business.tags && business.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-sm px-3 py-1 rounded-full border-border/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {business.name}
                </h1>
                {business.verified && <VerifiedBadge size="lg" />}
                <FavoriteButton businessId={business.id} size="lg" />
              </div>

              {(business.tripadvisorRating || business.googleRating) && (
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {business.tripadvisorRating && (
                    <TripAdvisorRating rating={business.tripadvisorRating} url={business.tripadvisorUrl} />
                  )}
                  {business.googleRating && (
                    <GoogleRating rating={business.googleRating} url={business.googleReviewsUrl} />
                  )}
                </div>
              )}

              <div className="flex items-center gap-2.5 text-muted-foreground mb-8">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-lg">{business.address}</span>
              </div>

              <div className="prose prose-lg max-w-none mb-10">
                <p className="text-lg leading-relaxed text-foreground/85">
                  {business.description}
                </p>
              </div>

              {/* Opening Hours */}
              {business.openingHours && (
                <div className="mb-10">
                  <OpeningHours hours={business.openingHours} />
                </div>
              )}

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                <iframe
                  title={`Map showing ${business.name}`}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 opacity-0 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
              <div className="bg-card rounded-2xl border border-border p-7 shadow-sm sticky top-28">
                <h3 className="font-display font-bold text-xl text-foreground mb-6">
                  Contact Details
                </h3>
                <div className="space-y-3">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                        <span className="font-semibold text-foreground">{business.phone}</span>
                      </div>
                    </a>
                  )}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Website</p>
                        <span className="font-semibold text-foreground">Visit Website</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                  {business.instagram && (
                    <a
                      href={business.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Instagram className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Instagram</p>
                        <span className="font-semibold text-foreground">Follow Us</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Is this your business?
                  </p>
                  <Button asChild variant="outline" className="w-full rounded-xl">
                    <Link to={`/${townSlug}/contact`}>Claim Listing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="py-8 bg-background">
        <div className="container flex justify-center">
          <AdBanner size="leaderboard" className="hidden md:flex" />
          <AdBanner size="rectangle" className="md:hidden" />
        </div>
      </section>

      {/* Related Businesses */}
      {relatedBusinesses.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/40 border-t border-border">
          <div className="container text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
              More {business.category} in {town.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBusinesses.map((related, index) => (
                <div key={related.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BusinessCard business={related} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Business;
