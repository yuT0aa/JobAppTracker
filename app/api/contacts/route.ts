import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { contactInputSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  return NextResponse.json(await prisma.contact.findMany({ where: { userId: auth.userId }, include: { company: true }, orderBy: { name: "asc" } }));
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = contactInputSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const data = parsed.data;
  if (data.companyId && !(await prisma.company.findFirst({ where: { id: data.companyId, userId: auth.userId } }))) return NextResponse.json({ error: "Company not found." }, { status: 404 });
  return NextResponse.json(await prisma.contact.create({ data: { ...data, userId: auth.userId, companyId: data.companyId || null, email: data.email || null, role: data.role || null, linkedin: data.linkedin || null, notes: data.notes || null }, include: { company: true } }), { status: 201 });
}
