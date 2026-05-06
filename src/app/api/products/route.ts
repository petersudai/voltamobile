import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  brandId: z.string().min(1),
  modelName: z.string().min(1),
  storageCapacity: z.string().min(1),
  ram: z.string().optional(),
  color: z.string().min(1),
  condition: z.enum(["BRAND_NEW", "EX_UK", "REFURBISHED", "USED"]),
  batteryHealth: z.number().int().min(1).max(100).optional().nullable(),
  priceKES: z.number().int().positive(),
  priceUSD: z.number().int().positive().optional().nullable(),
  marketPriceKES: z.number().int().positive().optional().nullable(),
  marketPriceUSD: z.number().int().positive().optional().nullable(),
  images: z.array(z.string().min(1)).min(1),
  description: z.string().optional().nullable(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isHero: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const brand = searchParams.get("brand");
  const condition = searchParams.get("condition");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");
  const storage = searchParams.get("storage");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "12");

  const where: Record<string, unknown> = {};

  if (brand) where.brand = { slug: brand };
  if (condition) where.condition = condition;
  if (storage) where.storageCapacity = storage;
  if (featured === "true") where.isFeatured = true;
  if (minPrice || maxPrice) {
    where.priceKES = {
      ...(minPrice ? { gte: parseInt(minPrice) } : {}),
      ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
    };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { modelName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const baseSlug = slugify(`${data.modelName} ${data.storageCapacity} ${data.color} ${data.condition}`);
  let slug = baseSlug;
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  // Only one hero at a time — clear any existing hero first
  if (data.isHero) {
    await prisma.product.updateMany({ where: { isHero: true }, data: { isHero: false } });
  }

  const product = await prisma.product.create({
    data: { ...data, slug },
    include: { brand: true },
  });

  return NextResponse.json(product, { status: 201 });
}
