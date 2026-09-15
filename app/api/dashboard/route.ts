import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const [total, grouped, recent] = await Promise.all([
    prisma.application.count({ where: { userId: auth.userId } }),
    prisma.application.groupBy({ by: ["status"], where: { userId: auth.userId }, _count: { _all: true } }),
    prisma.application.findMany({ where: { userId: auth.userId }, include: { company: true }, orderBy: { updatedAt: "desc" }, take: 5 })
  ]);
  return NextResponse.json({
    total,
    byStatus: Object.fromEntries(grouped.map((item) => [item.status, item._count._all])),
    recent
  });
}
