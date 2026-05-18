import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ROLES } from "@/constants/roles";
import { getUsers } from "@/actions/empleados";
import { UserTableWrapper } from "./user-table-wrapper";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function EmpleadosPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as { role?: string };

  if (user.role !== ROLES.ADMIN) {
    redirect("/novedades");
  }

  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  let initialData;
  let error: string | null = null;

  try {
    initialData = await getUsers(page);
  } catch (err) {
    error = err instanceof Error ? err.message : "Error al cargar usuarios";
    console.log("Error fetching users:", error);
    redirect("/dashboard")
  }

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Administración de Empleados</h1>
        <p className="mt-2 text-base-content/60">
          Gestiona los roles y permisos de tus empleados
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {initialData && (
        <UserTableWrapper
          initialUsers={initialData.users}
          initialPage={initialData.currentPage}
          initialTotalPages={initialData.pages}
          initialTotal={initialData.total}
        />
      )}
    </main>
  );
}
