import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, MapPin, CheckCircle } from "lucide-react";
import { useTown } from "@/contexts/TownContext";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { townSlug } = useTown();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container max-w-lg text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Message Sent!
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for getting in touch. We'll respond to your message within 
              1-2 business days.
            </p>
            <Button asChild>
              <Link to={`/${townSlug}`}>Return Home</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Logo Banner */}
      <LogoBanner showTagline={false} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background py-14 md:py-20">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 opacity-0 animate-fade-in-down">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.15s" }}>
            Have a question, feedback, or need help with your listing? 
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">hello@granthamlocal.co.uk</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Location</h3>
                    <p className="text-muted-foreground">Grantham, Lincolnshire, NG31</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-secondary rounded-xl">
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Response Times
                </h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond to enquiries within 1-2 business days. 
                  For listing submissions, please allow 2-3 business days for review.
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="What's this about?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help?"
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" size="lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
