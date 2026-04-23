import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
  var pool: Pool | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const pool =
  globalThis.pool ??
  new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

const adapter = new PrismaPg(pool);

const prisma = globalThis.prisma ?? new PrismaClient({ adapter });

globalThis.prisma = prisma;
globalThis.pool = pool;

export { prisma };
