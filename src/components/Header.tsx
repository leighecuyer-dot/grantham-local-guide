import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTown, TOWNS } from "@/contexts/TownContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { town, townSlug } = useTown();

  const navLinks = [
    { href: `/${townSlug}`, label: "Home" },
    { href: `/${townSlug}/categories`, label: "Browse" },
    { href: `/${townSlug}/about`, label: "About" },
    { href: `/${townSlug}/contact`, label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === `/${townSlug}`) {
      return location.pathname === `/${townSlug}` || location.pathname === `/${townSlug}/`;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to={`/${townSlug}`} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-base font-bold text-primary-foreground">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold text-foreground leading-tight">
              Discover Local
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {town.name}
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {TOWNS.map((t) => (
                  <DropdownMenuItem key={t.slug} asChild>
                    <Link 
                      to={`/${t.slug}`}
                      className={cn(t.slug === townSlug && "font-medium text-primary")}
                    >
                      {t.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-3.5 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive(link.href)
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="ml-3 rounded-lg h-9" size="sm">
            <Link to={`/${townSlug}/add-listing`}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Listing
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="container py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={`/${townSlug}/add-listing`}
              onClick={() => setIsOpen(false)}
              className="mt-2 px-4 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground text-center"
            >
              Add Your Business
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
