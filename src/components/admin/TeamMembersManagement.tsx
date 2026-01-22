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
import { ImageUpload } from "@/components/ui/image-upload";
import { useActivityLog } from "@/hooks/useActivityLog";

const TeamMembersManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    bio: "",
    image_url: "",
    social_links: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
    display_order: 0,
    is_active: true,
  });

  const queryClient = useQueryClient();
  const { logActivity } = useActivityLog();

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newMember: typeof formData) => {
      const { data, error } = await supabase
        .from("team_members")
        .insert([newMember])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      logActivity({
        entityType: "team_member",
        actionType: "created",
        entityId: data?.id,
        entityName: formData.full_name,
      });
      toast.success("Team member created successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create team member");
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("team_members")
        .update(data)
        .eq("id", id);
      if (error) throw error;
      return { id, data };
    },
    onSuccess: ({ id, data }) => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      logActivity({
        entityType: "team_member",
        actionType: "updated",
        entityId: id,
        entityName: data.full_name,
      });
      toast.success("Team member updated successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update team member");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const member = teamMembers?.find(m => m.id === id);
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { id, name: member?.full_name };
    },
    onSuccess: ({ id, name }) => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      logActivity({
        entityType: "team_member",
        actionType: "deleted",
        entityId: id,
        entityName: name,
      });
      toast.success("Team member deleted successfully");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete team member");
      console.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      full_name: "",
      role: "",
      bio: "",
      image_url: "",
      social_links: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
      display_order: 0,
      is_active: true,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (member: any) => {
    setFormData({
      full_name: member.full_name,
      role: member.role,
      bio: member.bio || "",
      image_url: member.image_url || "",
      social_links: member.social_links || {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
      display_order: member.display_order,
      is_active: member.is_active,
    });
    setEditingId(member.id);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Team Members Management</h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Team Member"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name" className="text-sm">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-sm">Role/Position</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="mt-1"
              />
            </div>

            <ImageUpload
              label="Profile Image"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
            />

            <div className="space-y-2">
              <Label className="text-sm">Social Links (optional)</Label>
              <Input
                placeholder="Facebook URL"
                value={formData.social_links.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, facebook: e.target.value }
                })}
              />
              <Input
                placeholder="Twitter URL"
                value={formData.social_links.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, twitter: e.target.value }
                })}
              />
              <Input
                placeholder="LinkedIn URL"
                value={formData.social_links.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, linkedin: e.target.value }
                })}
              />
              <Input
                placeholder="Instagram URL"
                value={formData.social_links.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, instagram: e.target.value }
                })}
              />
            </div>

            <div>
              <Label htmlFor="display_order" className="text-sm">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="text-sm">Active</Label>
            </div>

            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full sm:w-auto">
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingId ? "Update" : "Create"} Team Member
            </Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {teamMembers?.map((member) => (
          <Card key={member.id} className="p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {member.image_url && (
                <img src={member.image_url} alt={member.full_name} className="w-full h-36 sm:h-48 object-cover rounded" />
              )}
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{member.full_name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{member.role}</p>
                {member.bio && <p className="text-xs sm:text-sm mt-2 line-clamp-3">{member.bio}</p>}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${member.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(member.id)}>
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
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
              This action cannot be undone. This will permanently delete the team member.
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

export default TeamMembersManagement;
