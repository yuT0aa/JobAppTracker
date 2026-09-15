import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { documentInputSchema } from "@/lib/validation";

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = documentInputSchema.partial().safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const existing = await prisma.document.findFirst({ where: { id: params.id, userId: auth.userId } });
  if (!existing) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const input = parsed.data;
  return NextResponse.json(await prisma.document.update({
    where: { id: params.id },
    data: { ...input, applicationId: input.applicationId || undefined, mimeType: input.mimeType || null }
  }));
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const result = await prisma.document.deleteMany({ where: { id: params.id, userId: auth.userId } });
  return result.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Document not found." }, { status: 404 });
}
