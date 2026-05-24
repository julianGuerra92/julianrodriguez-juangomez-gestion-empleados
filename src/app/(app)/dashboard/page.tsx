import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLES } from "@/constants/roles";
import { DashboardWrapper } from "./dashboard-wrapper";
import { getDashboardStats, getHorasExtrasByMonth, getIncapacidadDistribution, getDashboardEmployees } from "@/actions/dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== ROLES.ADMIN) {
    redirect("/novedades");
  }

  const [stats, horasExtras, incapacidades, employees] = await Promise.all([
    getDashboardStats(),
    getHorasExtrasByMonth(),
    getIncapacidadDistribution(),
    getDashboardEmployees(),
  ]);

  return (
    <main className="p-8">
      <div className="mb-8 font-jakarta">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Supervisa el rendimiento y estadísticas de la empresa.
        </p>
      </div>

      <DashboardWrapper 
        initialStats={stats}
        initialHorasExtras={horasExtras}
        initialIncapacidades={incapacidades}
        employees={employees}
      />
    </main>
  );
}
