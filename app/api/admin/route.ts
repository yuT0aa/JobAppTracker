import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api";

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const [users, applications, companies, interviews, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.application.count(),
    prisma.company.count(),
    prisma.interview.count(),
    prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { applications: true } } }, orderBy: { createdAt: "desc" }, take: 20 })
  ]);
  return NextResponse.json({ totals: { users, applications, companies, interviews }, users: recentUsers });
}
