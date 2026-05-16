import { prisma } from "../../config/database";

export async function createApplication(userId: string, serviceType: string, data: any) {
  return prisma.usaService.create({
    data: {
      userId,
      serviceType,
      ...data,
    },
  });
}

export async function getApplications(userId: string) {
  return prisma.usaService.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplication(userId: string, id: string) {
  const app = await prisma.usaService.findFirst({
    where: { id, userId },
  });
  if (!app) {
    throw Object.assign(new Error("Application not found"), { statusCode: 404 });
  }
  return app;
}
