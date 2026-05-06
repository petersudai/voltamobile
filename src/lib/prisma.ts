import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // max:1 — each serverless function instance holds at most one connection.
  // On Vercel, many concurrent invocations share Supabase's pool safely.
  // Pair this with the Transaction pooler URL (port 6543) in your env vars.
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 1,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always cache on globalThis — safe in production because Vercel warm containers
// reuse the same global, and prevents HMR from spawning duplicate clients in dev.
globalForPrisma.prisma = prisma;
