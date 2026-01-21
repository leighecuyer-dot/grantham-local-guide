import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
  showText?: boolean;
}

const VerifiedBadge = ({ className, showText = false }: VerifiedBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-blue-500",
        className
      )}
      title="Verified Business"
    >
      <BadgeCheck className="w-4 h-4 fill-blue-500 text-white" />
      {showText && <span className="text-xs font-medium">Verified</span>}
    </div>
  );
};

export default VerifiedBadge;
