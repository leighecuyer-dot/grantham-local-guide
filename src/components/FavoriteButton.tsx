import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  businessId: string;
  className?: string;
  size?: "sm" | "md";
}

const FavoriteButton = ({ businessId, className, size = "sm" }: FavoriteButtonProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(businessId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(businessId);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all",
        size === "sm" ? "w-8 h-8" : "w-10 h-10",
        favorited && "bg-rose-500/10 border-rose-500/30",
        className
      )}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "transition-all",
          size === "sm" ? "w-4 h-4" : "w-5 h-5",
          favorited ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500"
        )}
      />
    </button>
  );
};

export default FavoriteButton;
