import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

export async function GET(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const start = request.nextUrl.searchParams.get("start");
  const end = request.nextUrl.searchParams.get("end");
  const range = start || end ? { gte: start ? new Date(start) : undefined, lte: end ? new Date(end) : undefined } : undefined;
  const [interviews, reminders, tasks] = await Promise.all([
    prisma.interview.findMany({ where: { userId: auth.userId, scheduledAt: range }, include: { application: { include: { company: true } } }, orderBy: { scheduledAt: "asc" } }),
    prisma.reminder.findMany({ where: { userId: auth.userId, remindAt: range }, include: { application: { include: { company: true } } }, orderBy: { remindAt: "asc" } }),
    prisma.task.findMany({ where: { userId: auth.userId, dueAt: range }, include: { application: { include: { company: true } } }, orderBy: { dueAt: "asc" } })
  ]);
  return NextResponse.json({ interviews, reminders, tasks });
}
