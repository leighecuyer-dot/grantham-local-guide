import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Filter } from "lucide-react";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { getCategoryFromSlug, type Category as CategoryType } from "@/types/business";
import { getBusinessesByCategory } from "@/data/businesses";
import { useTown } from "@/contexts/TownContext";
import { Coffee, Utensils, Scissors, Sparkles, ShoppingBag, Wrench, Baby, Briefcase, Dumbbell, Trophy } from "lucide-react";

const categoryIcons: Record<CategoryType, React.ReactNode> = {
  "Café": <Coffee className="w-6 h-6" />,
  "Restaurant": <Utensils className="w-6 h-6" />,
  "Barbers": <Scissors className="w-6 h-6" />,
  "Hairdressers": <Scissors className="w-6 h-6" />,
  "Beauty": <Sparkles className="w-6 h-6" />,
  "Retail": <ShoppingBag className="w-6 h-6" />,
  "Trades": <Wrench className="w-6 h-6" />,
  "Kids Activities": <Baby className="w-6 h-6" />,
  "Services": <Briefcase className="w-6 h-6" />,
  "Gyms & Fitness": <Dumbbell className="w-6 h-6" />,
  "Sport Clubs": <Trophy className="w-6 h-6" />,
};

const categoryDescriptions: Record<CategoryType, string> = {
  "Café": "Discover the best coffee shops, tea rooms, and cosy cafés",
  "Restaurant": "Find amazing local restaurants for every occasion",
  "Barbers": "Top-rated barber shops and men's grooming",
  "Hairdressers": "Hair salons and stylists for all your hair care needs",
  "Beauty": "Salons, spas, and beauty treatments near you",
  "Retail": "Independent shops, boutiques, and local stores",
  "Trades": "Trusted local tradespeople and contractors",
  "Kids Activities": "Fun activities and venues for children",
  "Services": "Professional services for home and business",
  "Gyms & Fitness": "Gyms, fitness studios, and wellness centres",
  "Sport Clubs": "Local sports clubs, teams, and athletic organisations",
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryFromSlug(slug || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const { town, townSlug } = useTown();

  if (!category) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Category Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find that category.
          </p>
          <Button asChild>
            <Link to={`/${townSlug}/categories`}>Browse All Categories</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const allBusinesses = getBusinessesByCategory(category);

  const filteredBusinesses = useMemo(() => {
    let result = [...allBusinesses].sort((a, b) => 
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    );
    
    if (showFeaturedOnly) {
      result = result.filter(b => b.featured);
    }
    
    if (!searchQuery.trim()) return result;
    
    const query = searchQuery.toLowerCase();
    return result.filter(
      (business) =>
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.address.toLowerCase().includes(query)
    );
  }, [allBusinesses, searchQuery, showFeaturedOnly]);

  const featuredCount = allBusinesses.filter((b) => b.featured).length;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-14 md:py-20">
        <div className="container text-center">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to={`/${townSlug}/categories`}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              All Categories
            </Link>
          </Button>
          
          <div className="flex items-center justify-center gap-4 mb-4 opacity-0 animate-fade-in-down">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
              {categoryIcons[category]}
            </div>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Best {category} in {town.name}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {categoryDescriptions[category]}. Browse {allBusinesses.length} local {allBusinesses.length === 1 ? 'business' : 'businesses'} below.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <SearchBar
              onSearch={setSearchQuery}
              placeholder={`Search ${category.toLowerCase()}...`}
              className="flex-1"
            />
            {featuredCount > 0 && (
              <Button
                variant={showFeaturedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className="w-fit mx-auto sm:mx-0 hover:scale-105 transition-transform"
              >
                <Filter className="w-4 h-4 mr-2" />
                Featured Only
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-14 md:py-20">
        <div className="container">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-6">
                {searchQuery 
                  ? `No businesses found matching "${searchQuery}"`
                  : showFeaturedOnly
                  ? "No featured businesses in this category"
                  : "No businesses in this category yet. Be the first to list!"}
              </p>
              {!searchQuery && !showFeaturedOnly && (
                <Button asChild className="hover:scale-105 transition-transform">
                  <Link to={`/${townSlug}/add-listing`}>Add Your Business</Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-8 text-center">
                Showing {filteredBusinesses.length} {filteredBusinesses.length === 1 ? "business" : "businesses"}
                {searchQuery && ` for "${searchQuery}"`}
                {showFeaturedOnly && " (featured only)"}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBusinesses.map((business, index) => (
                  <div key={business.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                    <BusinessCard business={business} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Category;
