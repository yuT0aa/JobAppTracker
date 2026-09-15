import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { contactInputSchema } from "@/lib/validation";

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = contactInputSchema.partial().safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const existing = await prisma.contact.findFirst({ where: { id: params.id, userId: auth.userId } });
  if (!existing) return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  const data = parsed.data;
  return NextResponse.json(await prisma.contact.update({ where: { id: params.id }, data: { ...data, companyId: data.companyId || undefined, email: data.email || null, role: data.role || null, linkedin: data.linkedin || null, notes: data.notes || null } }));
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const result = await prisma.contact.deleteMany({ where: { id: params.id, userId: auth.userId } });
  return result.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Contact not found." }, { status: 404 });
}
