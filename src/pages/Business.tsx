import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Globe, Phone, Instagram, ExternalLink, Star } from "lucide-react";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import AdBanner from "@/components/AdBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBusinessBySlug, getRelatedBusinesses } from "@/data/businesses";
import { getCategoryIcon, getCategorySlug } from "@/types/business";
import { useTown } from "@/contexts/TownContext";

const TripAdvisorRating = ({ rating, url }: { rating: number; url?: string }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const RatingContent = () => (
    <div className="flex items-center gap-2.5">
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

const Business = () => {
  const { slug } = useParams<{ slug: string }>();
  const business = getBusinessBySlug(slug || "");
  const { town, townSlug } = useTown();

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

  const relatedBusinesses = getRelatedBusinesses(business, 3);
  const encodedAddress = encodeURIComponent(business.address);

  return (
    <Layout>
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 lg:h-[28rem] overflow-hidden bg-muted">
        <img
          src={business.image}
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

              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                {business.name}
              </h1>

              {business.tripadvisorRating && (
                <div className="mb-6">
                  <TripAdvisorRating rating={business.tripadvisorRating} url={business.tripadvisorUrl} />
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

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                <iframe
                  title={`Map showing ${business.name}`}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`}
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
