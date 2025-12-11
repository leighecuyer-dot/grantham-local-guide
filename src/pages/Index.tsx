import { Link } from "react-router-dom";
import { ArrowRight, Search, MapPin, Star, TrendingUp, Clock, Coffee, Utensils, Scissors, Sparkles, ShoppingBag, Wrench, Baby, Briefcase, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES, Category, getCategorySlug } from "@/types/business";
import { getFeaturedBusinesses, getLatestBusinesses } from "@/data/businesses";
import { useTown } from "@/contexts/TownContext";

const categoryIcons: Record<Category, React.ReactNode> = {
  "Café": <Coffee className="w-5 h-5" />,
  "Restaurant": <Utensils className="w-5 h-5" />,
  "Barbers": <Scissors className="w-5 h-5" />,
  "Beauty": <Sparkles className="w-5 h-5" />,
  "Retail": <ShoppingBag className="w-5 h-5" />,
  "Trades": <Wrench className="w-5 h-5" />,
  "Kids Activities": <Baby className="w-5 h-5" />,
  "Services": <Briefcase className="w-5 h-5" />,
  "Gyms & Fitness": <Dumbbell className="w-5 h-5" />,
};

const Index = () => {
  const featuredBusinesses = getFeaturedBusinesses();
  const latestBusinesses = getLatestBusinesses(6);
  const { town, townSlug } = useTown();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary via-background to-background">
        <div className="container relative z-10 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.1] tracking-tight">
              Discover the Best of{" "}
              <span className="text-primary">{town.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Cafés, bars, salons, shops, trades, gyms and local favourites — all in one place.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-12">
              <SearchBar 
                placeholder="Search businesses, services, or categories..." 
                showButton
              />
            </div>

            {/* Category Quick Links */}
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.slice(0, 6).map((category) => (
                <Link
                  key={category}
                  to={`/${townSlug}/category/${getCategorySlug(category)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <span className="text-primary">{categoryIcons[category]}</span>
                  {category}
                </Link>
              ))}
              <Link
                to={`/${townSlug}/categories`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Featured Local Picks */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                <Star className="w-4 h-4" />
                Featured
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Featured Local Picks
              </h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked favourites from {town.name}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to={`/${townSlug}/categories`}>
                View all businesses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.slice(0, 6).map((business, index) => (
              <div key={business.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Browse by Category
            </h2>
            <p className="text-muted-foreground">
              Find exactly what you're looking for in {town.name}
            </p>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <Link
                key={category}
                to={`/${townSlug}/category/${getCategorySlug(category)}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {categoryIcons[category]}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse local {category.toLowerCase()}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New This Month */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-primary text-sm font-medium mb-3">
                <Clock className="w-4 h-4" />
                New
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                New This Month
              </h2>
              <p className="text-muted-foreground mt-2">
                Recently added to our directory
              </p>
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBusinesses.map((business, index) => (
              <div key={business.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Nearby */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <MapPin className="w-4 h-4" />
              Nearby
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Explore Nearby
            </h2>
            <p className="text-muted-foreground">
              Quick links to popular categories around you
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {["Café", "Restaurant", "Beauty", "Barbers", "Retail"].map((cat) => (
              <Link
                key={cat}
                to={`/${townSlug}/category/${getCategorySlug(cat as Category)}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border text-foreground font-medium hover:border-primary hover:text-primary transition-all"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {cat}s Near You
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="relative overflow-hidden bg-primary rounded-2xl p-10 md:p-14 text-center">
            <div className="relative z-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                Own a Local Business?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-md mx-auto">
                Get your business listed and reach more customers in {town.name}. It's free!
              </p>
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to={`/${townSlug}/add-listing`}>
                  Add Your Business Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-primary-foreground/5 blur-2xl" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
