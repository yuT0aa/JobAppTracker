import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, readJson } from "@/lib/api";
import { z } from "zod";

type Params = { params: { id: string } };
const roleSchema = z.object({ role: z.enum(["USER", "ADMIN"]) });

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const parsed = roleSchema.safeParse(await readJson(request));
  if (!parsed.success) return NextResponse.json({ error: "role must be USER or ADMIN." }, { status: 400 });
  if (params.id === auth.userId && parsed.data.role !== "ADMIN") {
    return NextResponse.json({ error: "You cannot remove your own administrator role." }, { status: 409 });
  }
  const user = await prisma.user.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json(await prisma.user.update({ where: { id: params.id }, data: { role: parsed.data.role }, select: { id: true, role: true } }));
}
