import { Link } from "react-router-dom";
import { ArrowRight, Search, Eye, Sparkles, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES } from "@/types/business";
import { getFeaturedBusinesses, getLatestBusinesses } from "@/data/businesses";

const Index = () => {
  const featuredBusinesses = getFeaturedBusinesses();
  const latestBusinesses = getLatestBusinesses(6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-background to-background pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              The modern way to discover local
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground mb-6 animate-fade-in leading-[1.1]">
              Discover the Best Local Businesses in{" "}
              <span className="gradient-text">Grantham</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              A modern directory for cafés, barbers, beauty, shops, services and hidden gems. Visual, searchable, and beautifully designed.
            </p>
            <div className="animate-fade-in max-w-2xl mx-auto mb-10" style={{ animationDelay: "0.2s" }}>
              <SearchBar 
                placeholder="Search businesses, services, or categories..." 
                showButton
              />
            </div>
            <div className="flex flex-wrap gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {CATEGORIES.slice(0, 5).map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
                  className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {category}
                </Link>
              ))}
              <Link
                to="/categories"
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View All →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-green-100 to-transparent blur-3xl translate-x-1/3" />
      </section>

      {/* Why Different Section */}
      <section className="py-20 md:py-24 border-b border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why This Directory is Different
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Built for the modern age. Not another outdated business list.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-green-50 to-background border border-border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                More Visual
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Every listing features photos, maps, and rich details. See what you're getting before you visit.
              </p>
            </div>
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-green-50 to-background border border-border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Easier to Search
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Powerful search and filters help you find exactly what you need in seconds, not minutes.
              </p>
            </div>
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-green-50 to-background border border-border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Info className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                More Detailed
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete info including hours, ratings, social links, and embedded maps. Everything in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Hand-picked
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured Businesses
              </h2>
            </div>
            <Button asChild variant="outline" className="w-fit">
              <Link to="/categories">
                View all
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.slice(0, 6).map((business, index) => (
              <div key={business.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-24 bg-muted/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Find exactly what you're looking for in Grantham
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <div key={category} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Latest Additions
              </h2>
              <p className="text-muted-foreground text-lg mt-2">
                Recently added to our directory
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBusinesses.map((business, index) => (
              <div key={business.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-green-600 to-green-700 rounded-3xl p-10 md:p-16 text-center">
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Own a Local Business?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-lg mx-auto text-lg">
                Get your business listed in our directory and reach more customers in Grantham. It's completely free!
              </p>
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/add-listing">
                  Add Your Business Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;