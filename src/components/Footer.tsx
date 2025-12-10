import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
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
