import Nav from "@/components/Nav";
import TasksContent from "./server";
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main style={{maxWidth:1000, margin:"24px auto", padding:"0 16px"}}>
      <Nav />
      <TasksContent />
    </main>
  );
}
