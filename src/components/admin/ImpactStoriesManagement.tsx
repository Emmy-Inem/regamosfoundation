import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";

export function ImpactStoriesManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    story: "",
    impact: "",
    image_url: "",
    display_order: 0,
    is_featured: false,
  });

  const queryClient = useQueryClient();

  const { data: stories, isLoading } = useQuery({
    queryKey: ["impact-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_stories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newStory: typeof formData) => {
      const { error } = await supabase.from("impact_stories").insert([newStory]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["impact-stories"] });
      toast.success("Story created successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to create story"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("impact_stories").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["impact-stories"] });
      toast.success("Story updated successfully");
      resetForm();
    },
    onError: () => toast.error("Failed to update story"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("impact_stories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["impact-stories"] });
      toast.success("Story deleted successfully");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete story"),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      story: "",
      impact: "",
      image_url: "",
      display_order: 0,
      is_featured: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (story: any) => {
    setFormData({
      name: story.name,
      title: story.title,
      story: story.story,
      impact: story.impact,
      image_url: story.image_url || "",
      display_order: story.display_order,
      is_featured: story.is_featured,
    });
    setEditingId(story.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Impact Stories</h2>
        <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Story"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Amaka's Story"
                  />
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., From Widow to Entrepreneur"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="story">Story</Label>
                <RichTextEditor
                  value={formData.story}
                  onChange={(value) => setFormData({ ...formData, story: value })}
                  placeholder="Write the impact story with full formatting options"
                />
              </div>

              <div>
                <Label htmlFor="impact">Impact Summary</Label>
                <Input
                  id="impact"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  required
                  placeholder="e.g., Now supporting 5 families"
                />
              </div>

              <ImageUpload
                label="Story Image"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>

              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  "Update Story"
                ) : (
                  "Create Story"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {stories?.map((story) => (
          <Card key={story.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                  <h3 className="text-lg sm:text-xl font-semibold">{story.name}</h3>
                  <p className="text-sm sm:text-base text-primary font-medium">{story.title}</p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{story.story}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="bg-accent/10 px-2 py-1 rounded">{story.impact}</span>
                    <span className="bg-muted px-2 py-1 rounded">Order: {story.display_order}</span>
                    {story.is_featured && (
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-2 py-1 rounded">Featured</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(story)} className="flex-1 sm:flex-initial">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteId(story.id)}
                    className="flex-1 sm:flex-initial"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this story.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}