import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const [byStatus, byMonth, companies] = await Promise.all([
    prisma.application.groupBy({ by: ["status"], where: { userId: auth.userId }, _count: { _all: true } }),
    prisma.$queryRaw<Array<{ month: Date; count: bigint }>>`
      SELECT date_trunc('month', "createdAt") AS month, COUNT(*)::bigint AS count
      FROM "Application" WHERE "userId" = ${auth.userId}
      GROUP BY 1 ORDER BY 1 ASC
    `,
    prisma.company.findMany({ where: { userId: auth.userId }, select: { name: true, _count: { select: { applications: true } } }, orderBy: { applications: { _count: "desc" } }, take: 5 })
  ]);
  return NextResponse.json({
    byStatus: Object.fromEntries(byStatus.map((item) => [item.status, item._count._all])),
    byMonth: byMonth.map((item) => ({ month: item.month, count: Number(item.count) })),
    topCompanies: companies.map((item) => ({ name: item.name, count: item._count.applications }))
  });
}
