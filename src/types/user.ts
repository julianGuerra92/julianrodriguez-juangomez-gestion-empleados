import { Role } from "@/generated/prisma/client";

export interface UserListItem {
  id: string;
  email: string;
  name: string;
  role: Role;
  hireDate: Date;
  createdAt: Date;
}

export interface GetUsersResponse {
  users: UserListItem[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface ChangeRoleResponse {
  success: boolean;
  error?: string;
  user?: UserListItem;
}
