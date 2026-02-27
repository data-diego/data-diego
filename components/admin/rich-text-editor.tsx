"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown as TiptapMarkdown } from "tiptap-markdown";
import { useCallback, useRef } from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface RichTextEditorProps {
  content: string;
  onChange: (markdown: string) => void;
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
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`size-7 flex items-center justify-center rounded text-xs transition-colors ${
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onImageUpload }: { editor: Editor; onImageUpload: () => void }) {
  return (
    <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5 flex-wrap">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline code"
      >
        {"<>"}
      </ToolbarButton>

      <div className="w-px h-4 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        H3
      </ToolbarButton>

      <div className="w-px h-4 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
          <circle cx="5" cy="6" r="1.5" fill="currentColor" /><circle cx="5" cy="12" r="1.5" fill="currentColor" /><circle cx="5" cy="18" r="1.5" fill="currentColor" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Quote"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M10 8c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h1l-1 3h2l1-3c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2h-3zM3 8c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h1l-1 3h2l1-3c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2H3z" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code block"
      >
        {"{ }"}
      </ToolbarButton>

      <div className="w-px h-4 bg-border mx-1" />

      <ToolbarButton
        onClick={() => {
          const url = window.prompt("URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        active={editor.isActive("link")}
        title="Add link"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={onImageUpload} title="Upload image">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </ToolbarButton>

      <div className="w-px h-4 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal rule"
      >
        —
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);

  const uploadAndInsertImage = useCallback(
    async (file: File, currentEditor: Editor | null) => {
      const ed = currentEditor ?? editorRef.current;
      if (!ed) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }

      const localUrl = URL.createObjectURL(file);
      ed.chain().focus().setImage({ src: localUrl, alt: file.name }).run();

      try {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!result.ok) throw new Error("Upload failed");
        const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };

        const publicUrl = await convex.query(api.files.getUrl, { storageId });
        if (!publicUrl) throw new Error("Could not get URL");

        // Replace the blob with the real URL in the document
        const { doc, tr } = ed.state;
        doc.descendants((node, pos) => {
          if (node.type.name === "image" && node.attrs.src === localUrl) {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: publicUrl });
          }
        });
        ed.view.dispatch(tr);

        URL.revokeObjectURL(localUrl);
        toast.success("Image uploaded");
      } catch {
        toast.error("Failed to upload image");
      }
    },
    [generateUploadUrl, convex]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      TiptapLink.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Write something..." }),
      TiptapMarkdown,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-neutral dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !event.dataTransfer?.files?.length) return false;
        const file = event.dataTransfer.files[0];
        if (!file?.type.startsWith("image/")) return false;
        event.preventDefault();
        void uploadAndInsertImage(file, editorRef.current);
        return true;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) void uploadAndInsertImage(file, editorRef.current);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: e }) => {
      const md = (e.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
      onChange(md);
    },
    onCreate: ({ editor: e }) => {
      editorRef.current = e;
    },
  });

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void uploadAndInsertImage(file, editor);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadAndInsertImage, editor]
  );

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <Toolbar editor={editor} onImageUpload={() => fileInputRef.current?.click()} />
      <EditorContent editor={editor} />
    </div>
  );
}
