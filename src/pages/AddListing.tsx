import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/Layout";
import LogoBanner from "@/components/LogoBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CATEGORIES } from "@/types/business";
import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import { useTown } from "@/contexts/TownContext";

const listingSchema = z.object({
  name: z.string().trim().min(1, "Business name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().trim().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  address: z.string().trim().min(1, "Address is required").max(200, "Address must be less than 200 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional().or(z.literal("")),
  website: z.string().trim().url("Please enter a valid URL").optional().or(z.literal("")),
  instagram: z.string().trim().url("Please enter a valid Instagram URL").optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
});

type ListingFormData = z.infer<typeof listingSchema>;

const AddListing = () => {
  const [submitted, setSubmitted] = useState(false);
  const { townSlug } = useTown();

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      instagram: "",
      email: "",
    },
  });

  const onSubmit = (data: ListingFormData) => {
    console.log("Validated listing data:", data);
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. The Green Bean Café" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your business..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 12 High Street, Grantham, NG31 6PN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g. 01476 123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://instagram.com/yourbusiness" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      We'll use this to confirm your listing. Not displayed publicly.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 space-y-3">
                <p className="text-sm text-primary font-medium">
                  ✓ You're joining at Founder Pricing. This rate is guaranteed for 6 months.
                </p>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Submit Listing
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </Layout>
  );
};

export default AddListing;
