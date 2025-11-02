import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export function SiteContentManagement() {
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState<Record<string, string>>({});

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const existing = content?.find((c) => c.content_key === key);
      if (existing) {
        const { error } = await supabase
          .from("site_content")
          .update({ content_value: value })
          .eq("content_key", key);
        if (error) throw error;
      } else {
        const section = key.includes("hero") ? "hero" : key.includes("mission") ? "mission" : "about";
        const { error } = await supabase
          .from("site_content")
          .insert([{ content_key: key, content_value: value, content_type: "text", section }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Content updated successfully");
    },
    onError: () => toast.error("Failed to update content"),
  });

  const handleSave = (key: string) => {
    const value = formData[key];
    if (value !== undefined) {
      updateMutation.mutate({ key, value });
    }
  };

  const getContentValue = (key: string) => {
    if (formData[key] !== undefined) return formData[key];
    return content?.find((c) => c.content_key === key)?.content_value || "";
  };

  const setContentValue = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const sections = [
    {
      title: "Hero Section",
      fields: [
        { key: "hero_badge", label: "Badge Text", type: "text" },
        { key: "hero_heading", label: "Main Heading", type: "text" },
        { key: "hero_description", label: "Description", type: "textarea" },
      ],
    },
    {
      title: "Mission Section",
      fields: [
        { key: "mission_title", label: "Section Title", type: "text" },
        { key: "mission_subtitle", label: "Subtitle", type: "textarea" },
        { key: "mission_text", label: "Mission Statement", type: "textarea" },
        { key: "vision_text", label: "Vision Statement", type: "textarea" },
        { key: "values_text", label: "Core Values", type: "textarea" },
      ],
    },
    {
      title: "About Page",
      fields: [
        { key: "about_heading", label: "Page Heading", type: "text" },
        { key: "about_subtitle", label: "Subtitle", type: "textarea" },
        { key: "about_story_p1", label: "Story Paragraph 1", type: "textarea" },
        { key: "about_story_p2", label: "Story Paragraph 2", type: "textarea" },
        { key: "about_story_p3", label: "Story Paragraph 3", type: "textarea" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">Site Content Management</h2>

      {sections.map((section) => (
        <Card key={section.title}>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            {section.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={getContentValue(field.key)}
                    onChange={(e) => setContentValue(field.key, e.target.value)}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={field.key}
                    value={getContentValue(field.key)}
                    onChange={(e) => setContentValue(field.key, e.target.value)}
                  />
                )}
                <Button
                  size="sm"
                  onClick={() => handleSave(field.key)}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}