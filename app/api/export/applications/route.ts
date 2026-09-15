import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const applications = await prisma.application.findMany({
    where: { userId: auth.userId },
    include: { company: true },
    orderBy: { createdAt: "desc" }
  });
  const csv = toCsv(
    ["Company", "Role", "Status", "Location", "Applied date", "URL", "Notes", "Created"],
    applications.map((application) => [
      application.company.name,
      application.role,
      application.status,
      application.location,
      application.appliedAt?.toISOString(),
      application.url,
      application.notes,
      application.createdAt.toISOString()
    ])
  );
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="careertrack-applications.csv"',
      "Cache-Control": "private, no-store"
    }
  });
}
