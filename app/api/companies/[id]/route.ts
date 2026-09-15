import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { companyInputSchema } from "@/lib/validation";

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = companyInputSchema.partial().safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const existing = await prisma.company.findFirst({ where: { id: params.id, userId: auth.userId } });
  if (!existing) return NextResponse.json({ error: "Company not found." }, { status: 404 });
  const company = await prisma.company.update({
    where: { id: existing.id },
    data: parsed.data
  });
  return NextResponse.json(company);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const company = await prisma.company.findFirst({
    where: { id: params.id, userId: auth.userId },
    include: { _count: { select: { applications: true } } }
  });
  if (!company) return NextResponse.json({ error: "Company not found." }, { status: 404 });
  if (company._count.applications > 0) {
    return NextResponse.json({ error: "Remove this company's applications before deleting it." }, { status: 409 });
  }
  const result = await prisma.company.deleteMany({ where: { id: params.id, userId: auth.userId } });
  if (result.count === 0) return NextResponse.json({ error: "Company not found." }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
