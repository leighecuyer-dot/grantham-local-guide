import { Check, Star, Zap, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTown } from "@/contexts/TownContext";

const pricingTiers = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Get your business discovered",
    icon: Star,
    features: [
      "Basic business listing",
      "One image",
      "Contact information",
      "Category placement",
      "Customer reviews",
    ],
    highlighted: false,
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
  },
  {
    name: "Featured",
    price: "£5",
    period: "per month",
    description: "Stand out in your category",
    icon: Zap,
    features: [
      "Everything in Free",
      "Top of category placement",
      "Up to 3 images",
      "Highlighted background",
      "Featured badge",
      "Priority in search results",
    ],
    highlighted: true,
    buttonText: "Go Featured",
    buttonVariant: "default" as const,
  },
  {
    name: "Premium",
    price: "£20",
    period: "per month",
    description: "Maximum visibility & AI tools",
    icon: Crown,
    features: [
      "Everything in Featured",
      "Featured on homepage",
      "Priority placement everywhere",
      "AI-powered profile rewrite",
      "Social media shoutout",
      "Unlimited images",
      "Analytics dashboard",
      "Priority support",
    ],
    highlighted: false,
    buttonText: "Go Premium",
    buttonVariant: "outline" as const,
  },
];

const Advertise = () => {
  const { town, townSlug } = useTown();

  return (
    <Layout>
      {/* Logo Banner */}
      <LogoBanner showTagline={false} />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              For Local Businesses
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Grow Your Business in {town.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get discovered by thousands of local customers actively searching for businesses like yours. 
              Choose a plan that fits your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.highlighted
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : "border-border"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                    tier.highlighted ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  }`}>
                    <tier.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">/{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to={`/${townSlug}/contact`} className="w-full">
                    <Button variant={tier.buttonVariant} className="w-full">
                      {tier.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Why Advertise With Us?
            </h2>
            <p className="text-muted-foreground">
              Join hundreds of local businesses already growing with Discover Local
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">Monthly visitors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Local businesses listed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Customer satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact us today to discuss which plan is right for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/${townSlug}/add-listing`}>
                <Button size="lg">
                  Add Your Business
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to={`/${townSlug}/contact`}>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Advertise;
