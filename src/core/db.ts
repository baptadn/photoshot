import { PrismaClient } from "@prisma/client";

declare global {
  var db: PrismaClient | undefined;
}

const db = globalThis.db || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}

export default db;
