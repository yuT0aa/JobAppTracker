const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const userPassword = await bcrypt.hash("User123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@careertrack.local" },
    update: { role: "ADMIN", passwordHash: adminPassword, name: "CareerTrack Admin" },
    create: { email: "admin@careertrack.local", role: "ADMIN", passwordHash: adminPassword, name: "CareerTrack Admin" }
  });
  const user = await prisma.user.upsert({
    where: { email: "demo@careertrack.local" },
    update: { role: "USER", passwordHash: userPassword, name: "Demo User" },
    create: { email: "demo@careertrack.local", role: "USER", passwordHash: userPassword, name: "Demo User" }
  });
  const company = await prisma.company.upsert({
    where: { userId_name: { userId: user.id, name: "Acme Corp" } },
    update: {},
    create: { userId: user.id, name: "Acme Corp", website: "https://example.com", location: "Remote" }
  });
  const application = await prisma.application.findFirst({ where: { userId: user.id, companyId: company.id, role: "Product Engineer" } });
  if (!application) {
    await prisma.application.create({
      data: { userId: user.id, companyId: company.id, role: "Product Engineer", location: "Remote", status: "APPLIED", appliedAt: new Date() }
    });
  }
  await prisma.notification.upsert({
    where: { id: "seed-welcome-notification" },
    update: {},
    create: { id: "seed-welcome-notification", userId: admin.id, type: "SYSTEM", title: "Welcome to CareerTrack", message: "Your seeded admin workspace is ready." }
  });
  console.log("Seeded demo users: admin@careertrack.local and demo@careertrack.local");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
