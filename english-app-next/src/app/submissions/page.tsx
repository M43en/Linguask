import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) return <main className="card">Sign in first.</main>;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const assigns = await prisma.assignment.findMany({
    where: { assigneeId: user!.id },
    include: { task: true },
    orderBy: { createdAt: "desc" }
  });
  return (
    <main style={{maxWidth:900, margin:"24px auto", padding:"0 16px"}}>
      <h2>My Assignments</h2>
      {assigns.map(a => (
        <div key={a.id} className="card">
          <b>{a.task.title}</b> — Status: {a.status}
          <form action={`/api/submissions`} method="post">
            <input type="hidden" name="assignmentId" value={a.id} />
            <textarea className="input" name="payload" placeholder="Paste your text/link here..." />
            <button className="btn" type="submit">Submit</button>
          </form>
        </div>
      ))}
    </main>
  );
}
