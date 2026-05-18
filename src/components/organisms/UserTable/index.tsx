import { UserListItem } from "@/types/user";
import { Role } from "@/generated/prisma/client";
import { ROLES } from "@/constants/roles";
import { RoleSelector } from "@/components/molecules/RoleSelector";
import { Button } from "@/components/atoms/Button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserTableProps {
  users: UserListItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRoleChange: (userId: string, newRole: Role) => void;
  loading?: boolean;
  total: number;
}

export function UserTable({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onRoleChange,
  loading = false,
  total,
}: UserTableProps) {
  const getRoleLabel = (role: Role) =>
    role === ROLES.ADMIN ? "Administrador" : "Usuario";

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Fecha de Ingreso</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {format(new Date(user.hireDate), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </td>
                <td>
                  <span className="badge badge-lg">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <RoleSelector
                    userId={user.id}
                    currentRole={user.role}
                    onConfirm={(newRole) => onRoleChange(user.id, newRole)}
                    loading={loading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-sm text-base-content/60">
          Página {currentPage} de {totalPages} | Total: {total} empleados
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={loading || currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={loading || currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
