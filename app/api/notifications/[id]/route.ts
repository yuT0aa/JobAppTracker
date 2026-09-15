import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  if (typeof body.read !== "boolean") return NextResponse.json({ error: "read must be a boolean." }, { status: 400 });
  const notification = await prisma.notification.findFirst({ where: { id: params.id, userId: auth.userId } });
  if (!notification) return NextResponse.json({ error: "Notification not found." }, { status: 404 });
  return NextResponse.json(await prisma.notification.update({ where: { id: params.id }, data: { readAt: body.read ? new Date() : null } }));
}
