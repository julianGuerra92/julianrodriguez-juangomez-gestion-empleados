import Link from "next/link"
import { Building2 } from "lucide-react"

export function LandingNavbar() {
      return (
            <nav className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 sticky top-0 z-50">
                  <div className="flex-1">
                        <Link href="/" className="flex items-center gap-2">
                              <Building2 className="w-7 h-7 text-primary" />
                              <span className="text-xl font-bold">
                                    <span className="text-primary">Gestión</span>
                                    <span className="text-base-content">RRHH</span>
                              </span>
                        </Link>
                  </div>
                  <div className="flex-none">
                        <Link href="/login" className="btn btn-primary">
                              Iniciar Sesión
                        </Link>
                  </div>
            </nav>
      )
}
