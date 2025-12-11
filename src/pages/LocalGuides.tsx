import { Link } from "react-router-dom";
import { ChevronRight, Trophy, Gem, Heart, Sparkles, Coffee, Scissors } from "lucide-react";
import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import BusinessCard from "@/components/BusinessCard";
import { useTown } from "@/contexts/TownContext";
import { businesses, getFeaturedBusinesses, getBusinessesByTag } from "@/data/businesses";
import { getCategorySlug } from "@/types/business";

interface GuideSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  businesses: typeof businesses;
  link?: string;
}

const LocalGuides = () => {
  const { town, townSlug } = useTown();
  
  const topCafes = businesses.filter(b => b.category === "Café").sort((a, b) => (b.tripadvisorRating || 0) - (a.tripadvisorRating || 0)).slice(0, 5);
  const topSalons = businesses.filter(b => b.category === "Beauty").sort((a, b) => (b.tripadvisorRating || 0) - (a.tripadvisorRating || 0)).slice(0, 5);
  const hiddenGems = getBusinessesByTag("Hidden gem", 5);
  const localFavourites = getBusinessesByTag("Local favourite", 5);
  const independents = getBusinessesByTag("Independent", 6);

  const guides: GuideSection[] = [
    {
      title: `Top Cafés in ${town.name}`,
      description: "The best spots for coffee, brunch, and a relaxed atmosphere",
      icon: <Coffee className="w-5 h-5" />,
      businesses: topCafes,
      link: `/${townSlug}/category/${getCategorySlug("Café")}`,
    },
    {
      title: `Best Salons for 2025`,
      description: "Award-winning beauty treatments and expert stylists",
      icon: <Scissors className="w-5 h-5" />,
      businesses: topSalons,
      link: `/${townSlug}/category/${getCategorySlug("Beauty")}`,
    },
    {
      title: `Hidden Gems in ${town.name}`,
      description: "Discover the lesser-known local treasures",
      icon: <Gem className="w-5 h-5" />,
      businesses: hiddenGems,
    },
    {
      title: "Most Loved Local Businesses",
      description: "The community favourites everyone's talking about",
      icon: <Heart className="w-5 h-5" />,
      businesses: localFavourites,
    },
    {
      title: "Independent & Proud",
      description: "Support local independent businesses making a difference",
      icon: <Sparkles className="w-5 h-5" />,
      businesses: independents,
    },
  ];

  return (
    <Layout>
      {/* Logo Banner */}
      <LogoBanner showTagline={false} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary via-background to-background py-16 md:py-24">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 opacity-0 animate-fade-in-down">
            <Trophy className="w-4 h-4" />
            Curated Lists
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Local Guides
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Expertly curated lists to help you discover the very best of {town.name}. 
            From top-rated cafés to hidden gems — we've done the research for you.
          </p>
        </div>
      </section>

      {/* Guide Sections */}
      {guides.map((guide, guideIndex) => (
        guide.businesses.length > 0 && (
          <section 
            key={guide.title}
            className={`py-16 md:py-20 ${guideIndex % 2 === 0 ? 'bg-muted/30' : ''}`}
          >
            <div className="container">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                    {guide.icon}
                    {guide.businesses.length} listings
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {guide.title}
                  </h2>
                  <p className="text-muted-foreground max-w-lg">
                    {guide.description}
                  </p>
                </div>
                {guide.link && (
                  <Link 
                    to={guide.link}
                    className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {guide.businesses.slice(0, 3).map((business, index) => (
                  <div 
                    key={business.id} 
                    className="opacity-0 animate-fade-in-up" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <BusinessCard business={business} />
                  </div>
                ))}
              </div>

              {guide.link && (
                <div className="text-center mt-8 md:hidden">
                  <Link 
                    to={guide.link}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    View all {guide.title.toLowerCase()}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )
      ))}

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-10 md:p-14 text-center">
            <div className="relative z-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Know a business that deserves a spot?
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-md mx-auto">
                Help us grow the {town.name} community by suggesting a local favourite.
              </p>
              <Link
                to={`/${townSlug}/add-listing`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background text-foreground font-semibold hover:bg-background/90 transition-colors"
              >
                Suggest a Business
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-primary-foreground/5 blur-2xl" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LocalGuides;