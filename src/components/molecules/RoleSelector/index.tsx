"use client";

import { useState } from "react";
import { Role } from "@/generated/prisma/client";
import { ROLES } from "@/constants/roles";
import { Select } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";

interface RoleSelectorProps {
  userId: string;
  currentRole: Role;
  onConfirm: (newRole: Role) => void;
  loading?: boolean;
}

const roleOptions = [
  { label: "Usuario", value: ROLES.USER },
  { label: "Administrador", value: ROLES.ADMIN },
];

export function RoleSelector({
  userId,
  currentRole,
  onConfirm,
  loading = false,
}: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [showModal, setShowModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  const handleRoleChange = (newRole: string) => {
    if (newRole !== currentRole) {
      setSelectedRole(newRole);
      setPendingRole(newRole as Role);
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    if (pendingRole) {
      onConfirm(pendingRole);
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setSelectedRole(currentRole);
    setPendingRole(null);
    setShowModal(false);
  };

  return (
    <>
      <Select
        value={selectedRole}
        onChange={handleRoleChange}
        disabled={loading}
        options={roleOptions}
        className="w-fit"
      />

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmar cambio de rol</h3>
            <p className="py-4">
              ¿Estás seguro de cambiar el rol a{" "}
              <span className="font-semibold">
                {pendingRole === ROLES.ADMIN ? "Administrador" : "Usuario"}
              </span>
              ?
            </p>
            <div className="modal-action">
              <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={loading}
                isLoading={loading}
              >
                Confirmar
              </Button>
            </div>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={handleCancel}
          >
            <button>close</button>
          </form>
        </div>
      )}
    </>
  );
}
