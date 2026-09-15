import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import { z } from "zod";

type Params = { params: { id: string } };
const patchSchema = z.object({ title: z.string().trim().min(1).max(200).optional(), remindAt: z.string().datetime({ offset: true }).optional(), completed: z.boolean().optional() });

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Validation failed." }, { status: 400 });
  const existing = await prisma.reminder.findFirst({ where: { id: params.id, userId: auth.userId } });
  if (!existing) return NextResponse.json({ error: "Reminder not found." }, { status: 404 });
  return NextResponse.json(await prisma.reminder.update({ where: { id: params.id }, data: { title: parsed.data.title, remindAt: parsed.data.remindAt ? new Date(parsed.data.remindAt) : undefined, completedAt: parsed.data.completed === undefined ? undefined : parsed.data.completed ? new Date() : null } }));
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const result = await prisma.reminder.deleteMany({ where: { id: params.id, userId: auth.userId } });
  return result.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Reminder not found." }, { status: 404 });
}
