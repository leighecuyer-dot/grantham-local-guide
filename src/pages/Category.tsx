import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { getCategoryFromSlug, getCategoryIcon } from "@/types/business";
import { getBusinessesByCategory } from "@/data/businesses";
import { useTown } from "@/contexts/TownContext";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryFromSlug(slug || "");
  const [searchQuery, setSearchQuery] = useState("");
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
    const featuredFirst = [...allBusinesses].sort((a, b) => 
      (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    );
    
    if (!searchQuery.trim()) return featuredFirst;
    
    const query = searchQuery.toLowerCase();
    return featuredFirst.filter(
      (business) =>
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.address.toLowerCase().includes(query)
    );
  }, [allBusinesses, searchQuery]);

  const featuredCount = allBusinesses.filter((b) => b.featured).length;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-light to-background py-12 md:py-16">
        <div className="container">
          <Button asChild variant="ghost" className="mb-6 -ml-4">
            <Link to={`/${townSlug}/categories`}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              All Categories
            </Link>
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{getCategoryIcon(category)}</span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Best {category} in {town.name}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Browse {town.name}'s top {category.toLowerCase()} below. 
            {featuredCount > 0 && " Featured businesses are shown first."}
          </p>
          <SearchBar
            onSearch={setSearchQuery}
            placeholder={`Search ${category.toLowerCase()}...`}
            className="max-w-md"
          />
        </div>
      </section>

      {/* Listings */}
      <section className="py-12 md:py-16">
        <div className="container">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-6">
                {searchQuery 
                  ? `No businesses found matching "${searchQuery}"`
                  : "No businesses in this category yet. Be the first to list!"}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link to={`/${townSlug}/add-listing`}>Add Your Business</Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredBusinesses.length} {filteredBusinesses.length === 1 ? "business" : "businesses"}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
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
