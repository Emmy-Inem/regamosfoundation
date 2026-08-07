import { useCallback, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Heading2, Heading3, Quote, List, Minus, ImagePlus, Link2 } from "lucide-react";

// Register an <hr> block embed so writers can visually separate sections
const BlockEmbed = Quill.import("blots/block/embed") as any;
class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = "divider";
DividerBlot.tagName = "hr";
if (!(Quill as any).imports["formats/divider"]) {
  Quill.register("formats/divider", DividerBlot as any);
}



interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Minimum editor height, e.g. "520px". Defaults to 300px. */
  minHeight?: string;
  /** Show quick-insert block buttons + live word count (long-form writing) */
  showQuickInserts?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  minHeight,
  showQuickInserts = false,
}: RichTextEditorProps) {
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

  const applyBlock = useCallback((format: string, val: unknown) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    editor.focus();
    const range = editor.getSelection(true);
    const current = editor.getFormat(range || undefined) as Record<string, unknown>;
    const isActive = JSON.stringify(current?.[format]) === JSON.stringify(val);
    editor.format(format, isActive ? false : val, "user");
  }, []);

  const insertDivider = useCallback(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    editor.focus();
    const range = editor.getSelection(true);
    const index = range?.index ?? editor.getLength();
    editor.insertText(index, "\n", "user");
    editor.insertEmbed(index + 1, "divider", true, "user");
    editor.setSelection(index + 2, 0);
  }, []);

  const insertLink = useCallback(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    editor.focus();
    const range = editor.getSelection(true);
    const url = window.prompt("Link URL (https://…)");
    if (!url) return;
    if (range && range.length > 0) {
      editor.format("link", url, "user");
    } else {
      const index = range?.index ?? editor.getLength();
      editor.insertText(index, url, { link: url }, "user");
      editor.setSelection(index + url.length, 0);
    }
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
    "divider",

  ];

  const plainText = value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
  const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;

  const quickInserts = [
    { label: "Section heading", icon: Heading2, onClick: () => applyBlock("header", 2) },
    { label: "Sub-heading", icon: Heading3, onClick: () => applyBlock("header", 3) },
    { label: "Quote", icon: Quote, onClick: () => applyBlock("blockquote", true) },
    { label: "Bullet list", icon: List, onClick: () => applyBlock("list", "bullet") },
    { label: "Divider", icon: Minus, onClick: insertDivider },
    { label: "Image", icon: ImagePlus, onClick: imageHandler },
    { label: "Link", icon: Link2, onClick: insertLink },
  ];

  return (
    <div
      className={cn("rich-text-editor relative", className)}
      style={minHeight ? ({ ["--editor-min-height" as string]: minHeight } as React.CSSProperties) : undefined}
    >
      {showQuickInserts && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-muted/40 p-1.5">
          <span className="px-1.5 text-xs font-medium text-muted-foreground">Insert</span>
          {quickInserts.map(({ label, icon: Icon, onClick }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs"
              onClick={onClick}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      )}

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

      {showQuickInserts && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {words} words · {Math.max(1, Math.round(words / 225))} min read
          </span>
          <span>Tip: break long text into sections with headings, quotes and images.</span>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-background/70 text-sm font-medium text-muted-foreground">
          Uploading image…
        </div>
      )}
    </div>
  );
}
