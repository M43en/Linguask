import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function TasksContent() {
  const session = await auth();
  if (!session?.user?.email) return <div className="card">Sign in first.</div>;
  const tasks = await prisma.task.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 20 });
  return (
    <div>
      <h2>Tasks</h2>
      <div className="grid">
        {tasks.map(t => (
          <div key={t.id} className="card">
            <b>{t.title}</b>
            <div>Points: {t.points} • {t.estMinutes} minutes • {t.difficulty}</div>
            <p style={{whiteSpace:"pre-wrap"}}>{t.description}</p>
            <form action={`/api/assignments`} method="post">
              <input type="hidden" name="taskId" value={t.id} />
              <input type="hidden" name="source" value="SELF" />
              <button className="btn" type="submit">Choose</button>
            </form>
          </div>
        ))}
      </div>
      <div className="card">
        <b>Submissions</b> — <Link href="/submissions">View & Submit</Link>
      </div>
    </div>
  );
}
