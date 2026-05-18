"use client";

import {
  LayoutDashboard,
  FileText,
  Umbrella,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { ROLES } from "@/constants/roles";
import { NavLink } from "@/components/molecules/NavLink";
import { BrandLogo } from "@/components/molecules/BrandLogo";
import { Button } from "@/components/atoms/Button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const userLinks: NavItem[] = [
  { href: "/novedades", label: "Mis Novedades", icon: <FileText size={18} /> },
  {
    href: "/vacaciones",
    label: "Mis Vacaciones",
    icon: <Umbrella size={18} />,
  },
];

const adminLinks: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { href: "/empleados", label: "Empleados", icon: <Users size={18} /> },
  { href: "/novedades", label: "Novedades", icon: <FileText size={18} /> },
  { href: "/vacaciones", label: "Vacaciones", icon: <Umbrella size={18} /> },
];

interface SidebarProps {
  role: "ADMIN" | "USER";
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const [open, setOpen] = useState(true);
  const links = role === ROLES.ADMIN ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-0 left-0 z-40 flex h-full w-64 flex-col bg-base-200",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:flex",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-base-300">
          <BrandLogo />
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map(({ href, label, icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>

        {/* Footer: user info + logout */}
        <div className="border-t border-base-300 p-4">
          <div className="mb-3 px-2">
            <p className="text-xs text-base-content/50 uppercase tracking-wide">
              {role === ROLES.ADMIN ? "Administrador" : "Empleado"}
            </p>
            <p className="text-sm font-medium truncate">{userName}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full justify-start gap-2 text-error"
          >
            <LogOut size={16} />
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
}
