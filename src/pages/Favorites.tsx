import { useQuery } from "@tanstack/react-query";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useTown } from "@/contexts/TownContext";
import { supabase } from "@/integrations/supabase/client";
import { Business } from "@/types/business";
import { Database } from "@/integrations/supabase/types";
import SEOHead from "@/components/SEOHead";

type DbBusiness = Database["public"]["Tables"]["businesses"]["Row"];

const mapDbToBusiness = (db: DbBusiness): Business => ({
  id: db.id,
  name: db.name,
  slug: db.slug,
  category: db.category,
  description: db.description,
  address: db.address,
  phone: db.phone ?? undefined,
  website: db.website ?? undefined,
  instagram: db.instagram ?? undefined,
  email: db.email ?? undefined,
  image: db.image,
  featured: db.featured,
  tripadvisorRating: db.tripadvisor_rating ? Number(db.tripadvisor_rating) : undefined,
  tripadvisorUrl: db.tripadvisor_url ?? undefined,
  googleRating: db.google_rating ? Number(db.google_rating) : undefined,
  googleReviewsUrl: db.google_reviews_url ?? undefined,
  tags: (db.tags ?? []) as Business["tags"],
  views: db.views,
  town: db.town,
  openingHours: db.opening_hours as Business["openingHours"],
  verified: db.verified,
});

const Favorites = () => {
  const { favorites } = useFavorites();
  const { townSlug, town } = useTown();

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["favorites", favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .in("id", favorites);
      
      if (error) throw error;
      return (data || []).map(mapDbToBusiness);
    },
    enabled: favorites.length > 0,
  });

  // Filter to current town
  const townBusinesses = businesses.filter((b) => b.town === townSlug);

  return (
    <Layout>
      <SEOHead
        title={`My Favorites | Discover ${town.name}`}
        description={`View your saved favorite businesses in ${town.name}`}
      />

      <section className="section-padding">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-10">
            <Link
              to={`/${townSlug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold">
                  My Favorites
                </h1>
                <p className="text-muted-foreground mt-1">
                  {townBusinesses.length} saved {townBusinesses.length === 1 ? "business" : "businesses"} in {town.name}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border animate-pulse">
                  <div className="aspect-[16/10] bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : townBusinesses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring and tap the heart icon on any business to save it here for quick access.
              </p>
              <Link
                to={`/${townSlug}/categories`}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Businesses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {townBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Favorites;
