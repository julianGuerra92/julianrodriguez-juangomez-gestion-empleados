import { NovedadType } from "@/generated/prisma/client";

export interface NovedadListItem {
  id: string;
  type: NovedadType;
  startDate: Date;
  endDate: Date | null;
  hours: number | null;
  reason: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
}

export interface CreateNovedadPayload {
  type: NovedadType;
  startDate: Date;
  endDate?: Date | null;
  hours?: number | null;
  reason: string;
  userId?: string;
}

export interface UpdateNovedadPayload {
  id: string;
  type: NovedadType;
  startDate: Date;
  endDate?: Date | null;
  hours?: number | null;
  reason: string;
}

export interface GetNovedadesResponse {
  novedades: NovedadListItem[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface NovedadResponse {
  success: boolean;
  error?: string;
  novedad?: NovedadListItem;
}
