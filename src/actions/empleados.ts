"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import { ROLES, ROLES_ARRAY } from "@/constants/roles";
import type {
  UserListItem,
  GetUsersResponse,
  ChangeRoleResponse,
} from "@/types/user";

const PAGE_SIZE = 10;

export async function getUsers(page: number): Promise<GetUsersResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== ROLES.ADMIN) {
    throw new Error("No autorizado");
  }

  const validPage = Math.max(1, page);

  const total = await prisma.user.count();
  const pages = Math.ceil(total / PAGE_SIZE);

  if (validPage > pages && pages > 0) {
    throw new Error("Página no válida");
  }

  const skip = (validPage - 1) * PAGE_SIZE;

  const users = await prisma.user.findMany({
    skip,
    take: PAGE_SIZE,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      hireDate: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    users: users as UserListItem[],
    total,
    pages,
    currentPage: validPage,
  };
}

export async function changeUserRole(
  userId: string,
  newRole: Role,
): Promise<ChangeRoleResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== ROLES.ADMIN) {
    return { success: false, error: "No autorizado" };
  }

  if (session.user.id === userId) {
    return {
      success: false,
      error: "No puedes cambiar tu propio rol",
    };
  }

  if (!ROLES_ARRAY.includes(newRole)) {
    return { success: false, error: "Rol no válido" };
  }

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    return { success: false, error: "Usuario no encontrado" };
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      hireDate: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    user: updatedUser as UserListItem,
  };
}
