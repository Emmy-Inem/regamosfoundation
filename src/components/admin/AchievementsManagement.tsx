import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useActivityLog } from "@/hooks/useActivityLog";

const AchievementsManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    achievement_text: "",
    display_order: 0,
    is_active: true,
  });

  const queryClient = useQueryClient();
  const { logActivity } = useActivityLog();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newAchievement: typeof formData) => {
      const { data, error } = await supabase
        .from("achievements")
        .insert([newAchievement])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      logActivity({
        entityType: "achievement",
        actionType: "created",
        entityId: data?.id,
        entityName: formData.achievement_text.substring(0, 50),
      });
      toast.success("Achievement created successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create achievement");
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("achievements")
        .update(data)
        .eq("id", id);
      if (error) throw error;
      return { id, data };
    },
    onSuccess: ({ id, data }) => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      logActivity({
        entityType: "achievement",
        actionType: "updated",
        entityId: id,
        entityName: data.achievement_text.substring(0, 50),
      });
      toast.success("Achievement updated successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update achievement");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const achievement = achievements?.find(a => a.id === id);
      const { error } = await supabase
        .from("achievements")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { id, name: achievement?.achievement_text.substring(0, 50) };
    },
    onSuccess: ({ id, name }) => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      logActivity({
        entityType: "achievement",
        actionType: "deleted",
        entityId: id,
        entityName: name,
      });
      toast.success("Achievement deleted successfully");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete achievement");
      console.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      achievement_text: "",
      display_order: 0,
      is_active: true,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (achievement: any) => {
    setFormData({
      achievement_text: achievement.achievement_text,
      display_order: achievement.display_order,
      is_active: achievement.is_active,
    });
    setEditingId(achievement.id);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Achievements Management</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Achievement"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="achievement_text">Achievement Text</Label>
              <Textarea
                id="achievement_text"
                value={formData.achievement_text}
                onChange={(e) => setFormData({ ...formData, achievement_text: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingId ? "Update" : "Create"} Achievement
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {achievements?.map((achievement) => (
          <Card key={achievement.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Order: {achievement.display_order}</p>
                <p className="mb-2">{achievement.achievement_text}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${achievement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {achievement.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(achievement)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteId(achievement.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the achievement.
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
};

export default AchievementsManagement;
