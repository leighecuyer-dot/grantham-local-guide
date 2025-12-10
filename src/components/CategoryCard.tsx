import { Link } from "react-router-dom";
import { Category, getCategorySlug, getCategoryIcon } from "@/types/business";
import { businesses } from "@/data/businesses";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const count = businesses.filter((b) => b.category === category).length;

  return (
    <Link
      to={`/category/${getCategorySlug(category)}`}
      className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl group-hover:bg-primary/10 transition-colors">
        {getCategoryIcon(category)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
          {category}
        </h3>
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? "business" : "businesses"}
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
};

export default CategoryCard;
