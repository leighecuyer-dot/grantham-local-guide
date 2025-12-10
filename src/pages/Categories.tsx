import Layout from "@/components/Layout";
import CategoryCard from "@/components/CategoryCard";
import { CATEGORIES } from "@/types/business";

const Categories = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-light to-background py-12 md:py-16">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore local businesses in Grantham by category. Find exactly what you're looking for.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
