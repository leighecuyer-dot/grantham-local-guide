import { Link } from "react-router-dom";
import { Category, getCategorySlug } from "@/types/business";
import { businesses } from "@/data/businesses";
import { ArrowRight, Coffee, Utensils, Scissors, Sparkles, ShoppingBag, Wrench, Baby, Briefcase, Dumbbell, Trophy, Monitor, Hotel, Heart, Beer } from "lucide-react";
import { useTown } from "@/contexts/TownContext";

interface CategoryCardProps {
  category: Category;
}

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

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { townSlug } = useTown();
  const count = businesses.filter((b) => b.category === category).length;

  return (
    <Link
      to={`/${townSlug}/category/${getCategorySlug(category)}`}
      className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {categoryIcons[category]}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
          {category}
        </h3>
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? "listing" : "listings"}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
};

export default CategoryCard;
