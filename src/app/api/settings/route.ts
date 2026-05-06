import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "key query param required" }, { status: 400 });
  }
  const row = await prisma.siteSettings.findUnique({ where: { key } });
  return NextResponse.json({ key, value: row?.value ?? null });
}

const putSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { key, value } = parsed.data;
  const row = await prisma.siteSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json(row);
}
