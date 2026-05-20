"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/constants/roles";
import type {
  VacationListItem,
  GetVacationsResponse,
  VacationStats,
  CreateVacationPayload,
  VacationResponse,
  PendingVacationItem,
  GetPendingVacationsResponse,
  UpdateVacationStatusPayload,
} from "@/types/vacation";

const PAGE_SIZE = 10;
const DAYS_PER_YEAR = 15;

export async function getVacaciones(page: number): Promise<GetVacationsResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const validPage = Math.max(1, page);

  const whereClause = { userId: session.user.id };

  const total = await prisma.vacation.count({ where: whereClause });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (validPage > pages && total > 0) {
    throw new Error("Página no válida");
  }

  const skip = (validPage - 1) * PAGE_SIZE;

  const vacaciones = await prisma.vacation.findMany({
    where: whereClause,
    skip,
    take: PAGE_SIZE,
    select: {
      id: true,
      startDate: true,
      endDate: true,
      requestedDays: true,
      status: true,
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
    vacaciones: vacaciones as VacationListItem[],
    total,
    pages,
    currentPage: validPage,
  };
}

export async function getVacationStats(): Promise<VacationStats> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hireDate: true },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const today = new Date();
  const hireDate = new Date(user.hireDate);
  const diffMs = today.getTime() - hireDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const yearsWorked = Math.floor(diffDays / 365);
  const totalAccrued = yearsWorked * DAYS_PER_YEAR;

  const approvedVacations = await prisma.vacation.aggregate({
    where: {
      userId: session.user.id,
      status: "APROBADA",
    },
    _sum: {
      requestedDays: true,
    },
  });

  const usedDays = approvedVacations._sum.requestedDays ?? 0;
  const availableDays = Math.max(0, totalAccrued - usedDays);

  return {
    totalAccrued,
    usedDays,
    availableDays,
    yearsWorked,
  };
}

function calcBusinessDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endNorm = new Date(end);
  endNorm.setHours(0, 0, 0, 0);
  while (cur <= endNorm) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export async function createVacacion(
  payload: CreateVacationPayload,
): Promise<VacationResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  if (!payload.startDate || !payload.endDate) {
    return { success: false, error: "Las fechas de inicio y fin son requeridas" };
  }

  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { success: false, error: "Fechas inválidas" };
  }

  if (endDate < startDate) {
    return { success: false, error: "La fecha de fin no puede ser anterior a la fecha de inicio" };
  }

  const requestedDays = calcBusinessDays(startDate, endDate);

  if (requestedDays < 1) {
    return { success: false, error: "El rango seleccionado no incluye días hábiles" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hireDate: true },
  });

  if (!user) {
    return { success: false, error: "Usuario no encontrado" };
  }

  const today = new Date();
  const hireDate = new Date(user.hireDate);
  const diffDays = (today.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24);
  const yearsWorked = Math.floor(diffDays / 365);
  const totalAccrued = yearsWorked * DAYS_PER_YEAR;

  const approved = await prisma.vacation.aggregate({
    where: { userId: session.user.id, status: "APROBADA" },
    _sum: { requestedDays: true },
  });

  const usedDays = approved._sum.requestedDays ?? 0;
  const availableDays = Math.max(0, totalAccrued - usedDays);

  if (requestedDays > availableDays) {
    return {
      success: false,
      error: `No tienes suficientes días disponibles. Solicitados: ${requestedDays}, Disponibles: ${availableDays}`,
    };
  }

  try {
    const vacation = await prisma.vacation.create({
      data: {
        startDate,
        endDate,
        requestedDays,
        status: "PENDIENTE",
        userId: session.user.id,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        requestedDays: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });

    return { success: true, vacation: vacation as VacationListItem };
  } catch {
    return { success: false, error: "Error al crear la solicitud de vacaciones" };
  }
}

export async function getPendingVacaciones(
  page: number,
): Promise<GetPendingVacationsResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const sessionUser = session.user as { role?: string };
  if (sessionUser.role !== ROLES.ADMIN) {
    throw new Error("No autorizado");
  }

  const validPage = Math.max(1, page);
  const whereClause = { status: "PENDIENTE" as const };

  const total = await prisma.vacation.count({ where: whereClause });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const skip = (validPage - 1) * PAGE_SIZE;

  const vacaciones = await prisma.vacation.findMany({
    where: whereClause,
    skip,
    take: PAGE_SIZE,
    select: {
      id: true,
      startDate: true,
      endDate: true,
      requestedDays: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          hireDate: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const userIds = [...new Set(vacaciones.map((v) => v.user.id))];

  const approvedByUser = await prisma.vacation.groupBy({
    by: ["userId"],
    where: { userId: { in: userIds }, status: "APROBADA" },
    _sum: { requestedDays: true },
  });

  const approvedMap = new Map(
    approvedByUser.map((a) => [a.userId, a._sum.requestedDays ?? 0]),
  );

  const today = new Date();

  const solicitudes: PendingVacationItem[] = vacaciones.map((v) => {
    const hireDate = new Date(v.user.hireDate);
    const diffDays =
      (today.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24);
    const yearsWorked = Math.floor(diffDays / 365);
    const totalAccrued = yearsWorked * DAYS_PER_YEAR;
    const usedDays = approvedMap.get(v.user.id) ?? 0;
    const userAvailableDays = Math.max(0, totalAccrued - usedDays);

    return {
      id: v.id,
      startDate: v.startDate,
      endDate: v.endDate,
      requestedDays: v.requestedDays,
      status: v.status,
      createdAt: v.createdAt,
      user: { id: v.user.id, name: v.user.name },
      userAvailableDays,
    };
  });

  return { solicitudes, total, pages, currentPage: validPage };
}

export async function updateVacacionStatus(
  payload: UpdateVacationStatusPayload,
): Promise<VacationResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const sessionUser = session.user as { role?: string };
  if (sessionUser.role !== ROLES.ADMIN) {
    return { success: false, error: "No autorizado" };
  }

  const { id, status } = payload;

  const existing = await prisma.vacation.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existing) {
    return { success: false, error: "Solicitud no encontrada" };
  }

  if (existing.status !== "PENDIENTE") {
    return {
      success: false,
      error: "Solo se pueden actualizar solicitudes en estado PENDIENTE",
    };
  }

  try {
    const updated = await prisma.vacation.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        requestedDays: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });

    return { success: true, vacation: updated as VacationListItem };
  } catch {
    return { success: false, error: "Error al actualizar el estado de la solicitud" };
  }
}
