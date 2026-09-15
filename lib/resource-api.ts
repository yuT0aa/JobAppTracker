import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function ownedApplication(userId: string, applicationId: string) {
  return prisma.application.findFirst({ where: { id: applicationId, userId }, select: { id: true } });
}

export function notFound(message: string) {
  return NextResponse.json({ error: message }, { status: 404 });
}
