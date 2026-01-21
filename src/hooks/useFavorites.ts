import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "discover_local_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = useCallback((businessId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (businessId: string) => favorites.includes(businessId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
};
