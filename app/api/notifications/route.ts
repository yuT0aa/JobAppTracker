import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { notificationInputSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  return NextResponse.json(await prisma.notification.findMany({ where: { userId: auth.userId }, orderBy: { createdAt: "desc" }, take: 50 }));
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = notificationInputSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  return NextResponse.json(await prisma.notification.create({ data: { ...parsed.data, userId: auth.userId } }), { status: 201 });
}
