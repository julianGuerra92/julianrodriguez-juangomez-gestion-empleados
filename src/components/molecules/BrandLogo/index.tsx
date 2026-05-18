import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

interface BrandLogoProps {
  href?: string;
}

export function BrandLogo({ href = "/" }: BrandLogoProps) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <BriefcaseBusiness size={24} className="text-primary" />
      <span className="font-bold text-lg leading-tight">
        Gestión de
        <br />
        Empleados
      </span>
    </Link>
  );
}
