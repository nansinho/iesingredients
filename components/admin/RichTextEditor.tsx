"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { useState, useRef, useCallback, useEffect } from "react";
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
  RectangleHorizontal,
  Columns2,
  Code,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface RichTextEditorHandle {
  insertImage: (src: string, alt: string) => void;
  insertImageGrid: (images: { src: string; alt: string }[]) => void;
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onOpenLibrary?: () => void;
  onOpenGridLibrary?: () => void;
  editorRef?: React.MutableRefObject<RichTextEditorHandle | null>;
}

// Custom Image extension with float, size and width attributes
const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-float": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-float"),
        renderHTML: (attributes) => {
          if (!attributes["data-float"]) return {};
          return { "data-float": attributes["data-float"] };
        },
      },
      "data-size": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-size"),
        renderHTML: (attributes) => {
          if (!attributes["data-size"]) return {};
          return { "data-size": attributes["data-size"] };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => element.style.width || element.getAttribute("width"),
        renderHTML: (attributes) => {
          const styles: string[] = [];
          if (attributes.width) styles.push(`width: ${attributes.width}`);
          if (attributes.height) styles.push(`height: ${attributes.height}`);
          if (!styles.length) return {};
          return { style: styles.join("; ") };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.style.height || element.getAttribute("height"),
        renderHTML: () => ({}), // rendered via width's renderHTML
      },
    };
  },
});

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
          ? "bg-brand-accent/15 text-brand-accent-hover"
          : "text-brand-secondary/60 hover:text-brand-primary hover:bg-brand-primary/5",
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

export function RichTextEditor({ content, onChange, placeholder = "Commencez à écrire...", onOpenLibrary, onOpenGridLibrary, editorRef }: RichTextEditorProps) {
  const isSettingContent = useRef(false);
  const [showSource, setShowSource] = useState(false);
  const [sourceHtml, setSourceHtml] = useState("");

  const formatHtml = useCallback((html: string) => {
    let formatted = "";
    let indent = 0;
    // Split around tags while keeping the tags
    const tokens = html.replace(/>\s*</g, ">\n<").split("\n");
    for (const token of tokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;
      // Closing tag → decrease indent before printing
      if (/^<\/\w/.test(trimmed)) indent = Math.max(0, indent - 1);
      formatted += "  ".repeat(indent) + trimmed + "\n";
      // Opening tag (not self-closing, not void) → increase indent
      if (/^<\w[^>]*[^/]>$/.test(trimmed) && !/^<(img|br|hr|input|meta|link)\b/i.test(trimmed)) {
        indent++;
      }
    }
    return formatted.trimEnd();
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-brand-accent underline" },
      }),
      CustomImage.configure({
        HTMLAttributes: { class: "rounded-lg" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (!isSettingContent.current) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-5 py-4",
      },
      handleDrop: (_view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (file?.type.startsWith("image/")) {
          event.preventDefault();
          toast.info("Utilisez la médiathèque pour insérer des images");
          return true;
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const file = event.clipboardData?.files?.[0];
        if (file?.type.startsWith("image/")) {
          event.preventDefault();
          toast.info("Utilisez la médiathèque pour insérer des images");
          return true;
        }
        return false;
      },
    },
  });


  // Expose insertImage to parent via ref
  useEffect(() => {
    if (editorRef && editor) {
      editorRef.current = {
        insertImage: (src: string, alt: string) => {
          editor.chain().focus().setImage({ src, alt }).run();
        },
        insertImageGrid: (images: { src: string; alt: string }[]) => {
          if (images.length === 0) return;
          const imgTags = images
            .map((img) => `<img src="${img.src}" alt="${img.alt || ""}" class="rounded-lg" />`)
            .join("");
          const gridHtml = `<div class="image-grid">${imgTags}</div>`;
          editor.chain().focus().insertContent(gridHtml).run();
        },
      };
    }
  }, [editor, editorRef]);

  useEffect(() => {
    if (!editor || !content) return;
    if (content === "<p></p>") return;

    const normalize = (html: string) => html.replace(/>\s+</g, "><").trim();
    const currentHTML = editor.getHTML();

    if (normalize(content) !== normalize(currentHTML)) {
      isSettingContent.current = true;
      editor.commands.setContent(content, { emitUpdate: false });
      requestAnimationFrame(() => {
        isSettingContent.current = false;
      });
    }
  }, [editor, content]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL du lien :", "https://");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const setImageFloat = useCallback((float: string | null) => {
    if (!editor) return;
    editor.chain().focus().updateAttributes("image", { "data-float": float }).run();
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
        <ToolbarButton onClick={() => onOpenLibrary?.()} title="Insérer une image (Médiathèque)">
          <ImageIcon className={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={() => onOpenGridLibrary?.()} title="Insérer une grille d'images">
          <LayoutGrid className={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => {
            if (showSource) {
              // Retour en mode visuel : injecter le HTML édité dans TipTap
              isSettingContent.current = true;
              editor.commands.setContent(sourceHtml, { emitUpdate: false });
              onChange(sourceHtml);
              requestAnimationFrame(() => {
                isSettingContent.current = false;
              });
              setShowSource(false);
            } else {
              setSourceHtml(formatHtml(editor.getHTML()));
              setShowSource(true);
            }
          }}
          active={showSource}
          title="Code source HTML"
        >
          <Code className={iconSize} />
        </ToolbarButton>
      </div>

      {/* Image Bubble Menu — appears when an image is selected */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor: e }) => e.isActive("image")}
      >
        <div className="flex items-center gap-1.5 bg-white rounded-xl shadow-xl border border-gray-200 px-3 py-2">
          {/* Float */}
          <span className="text-[10px] text-gray-400 font-medium">Position</span>
          <ToolbarButton
            onClick={() => setImageFloat("left")}
            active={editor.getAttributes("image")["data-float"] === "left"}
            title="Flotter à gauche"
          >
            <Columns2 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setImageFloat(null)}
            active={!editor.getAttributes("image")["data-float"]}
            title="Centré (pleine largeur)"
          >
            <RectangleHorizontal className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setImageFloat("right")}
            active={editor.getAttributes("image")["data-float"] === "right"}
            title="Flotter à droite"
          >
            <Columns2 className="w-3.5 h-3.5 scale-x-[-1]" />
          </ToolbarButton>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Width presets */}
          <span className="text-[10px] text-gray-400 font-medium">Largeur</span>
          {["25%", "33%", "50%", "75%", "100%"].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => editor.chain().updateAttributes("image", { width: w === "100%" ? null : w }).run()}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-medium transition-all",
                (editor.getAttributes("image").width || "100%") === w || (w === "100%" && !editor.getAttributes("image").width)
                  ? "bg-brand-accent/15 text-brand-accent-hover"
                  : "text-gray-400 hover:text-brand-primary hover:bg-gray-100"
              )}
            >
              {w}
            </button>
          ))}

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* Custom dimensions W × H */}
          <span className="text-[10px] text-gray-400 font-medium">L</span>
          <input
            type="text"
            placeholder="auto"
            defaultValue={(editor.getAttributes("image").width || "").replace("px", "")}
            key={`w-${editor.getAttributes("image").width}`}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const val = (e.target as HTMLInputElement).value.trim();
              editor.chain().updateAttributes("image", { width: val ? (val.includes("%") ? val : `${parseInt(val)}px`) : null }).run();
            }}
            onBlur={(e) => {
              const val = e.target.value.trim();
              if (!val) return;
              editor.chain().updateAttributes("image", { width: val.includes("%") ? val : `${parseInt(val)}px` }).run();
            }}
            className="w-12 h-5 px-1 text-[10px] text-center font-mono rounded border border-gray-200 focus:border-brand-accent/50 focus:outline-none"
          />
          <span className="text-[10px] text-gray-300">×</span>
          <span className="text-[10px] text-gray-400 font-medium">H</span>
          <input
            type="text"
            placeholder="auto"
            defaultValue={(editor.getAttributes("image").height || "").replace("px", "")}
            key={`h-${editor.getAttributes("image").height}`}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const val = (e.target as HTMLInputElement).value.trim();
              editor.chain().updateAttributes("image", { height: val ? `${parseInt(val)}px` : null }).run();
            }}
            onBlur={(e) => {
              const val = e.target.value.trim();
              if (!val) return;
              editor.chain().updateAttributes("image", { height: `${parseInt(val)}px` }).run();
            }}
            className="w-12 h-5 px-1 text-[10px] text-center font-mono rounded border border-gray-200 focus:border-brand-accent/50 focus:outline-none"
          />
        </div>
      </BubbleMenu>

      {/* Editor / Source toggle */}
      {showSource ? (
        <textarea
          className="w-full min-h-[300px] px-5 py-4 font-mono text-xs leading-relaxed text-gray-800 bg-gray-50 border-none focus:outline-none resize-y"
          value={sourceHtml}
          onChange={(e) => {
            setSourceHtml(e.target.value);
          }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}

    </div>
  );
}
