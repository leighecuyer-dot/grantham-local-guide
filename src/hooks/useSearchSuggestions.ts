import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSearchSuggestions = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name, slug, category")
        .ilike("name", `%${query}%`)
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: enabled && query.length >= 2,
    staleTime: 30000,
  });
};
