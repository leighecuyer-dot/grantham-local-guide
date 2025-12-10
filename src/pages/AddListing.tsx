import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/types/business";
import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const AddListing = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Submission Received!",
      description: "We'll review your listing and get back to you soon.",
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
              Thank You!
            </h1>
            <p className="text-muted-foreground mb-8">
              We've received your listing submission. Our team will review it and 
              add it to the directory within 2-3 business days.
            </p>
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-light to-background py-12 md:py-16">
        <div className="container max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Add Your Business
          </h1>
          <p className="text-lg text-muted-foreground">
            Get your business listed in our directory for free. Fill out the form below 
            and we'll add you within 2-3 business days.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 md:py-16">
        <div className="container max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input id="name" placeholder="e.g. The Green Bean Café" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your business..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" placeholder="e.g. 12 High Street, Grantham, NG31 6PN" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="e.g. 01476 123456" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" type="url" placeholder="https://instagram.com/yourbusiness" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email *</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
              <p className="text-sm text-muted-foreground">
                We'll use this to confirm your listing. Not displayed publicly.
              </p>
            </div>

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Submit Listing
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default AddListing;
