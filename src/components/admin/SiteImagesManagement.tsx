import { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Upload, RotateCcw, Search, Save } from "lucide-react";
import { SITE_IMAGES, siteImageContentKey } from "@/lib/siteImages";
import { useActivityLog } from "@/hooks/useActivityLog";

const BUCKET = "content-uploads";

const SiteImagesManagement = () => {
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLog();
  const [query, setQuery] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data: overrides, isLoading } = useQuery({
    queryKey: ["site-images-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content_key, content_value")
        .eq("content_type", "image");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data || []).forEach((r) => {
        if (r.content_value) map[r.content_key] = r.content_value;
      });
      return map;
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["site-images-admin"] });
    queryClient.invalidateQueries({ queryKey: ["site-images"] });
  };

  const save = async (key: string, url: string) => {
    setBusyKey(key);
    const contentKey = siteImageContentKey(key);
    const { error } = await supabase
      .from("site_content")
      .upsert(
        {
          content_key: contentKey,
          content_value: url,
          content_type: "image",
          section: "images",
        },
        { onConflict: "content_key" }
      );
    setBusyKey(null);
    if (error) {
      toast.error("Could not save image: " + error.message);
      return;
    }
    logActivity({ entityType: "site_content", actionType: "updated", entityName: contentKey });
    setDrafts((d) => ({ ...d, [key]: "" }));
    refresh();
    toast.success("Image updated");
  };

  const reset = async (key: string) => {
    setBusyKey(key);
    const { error } = await supabase
      .from("site_content")
      .delete()
      .eq("content_key", siteImageContentKey(key));
    setBusyKey(null);
    if (error) {
      toast.error("Could not reset image");
      return;
    }
    refresh();
    toast.success("Reverted to the default image");
  };

  const upload = async (key: string, file: File) => {
    setBusyKey(key);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `site-images/${key.replace(/\./g, "-")}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    if (error) {
      setBusyKey(null);
      toast.error("Upload failed: " + error.message);
      return;
    }
    const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    await save(key, url);
  };

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = SITE_IMAGES.filter(
      (i) =>
        !q ||
        i.label.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q) ||
        i.key.toLowerCase().includes(q)
    );
    const byGroup: Record<string, typeof SITE_IMAGES> = {};
    filtered.forEach((i) => {
      byGroup[i.group] = [...(byGroup[i.group] || []), i];
    });
    return byGroup;
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const customCount = SITE_IMAGES.filter((i) => overrides?.[siteImageContentKey(i.key)]).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Images</h2>
          <p className="text-sm text-muted-foreground">
            Replace any image used on the website. {SITE_IMAGES.length} slots · {customCount} customised.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search images…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="space-y-3">
          <h3 className="text-lg font-semibold">{group}</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const override = overrides?.[siteImageContentKey(item.key)];
              const current = override || item.fallback;
              const busy = busyKey === item.key;
              return (
                <Card key={item.key}>
                  <CardContent className="space-y-3 p-4">
                    <div className="aspect-[16/10] overflow-hidden rounded-md bg-muted">
                      <img
                        src={current}
                        alt={item.label}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium leading-tight">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                      </div>
                      <Badge variant={override ? "default" : "secondary"}>
                        {override ? "Custom" : "Default"}
                      </Badge>
                    </div>

                    <Input
                      placeholder="Paste an image URL…"
                      value={drafts[item.key] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [item.key]: e.target.value }))}
                    />

                    <div className="flex flex-wrap gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={(el) => (fileInputs.current[item.key] = el)}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) upload(item.key, file);
                          e.target.value = "";
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => fileInputs.current[item.key]?.click()}
                      >
                        {busy ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-1 h-4 w-4" />
                        )}
                        Upload
                      </Button>
                      <Button
                        size="sm"
                        disabled={busy || !drafts[item.key]?.trim()}
                        onClick={() => save(item.key, drafts[item.key].trim())}
                      >
                        <Save className="mr-1 h-4 w-4" />
                        Use URL
                      </Button>
                      {override && (
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => reset(item.key)}>
                          <RotateCcw className="mr-1 h-4 w-4" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SiteImagesManagement;
