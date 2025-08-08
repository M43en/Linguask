import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function GiftsContent() {
  const session = await auth();
  if (!session?.user?.email) return <div className="card">Sign in first.</div>;
  const gifts = await prisma.gift.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h2>Gifts</h2>
      <div className="grid">
        {gifts.map(g => (
          <div key={g.id} className="card">
            <b>{g.title}</b>
            <div>Cost: {g.costPoints} points • Stock: {g.stock}</div>
            <p style={{whiteSpace:"pre-wrap"}}>{g.description}</p>
            <form action={`/api/redemptions`} method="post">
              <input type="hidden" name="giftId" value={g.id} />
              <button className="btn" type="submit" disabled={g.stock<=0}>Redeem</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
