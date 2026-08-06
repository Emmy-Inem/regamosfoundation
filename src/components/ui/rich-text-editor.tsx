import { useCallback, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [uploading, setUploading] = useState(false);

  /** Upload picked image to storage and insert the public URL (no base64 bloat) */
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image is too large. Please use an image under 5MB.");
        return;
      }

      setUploading(true);
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from("content-uploads")
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (error) throw error;

        const { data } = supabase.storage.from("content-uploads").getPublicUrl(path);

        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);
        const index = range?.index ?? editor?.getLength() ?? 0;
        editor?.insertEmbed(index, "image", data.publicUrl, "user");
        editor?.setSelection(index + 1, 0);
        toast.success("Image inserted");
      } catch (err: any) {
        toast.error(err?.message || "Failed to upload image");
      } finally {
        setUploading(false);
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          [{ script: "sub" }, { script: "super" }],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
      clipboard: { matchVisual: false },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <div className={cn("rich-text-editor relative", className)}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-background"
      />
      {uploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/70 text-sm font-medium text-muted-foreground">
          Uploading image…
        </div>
      )}
    </div>
  );
}
