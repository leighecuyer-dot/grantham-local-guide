import { Bot, MessageSquare, Share2, Calendar, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTown } from "@/contexts/TownContext";

const aiTools = [
  {
    name: "AI Review Responder",
    description: "Automatically generate professional, personalised responses to customer reviews. Save hours each week while maintaining a personal touch.",
    icon: MessageSquare,
    status: "Coming Soon",
    features: [
      "Analyse review sentiment automatically",
      "Generate on-brand responses",
      "Support for multiple platforms",
      "Customisable tone and style",
    ],
  },
  {
    name: "AI Social Media Generator",
    description: "Create engaging social media posts for your business in seconds. Perfect for promoting offers, events, and new products.",
    icon: Share2,
    status: "Coming Soon",
    features: [
      "Generate posts for all major platforms",
      "Automatic hashtag suggestions",
      "Image caption generation",
      "Content calendar planning",
    ],
  },
  {
    name: "AI Booking Reminder",
    description: "Reduce no-shows with intelligent booking reminders. Automatically send personalised messages to customers before their appointments.",
    icon: Calendar,
    status: "Coming Soon",
    features: [
      "Smart timing for reminders",
      "Personalised messaging",
      "Multi-channel delivery (SMS, Email)",
      "Automatic rescheduling suggestions",
    ],
  },
  {
    name: "AI Customer Reply Bot",
    description: "Never miss a customer enquiry. Our AI bot handles common questions 24/7, freeing you to focus on running your business.",
    icon: Bot,
    status: "Coming Soon",
    features: [
      "24/7 automated responses",
      "Learns from your business info",
      "Seamless human handoff",
      "Multi-language support",
    ],
  },
];

const AITools = () => {
  const { townSlug } = useTown();

  return (
    <Layout>
      {/* Logo Banner */}
      <LogoBanner showTagline={false} />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Coming Soon
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              AI Tools for Local Businesses
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Supercharge your business with intelligent automation. Save time, engage customers, 
              and grow faster with our suite of AI-powered tools.
            </p>
            <Link to={`/${townSlug}/contact`}>
              <Button size="lg">
                Join the Waitlist
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {aiTools.map((tool) => (
              <Card key={tool.name} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background">
                    <Clock className="w-3 h-3 mr-1" />
                    {tool.status}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <CardDescription className="text-base">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
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
              Why AI for Your Business?
            </h2>
            <p className="text-muted-foreground">
              Local businesses using AI tools see significant improvements in efficiency and customer satisfaction
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-background rounded-xl border border-border">
              <div className="text-3xl font-bold text-primary mb-2">10+ hrs</div>
              <p className="text-muted-foreground">Saved per week on average</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl border border-border">
              <div className="text-3xl font-bold text-primary mb-2">40%</div>
              <p className="text-muted-foreground">Increase in response rates</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl border border-border">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Customer support coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Be the First to Know
            </h2>
            <p className="text-muted-foreground mb-6">
              Join our waitlist to get early access to AI tools and exclusive launch pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/${townSlug}/contact`}>
                <Button size="lg">
                  Join the Waitlist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No spam. We'll only contact you about AI tools updates.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AITools;
