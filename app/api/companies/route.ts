import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { companyInputSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const companies = await prisma.company.findMany({
    where: { userId: auth.userId },
    include: { _count: { select: { applications: true } } },
    orderBy: { name: "asc" }
  });
  return NextResponse.json(companies);
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = companyInputSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const input = parsed.data;
  const company = await prisma.company.create({
    data: {
      userId: auth.userId,
      name: input.name,
      website: input.website || null,
      location: input.location || null,
      notes: input.notes || null
    }
  });
  return NextResponse.json(company, { status: 201 });
}
