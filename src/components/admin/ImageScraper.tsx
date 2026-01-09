import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, Loader2, CheckCircle, XCircle } from "lucide-react";
import type { Business } from "@/types/business";

interface ImageScraperProps {
  businesses: Business[];
  onComplete: () => void;
}

interface ScrapeResult {
  id: string;
  name: string;
  status: "pending" | "success" | "error" | "skipped";
  error?: string;
}

export const ImageScraper = ({ businesses, onComplete }: ImageScraperProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ScrapeResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isPlaceholderImage = (image?: string | null) => {
    const value = (image || "").trim();
    return (
      !value ||
      value.includes("placeholder") ||
      value.includes("unsplash.com")
    );
  };

  const isUnsupportedWebsite = (website?: string | null) => {
    if (!website) return false;
    const w = website.toLowerCase();
    // Common social/profile hosts that Firecrawl frequently won't support
    return (
      w.includes("facebook.com") ||
      w.includes("fb.com") ||
      w.includes("instagram.com") ||
      w.includes("tiktok.com") ||
      w.includes("linkedin.com") ||
      w.includes("x.com") ||
      w.includes("twitter.com")
    );
  };

  const businessesWithWebsites = businesses.filter(
    (b) => b.website && b.website.trim() !== ""
  );

  const businessesToScrape = businessesWithWebsites.filter(
    (b) => isPlaceholderImage(b.image)
  );

  const alreadyHaveImages = businessesWithWebsites.length - businessesToScrape.length;

  const scrapeImages = async () => {
    setIsRunning(true);
    setResults([]);
    setCurrentIndex(0);

    const newResults: ScrapeResult[] = businessesToScrape.map((b) => ({
      id: b.id,
      name: b.name,
      status: "pending" as const,
    }));
    setResults(newResults);

    for (let i = 0; i < businessesToScrape.length; i++) {
      const business = businessesToScrape[i];
      setCurrentIndex(i + 1);

      try {
        if (isUnsupportedWebsite(business.website)) {
          newResults[i] = {
            ...newResults[i],
            status: "skipped",
            error: "Unsupported website (social profile)",
          };
          setResults([...newResults]);
          continue;
        }

        const { data, error } = await supabase.functions.invoke(
          "scrape-business-image",
          {
            body: {
              businessId: business.id,
              websiteUrl: business.website,
            },
          }
        );

        if (error || !data?.success) {
          const rawError = error?.message || data?.error || "Unknown error";

          // Simplify common error messages
          let friendlyError = rawError;
          if (rawError.includes("not currently supported")) {
            friendlyError = "Site not supported";
          } else if (rawError.includes("No screenshot")) {
            friendlyError = "No image found";
          }

          newResults[i] = {
            ...newResults[i],
            status: rawError.includes("not currently supported") ? "skipped" : "error",
            error: friendlyError,
          };
        } else {
          newResults[i] = { ...newResults[i], status: "success" };
        }
      } catch (err: unknown) {
        newResults[i] = {
          ...newResults[i],
          status: "error",
          error: err instanceof Error ? err.message : "Failed to scrape",
        };
      }

      setResults([...newResults]);

      // Small delay between requests to avoid rate limiting
      if (i < businessesToScrape.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    const successCount = newResults.filter((r) => r.status === "success").length;
    const errorCount = newResults.filter((r) => r.status === "error").length;

    if (successCount > 0) {
      toast.success(`Scraped ${successCount} images successfully!`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} businesses failed to scrape.`);
    }

    setIsRunning(false);
    onComplete();
  };

  const progress =
    businessesToScrape.length > 0
      ? (currentIndex / businessesToScrape.length) * 100
      : 0;

  const totalBusinesses = businesses.length;
  const withWebsite = businessesWithWebsites.length;
  const withoutWebsite = totalBusinesses - withWebsite;
  const needsScraping = businessesToScrape.length;

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          <strong>{totalBusinesses}</strong> total businesses
        </p>
        <p>
          <strong>{withWebsite}</strong> have websites
        </p>
        <p>
          <strong>{alreadyHaveImages}</strong> already have images (skipped)
        </p>
        <p>
          <strong>{withoutWebsite}</strong> without websites (skipped)
        </p>
        <p className="text-foreground font-medium">
          <strong>{needsScraping}</strong> need images and will be scraped
        </p>
      </div>

      {!isRunning && results.length === 0 && (
        <Button
          onClick={scrapeImages}
          disabled={needsScraping === 0}
          className="w-full"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {needsScraping > 0 
            ? `Scrape Images for ${needsScraping} Businesses`
            : "All businesses have images"
          }
        </Button>
      )}

      {isRunning && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>
              Scraping {currentIndex} of {needsScraping}...
            </span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {results.length > 0 && (
        <div className="max-h-60 overflow-y-auto space-y-1 border rounded-lg p-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-muted/50"
            >
              {result.status === "pending" && (
                <div className="w-4 h-4 rounded-full bg-muted" />
              )}
              {result.status === "success" && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {result.status === "skipped" && (
                <div className="w-4 h-4 rounded-full border border-muted-foreground/40" />
              )}
              {result.status === "error" && (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
              <span className="truncate flex-1">{result.name}</span>
              {result.error && (
                <span
                  className={`text-xs truncate max-w-[150px] ${
                    result.status === "error" ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {result.error}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {!isRunning && results.length > 0 && (
        <Button onClick={scrapeImages} variant="outline" className="w-full">
          <ImageIcon className="w-4 h-4 mr-2" />
          Run Again
        </Button>
      )}
    </div>
  );
};
