import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.formData();
  const giftId = data.get("giftId") as string | null;
  if (!giftId) return NextResponse.json({ error: "Missing giftId" }, { status: 400 });
  const me = await prisma.user.findUnique({ where: { email: session.user.email } });
  const gift = await prisma.gift.findUnique({ where: { id: giftId } });
  if (!me || !gift) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sum = await prisma.pointTransaction.aggregate({ where: { userId: me.id }, _sum: { amount: true } });
  const balance = sum._sum.amount ?? 0;
  if (balance < gift.costPoints) {
    return NextResponse.json({ error: "Insufficient points" }, { status: 400 });
  }

  const redemption = await prisma.$transaction(async (tx) => {
    const r = await tx.redemption.create({
      data: {
        giftId: gift.id,
        userId: me.id,
        costPoints: gift.costPoints,
        status: gift.autoFulfill ? "FULFILLED" : "PENDING"
      }
    });
    await tx.pointTransaction.create({
      data: {
        userId: me.id,
        type: "REDEEM",
        amount: -gift.costPoints,
        reason: `Redeem: ${gift.title}`,
        refTable: "Redemption",
        refId: r.id
      }
    });
    if (gift.stock <= 0) throw new Error("Out of stock");
    await tx.gift.update({ where: { id: gift.id }, data: { stock: { decrement: 1 } } });
    return r;
  });

  return NextResponse.redirect(new URL("/gifts", req.url));
}
