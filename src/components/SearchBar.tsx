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
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className="pl-12 pr-4 h-12 text-base rounded-xl border-border/50 bg-background shadow-sm focus-visible:ring-primary"
          />
        </div>
        {showButton && (
          <Button type="submit" className="h-12 px-6 rounded-xl">
            Search
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
