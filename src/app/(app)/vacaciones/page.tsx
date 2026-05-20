import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { VacaionesWrapper } from "./vacaciones-wrapper";
import type { VacationStats } from "@/types/vacation";

const PAGE_SIZE = 10;
const DAYS_PER_YEAR = 15;

export default async function VacacionesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hireDate: true },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const whereClause = { userId: session.user.id };

  const [vacacionesData, total, approvedAggregate] = await Promise.all([
    prisma.vacation.findMany({
      where: whereClause,
      take: PAGE_SIZE,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        requestedDays: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vacation.count({ where: whereClause }),
    prisma.vacation.aggregate({
      where: { userId: session.user.id, status: "APROBADA" },
      _sum: { requestedDays: true },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const today = new Date();
  const hireDate = new Date(currentUser.hireDate);
  const diffDays = (today.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24);
  const yearsWorked = Math.floor(diffDays / 365);
  const totalAccrued = yearsWorked * DAYS_PER_YEAR;
  const usedDays = approvedAggregate._sum.requestedDays ?? 0;

  const stats: VacationStats = {
    totalAccrued,
    usedDays,
    availableDays: Math.max(0, totalAccrued - usedDays),
    yearsWorked,
  };

  return (
    <VacaionesWrapper
      initialVacaciones={vacacionesData as any}
      initialTotal={total}
      initialPages={pages}
      stats={stats}
    />
  );
}
