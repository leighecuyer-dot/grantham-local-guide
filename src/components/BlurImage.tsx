import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

const BlurImage = ({ src, alt, className, containerClassName }: BlurImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const img = imgRef.current;
    if (img?.complete) {
      setIsLoaded(true);
    }
  }, [isInView]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", containerClassName)}>
      {/* Blur placeholder */}
      <div
        className={cn(
          "absolute inset-0 bg-muted animate-pulse transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="w-full h-full bg-gradient-to-br from-muted via-muted/80 to-muted" />
      </div>
      
      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "transition-all duration-500",
            isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105",
            className
          )}
        />
      )}
    </div>
  );
};

export default BlurImage;
