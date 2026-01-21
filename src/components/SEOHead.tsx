import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "business.business";
  keywords?: string;
}

const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  ogType = "website",
  keywords,
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tags
    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);

    // Open Graph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:image", ogImage, true);
    if (canonicalUrl) setMeta("og:url", canonicalUrl, true);

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    }
  }, [title, description, canonicalUrl, ogImage, ogType, keywords]);

  return null;
};

export default SEOHead;
