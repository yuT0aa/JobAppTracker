import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { readJson, requireUser, validationError } from "@/lib/api";
import { applicationInputSchema, applicationQuerySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const query = applicationQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!query.success) return validationError(query.error);

  const { page, pageSize, sort, direction } = query.data;
  const orderBy = sort === "company" ? { company: { name: direction } } : sort === "role" ? { role: direction } : sort === "status" ? { status: direction } : { [sort]: direction };
  const where: Prisma.ApplicationWhereInput = {
      userId: auth.userId,
      status: query.data.status,
      companyId: query.data.companyId,
      ...(query.data.search
        ? { OR: [{ role: { contains: query.data.search, mode: "insensitive" } }, { company: { name: { contains: query.data.search, mode: "insensitive" } } }] }
        : {})
  };
  const [applications, total] = await Promise.all([
    prisma.application.findMany({ where, include: { company: true }, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.application.count({ where })
  ]);
  return NextResponse.json({ data: applications, pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) } });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = applicationInputSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationError(parsed.error);
  const input = parsed.data;
  const company = await prisma.company.upsert({
    where: { userId_name: { userId: auth.userId, name: input.company } },
    update: {},
    create: { userId: auth.userId, name: input.company }
  });
  const application = await prisma.application.create({
    data: {
      userId: auth.userId,
      companyId: company.id,
      role: input.role,
      location: input.location || null,
      url: input.url || null,
      notes: input.notes || null,
      status: input.status,
      appliedAt: input.appliedAt ? new Date(input.appliedAt) : null
    },
    include: { company: true }
  });
  return NextResponse.json(application, { status: 201 });
}
