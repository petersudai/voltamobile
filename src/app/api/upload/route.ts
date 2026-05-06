import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF` },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `"${file.name}" exceeds the 10 MB limit` },
        { status: 400 }
      );
    }
  }

  const urls: string[] = [];

  // ── Production: Vercel Blob ────────────────────────────────────────────────
  // Vercel's filesystem is read-only at runtime; Blob gives a permanent CDN URL.
  // Requires BLOB_READ_WRITE_TOKEN (auto-set when you link a Blob store in the
  // Vercel dashboard: Storage → Create → Blob).
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");

    for (const file of files) {
      const ext = file.type.split("/")[1].replace("jpeg", "jpg");
      const blob = await put(`products/${randomUUID()}.${ext}`, file, {
        access: "public",
        contentType: file.type,
      });
      urls.push(blob.url);
    }

    return NextResponse.json({ urls });
  }

  // ── Production guard ──────────────────────────────────────────────────────
  // Vercel's filesystem is read-only at runtime. If BLOB_READ_WRITE_TOKEN is
  // missing we cannot write files — return a clear error instead of crashing.
  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Image uploads are not configured. Set BLOB_READ_WRITE_TOKEN in your Vercel project environment variables (Dashboard → Storage → Create Blob store → connect to project).",
      },
      { status: 503 }
    );
  }

  // ── Development: local filesystem ─────────────────────────────────────────
  // Files land in public/uploads/ and are served as /uploads/<filename>.
  // This folder is gitignored; it only exists on your local machine.
  const { writeFile, mkdir } = await import("fs/promises");
  const { join } = await import("path");

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `${randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();
    await writeFile(join(uploadDir, filename), Buffer.from(bytes));
    urls.push(`/uploads/${filename}`);
  }

  return NextResponse.json({ urls });
}
