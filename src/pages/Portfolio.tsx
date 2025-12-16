import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTown } from "@/contexts/TownContext";
import granthamSkyline from "@/assets/grantham-skyline.jpg";
import discoverLocalLogo from "@/assets/discover-local-logo.png";

interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  url?: string;
  features: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

const portfolioProjects: PortfolioProject[] = [
  {
    id: "1",
    name: "The Garden Café",
    category: "Restaurant & Café",
    description: "A beautiful, modern website for a local café featuring online menu, table reservations, and Instagram integration.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60",
    features: ["Online Menu", "Table Booking", "Gallery", "Contact Form"],
    testimonial: {
      quote: "Our new website has increased our bookings by 40%. The team really understood what we needed.",
      author: "Sarah Johnson",
      role: "Owner, The Garden Café"
    }
  },
  {
    id: "2",
    name: "Elite Barbers",
    category: "Barbers & Grooming",
    description: "A sleek, masculine website with online booking integration and a gallery showcasing their best work.",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=60",
    features: ["Online Booking", "Service Prices", "Team Profiles", "Reviews"],
    testimonial: {
      quote: "Professional, fast, and exactly what we wanted. Highly recommend for any local business.",
      author: "Mike Thompson",
      role: "Owner, Elite Barbers"
    }
  },
  {
    id: "3",
    name: "Bloom Beauty Studio",
    category: "Beauty & Wellness",
    description: "An elegant, feminine website featuring treatment menus, online booking, and a stunning before/after gallery.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=60",
    features: ["Treatment Menu", "Online Booking", "Gift Vouchers", "Before/After Gallery"],
    testimonial: {
      quote: "The website captures our brand perfectly. Our clients love how easy it is to book online now.",
      author: "Emma Davis",
      role: "Founder, Bloom Beauty Studio"
    }
  },
  {
    id: "4",
    name: "HomeFix Trades",
    category: "Trades & Services",
    description: "A trust-building website for a local tradesman featuring service areas, project gallery, and quote requests.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60",
    features: ["Service List", "Quote Request", "Project Gallery", "Testimonials"],
    testimonial: {
      quote: "I've had so many more enquiries since launching the website. Best investment I've made.",
      author: "Dave Williams",
      role: "Owner, HomeFix Trades"
    }
  },
  {
    id: "5",
    name: "Little Stars Nursery",
    category: "Kids Activities",
    description: "A warm, inviting website for a local nursery with parent portal integration, virtual tours, and enrolment forms.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=60",
    features: ["Virtual Tour", "Enrolment Form", "Parent Portal", "News & Events"],
  },
  {
    id: "6",
    name: "FitZone Gym",
    category: "Gyms & Fitness",
    description: "A high-energy website with class timetables, membership options, and trainer profiles.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60",
    features: ["Class Timetable", "Membership Plans", "Trainer Profiles", "Free Trial Signup"],
    testimonial: {
      quote: "The new site brings in 5-10 new membership enquiries every week. Fantastic ROI.",
      author: "James Carter",
      role: "Manager, FitZone Gym"
    }
  },
];

const Portfolio = () => {
  const { townSlug } = useTown();

  return (
    <Layout>
      {/* Logo Banner with Background */}
      <section className="relative w-full py-16 md:py-20 lg:py-24 border-b border-primary/20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${granthamSkyline})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-primary/10" />
        
        <div className="relative z-10 w-full flex flex-col items-center px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-110 animate-pulse" />
            <img 
              src={discoverLocalLogo} 
              alt="Discover Local" 
              className="relative h-48 md:h-64 lg:h-80 xl:h-96 max-w-full object-contain drop-shadow-2xl opacity-0 animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="border-primary text-primary px-4 py-1.5 text-base font-semibold mb-6">
              <Globe className="w-4 h-4 mr-2 inline" />
              Our Work
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Websites We've Built for Local Businesses
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Take a look at some of the beautiful, functional websites we've created for businesses just like yours.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {portfolioProjects.map((project, index) => (
              <Card 
                key={project.id}
                className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                    {project.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {project.testimonial && (
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground italic mb-2">
                        "{project.testimonial.quote}"
                      </p>
                      <p className="text-xs text-foreground font-medium">
                        {project.testimonial.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.testimonial.role}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Websites Built</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2 Weeks</div>
              <p className="text-muted-foreground">Average Delivery</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-primary/30 bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Ready to Get Your Own Website?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join the growing list of local businesses with professional websites. 
                Starting from just £299.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={`/${townSlug}/contact`}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Get a Free Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={`/${townSlug}/advertise`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
