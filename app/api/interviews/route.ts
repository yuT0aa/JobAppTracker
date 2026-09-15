import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { interviewInputSchema } from "@/lib/validation";
import { ownedApplication } from "@/lib/resource-api";

export async function GET(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  const interviews = await prisma.interview.findMany({
    where: { userId: auth.userId, ...(from || to ? { scheduledAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } } : {}) },
    include: { application: { include: { company: true } } },
    orderBy: { scheduledAt: "asc" }
  });
  return NextResponse.json(interviews);
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = interviewInputSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  if (!(await ownedApplication(auth.userId, parsed.data.applicationId))) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  const interview = await prisma.interview.create({ data: { ...parsed.data, userId: auth.userId, scheduledAt: new Date(parsed.data.scheduledAt), location: parsed.data.location || null, notes: parsed.data.notes || null } });
  return NextResponse.json(interview, { status: 201 });
}
