import { createContext, useContext, ReactNode } from "react";
import { useParams } from "react-router-dom";

export interface Town {
  slug: string;
  name: string;
  postcode: string;
}

export const TOWNS: Town[] = [
  { slug: "grantham", name: "Grantham", postcode: "NG31" },
  { slug: "lincoln", name: "Lincoln", postcode: "LN1" },
  { slug: "sleaford", name: "Sleaford", postcode: "NG34" },
];

interface TownContextType {
  town: Town;
  townSlug: string;
}

const TownContext = createContext<TownContextType | null>(null);

export const TownProvider = ({ children }: { children: ReactNode }) => {
  const { town: townSlug } = useParams<{ town: string }>();
  
  const town = TOWNS.find(t => t.slug === townSlug) || TOWNS[0];

  return (
    <TownContext.Provider value={{ town, townSlug: town.slug }}>
      {children}
    </TownContext.Provider>
  );
};

export const useTown = () => {
  const context = useContext(TownContext);
  if (!context) {
    // Return default town if outside provider
    return { town: TOWNS[0], townSlug: TOWNS[0].slug };
  }
  return context;
};

export const getTownPath = (townSlug: string, path: string = "") => {
  return `/${townSlug}${path}`;
};
