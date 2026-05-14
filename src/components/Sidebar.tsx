"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
      LayoutDashboard,
      FileText,
      Umbrella,
      Users,
      LogOut,
      BriefcaseBusiness,
      Menu,
      X,
} from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"

interface NavItem {
      href: string
      label: string
      icon: React.ReactNode
}

const userLinks: NavItem[] = [
      { href: "/novedades", label: "Mis Novedades", icon: <FileText size={18} /> },
      { href: "/vacaciones", label: "Mis Vacaciones", icon: <Umbrella size={18} /> },
]

const adminLinks: NavItem[] = [
      { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { href: "/empleados", label: "Empleados", icon: <Users size={18} /> },
      { href: "/novedades", label: "Novedades", icon: <FileText size={18} /> },
      { href: "/vacaciones", label: "Vacaciones", icon: <Umbrella size={18} /> },
]

interface SidebarProps {
      role: "ADMIN" | "USER"
      userName: string
}

export function Sidebar({ role, userName }: SidebarProps) {
      const pathname = usePathname()
      const [open, setOpen] = useState(true)
      const links = role === "ADMIN" ? adminLinks : userLinks

      return (
            <>
                  {/* Mobile toggle */}
                  <button
                        className="btn btn-ghost fixed top-4 left-4 z-50 lg:hidden"
                        onClick={() => setOpen(!open)}
                        aria-label="Abrir menú"
                  >
                        {open ? <X size={20} /> : <Menu size={20} />}
                  </button>

                  {/* Overlay (mobile) */}
                  {open && (
                        <div
                              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                              onClick={() => setOpen(false)}
                        />
                  )}

                  {/* Sidebar panel */}
                  <aside
                        className={`fixed top-0 left-0 z-40 flex h-full w-64 flex-col bg-base-200 transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex`}
                  >
                        {/* Logo */}
                        <div className="flex items-center gap-3 px-6 py-5 border-b border-base-300">
                              <BriefcaseBusiness size={24} className="text-primary" />
                              <span className="font-bold text-lg leading-tight">
                                    Gestión de<br />Empleados
                              </span>
                        </div>

                        {/* Nav links */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                              {links.map(({ href, label, icon }) => {
                                    const active = pathname === href || pathname.startsWith(href + "/")
                                    return (
                                          <Link
                                                key={href}
                                                href={href}
                                                onClick={() => setOpen(false)}
                                                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors
                  ${active
                                                            ? "bg-primary text-primary-content"
                                                            : "text-base-content hover:bg-base-300"
                                                      }`}
                                          >
                                                {icon}
                                                {label}
                                          </Link>
                                    )
                              })}
                        </nav>

                        {/* Footer: user info + logout */}
                        <div className="border-t border-base-300 p-4">
                              <div className="mb-3 px-2">
                                    <p className="text-xs text-base-content/50 uppercase tracking-wide">
                                          {role === "ADMIN" ? "Administrador" : "Empleado"}
                                    </p>
                                    <p className="text-sm font-medium truncate">{userName}</p>
                              </div>
                              <button
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="btn btn-ghost btn-sm w-full justify-start gap-2 text-error"
                              >
                                    <LogOut size={16} />
                                    Cerrar sesión
                              </button>
                        </div>
                  </aside>
            </>
      )
}
