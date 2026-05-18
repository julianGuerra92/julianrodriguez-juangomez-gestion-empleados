"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { changeUserRole } from "@/actions/empleados";
import { UserListItem } from "@/types/user";
import { UserTable } from "@/components/organisms/UserTable";
import { Alert } from "@/components/atoms/Alert";

interface UserTableWrapperProps {
  initialUsers: UserListItem[];
  initialPage: number;
  initialTotalPages: number;
  initialTotal: number;
}

export function UserTableWrapper({
  initialUsers,
  initialPage,
  initialTotalPages,
  initialTotal,
}: UserTableWrapperProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    setError(null);
    router.push(`?page=${newPage}`);
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await changeUserRole(userId, newRole);

      if (!result.success) {
        setError(result.error || "Error al cambiar el rol");
        setLoading(false);
        return;
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );

      setSuccess("Rol actualizado correctamente");
      setTimeout(() => setSuccess(null), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="error" role="alert">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" role="status">
          {success}
        </Alert>
      )}

      <UserTable
        users={users}
        currentPage={page}
        totalPages={initialTotalPages}
        onPageChange={handlePageChange}
        onRoleChange={handleRoleChange}
        loading={loading}
        total={initialTotal}
      />
    </div>
  );
}
