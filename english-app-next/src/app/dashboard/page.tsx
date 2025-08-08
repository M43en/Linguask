import Nav from "@/components/Nav";
import DashboardContent from "./server";
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <main style={{maxWidth:960, margin:"24px auto", padding:"0 16px"}}>
      <Nav />
      <DashboardContent />
    </main>
  );
}
