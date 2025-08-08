import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.formData();
  const taskId = data.get("taskId") as string | null;
  const source = (data.get("source") as string | null) ?? "SELF";
  if (!taskId) return NextResponse.json({ error: "Missing taskId" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!user || !task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const a = await prisma.assignment.create({
    data: {
      taskId: task.id,
      assigneeId: user.id,
      source: source as any,
      status: "IN_PROGRESS"
    }
  });
  return NextResponse.redirect(new URL("/submissions", req.url));
}
