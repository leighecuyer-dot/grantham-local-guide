import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, MapPin, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-light to-background py-12 md:py-16">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            About Discover Local
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Connecting residents with the best local businesses in Grantham and 
            helping small businesses thrive in our community.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Discover Local was created with a simple goal: to make it easy for 
                  residents to discover and support the amazing local businesses in their town.
                </p>
                <p>
                  From independent cafés to skilled tradespeople, from beauty salons to 
                  kids' activities, Grantham has so much to offer. We believe that when 
                  we support local businesses, we strengthen our entire community.
                </p>
                <p>
                  Our directory is free for businesses to join, because we believe every 
                  local business deserves visibility, regardless of their marketing budget.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-card rounded-xl border border-border p-6">
                <Heart className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">Community First</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritise the needs of our local community above all else.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">Support Local</h3>
                <p className="text-sm text-muted-foreground">
                  Every listing helps a local business reach more customers.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">Truly Local</h3>
                <p className="text-sm text-muted-foreground">
                  Every business in our directory is based in or near Grantham.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">Always Free</h3>
                <p className="text-sm text-muted-foreground">
                  Basic listings will always be free for local businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                12+
              </div>
              <p className="text-muted-foreground">Local Businesses Listed</p>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                9
              </div>
              <p className="text-muted-foreground">Business Categories</p>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                NG31
              </div>
              <p className="text-muted-foreground">Proudly Serving Grantham</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            Looking Ahead
          </h2>
          <div className="space-y-4 text-foreground/80 text-center">
            <p>
              We're just getting started! Our plans include expanding to nearby towns 
              and villages, adding customer reviews, and creating more ways for local 
              businesses to connect with their community.
            </p>
            <p>
              If you have ideas for how we can improve, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Join Our Directory
            </h2>
            <p className="opacity-90 mb-6 max-w-lg mx-auto">
              If you run a local business in Grantham, we'd love to feature you 
              in our directory. It's completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/add-listing">
                  Add Your Business
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
