import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  brandId: z.string().min(1).optional(),
  modelName: z.string().min(1).optional(),
  storageCapacity: z.string().min(1).optional(),
  ram: z.string().optional().nullable(),
  color: z.string().min(1).optional(),
  condition: z.enum(["BRAND_NEW", "EX_UK", "REFURBISHED", "USED"]).optional(),
  batteryHealth: z.number().int().min(1).max(100).optional().nullable(),
  priceKES: z.number().int().positive().optional(),
  priceUSD: z.number().int().positive().optional().nullable(),
  marketPriceKES: z.number().int().positive().optional().nullable(),
  marketPriceUSD: z.number().int().positive().optional().nullable(),
  images: z.array(z.string()).min(1).optional(),
  description: z.string().optional().nullable(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isHero: z.boolean().optional(),
});

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { brand: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  if (data.modelName || data.storageCapacity || data.color || data.condition) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (existing) {
      const newSlug = slugify(
        `${data.modelName ?? existing.modelName} ${data.storageCapacity ?? existing.storageCapacity} ${data.color ?? existing.color} ${data.condition ?? existing.condition}`
      );
      if (newSlug !== existing.slug) {
        (data as Record<string, unknown>).slug = newSlug;
      }
    }
  }

  // Only one hero at a time — clear any existing hero before setting a new one
  if (data.isHero) {
    await prisma.product.updateMany({
      where: { isHero: true, id: { not: id } },
      data: { isHero: false },
    });
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    include: { brand: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
