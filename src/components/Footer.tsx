import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    // Simulate subscription - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Thanks for subscribing! We'll keep you updated.");
    setEmail("");
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
              Get weekly updates on new businesses, local events, and exclusive offers in Grantham.
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
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">G</span>
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                Grantham Local
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Discover the best local businesses in Grantham. From cafés to tradespeople, 
              find everything you need in our community directory.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/add-listing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Add Your Business
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Popular Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/cafe" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cafés
                </Link>
              </li>
              <li>
                <Link to="/category/restaurant" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/category/barbers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Barbers
                </Link>
              </li>
              <li>
                <Link to="/category/beauty" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Beauty
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Grantham Local. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ in Grantham, NG31
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
