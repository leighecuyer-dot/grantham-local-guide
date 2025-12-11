import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import CategoryCard from "@/components/CategoryCard";
import BusinessCard from "@/components/BusinessCard";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES } from "@/types/business";
import { businesses } from "@/data/businesses";
import { useTown } from "@/contexts/TownContext";

const Categories = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const { town } = useTown();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    return businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query) ||
        business.address.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-light to-background py-12 md:py-16">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Explore local businesses in {town.name} by category, or search for something specific.
          </p>
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search all businesses..."
            className="max-w-md"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          {searchResults ? (
            <>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
              </h2>
              {searchResults.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No businesses found. Try a different search term.
                </p>
              )}
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((category) => (
                <CategoryCard key={category} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
