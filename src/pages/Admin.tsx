import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, Eye, Upload, RefreshCcw, ImageIcon, ImageOff, Filter } from "lucide-react";
import { BulkImport } from "@/components/admin/BulkImport";
import { ImageScraper } from "@/components/admin/ImageScraper";
import { ImageUpload } from "@/components/admin/ImageUpload";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useBusinesses, useCreateBusiness, useUpdateBusiness, useDeleteBusiness, CreateBusinessInput } from "@/hooks/useBusinesses";
import { CATEGORIES, BUSINESS_TAGS, Category, BusinessTag } from "@/types/business";
import { TOWNS } from "@/contexts/TownContext";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(result.data.email, result.data.password);
        toast.success("Account created! Please contact admin for access.");
      } else {
        await signIn(result.data.email, result.data.password);
        onLogin();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border border-border">
        <h1 className="text-2xl font-bold text-center text-foreground">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrors({}); }}
            className="text-primary hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

const BusinessForm = ({
  business,
  onSave,
  onClose,
}: {
  business?: any;
  onSave: (data: CreateBusinessInput) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState<CreateBusinessInput>({
    name: business?.name || "",
    slug: business?.slug || "",
    category: business?.category || "Café",
    description: business?.description || "",
    address: business?.address || "",
    town: business?.town || "grantham",
    phone: business?.phone || "",
    website: business?.website || "",
    instagram: business?.instagram || "",
    email: business?.email || "",
    image: business?.image || "",
    featured: business?.featured || false,
    tripadvisor_rating: business?.tripadvisorRating || undefined,
    tripadvisor_url: business?.tripadvisorUrl || "",
    google_rating: business?.googleRating || undefined,
    google_reviews_url: business?.googleReviewsUrl || "",
    tags: business?.tags || [],
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: business?.slug || generateSlug(name),
    });
  };

  const handleTagToggle = (tag: BusinessTag) => {
    const tags = formData.tags || [];
    if (tags.includes(tag)) {
      setFormData({ ...formData, tags: tags.filter((t) => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...tags, tag] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Business Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="town">Town *</Label>
          <Select
            value={formData.town}
            onValueChange={(value) => setFormData({ ...formData, town: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOWNS.map((t) => (
                <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Image *</Label>
        <ImageUpload
          value={formData.image}
          onChange={(url) => setFormData({ ...formData, image: url })}
          businessSlug={formData.slug}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            placeholder="https://instagram.com/..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tripadvisor_rating">TripAdvisor Rating</Label>
          <Input
            id="tripadvisor_rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.tripadvisor_rating || ""}
            onChange={(e) => setFormData({ ...formData, tripadvisor_rating: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
        <div>
          <Label htmlFor="tripadvisor_url">TripAdvisor URL</Label>
          <Input
            id="tripadvisor_url"
            value={formData.tripadvisor_url}
            onChange={(e) => setFormData({ ...formData, tripadvisor_url: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="google_rating">Google Rating</Label>
          <Input
            id="google_rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.google_rating || ""}
            onChange={(e) => setFormData({ ...formData, google_rating: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
        <div>
          <Label htmlFor="google_reviews_url">Google Reviews URL</Label>
          <Input
            id="google_reviews_url"
            value={formData.google_reviews_url}
            onChange={(e) => setFormData({ ...formData, google_reviews_url: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
        />
        <Label htmlFor="featured">Featured Business</Label>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {BUSINESS_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.tags?.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {business ? "Update" : "Create"} Business
        </Button>
      </div>
    </form>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin(user?.id);
  const {
    data: businesses,
    isLoading: businessesLoading,
    isFetching: businessesFetching,
    refetch: refetchBusinesses,
  } = useBusinesses();
  const createBusiness = useCreateBusiness();
  const updateBusiness = useUpdateBusiness();
  const deleteBusiness = useDeleteBusiness();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [imageScraperOpen, setImageScraperOpen] = useState(false);
  const [imageFilter, setImageFilter] = useState<"all" | "missing" | "has">("all");

  const isPlaceholderImage = (image: string) => {
    return !image || image.includes("placeholder") || image.includes("unsplash.com");
  };

  const filteredBusinesses = useMemo(() => {
    if (!businesses) return [];
    if (imageFilter === "all") return businesses;
    if (imageFilter === "missing") return businesses.filter((b) => isPlaceholderImage(b.image));
    return businesses.filter((b) => !isPlaceholderImage(b.image));
  }, [businesses, imageFilter]);

  const missingImageCount = useMemo(() => {
    return businesses?.filter((b) => isPlaceholderImage(b.image)).length ?? 0;
  }, [businesses]);

  const handleBulkImport = async (businesses: CreateBusinessInput[]) => {
    const { data: existing, error: existingError } = await supabase
      .from("businesses")
      .select("slug");

    if (existingError) throw existingError;

    const existingSlugs = new Set((existing || []).map((b: any) => b.slug));

    let imported = 0;
    let duplicates = 0;
    let failed = 0;
    let firstError: string | undefined;

    for (const business of businesses) {
      if (existingSlugs.has(business.slug)) {
        duplicates++;
        continue;
      }

      try {
        await createBusiness.mutateAsync(business);
        existingSlugs.add(business.slug);
        imported++;
      } catch (error: any) {
        failed++;
        if (!firstError) firstError = error?.message || "Unknown error";
      }
    }

    return { imported, duplicates, failed, firstError };
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={() => {}} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
          <p className="text-sm text-muted-foreground">Logged in as: {user.email}</p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      </div>
    );
  }

  const handleCreate = async (data: CreateBusinessInput) => {
    try {
      await createBusiness.mutateAsync(data);
      toast.success("Business created successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (data: CreateBusinessInput) => {
    if (!editingBusiness) return;
    try {
      await updateBusiness.mutateAsync({ id: editingBusiness.id, ...data });
      toast.success("Business updated successfully!");
      setEditingBusiness(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this business?")) return;
    try {
      await deleteBusiness.mutateAsync(id);
      toast.success("Business deleted successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your business listings</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="text-sm text-muted-foreground hidden sm:block">
              {businessesLoading ? "Loading…" : `${filteredBusinesses.length} of ${businesses?.length ?? 0} businesses`}
              {missingImageCount > 0 && (
                <span className="ml-2 text-amber-600">({missingImageCount} missing images)</span>
              )}
            </div>
            <Select value={imageFilter} onValueChange={(v) => setImageFilter(v as "all" | "missing" | "has")}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Businesses</SelectItem>
                <SelectItem value="missing">Missing Images</SelectItem>
                <SelectItem value="has">Has Images</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => refetchBusinesses()}
              disabled={businessesFetching}
              title="Refresh businesses"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${businessesFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bulk Import Businesses</DialogTitle>
                </DialogHeader>
                <BulkImport onImport={handleBulkImport} />
              </DialogContent>
            </Dialog>
            <Dialog open={imageScraperOpen} onOpenChange={setImageScraperOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Scrape Images
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Scrape Business Images</DialogTitle>
                </DialogHeader>
                {businesses && (
                  <ImageScraper
                    businesses={businesses}
                    onComplete={() => {
                      refetchBusinesses();
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingBusiness(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Business
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingBusiness ? "Edit Business" : "Add New Business"}
                  </DialogTitle>
                </DialogHeader>
                <BusinessForm
                  business={editingBusiness}
                  onSave={editingBusiness ? handleUpdate : handleCreate}
                  onClose={() => {
                    setDialogOpen(false);
                    setEditingBusiness(null);
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {businessesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : businesses && businesses.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Business</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Town</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Featured</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Views</th>
                    <th className="text-right px-4 py-3 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBusinesses.map((business) => (
                    <tr key={business.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={business.image}
                              alt={business.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            {isPlaceholderImage(business.image) && (
                              <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5" title="Missing image">
                                <ImageOff className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-foreground">{business.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{business.category}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">grantham</td>
                      <td className="px-4 py-3">
                        {business.featured && (
                          <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{business.views}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/grantham/business/${business.slug}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingBusiness(business);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(business.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground mb-4">No businesses yet. Add your first one!</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Business
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
