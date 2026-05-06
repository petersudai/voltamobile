"use client";

import { useState, useRef, useCallback, useId } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CONDITION_LABELS } from "@/lib/constants";
import {
  Upload,
  X,
  Link2,
  Plus,
  GripVertical,
  ImageOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Name required"),
  brandId: z.string().min(1, "Brand required"),
  modelName: z.string().min(1, "Model required"),
  storageCapacity: z.string().min(1, "Storage required"),
  ram: z.string().optional(),
  color: z.string().min(1, "Color required"),
  condition: z.enum(["BRAND_NEW", "EX_UK", "REFURBISHED", "USED"]),
  batteryHealth: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  priceKES: z.coerce.number().int().positive("Price required"),
  priceUSD: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  marketPriceKES: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  marketPriceUSD: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  description: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isHero: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface InitialData extends Partial<FormData> {
  id?: string;
  images?: string | string[];
}

interface ProductFormProps {
  brands: Brand[];
  initialData?: InitialData;
  mode: "create" | "edit";
}

// ─── Image Manager ────────────────────────────────────────────────────────────

function ImageManager({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
}) {
  const [draggingOver, setDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlId = useId();

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);
      if (!arr.length) return;

      setUploading(true);
      setUploadError("");

      const form = new FormData();
      arr.forEach((f) => form.append("files", f));

      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const json = await res.json();
        if (!res.ok) {
          setUploadError(json.error ?? "Upload failed");
          return;
        }
        onChange([...value, ...json.urls]);
      } catch {
        setUploadError("Upload failed — check your connection and try again.");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [value, onChange]
  );

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) uploadFiles(files);
  };

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    // Accept lines separated by newline too
    const urls = trimmed
      .split(/\n/)
      .map((u) => u.trim())
      .filter(Boolean);
    onChange([...value, ...urls]);
    setUrlInput("");
  };

  const removeImage = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
    setImgErrors((prev) => {
      const next = { ...prev };
      delete next[i];
      return next;
    });
  };

  const moveImage = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Photos
          <span className="ml-1 text-xs font-normal text-gray-400">
            (first image = main display)
          </span>
        </label>
        {value.length > 0 && (
          <span className="text-xs text-gray-400">{value.length} photo{value.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 cursor-pointer transition-all duration-200 select-none",
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
              Click or drag photos here
            </p>
            <p className="text-xs text-gray-400">JPEG · PNG · WebP · up to 10 MB each</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={onFilePick}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-red-600 px-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {uploadError}
        </div>
      )}

      {/* Image previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div
              key={url + i}
              className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
            >
              {imgErrors[i] ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gray-100">
                  <ImageOff className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 text-center px-1 truncate w-full text-center">
                    {url.split("/").pop()}
                  </span>
                </div>
              ) : (
                <Image
                  src={url}
                  alt={`Product photo ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  onError={() => setImgErrors((p) => ({ ...p, [i]: true }))}
                />
              )}

              {/* Badge for main photo */}
              {i === 0 && (
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                  MAIN
                </div>
              )}

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-150 flex items-start justify-end p-1 gap-1">
                {/* Move left */}
                {i > 0 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveImage(i, i - 1); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-white/90 hover:bg-white shadow-sm"
                    title="Move left"
                  >
                    <GripVertical className="w-3 h-3 text-gray-600" />
                  </button>
                )}
                {/* Remove */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-white/90 hover:bg-red-50 shadow-sm"
                  title="Remove photo"
                >
                  <X className="w-3 h-3 text-gray-600 hover:text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* URL input fallback */}
      <div className="flex items-start gap-2 pt-1">
        <div className="flex-1">
          <label htmlFor={urlId} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
            <Link2 className="w-3.5 h-3.5" />
            Or add by URL
          </label>
          <textarea
            id={urlId}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addUrl();
              }
            }}
            rows={2}
            placeholder="https://images.unsplash.com/photo-…"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
          />
          <p className="mt-1 text-[10px] text-gray-400">One URL per line · press Enter to add</p>
        </div>
        <button
          type="button"
          onClick={addUrl}
          disabled={!urlInput.trim()}
          className="mt-6 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {error && <p className="text-xs text-red-600 px-1">{error}</p>}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function ProductForm({ brands, initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(() => {
    if (Array.isArray(initialData?.images)) return initialData.images;
    if (typeof initialData?.images === "string" && initialData.images) {
      return initialData.images.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  });
  const [imagesError, setImagesError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: initialData?.name ?? "",
      brandId: initialData?.brandId ?? "",
      modelName: initialData?.modelName ?? "",
      storageCapacity: initialData?.storageCapacity ?? "",
      ram: initialData?.ram ?? "",
      color: initialData?.color ?? "",
      condition: initialData?.condition ?? "EX_UK",
      batteryHealth: initialData?.batteryHealth ?? ("" as never),
      priceKES: initialData?.priceKES ?? ("" as never),
      priceUSD: initialData?.priceUSD ?? ("" as never),
      marketPriceKES: initialData?.marketPriceKES ?? ("" as never),
      marketPriceUSD: initialData?.marketPriceUSD ?? ("" as never),
      description: initialData?.description ?? "",
      isAvailable: initialData?.isAvailable ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      isHero: initialData?.isHero ?? false,
    },
  });

  const condition = watch("condition");

  const onSubmit = async (data: FormData) => {
    setError("");
    setImagesError("");

    if (images.length === 0) {
      setImagesError("At least one photo is required.");
      return;
    }

    const payload = {
      ...data,
      images,
      batteryHealth: data.batteryHealth || null,
      priceUSD: data.priceUSD || null,
      marketPriceKES: data.marketPriceKES || null,
      marketPriceUSD: data.marketPriceUSD || null,
      ram: data.ram || null,
      description: data.description || null,
    };

    const url =
      mode === "create" ? "/api/products" : `/api/products/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error?.message ?? "Something went wrong.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Product Name" error={errors.name?.message} className="sm:col-span-2">
          <input
            {...register("name")}
            className={inputClass}
            placeholder="iPhone 15 Pro Max 256GB Natural Titanium"
          />
        </FormField>

        <FormField label="Brand" error={errors.brandId?.message}>
          <select {...register("brandId")} className={inputClass}>
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Model Name" error={errors.modelName?.message}>
          <input
            {...register("modelName")}
            className={inputClass}
            placeholder="iPhone 15 Pro Max"
          />
        </FormField>

        <FormField label="Storage" error={errors.storageCapacity?.message}>
          <select {...register("storageCapacity")} className={inputClass}>
            <option value="">Select storage</option>
            {["64GB", "128GB", "256GB", "512GB", "1TB"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>

        <FormField label="RAM (optional)" error={errors.ram?.message}>
          <input {...register("ram")} className={inputClass} placeholder="8GB" />
        </FormField>

        <FormField label="Color" error={errors.color?.message}>
          <input
            {...register("color")}
            className={inputClass}
            placeholder="Natural Titanium"
          />
        </FormField>

        <FormField label="Condition" error={errors.condition?.message}>
          <select {...register("condition")} className={inputClass}>
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormField>

        {condition !== "BRAND_NEW" && (
          <FormField label="Battery Health (%)" error={errors.batteryHealth?.message}>
            <input
              {...register("batteryHealth")}
              type="number"
              min={1}
              max={100}
              className={inputClass}
              placeholder="95"
            />
          </FormField>
        )}

        <FormField label="Price (KES)" error={errors.priceKES?.message}>
          <input
            {...register("priceKES")}
            type="number"
            className={inputClass}
            placeholder="89999"
          />
        </FormField>

        <FormField label="Price (USD, optional)" error={errors.priceUSD?.message}>
          <input
            {...register("priceUSD")}
            type="number"
            className={inputClass}
            placeholder="692"
          />
        </FormField>

        <FormField
          label="Market Price KES (anchoring, optional)"
          error={errors.marketPriceKES?.message}
        >
          <input
            {...register("marketPriceKES")}
            type="number"
            className={inputClass}
            placeholder="115000"
          />
        </FormField>

        <FormField label="Market Price USD (optional)" error={errors.marketPriceUSD?.message}>
          <input
            {...register("marketPriceUSD")}
            type="number"
            className={inputClass}
            placeholder="885"
          />
        </FormField>
      </div>

      {/* Image manager — replaces the raw textarea */}
      <ImageManager
        value={images}
        onChange={setImages}
        error={imagesError}
      />

      <FormField
        label="Device Notes / Description"
        error={errors.description?.message}
        hint="Scratches, inclusions, condition notes. Bullet points work well."
      >
        <textarea
          {...register("description")}
          rows={5}
          className={inputClass + " resize-none"}
          placeholder={`- Minor scratch on bottom edge\n- Original charger included\n- Screen in perfect condition`}
        />
      </FormField>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("isAvailable")}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Available for sale</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">★ Featured on homepage</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer" title="Shows this product in the homepage hero banner. Only one product can be the hero at a time.">
          <input
            type="checkbox"
            {...register("isHero")}
            className="w-4 h-4 rounded accent-violet-600"
          />
          <span className="text-sm font-medium text-gray-700">🏠 Homepage hero</span>
        </label>
      </div>
      <p className="text-xs text-gray-400 -mt-4">
        Hero: sets this product as the homepage banner image &amp; data. Marking a new hero automatically removes the previous one.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={isSubmitting} size="md">
          {mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow";

function FormField({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
