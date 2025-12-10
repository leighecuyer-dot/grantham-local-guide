import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import BusinessCard from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { getCategoryFromSlug, getCategoryIcon } from "@/types/business";
import { getBusinessesByCategory } from "@/data/businesses";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryFromSlug(slug || "");

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
            <Link to="/categories">Browse All Categories</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const allBusinesses = getBusinessesByCategory(category);
  const featuredBusinesses = allBusinesses.filter((b) => b.featured);
  const regularBusinesses = allBusinesses.filter((b) => !b.featured);
  const sortedBusinesses = [...featuredBusinesses, ...regularBusinesses];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-light to-background py-12 md:py-16">
        <div className="container">
          <Button asChild variant="ghost" className="mb-6 -ml-4">
            <Link to="/categories">
              <ChevronLeft className="w-4 h-4 mr-1" />
              All Categories
            </Link>
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{getCategoryIcon(category)}</span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Best {category} in Grantham
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse Grantham's top {category.toLowerCase()} below. 
            {featuredBusinesses.length > 0 && " Featured businesses are shown first."}
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="py-12 md:py-16">
        <div className="container">
          {sortedBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-6">
                No businesses in this category yet. Be the first to list!
              </p>
              <Button asChild>
                <Link to="/add-listing">Add Your Business</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {sortedBusinesses.length} {sortedBusinesses.length === 1 ? "business" : "businesses"}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedBusinesses.map((business) => (
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
