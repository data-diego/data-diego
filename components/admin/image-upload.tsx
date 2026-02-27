"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  currentStorageId?: Id<"_storage">;
  onUploaded: (storageId: Id<"_storage">) => void;
  onRemoved?: () => void;
  className?: string;
  shape?: "square" | "circle";
}

export function ImageUpload({
  currentImageUrl,
  currentStorageId,
  onUploaded,
  onRemoved,
  className = "",
  shape = "square",
}: ImageUploadProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const removeFile = useMutation(api.files.remove);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");

      const { storageId } = (await result.json()) as {
        storageId: Id<"_storage">;
      };
      onUploaded(storageId);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (currentStorageId) {
      try {
        await removeFile({ storageId: currentStorageId });
      } catch {
        // Storage might already be deleted, that's ok
      }
    }
    setPreview(null);
    onRemoved?.();
  };

  const displayUrl = preview || currentImageUrl;
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <div className={`${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => void handleFileSelect(e)}
        className="hidden"
      />

      {displayUrl ? (
        <div className="relative group/img inline-block">
          <img
            src={displayUrl}
            alt="Upload"
            className={`object-cover border border-border ${shapeClass}`}
            style={{ width: "100%", height: "100%" }}
          />
          <div
            className={`absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1 ${shapeClass}`}
          >
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 text-xs"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "..." : "Replace"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-7 text-xs"
              onClick={() => void handleRemove()}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`w-full h-full border-2 border-dashed border-muted-foreground/30 hover:border-foreground/50 flex flex-col items-center justify-center gap-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors ${shapeClass}`}
        >
          {uploading ? (
            <span className="text-xs">Uploading...</span>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-[10px]">Upload image</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
