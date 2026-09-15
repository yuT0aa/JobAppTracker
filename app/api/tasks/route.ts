import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { taskInputSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  return NextResponse.json(await prisma.task.findMany({ where: { userId: auth.userId }, include: { application: { include: { company: true } } }, orderBy: [{ completedAt: "asc" }, { dueAt: "asc" }] }));
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = taskInputSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const data = parsed.data;
  if (data.applicationId && !(await prisma.application.findFirst({ where: { id: data.applicationId, userId: auth.userId } }))) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  return NextResponse.json(await prisma.task.create({ data: { ...data, userId: auth.userId, dueAt: data.dueAt ? new Date(data.dueAt) : null, applicationId: data.applicationId || null, description: data.description || null } }), { status: 201 });
}
