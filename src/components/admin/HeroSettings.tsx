"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  Link2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ImageOff,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface HeroSettingsProps {
  /** Current value from the database (or the default constant) */
  currentImageUrl: string;
}

export function HeroSettings({ currentImageUrl }: HeroSettingsProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [previewError, setPreviewError] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Upload file → /api/upload ──────────────────────────────────────────────
  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError("");

    const form = new FormData();
    form.append("files", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        setUploadError(json.error ?? "Upload failed");
        return;
      }
      setImageUrl(json.urls[0]);
      setPreviewError(false);
    } catch {
      setUploadError("Upload failed — check your connection.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) uploadFile(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(false);
    const file = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/")
    );
    if (file) uploadFile(file);
  };

  // ── Save to DB ─────────────────────────────────────────────────────────────
  const save = async () => {
    setSaving(true);
    setSaved(false);
    setUploadError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "heroImageUrl", value: imageUrl }),
      });
      if (!res.ok) {
        const json = await res.json();
        setUploadError(json.error ?? "Save failed");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setUploadError("Save failed — check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImageUrl(trimmed);
    setPreviewError(false);
    setUrlInput("");
  };

  const isDirty = imageUrl !== currentImageUrl;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Current preview */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Current hero image</p>
        <div className="relative w-full max-w-xs aspect-[9/19] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
          {previewError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
              <ImageOff className="w-8 h-8" />
              <span className="text-xs">Preview unavailable</span>
            </div>
          ) : (
            <Image
              key={imageUrl}
              src={imageUrl}
              alt="Hero preview"
              fill
              sizes="220px"
              className="object-contain"
              onError={() => setPreviewError(true)}
            />
          )}
        </div>
        {isDirty && (
          <p className="mt-2 text-xs text-amber-600 font-medium">
            ⚠ Unsaved change — click Save to apply.
          </p>
        )}
      </div>

      {/* Upload drop zone */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Upload a new photo</p>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 cursor-pointer transition-all duration-200 select-none",
            draggingOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">Uploading…</p>
            </>
          ) : (
            <>
              <Upload className="w-7 h-7 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">
                Click or drag a photo here
              </p>
              <p className="text-xs text-gray-400">
                Portrait orientation recommended · JPEG / PNG / WebP · up to 10 MB
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={onFilePick}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* URL input */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
          <Link2 className="w-3.5 h-3.5" />
          Or paste an image URL
        </label>
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyUrl(); } }}
            placeholder="https://images.unsplash.com/photo-…"
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={applyUrl}
            disabled={!urlInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-gray-700 transition-colors whitespace-nowrap"
          >
            Use URL
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Press Enter or click "Use URL" to preview before saving.
        </p>
      </div>

      {/* Reset to default */}
      {imageUrl !== currentImageUrl && (
        <button
          type="button"
          onClick={() => { setImageUrl(currentImageUrl); setPreviewError(false); }}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Discard change
        </button>
      )}

      {/* Error */}
      {uploadError && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {uploadError}
        </div>
      )}

      {/* Save */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          onClick={save}
          loading={saving}
          size="md"
        >
          Save Hero Image
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Saved — live on the store
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        The hero image appears on the right side of the homepage banner. Use a
        portrait-oriented phone photo for the best look. Changes go live
        immediately after saving.
      </p>
    </div>
  );
}
