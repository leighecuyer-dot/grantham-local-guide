import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Business, Category, BusinessTag } from "@/types/business";

interface DbBusiness {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  address: string;
  town: string;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  email: string | null;
  image: string;
  featured: boolean;
  tripadvisor_rating: number | null;
  tripadvisor_url: string | null;
  tags: string[] | null;
  views: number;
  created_at: string;
  updated_at: string;
}

const mapDbToBusiness = (db: DbBusiness): Business => ({
  id: db.id,
  name: db.name,
  slug: db.slug,
  category: db.category as Category,
  description: db.description,
  address: db.address,
  phone: db.phone || undefined,
  website: db.website || undefined,
  instagram: db.instagram || undefined,
  email: db.email || undefined,
  image: db.image,
  featured: db.featured,
  tripadvisorRating: db.tripadvisor_rating || undefined,
  tripadvisorUrl: db.tripadvisor_url || undefined,
  tags: (db.tags as BusinessTag[]) || undefined,
  views: db.views,
  createdAt: db.created_at.split('T')[0],
});

export const useBusinesses = (town?: string) => {
  return useQuery({
    queryKey: ["businesses", town],
    queryFn: async () => {
      let query = supabase.from("businesses").select("*");
      if (town) {
        query = query.eq("town", town);
      }
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data as DbBusiness[]).map(mapDbToBusiness);
    },
  });
};

export const useFeaturedBusinesses = (town?: string) => {
  return useQuery({
    queryKey: ["businesses", "featured", town],
    queryFn: async () => {
      let query = supabase.from("businesses").select("*").eq("featured", true);
      if (town) {
        query = query.eq("town", town);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data as DbBusiness[]).map(mapDbToBusiness);
    },
  });
};

export const useTrendingBusinesses = (town?: string, limit: number = 6) => {
  return useQuery({
    queryKey: ["businesses", "trending", town, limit],
    queryFn: async () => {
      let query = supabase.from("businesses").select("*").order("views", { ascending: false }).limit(limit);
      if (town) {
        query = query.eq("town", town);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data as DbBusiness[]).map(mapDbToBusiness);
    },
  });
};

export const useLatestBusinesses = (town?: string, limit: number = 6) => {
  return useQuery({
    queryKey: ["businesses", "latest", town, limit],
    queryFn: async () => {
      let query = supabase.from("businesses").select("*").order("created_at", { ascending: false }).limit(limit);
      if (town) {
        query = query.eq("town", town);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data as DbBusiness[]).map(mapDbToBusiness);
    },
  });
};

export const useBusinessesByCategory = (category: Category, town?: string) => {
  return useQuery({
    queryKey: ["businesses", "category", category, town],
    queryFn: async () => {
      let query = supabase.from("businesses").select("*").eq("category", category as any);
      if (town) {
        query = query.eq("town", town);
      }
      const { data, error } = await query.order("featured", { ascending: false });
      if (error) throw error;
      return (data as DbBusiness[]).map(mapDbToBusiness);
    },
  });
};

export const useBusinessBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["business", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return mapDbToBusiness(data as DbBusiness);
    },
    enabled: !!slug,
  });
};

export const useBusinessesByTag = (tag: string, town?: string, limit?: number) => {
  return useQuery({
    queryKey: ["businesses", "tag", tag, town, limit],
    queryFn: async () => {
      let query = supabase.from("businesses").select("*").contains("tags", [tag]);
      if (town) {
        query = query.eq("town", town);
      }
      if (limit) {
        query = query.limit(limit);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data as DbBusiness[]).map(mapDbToBusiness);
    },
  });
};

export interface CreateBusinessInput {
  name: string;
  slug: string;
  category: Category;
  description: string;
  address: string;
  town: string;
  phone?: string;
  website?: string;
  instagram?: string;
  email?: string;
  image: string;
  featured?: boolean;
  tripadvisor_rating?: number;
  tripadvisor_url?: string;
  tags?: BusinessTag[];
}

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (business: CreateBusinessInput) => {
      const { data, error } = await supabase
        .from("businesses")
        .insert(
          {
            name: business.name,
            slug: business.slug,
            category: business.category as any,
            description: business.description,
            address: business.address,
            town: business.town,
            phone: business.phone || null,
            website: business.website || null,
            instagram: business.instagram || null,
            email: business.email || null,
            image: business.image,
            featured: business.featured || false,
            tripadvisor_rating: business.tripadvisor_rating || null,
            tripadvisor_url: business.tripadvisor_url || null,
            tags: business.tags || [],
          } as any
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...business }: CreateBusinessInput & { id: string }) => {
      const { data, error } = await supabase
        .from("businesses")
        .update(
          {
            name: business.name,
            slug: business.slug,
            category: business.category as any,
            description: business.description,
            address: business.address,
            town: business.town,
            phone: business.phone || null,
            website: business.website || null,
            instagram: business.instagram || null,
            email: business.email || null,
            image: business.image,
            featured: business.featured || false,
            tripadvisor_rating: business.tripadvisor_rating || null,
            tripadvisor_url: business.tripadvisor_url || null,
            tags: business.tags || [],
          } as any
        )
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
};

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("businesses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
};
