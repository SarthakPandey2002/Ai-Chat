import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma Client instance
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export default prisma;