import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Add it to .env (see .env.example).')
}

// Local dev uses a `file:` SQLite DB (no token). Production uses a hosted
// libSQL/Turso DB, which needs an auth token supplied via TURSO_AUTH_TOKEN.
const authToken = process.env.TURSO_AUTH_TOKEN
const adapter = new PrismaLibSql(
  authToken ? { url: databaseUrl, authToken } : { url: databaseUrl }
)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
