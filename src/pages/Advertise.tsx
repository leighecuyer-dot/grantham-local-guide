import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Zap, Crown, ArrowRight, Loader2, ChevronDown, Globe, Palette, Smartphone, Search, Rocket, Store, Code } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTown } from "@/contexts/TownContext";
import { supabase } from "@/integrations/supabase/client";
import { SUBSCRIPTION_TIERS, getTierByProductId, SubscriptionTier } from "@/lib/stripe-config";
import { toast } from "@/hooks/use-toast";
import granthamSkyline from "@/assets/grantham-skyline.jpg";
import discoverLocalLogo from "@/assets/discover-local-logo.png";

const Advertise = () => {
  const { town, townSlug } = useTown();
  const { user, session } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("free");
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [businessCount, setBusinessCount] = useState<number>(0);

  // Fetch business count
  useEffect(() => {
    const fetchBusinessCount = async () => {
      const { count, error } = await supabase
        .from("businesses")
        .select("*", { count: "exact", head: true })
        .eq("town", townSlug);
      
      if (!error && count !== null) {
        setBusinessCount(count);
      }
    };

    fetchBusinessCount();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("business-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "businesses" },
        () => fetchBusinessCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [townSlug]);

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
      {/* Logo Banner with Background */}
      <section className="relative w-full py-16 md:py-20 lg:py-24 border-b border-primary/20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${granthamSkyline})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-primary/10" />
        
        {/* Logo Content */}
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              For Local Businesses
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Grow Your Business in {town.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you need more visibility in our local directory or a professional website — we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="directory" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-14">
              <TabsTrigger value="directory" className="text-base gap-2 h-12">
                <Store className="w-5 h-5" />
                Directory Listing
              </TabsTrigger>
              <TabsTrigger value="website" className="text-base gap-2 h-12">
                <Code className="w-5 h-5" />
                Website Building
              </TabsTrigger>
            </TabsList>

            {/* Directory Listing Tab */}
            <TabsContent value="directory" className="space-y-0">
              {/* Current Subscription Status */}
              {user && currentTier !== "free" && (
                <div className="py-6 bg-primary/5 border-y border-primary/20 -mx-4 px-4 mb-12">
                  <div className="text-center">
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
                </div>
              )}

              {/* Founder Pricing Header */}
              <div className="py-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-primary/20 -mx-4 px-4 mb-12 rounded-lg">
                <div className="text-center">
                  <Badge variant="outline" className="border-primary text-primary px-4 py-1.5 text-base font-semibold mb-4">
                    ⚡ Founder Pricing – Limited Time
                  </Badge>
                  <p className="text-muted-foreground max-w-xl mx-auto mb-4">
                    Be an early adopter and lock in these discounted rates for 6 months. 
                    After launch, prices will increase — but your rate stays the same.
                  </p>
                  <Collapsible>
                    <CollapsibleTrigger className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      Learn more about Founder Pricing
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 text-left max-w-xl mx-auto">
                      <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                        <p><strong className="text-foreground">How it works:</strong> Sign up during our launch period and your monthly rate is guaranteed for 6 months from your subscription start date.</p>
                        <p><strong className="text-foreground">After 6 months:</strong> Your plan will continue at the then-current rate, which you can cancel anytime before renewal.</p>
                        <p><strong className="text-foreground">No lock-in:</strong> Cancel anytime. Your benefits continue until the end of your billing period.</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
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

              {/* Not logged in notice */}
              {!user && (
                <div className="py-8 bg-muted/50 rounded-lg mb-12">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Please{" "}
                      <Link to="/admin" className="text-primary underline hover:no-underline">
                        login or create an account
                      </Link>{" "}
                      to subscribe to a premium plan.
                    </p>
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              <div className="py-16 bg-muted/30 -mx-4 px-4 rounded-lg mb-12">
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                    Why Advertise With Us?
                  </h2>
                  <p className="text-muted-foreground">
                    Get your business in front of local customers actively searching for services like yours
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{businessCount}</div>
                    <p className="text-muted-foreground">Businesses in {town.name}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                    <p className="text-muted-foreground">Always visible online</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">Free</div>
                    <p className="text-muted-foreground">Basic listing included</p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="py-16 bg-card -mx-4 px-4 rounded-lg">
                <div className="max-w-3xl mx-auto">
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
              </div>
            </TabsContent>

            {/* Website Building Tab */}
            <TabsContent value="website" className="space-y-0">
              {/* Website Building Hero */}
              <div className="text-center mb-12">
                <Badge variant="outline" className="border-primary text-primary px-4 py-1.5 text-base font-semibold mb-6">
                  <Globe className="w-4 h-4 mr-2 inline" />
                  Professional Website Building
                </Badge>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                  Beautiful Websites for Small Businesses
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We build stunning, modern websites that help your business stand out online. 
                  From simple landing pages to full e-commerce stores — we've got you covered.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
                <Card className="text-center p-6 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Custom Design</h3>
                  <p className="text-sm text-muted-foreground">Unique designs tailored to your brand identity and business goals</p>
                </Card>
                <Card className="text-center p-6 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Mobile Friendly</h3>
                  <p className="text-sm text-muted-foreground">Looks and works perfectly on all devices and screen sizes</p>
                </Card>
                <Card className="text-center p-6 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  <Search className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">SEO Optimised</h3>
                  <p className="text-sm text-muted-foreground">Built to rank well on Google and drive organic traffic</p>
                </Card>
                <Card className="text-center p-6 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Fast & Secure</h3>
                  <p className="text-sm text-muted-foreground">Lightning fast loading with SSL security included</p>
                </Card>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                <Card className="flex flex-col border-border hover:border-primary/40 transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">Starter</CardTitle>
                    <CardDescription>Perfect for getting online</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">£299</span>
                      <span className="text-muted-foreground">/one-time</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Single page website</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Mobile responsive design</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Contact form included</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Basic SEO setup</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">1 year hosting included</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/${townSlug}/contact`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="flex flex-col border-primary shadow-lg shadow-primary/20 scale-105 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">Professional</CardTitle>
                    <CardDescription>Full business website</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">£599</span>
                      <span className="text-muted-foreground">/one-time</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Up to 5 pages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Custom brand design</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Google Maps integration</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Social media links</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Advanced SEO setup</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">1 year hosting + domain</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/${townSlug}/contact`} className="w-full">
                      <Button className="w-full">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="flex flex-col border-border hover:border-primary/40 transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Crown className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">E-Commerce</CardTitle>
                    <CardDescription>Sell products online</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">£999</span>
                      <span className="text-muted-foreground">/one-time</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Full online store</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Product management</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Secure payment gateway</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Inventory tracking</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Order management</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">1 year hosting + domain</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/${townSlug}/contact`} className="w-full">
                      <Button variant="outline" className="w-full">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              {/* Portfolio CTA */}
              <div className="max-w-2xl mx-auto mb-16">
                <Card className="border-primary/30 bg-card/50 backdrop-blur">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                      See Our Previous Work
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Check out websites we've built for other local businesses in {town.name} and surrounding areas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to={`/${townSlug}/portfolio`}>
                        <Button size="lg" className="w-full sm:w-auto">
                          View Portfolio
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link to={`/${townSlug}/contact`}>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                          Get a Free Quote
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Website FAQ */}
              <div className="py-16 bg-card -mx-4 px-4 rounded-lg">
                <div className="max-w-3xl mx-auto">
                  <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        How long does it take to build a website?
                      </h3>
                      <p className="text-muted-foreground">
                        Starter websites typically take 1-2 weeks. Professional sites take 2-3 weeks, 
                        and e-commerce stores take 3-4 weeks depending on complexity.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        What's included in the hosting?
                      </h3>
                      <p className="text-muted-foreground">
                        All packages include 1 year of hosting, SSL certificate, and email setup. 
                        After the first year, hosting is £10/month.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Can I update the website myself?
                      </h3>
                      <p className="text-muted-foreground">
                        Yes! We build websites with easy-to-use content management systems so you can 
                        update text, images, and products yourself. We also offer training.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Do you offer ongoing support?
                      </h3>
                      <p className="text-muted-foreground">
                        Absolutely. We offer maintenance packages starting at £30/month that include 
                        updates, backups, security monitoring, and priority support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background border-t border-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact us today to discuss which option is right for your business
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
