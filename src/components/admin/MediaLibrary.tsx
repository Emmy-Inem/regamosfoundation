import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, Copy, Search, ImageOff, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type StorageFile = {
  name: string;
  id?: string | null;
  updated_at?: string;
  created_at?: string;
  metadata?: { size?: number; mimetype?: string } | null;
};

const BUCKET = "content-uploads";

const MediaLibrary = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 500, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      toast.error("Failed to load media");
    } else {
      setFiles((data || []).filter((f) => f.name && !f.name.endsWith("/")));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const publicUrl = (name: string) =>
    supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(list)) {
        const ext = file.name.split(".").pop();
        const safe = file.name
          .replace(/\.[^.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 40);
        const key = `${Date.now()}-${safe}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;
      }
      toast.success(`Uploaded ${list.length} file${list.length > 1 ? "s" : ""}`);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (name: string) => {
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    setFiles((f) => f.filter((x) => x.name !== name));
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
  const isImage = (name: string) => /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(name);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <label>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button asChild size="sm" disabled={uploading}>
              <span className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload images
              </span>
            </Button>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          <ImageOff className="h-8 w-8 mx-auto mb-2 opacity-60" />
          No files found. Upload some images to get started.
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((f) => {
            const url = publicUrl(f.name);
            return (
              <Card key={f.name} className="overflow-hidden group">
                <div className="relative aspect-square bg-muted">
                  {isImage(f.name) ? (
                    <img
                      src={url}
                      alt={f.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center break-all">
                      {f.name}
                    </div>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-[11px] truncate" title={f.name}>
                    {f.name}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs"
                      onClick={() => copy(url)}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-7 px-2">
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this file?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {f.name} will be permanently removed and any page referencing it
                            will break.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(f.name)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
