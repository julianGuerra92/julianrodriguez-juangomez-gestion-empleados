import { VacationStatus } from "@/generated/prisma/client";

export interface VacationListItem {
  id: string;
  startDate: Date;
  endDate: Date;
  requestedDays: number;
  status: VacationStatus;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
}

export interface GetVacationsResponse {
  vacaciones: VacationListItem[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface VacationStats {
  totalAccrued: number;
  usedDays: number;
  availableDays: number;
  yearsWorked: number;
}

export interface VacationResponse {
  success: boolean;
  error?: string;
  vacation?: VacationListItem;
}

export interface CreateVacationPayload {
  startDate: string;
  endDate: string;
}

export interface PendingVacationItem extends VacationListItem {
  userAvailableDays: number;
}

export interface GetPendingVacationsResponse {
  solicitudes: PendingVacationItem[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface UpdateVacationStatusPayload {
  id: string;
  status: "APROBADA" | "RECHAZADA";
}
