import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { taskInputSchema } from "@/lib/validation";
import { z } from "zod";

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = taskInputSchema.partial().extend({ completed: z.boolean().optional() }).safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const existing = await prisma.task.findFirst({ where: { id: params.id, userId: auth.userId } });
  if (!existing) return NextResponse.json({ error: "Task not found." }, { status: 404 });
  const { completed, ...data } = parsed.data;
  return NextResponse.json(await prisma.task.update({ where: { id: params.id }, data: { ...data, dueAt: data.dueAt ? new Date(data.dueAt) : data.dueAt === null ? null : undefined, completedAt: completed === undefined ? undefined : completed ? new Date() : null, description: data.description === "" ? null : data.description, applicationId: data.applicationId || undefined } }));
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const result = await prisma.task.deleteMany({ where: { id: params.id, userId: auth.userId } });
  return result.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Task not found." }, { status: 404 });
}
