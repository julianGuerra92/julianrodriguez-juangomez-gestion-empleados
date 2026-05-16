"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface NavLinkProps {
      href: string
      label: string
      icon: ReactNode
      onClick?: () => void
}

export function NavLink({ href, label, icon, onClick }: NavLinkProps) {
      const pathname = usePathname()
      const active = pathname === href || pathname.startsWith(href + "/")

      return (
            <Link
                  href={href}
                  onClick={onClick}
                  className={[
                        "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                        active
                              ? "bg-primary text-primary-content"
                              : "text-base-content hover:bg-base-300",
                  ].join(" ")}
            >
                  {icon}
                  {label}
            </Link>
      )
}
