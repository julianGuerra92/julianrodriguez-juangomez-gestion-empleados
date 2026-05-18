"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/constants/roles";
import { NovedadType } from "@/generated/prisma/client";
import type {
  NovedadListItem,
  GetNovedadesResponse,
  CreateNovedadPayload,
  UpdateNovedadPayload,
  NovedadResponse,
} from "@/types/novedad";

const PAGE_SIZE = 10;

export async function getNovedades(
  page: number,
  userId?: string,
  filterByType?: NovedadType,
): Promise<GetNovedadesResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    throw new Error("Usuario no encontrado");
  }

  const validPage = Math.max(1, page);

  const whereClause: any = {};
  
  if (currentUser.role === ROLES.USER) {
    whereClause.userId = session.user.id;
  } else if (userId && currentUser.role === ROLES.ADMIN) {
    whereClause.userId = userId;
  }

  if (filterByType) {
    whereClause.type = filterByType;
  }

  const total = await prisma.novedad.count({
    where: whereClause,
  });
  const pages = Math.ceil(total / PAGE_SIZE);

  if (validPage > pages && pages > 0) {
    throw new Error("Página no válida");
  }

  const skip = (validPage - 1) * PAGE_SIZE;

  const novedades = await prisma.novedad.findMany({
    where: whereClause,
    skip,
    take: PAGE_SIZE,
    select: {
      id: true,
      type: true,
      startDate: true,
      endDate: true,
      hours: true,
      reason: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    novedades: novedades as NovedadListItem[],
    total,
    pages,
    currentPage: validPage,
  };
}

export async function createNovedad(
  payload: CreateNovedadPayload,
): Promise<NovedadResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    return { success: false, error: "Usuario no encontrado" };
  }

  const targetUserId = payload.userId || session.user.id;

  if (currentUser.role === ROLES.USER && targetUserId !== session.user.id) {
    return {
      success: false,
      error: "No puedes crear novedades para otros usuarios",
    };
  }

  if (currentUser.role === ROLES.ADMIN && payload.userId) {
    const targetUserExists = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!targetUserExists) {
      return { success: false, error: "Usuario destino no encontrado" };
    }
  }

  if (!payload.reason || payload.reason.trim().length === 0) {
    return { success: false, error: "El motivo es requerido" };
  }

  if (!payload.startDate) {
    return { success: false, error: "La fecha de inicio es requerida" };
  }

  if (payload.type === "HORA_EXTRA") {
    if (!payload.hours || payload.hours <= 0) {
      return { success: false, error: "Las horas debe ser mayor a 0" };
    }
  } else if (payload.type === "INCAPACIDAD") {
    if (!payload.endDate) {
      return { success: false, error: "La fecha de fin es requerida" };
    }

    if (new Date(payload.endDate) < new Date(payload.startDate)) {
      return {
        success: false,
        error: "La fecha de fin no puede ser anterior a la fecha de inicio",
      };
    }
  }

  try {
    const novedad = await prisma.novedad.create({
      data: {
        type: payload.type,
        startDate: new Date(payload.startDate),
        endDate: payload.endDate ? new Date(payload.endDate) : null,
        hours: payload.hours || null,
        reason: payload.reason,
        userId: targetUserId,
      },
      select: {
        id: true,
        type: true,
        startDate: true,
        endDate: true,
        hours: true,
        reason: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      novedad: novedad as NovedadListItem,
    };
  } catch (error) {
    return { success: false, error: "Error al crear la novedad" };
  }
}

export async function updateNovedad(
  payload: UpdateNovedadPayload,
): Promise<NovedadResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    return { success: false, error: "Usuario no encontrado" };
  }

  const novedad = await prisma.novedad.findUnique({
    where: { id: payload.id },
    include: { user: true },
  });

  if (!novedad) {
    return { success: false, error: "Novedad no encontrada" };
  }

  if (
    currentUser.role === ROLES.USER &&
    novedad.userId !== session.user.id
  ) {
    return {
      success: false,
      error: "No puedes editar novedades de otros usuarios",
    };
  }

  if (!payload.reason || payload.reason.trim().length === 0) {
    return { success: false, error: "El motivo es requerido" };
  }

  if (!payload.startDate) {
    return { success: false, error: "La fecha de inicio es requerida" };
  }

  if (payload.type === "HORA_EXTRA") {
    if (!payload.hours || payload.hours <= 0) {
      return { success: false, error: "Las horas debe ser mayor a 0" };
    }
  } else if (payload.type === "INCAPACIDAD") {
    if (!payload.endDate) {
      return { success: false, error: "La fecha de fin es requerida" };
    }

    if (new Date(payload.endDate) < new Date(payload.startDate)) {
      return {
        success: false,
        error: "La fecha de fin no puede ser anterior a la fecha de inicio",
      };
    }
  }

  try {
    const updated = await prisma.novedad.update({
      where: { id: payload.id },
      data: {
        type: payload.type,
        startDate: new Date(payload.startDate),
        endDate: payload.endDate ? new Date(payload.endDate) : null,
        hours: payload.hours || null,
        reason: payload.reason,
      },
      select: {
        id: true,
        type: true,
        startDate: true,
        endDate: true,
        hours: true,
        reason: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      novedad: updated as NovedadListItem,
    };
  } catch (error) {
    return { success: false, error: "Error al actualizar la novedad" };
  }
}

export async function deleteNovedad(novedadId: string): Promise<NovedadResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    return { success: false, error: "Usuario no encontrado" };
  }

  const novedad = await prisma.novedad.findUnique({
    where: { id: novedadId },
  });

  if (!novedad) {
    return { success: false, error: "Novedad no encontrada" };
  }

  if (
    currentUser.role === ROLES.USER &&
    novedad.userId !== session.user.id
  ) {
    return {
      success: false,
      error: "No puedes eliminar novedades de otros usuarios",
    };
  }

  try {
    await prisma.novedad.delete({
      where: { id: novedadId },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar la novedad" };
  }
}
