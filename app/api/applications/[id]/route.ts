import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { applicationPatchSchema } from "@/lib/validation";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const application = await prisma.application.findFirst({ where: { id: params.id, userId: auth.userId }, include: { company: true } });
  if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  return NextResponse.json(application);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = applicationPatchSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const existing = await prisma.application.findFirst({ where: { id: params.id, userId: auth.userId } });
  if (!existing) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  const input = parsed.data;
  const company = input.company
    ? await prisma.company.upsert({
        where: { userId_name: { userId: auth.userId, name: input.company } },
        update: {},
        create: { userId: auth.userId, name: input.company }
      })
    : undefined;
  const application = await prisma.application.update({
    where: { id: existing.id },
    data: {
      ...(company ? { companyId: company.id } : {}),
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.location !== undefined ? { location: input.location || null } : {}),
      ...(input.url !== undefined ? { url: input.url || null } : {}),
      ...(input.notes !== undefined ? { notes: input.notes || null } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.appliedAt !== undefined ? { appliedAt: input.appliedAt ? new Date(input.appliedAt) : null } : {})
    },
    include: { company: true }
  });
  return NextResponse.json(application);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const result = await prisma.application.deleteMany({ where: { id: params.id, userId: auth.userId } });
  if (result.count === 0) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
