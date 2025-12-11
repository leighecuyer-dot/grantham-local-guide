import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTown } from "@/contexts/TownContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { town, townSlug } = useTown();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: trimmedEmail });

    if (error) {
      if (error.code === '23505') {
        toast.info("You're already subscribed!");
      } else {
        console.error("Newsletter subscription error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.success("Thanks for subscribing! We'll keep you updated.");
      setEmail("");
    }
    
    setIsLoading(false);
  };

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-border">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              Stay in the Loop
            </h3>
            <p className="text-muted-foreground mb-6">
              Get weekly updates on new businesses, local events, and exclusive offers in {town.name}.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-11 bg-background"
              />
              <Button type="submit" disabled={isLoading} className="h-11 px-6">
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to={`/${townSlug}`} className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">D</span>
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                Discover Local
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Discover the best local businesses in {town.name}. From cafés to tradespeople, 
              find everything you need in our community directory.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to={`/${townSlug}/categories`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/local-guides`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Local Guides
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/add-listing`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Add Your Business
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/advertise`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  For Businesses
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/ai-tools`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/about`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/contact`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Popular Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to={`/${townSlug}/category/cafe`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cafés
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/category/restaurant`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/category/barbers`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Barbers
                </Link>
              </li>
              <li>
                <Link to={`/${townSlug}/category/beauty`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Beauty
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Discover Local. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to={`/${townSlug}/about`} className="hover:text-primary transition-colors">Terms</Link>
            <Link to={`/${townSlug}/about`} className="hover:text-primary transition-colors">Privacy</Link>
            <span>Made with ❤️ in {town.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
