"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Highlighter,
  Minus,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded-lg transition-all",
        active
          ? "bg-[var(--brand-accent)]/15 text-[var(--brand-accent-hover)]"
          : "text-[var(--brand-secondary)]/60 hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />;
}

export function RichTextEditor({ content, onChange, placeholder = "Commencez à écrire..." }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[var(--brand-accent)] underline" },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full mx-auto" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-5 py-4",
      },
      handleDrop: (view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (file?.type.startsWith("image/")) {
          event.preventDefault();
          handleImageUpload(file);
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const file = event.clipboardData?.files?.[0];
        if (file?.type.startsWith("image/")) {
          event.preventDefault();
          handleImageUpload(file);
          return true;
        }
        return false;
      },
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop volumineuse (max 5 Mo)");
      return;
    }

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const fileName = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run();
      toast.success("Image insérée");
    } catch {
      toast.error("Erreur lors de l'upload");
    }
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL du lien :", "https://");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const iconSize = "w-4 h-4";

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-[#FAFAF8]">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Annuler">
          <Undo className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rétablir">
          <Redo className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Titre 1">
          <Heading1 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Titre 2">
          <Heading2 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Titre 3">
          <Heading3 className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Gras">
          <Bold className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italique">
          <Italic className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Souligné">
          <UnderlineIcon className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Barré">
          <Strikethrough className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Surligné">
          <Highlighter className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Aligner à gauche">
          <AlignLeft className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centrer">
          <AlignCenter className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Aligner à droite">
          <AlignRight className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Liste à puces">
          <List className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Liste numérotée">
          <ListOrdered className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citation">
          <Quote className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Ligne horizontale">
          <Minus className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Insérer un lien">
          <Link2 className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Insérer une image">
          <ImageIcon className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload image">
          <Upload className={iconSize} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
