import { Link } from "react-router-dom";
import { ArrowRight, Search, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import CategoryCard from "@/components/CategoryCard";
import { CATEGORIES } from "@/types/business";
import { getFeaturedBusinesses, getLatestBusinesses } from "@/data/businesses";

const Index = () => {
  const featuredBusinesses = getFeaturedBusinesses();
  const latestBusinesses = getLatestBusinesses(6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-light to-background py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Discover the Best Local Businesses in{" "}
              <span className="text-primary">Grantham</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Browse cafés, barbers, salons, shops, and local services — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="text-base">
                <Link to="/categories">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Directory
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/add-listing">
                  Add Your Business
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find exactly what you're looking for in Grantham
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Businesses
              </h2>
              <p className="text-muted-foreground">
                Hand-picked local favourites
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link to="/categories">
                View all
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.slice(0, 6).map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link to="/categories">
                View all businesses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Latest Additions
              </h2>
              <p className="text-muted-foreground">
                Recently added to our directory
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              About Grantham Local
            </h2>
            <p className="text-lg opacity-90 mb-8">
              We're on a mission to support local businesses in Grantham and help residents 
              discover the amazing services right on their doorstep. From independent cafés 
              to skilled tradespeople, our directory makes it easy to find and support local.
            </p>
            <div className="grid gap-8 sm:grid-cols-3 mt-12">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Easy to Find</h3>
                <p className="text-sm opacity-80">Browse by category or search for specific services</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Truly Local</h3>
                <p className="text-sm opacity-80">Every business is based in or around Grantham</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Community First</h3>
                <p className="text-sm opacity-80">Supporting local businesses strengthens our community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="bg-secondary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Own a Local Business?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Get your business listed in our directory and reach more customers in Grantham. 
              It's free to add a basic listing!
            </p>
            <Button asChild size="lg">
              <Link to="/add-listing">
                Add Your Business Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
