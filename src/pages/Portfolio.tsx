import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTown } from "@/contexts/TownContext";
import granthamSkyline from "@/assets/grantham-skyline.jpg";
import discoverLocalLogo from "@/assets/discover-local-logo.png";

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

      {/* Coming Soon Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-primary" />
              </div>
            </div>
            <Badge variant="outline" className="border-primary text-primary px-4 py-1.5 text-base font-semibold mb-6">
              <Globe className="w-4 h-4 mr-2 inline" />
              Portfolio
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Coming Soon
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're currently working with local businesses to build their perfect websites. 
              Check back soon to see our growing portfolio of work.
            </p>
            <p className="text-muted-foreground mb-10">
              In the meantime, get in touch to discuss your project and be among our first featured clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/${townSlug}/contact`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Get in Touch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to={`/${townSlug}/advertise`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Our Services
                </Button>
              </Link>
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
                Want to Be Featured?
              </h2>
              <p className="text-muted-foreground mb-6">
                Get a professional website for your business starting from just £299. 
                Be among the first to be showcased in our portfolio.
              </p>
              <Link to={`/${townSlug}/contact`}>
                <Button size="lg">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
