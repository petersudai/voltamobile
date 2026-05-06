import { prisma } from "./prisma";

/** Fallback hero image used when nothing has been saved in the DB yet */
export const HERO_IMAGE_DEFAULT =
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=95&auto=format&fit=crop";

export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.siteSettings.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getHeroImageUrl(): Promise<string> {
  return (await getSetting("heroImageUrl")) ?? HERO_IMAGE_DEFAULT;
}
