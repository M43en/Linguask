import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardContent() {
  const session = await auth();
  if (!session?.user?.email) {
    return <div className="card">Not signed in.</div>;
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const streak = await prisma.streak.findUnique({ where: { userId: user!.id } });
  const points = await prisma.pointTransaction.aggregate({
    where: { userId: user!.id },
    _sum: { amount: true }
  });
  const balance = points._sum.amount ?? 0;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="card"><b>Streak</b><div style={{fontSize:24}}>{streak?.currentCount ?? 0} days 🔥</div></div>
        <div className="card"><b>Points</b><div style={{fontSize:24}}>{balance}</div></div>
      </div>
      <div className="card">
        <b>Today&apos;s Tasks</b>
        <p>Go to the Tasks page to pick or submit tasks.</p>
      </div>
    </div>
  );
}
