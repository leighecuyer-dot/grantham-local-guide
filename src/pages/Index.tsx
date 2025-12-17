import { Link } from "react-router-dom";
import { ArrowRight, Search, MapPin, Star, TrendingUp, Clock, Coffee, Utensils, Scissors, Sparkles, ShoppingBag, Wrench, Baby, Briefcase, Dumbbell, BookOpen, Trophy, Zap, Monitor, Hotel, Heart, Beer } from "lucide-react";
import granthamSkyline from "@/assets/grantham-skyline.jpg";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import SearchBar from "@/components/SearchBar";
import AdBanner from "@/components/AdBanner";
import LogoBanner from "@/components/LogoBanner";
import { CATEGORIES, Category, getCategorySlug } from "@/types/business";
import { getFeaturedBusinesses, getLatestBusinesses, getTrendingBusinesses } from "@/data/businesses";
import { useTown } from "@/contexts/TownContext";

const categoryIcons: Record<Category, React.ReactNode> = {
  "Café": <Coffee className="w-5 h-5" />,
  "Restaurant": <Utensils className="w-5 h-5" />,
  "Pubs & Bars": <Beer className="w-5 h-5" />,
  "Barbers": <Scissors className="w-5 h-5" />,
  "Hairdressers": <Scissors className="w-5 h-5" />,
  "Beauty": <Sparkles className="w-5 h-5" />,
  "Retail": <ShoppingBag className="w-5 h-5" />,
  "Trades": <Wrench className="w-5 h-5" />,
  "Kids Activities": <Baby className="w-5 h-5" />,
  "Services": <Briefcase className="w-5 h-5" />,
  "Gyms & Fitness": <Dumbbell className="w-5 h-5" />,
  "Sport Clubs": <Trophy className="w-5 h-5" />,
  "IT & Technology": <Monitor className="w-5 h-5" />,
  "Hotels & Accommodation": <Hotel className="w-5 h-5" />,
  "Health & Wellbeing": <Heart className="w-5 h-5" />,
};

const Index = () => {
  const featuredBusinesses = getFeaturedBusinesses();
  const latestBusinesses = getLatestBusinesses(6);
  const trendingBusinesses = getTrendingBusinesses(6);
  const { town, townSlug } = useTown();

  return (
    <Layout>
      {/* Logo Banner */}
      <LogoBanner />

      {/* List Your Business CTA */}
      <div className="py-4 text-center bg-gradient-to-r from-transparent via-muted/30 to-transparent">
        <Button asChild variant="outline" size="lg" className="border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all">
          <Link to={`/${townSlug}/add-listing`}>
            List Your Business Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <Link 
          to={`/${townSlug}/advertise`}
          className="inline-flex items-center justify-center gap-2 mt-6 px-4 py-2 text-sm bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-all group"
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span><span className="text-primary font-semibold">Founder Pricing</span> – Lock in discounted rates for 6 months</span>
          <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full animate-pulse">Limited spots</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${granthamSkyline})` }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/90 to-background" />
        {/* Gradient glow effects on top */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Central glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gradient-radial from-primary/15 via-primary/5 to-transparent blur-3xl" />
          {/* Top accent */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[100px]" />
        </div>
        
        <div className="container relative z-10 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.1] tracking-tight opacity-0 animate-fade-in-down">
              Discover the Best of{" "}
              <span className="text-primary">{town.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              Cafés, bars, salons, shops, trades, gyms and local favourites — all in one place.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
              <SearchBar 
                placeholder="Search businesses, services, or categories..." 
                showButton
              />
            </div>

            {/* Category Quick Links */}
            <div className="flex flex-wrap gap-2 justify-center opacity-0 animate-fade-in" style={{ animationDelay: "0.35s" }}>
              {CATEGORIES.slice(0, 6).map((category, index) => (
                <Link
                  key={category}
                  to={`/${townSlug}/category/${getCategorySlug(category)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                >
                  <span className="text-primary">{categoryIcons[category]}</span>
                  {category}
                </Link>
              ))}
              <Link
                to={`/${townSlug}/categories`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/25"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Local Picks */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Featured
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Featured Local Picks
            </h2>
            <p className="text-muted-foreground">
              Hand-picked favourites from {town.name}
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.slice(0, 6).map((business, index) => (
              <div key={business.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-transform">
              <Link to={`/${townSlug}/categories`}>
                View all businesses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending This Week */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Trending
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Trending This Week
            </h2>
            <p className="text-muted-foreground">
              Most viewed businesses in {town.name} right now
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingBusinesses.slice(0, 6).map((business, index) => (
              <div key={business.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Browse by Category */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
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
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
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
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New This Month */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-primary text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              New
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              New This Month
            </h2>
            <p className="text-muted-foreground">
              Recently added to our directory
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBusinesses.map((business, index) => (
              <div key={business.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
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

      {/* Ad Banner */}
      <section className="py-8">
        <div className="container flex justify-center">
          <AdBanner size="leaderboard" className="hidden md:flex" />
          <AdBanner size="rectangle" className="md:hidden" />
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
