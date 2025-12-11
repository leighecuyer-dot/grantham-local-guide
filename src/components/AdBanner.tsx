import { cn } from "@/lib/utils";

interface AdBannerProps {
  size?: "leaderboard" | "rectangle" | "skyscraper" | "banner";
  className?: string;
}

const sizeConfig = {
  leaderboard: { width: "728px", height: "90px", label: "728x90 Leaderboard" },
  rectangle: { width: "300px", height: "250px", label: "300x250 Rectangle" },
  skyscraper: { width: "160px", height: "600px", label: "160x600 Skyscraper" },
  banner: { width: "100%", height: "90px", label: "Responsive Banner" },
};

const AdBanner = ({ size = "banner", className }: AdBannerProps) => {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-muted/30 rounded-lg text-muted-foreground text-sm",
        className
      )}
      style={{
        width: config.width,
        height: config.height,
        maxWidth: "100%",
      }}
    >
      <div className="text-center p-4">
        <p className="font-medium">Ad Placeholder</p>
        <p className="text-xs opacity-70">{config.label}</p>
        <p className="text-xs opacity-50 mt-1">Google AdSense</p>
      </div>
    </div>
  );
};

export default AdBanner;
