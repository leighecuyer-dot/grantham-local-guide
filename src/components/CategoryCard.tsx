import { Link } from "react-router-dom";
import { Category, getCategorySlug, getCategoryIcon } from "@/types/business";
import { businesses } from "@/data/businesses";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const count = businesses.filter((b) => b.category === category).length;

  return (
    <Link
      to={`/category/${getCategorySlug(category)}`}
      className="group relative flex items-center gap-5 p-5 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-2xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
        {getCategoryIcon(category)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
          {category}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {count} {count === 1 ? "business" : "businesses"}
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        <ArrowUpRight className="w-5 h-5" />
      </div>
    </Link>
  );
};

export default CategoryCard;