import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, MapPin, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import LogoBanner from "@/components/LogoBanner";
import { useTown, TOWNS } from "@/contexts/TownContext";

const About = () => {
  const { town, townSlug } = useTown();

  return (
    <Layout>
      {/* Logo Banner */}
      <LogoBanner showTagline={false} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-14 md:py-20">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 opacity-0 animate-fade-in-down">
            Spend local. <span className="text-primary">Discover better.</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 font-medium mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {town.name}'s independent business guide.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.15s" }}>
            A curated guide helping people find great local businesses — and helping independents get seen.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <div className="space-y-4 text-foreground/80">
              <p className="text-lg font-medium text-foreground">
                This guide exists to support independent businesses in {town.name}.
              </p>
              <p>
                Every listing is chosen for quality, reputation, or local recommendation — not paid placement.
              </p>
              <p>
                The aim is simple: help people spend locally and help great businesses get discovered.
              </p>
              <p className="text-sm text-muted-foreground italic mt-6">
                New local guide — growing weekly.
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl border border-border p-6 text-center opacity-0 animate-fade-in-up hover:scale-105 transition-transform" style={{ animationDelay: "0.1s" }}>
              <Heart className="w-8 h-8 text-primary mb-4 mx-auto" />
              <h3 className="font-display font-semibold text-foreground mb-2">Community First</h3>
              <p className="text-sm text-muted-foreground">
                We prioritise the needs of local communities above all else.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center opacity-0 animate-fade-in-up hover:scale-105 transition-transform" style={{ animationDelay: "0.2s" }}>
              <Users className="w-8 h-8 text-primary mb-4 mx-auto" />
              <h3 className="font-display font-semibold text-foreground mb-2">Support Local</h3>
              <p className="text-sm text-muted-foreground">
                Every listing helps a local business reach more customers.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center opacity-0 animate-fade-in-up hover:scale-105 transition-transform" style={{ animationDelay: "0.3s" }}>
              <MapPin className="w-8 h-8 text-primary mb-4 mx-auto" />
              <h3 className="font-display font-semibold text-foreground mb-2">Truly Local</h3>
              <p className="text-sm text-muted-foreground">
                Every business in our directory is based in or near the towns we serve.
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center opacity-0 animate-fade-in-up hover:scale-105 transition-transform" style={{ animationDelay: "0.4s" }}>
              <Sparkles className="w-8 h-8 text-primary mb-4 mx-auto" />
              <h3 className="font-display font-semibold text-foreground mb-2">Always Free</h3>
              <p className="text-sm text-muted-foreground">
                Basic listings will always be free for local businesses.
              </p>
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
                {TOWNS.length}
              </div>
              <p className="text-muted-foreground">Towns Covered</p>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                9
              </div>
              <p className="text-muted-foreground">Business Categories</p>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                {town.postcode}
              </div>
              <p className="text-muted-foreground">Currently viewing {town.name}</p>
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
              We're just getting started! Our plans include expanding to more towns 
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
              If you run a local business in {town.name}, we'd love to feature you 
              in our directory. It's completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to={`/${townSlug}/add-listing`}>
                  Add Your Business
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to={`/${townSlug}/contact`}>Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
