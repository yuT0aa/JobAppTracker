import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { reminderInputSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  return NextResponse.json(await prisma.reminder.findMany({ where: { userId: auth.userId }, include: { application: { include: { company: true } } }, orderBy: { remindAt: "asc" } }));
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = reminderInputSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const data = parsed.data;
  if (data.applicationId && !(await prisma.application.findFirst({ where: { id: data.applicationId, userId: auth.userId } }))) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  return NextResponse.json(await prisma.reminder.create({ data: { ...data, userId: auth.userId, remindAt: new Date(data.remindAt), applicationId: data.applicationId || null } }), { status: 201 });
}
