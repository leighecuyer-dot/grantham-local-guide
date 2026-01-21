import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const VerifiedBadge = ({ className, showText = false, size = "md" }: VerifiedBadgeProps) => {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-blue-500",
        className
      )}
      title="Verified Business"
    >
      <BadgeCheck className={cn(iconSize, "fill-blue-500 text-white")} />
      {showText && <span className={cn(textSize, "font-medium")}>Verified</span>}
    </div>
  );
};

export default VerifiedBadge;
