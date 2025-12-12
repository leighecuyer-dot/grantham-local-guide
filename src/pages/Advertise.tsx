import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTown } from "@/contexts/TownContext";
import { supabase } from "@/integrations/supabase/client";
import { SUBSCRIPTION_TIERS, getTierByProductId, SubscriptionTier } from "@/lib/stripe-config";
import { toast } from "@/hooks/use-toast";

const Advertise = () => {
  const { town, townSlug } = useTown();
  const { user, session } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("free");
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  // Check for success/cancel from Stripe
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing. Your listing will be upgraded shortly.",
      });
      checkSubscription();
    } else if (searchParams.get("canceled") === "true") {
      toast({
        title: "Subscription canceled",
        description: "You can subscribe anytime to upgrade your listing.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  // Check subscription status on mount and when user changes
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setCurrentTier("free");
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!session?.access_token) return;
    
    setCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.subscribed && data?.product_id) {
        setCurrentTier(getTierByProductId(data.product_id));
      } else {
        setCurrentTier("free");
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig.priceId) return;

    setLoading(tier);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: tierConfig.priceId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!session?.access_token) return;

    setLoading("manage");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const tierIcons = {
    free: Star,
    featured: Zap,
    premium: Crown,
  };

  const tiers = (["free", "featured", "premium"] as const).map((key) => ({
    key,
    ...SUBSCRIPTION_TIERS[key],
    icon: tierIcons[key],
    highlighted: key === "featured",
  }));

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

      {/* Current Subscription Status */}
      {user && currentTier !== "free" && (
        <section className="py-6 bg-primary/5 border-y border-primary/20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-primary border-primary px-4 py-2 text-base">
                Current Plan: {SUBSCRIPTION_TIERS[currentTier].name}
              </Badge>
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={loading === "manage"}
              >
                {loading === "manage" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Manage Subscription"
                )}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isCurrentPlan = currentTier === tier.key;

              return (
                <Card
                  key={tier.key}
                  className={`relative flex flex-col transition-all duration-300 hover:scale-105 ${
                    tier.highlighted
                      ? "border-primary shadow-lg shadow-primary/20 scale-105"
                      : "border-border"
                  } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded">
                      Your Plan
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                      tier.highlighted ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>
                      {tier.key === "free"
                        ? "Get your business discovered"
                        : tier.key === "featured"
                        ? "Stand out in your category"
                        : "Maximum visibility & AI tools"}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">£{tier.price}</span>
                      {tier.price > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                      {tier.price === 0 && (
                        <span className="text-muted-foreground">/forever</span>
                      )}
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
                    {tier.key === "free" ? (
                      <Link to={`/${townSlug}/add-listing`} className="w-full">
                        <Button variant="outline" className="w-full">
                          {isCurrentPlan ? "Current Plan" : "Get Started Free"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    ) : isCurrentPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant={tier.highlighted ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleSubscribe(tier.key)}
                        disabled={loading === tier.key || checkingSubscription}
                      >
                        {loading === tier.key ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Subscribe to {tier.name}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Not logged in notice */}
      {!user && (
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <p className="text-muted-foreground">
              Please{" "}
              <Link to="/admin" className="text-primary underline hover:no-underline">
                login or create an account
              </Link>{" "}
              to subscribe to a premium plan.
            </p>
          </div>
        </section>
      )}

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

      {/* FAQ Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                How do I upgrade my listing?
              </h3>
              <p className="text-muted-foreground">
                Simply select your preferred plan above and complete the checkout process.
                Your listing will be upgraded within 24 hours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can cancel your subscription at any time through the subscription
                management portal. Your benefits will continue until the end of your
                billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit and debit cards through our secure payment
                provider, Stripe.
              </p>
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
