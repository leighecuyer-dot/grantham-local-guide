import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, Globe, Phone, Instagram, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBusinessBySlug, getRelatedBusinesses } from "@/data/businesses";
import { getCategoryIcon, getCategorySlug } from "@/types/business";

const TripAdvisorRating = ({ rating, url }: { rating: number; url?: string }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const RatingContent = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
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
      <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
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

  if (!business) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Business Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find that business.
          </p>
          <Button asChild>
            <Link to="/categories">Browse Directory</Link>
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
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-muted">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          <Button asChild variant="ghost" className="mb-6 -ml-4">
            <Link to={`/category/${getCategorySlug(business.category)}`}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to {business.category}
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {getCategoryIcon(business.category)} {business.category}
                </Badge>
                {business.featured && (
                  <Badge className="bg-primary/10 text-primary border-0">
                    ⭐ Featured
                  </Badge>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {business.name}
              </h1>

              {business.tripadvisorRating && (
                <div className="mb-4">
                  <TripAdvisorRating rating={business.tripadvisorRating} url={business.tripadvisorUrl} />
                </div>
              )}

              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{business.address}</span>
              </div>

              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-lg leading-relaxed text-foreground/90">
                  {business.description}
                </p>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-border mb-8">
                <iframe
                  title={`Map showing ${business.name}`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                  Contact Details
                </h3>
                <div className="space-y-3">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">{business.phone}</span>
                    </a>
                  )}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground flex-1">Visit Website</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                  {business.instagram && (
                    <a
                      href={business.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground flex-1">Instagram</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Is this your business?
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/contact">Claim Listing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Businesses */}
      {relatedBusinesses.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              More {business.category} in Grantham
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBusinesses.map((related) => (
                <BusinessCard key={related.id} business={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Business;
