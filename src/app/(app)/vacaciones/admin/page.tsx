import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLES } from "@/constants/roles";
import { getPendingVacaciones } from "@/actions/vacaciones";
import { SolicitudesWrapper } from "./solicitudes-wrapper";

export default async function VacacionesAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as { role?: string };

  if (user.role !== ROLES.ADMIN) {
    redirect("/vacaciones");
  }

  let initialData;

  try {
    initialData = await getPendingVacaciones(1);
  } catch {
    redirect("/dashboard");
  }

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Solicitudes de Vacaciones</h1>
        <p className="mt-2 text-base-content/60">
          Revisa y gestiona las solicitudes de vacaciones pendientes de los empleados
        </p>
      </div>

      <SolicitudesWrapper
        initialSolicitudes={initialData.solicitudes}
        initialTotal={initialData.total}
        initialPages={initialData.pages}
      />
    </main>
  );
}
