import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { documentInputSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  return NextResponse.json(await prisma.document.findMany({
    where: { userId: auth.userId },
    include: { application: { include: { company: true } } },
    orderBy: { createdAt: "desc" }
  }));
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = documentInputSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const input = parsed.data;
  if (input.applicationId && !await prisma.application.findFirst({ where: { id: input.applicationId, userId: auth.userId } })) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  return NextResponse.json(await prisma.document.create({
    data: { ...input, userId: auth.userId, applicationId: input.applicationId || null, mimeType: input.mimeType || null },
    include: { application: { include: { company: true } } }
  }), { status: 201 });
}
