import { PrismaClient } from '@prisma/client';

// This instantiates a single PrismaClient instance. It's best practice to do this
// in a separate file and import it wherever you need it. This prevents exhausting
// your database connection limit.
//
// In a serverless environment, this instance will be reused across function invocations
// within the same container.
// See: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
const prisma = new PrismaClient();

export default prisma;

