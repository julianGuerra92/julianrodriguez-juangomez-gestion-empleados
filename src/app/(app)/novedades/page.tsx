import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/constants/roles";
import { NovedadesWrapper } from "./novedades-wrapper";
import { redirect } from "next/navigation";

const PAGE_SIZE = 10;

export default async function NovedadesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const novedadesResponse = await prisma.novedad.findMany({
    where:
      currentUser.role === ROLES.ADMIN
        ? {}
        : { userId: session.user.id },
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

  const total = await prisma.novedad.count({
    where:
      currentUser.role === ROLES.ADMIN
        ? {}
        : { userId: session.user.id },
  });

  const pages = Math.ceil(total / PAGE_SIZE);

  let employees: { id: string; name: string; email: string }[] = [];

  if (currentUser.role === ROLES.ADMIN) {
    employees = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });
  }

  return (
    <NovedadesWrapper
      currentUserId={session.user.id}
      userRole={currentUser.role}
      initialNovedades={novedadesResponse as any}
      initialTotal={total}
      initialPages={pages}
      initialCurrentPage={1}
      employees={employees}
    />
  );
}
