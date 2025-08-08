import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  if (!process.env.SEED_KEY || key !== process.env.SEED_KEY) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Idempotent upserts so you can run it twice safely
  const [mod, student] = await Promise.all([
    prisma.user.upsert({
      where: { email: "moderator@example.com" },
      update: {},
      create: {
        email: "moderator@example.com",
        name: "Moderator",
        role: "MODERATOR",
        passwordHash: await bcrypt.hash("Mod12345!", 10),
      },
    }),
    prisma.user.upsert({
      where: { email: "student@example.com" },
      update: {},
      create: {
        email: "student@example.com",
        name: "Student",
        role: "STUDENT",
        passwordHash: await bcrypt.hash("Stu12345!", 10),
      },
    }),
  ]);

  // A couple of example tasks
  await prisma.task.createMany({
    data: [
      {
        title: "IELTS Speaking: Part 2 – Describe a place",
        description: "Record a 2-minute response. Focus on fluency and coherence.",
        points: 20,
        estMinutes: 15,
        difficulty: "B1",
        submissionType: "TEXT",
        creatorId: mod.id,
      },
      {
        title: "Pronunciation Drill: /θ/ vs /s/",
        description: "Submit a link to your recording or a short reflection.",
        points: 15,
        estMinutes: 10,
        difficulty: "B1",
        submissionType: "TEXT",
        creatorId: mod.id,
      },
    ],
    skipDuplicates: true,
  });

  // One example gift
  await prisma.gift.upsert({
    where: { id: "starter-gift" },
    update: {},
    create: {
      id: "starter-gift",
      title: "Badge: Consistency Starter",
      description: "A digital badge for your profile.",
      costPoints: 30,
      stock: 9999,
      autoFulfill: true,
    },
  });

  return NextResponse.json({ ok: true, mod: mod.email, student: student.email });
}
