import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/organisms/Sidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role as "ADMIN" | "USER";
  const userName = session.user.name ?? session.user.email ?? "Usuario";

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} userName={userName} />
      <div className="flex-1 lg:ml-0 overflow-auto">{children}</div>
    </div>
  );
}
