import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, Eye } from "lucide-react";
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
import { useBusinesses, useCreateBusiness, useUpdateBusiness, useDeleteBusiness, CreateBusinessInput } from "@/hooks/useBusinesses";
import { CATEGORIES, BUSINESS_TAGS, Category, BusinessTag } from "@/types/business";
import { TOWNS } from "@/contexts/TownContext";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success("Account created! Please contact admin for access.");
      } else {
        await signIn(email, password);
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
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
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
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
          placeholder="https://..."
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
            step="0.5"
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
  const { data: businesses, isLoading: businessesLoading } = useBusinesses();
  const createBusiness = useCreateBusiness();
  const updateBusiness = useUpdateBusiness();
  const deleteBusiness = useDeleteBusiness();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);

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
          <div className="flex gap-2">
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
                  {businesses.map((business) => (
                    <tr key={business.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={business.image}
                            alt={business.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
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
