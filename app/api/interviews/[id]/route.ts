import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, validationError } from "@/lib/api";
import { interviewInputSchema } from "@/lib/validation";

type Params = { params: { id: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const parsed = interviewInputSchema.partial().safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const existing = await prisma.interview.findFirst({ where: { id: params.id, userId: auth.userId } });
  if (!existing) return NextResponse.json({ error: "Interview not found." }, { status: 404 });
  const data = parsed.data;
  if (data.applicationId) {
    const application = await prisma.application.findFirst({ where: { id: data.applicationId, userId: auth.userId } });
    if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  return NextResponse.json(await prisma.interview.update({
    where: { id: params.id },
    data: { ...data, scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined, location: data.location === "" ? null : data.location, notes: data.notes === "" ? null : data.notes }
  }));
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const result = await prisma.interview.deleteMany({ where: { id: params.id, userId: auth.userId } });
  return result.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Interview not found." }, { status: 404 });
}
