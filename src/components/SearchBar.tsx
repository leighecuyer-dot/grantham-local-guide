import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else if (query.trim()) {
      navigate(`/categories?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className="pl-14 pr-5 h-14 text-base rounded-2xl border-border bg-card shadow-sm hover:shadow-md focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all duration-200"
          />
        </div>
        {showButton && (
          <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-shadow">
            Search
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;