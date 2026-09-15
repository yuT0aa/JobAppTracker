import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessAdmin } from "@/lib/authorization";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { response: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }

  return { userId: session.user.id };
}

export async function requireAdmin() {
  const auth = await requireUser();
  if (auth.response) return auth;
  const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } });
  if (!canAccessAdmin(user?.role)) {
    return { response: NextResponse.json({ error: "Administrator access required." }, { status: 403 }) };
  }
  return { userId: auth.userId };
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export function validationError(error: unknown) {
  return NextResponse.json(
    { error: "Validation failed.", details: error instanceof Error ? error.message : "Invalid input." },
    { status: 400 }
  );
}
