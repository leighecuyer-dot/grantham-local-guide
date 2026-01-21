import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { useTown } from "@/contexts/TownContext";
import { getCategorySlug } from "@/types/business";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showButton?: boolean;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search businesses...", 
  className = "",
  showButton = false 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { townSlug } = useTown();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [] } = useSearchSuggestions(query, !onSearch);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query);
    } else if (query.trim()) {
      navigate(`/${townSlug}/categories?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length >= 2 && !onSearch);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={() => query.length >= 2 && !onSearch && setShowSuggestions(true)}
              placeholder={placeholder}
              className="pl-14 pr-5 h-14 text-base rounded-2xl border-border bg-card shadow-sm hover:shadow-md focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all duration-200"
              autoComplete="off"
            />
          </div>
          {showButton && (
            <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-shadow">
              Search
            </Button>
          )}
        </div>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
          {suggestions.map((business) => (
            <Link
              key={business.id}
              to={`/${townSlug}/business/${business.slug}`}
              onClick={() => setShowSuggestions(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{business.name}</p>
                <p className="text-xs text-muted-foreground">{business.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
