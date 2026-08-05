import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultSiteImage, siteImageContentKey } from "@/lib/siteImages";

/**
 * Loads admin-managed image overrides from site_content.
 * Returns `img(key)` which resolves to the override, or the bundled default.
 */
export const useSiteImages = () => {
  const { data } = useQuery({
    queryKey: ["site-images"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content_key, content_value")
        .eq("content_type", "image");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data || []).forEach((row) => {
        if (row.content_value) map[row.content_key] = row.content_value;
      });
      return map;
    },
  });

  const img = (key: string) => data?.[siteImageContentKey(key)] || defaultSiteImage(key);

  return { img };
};
