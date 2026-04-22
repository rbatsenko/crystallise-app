import { createClient } from "@crystallise/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const email =
    typeof claims?.claims?.email === "string" ? claims.claims.email : undefined;

  return (
    <div className="min-h-screen flex">
      <Sidebar userEmail={email} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
