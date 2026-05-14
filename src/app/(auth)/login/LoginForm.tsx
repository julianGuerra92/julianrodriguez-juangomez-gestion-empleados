"use client"

import { useActionState } from "react"
import { loginAction, type LoginState } from "./actions"
import { Mail, Lock, Loader2, BriefcaseBusiness } from "lucide-react"

const initialState: LoginState = {}

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-2xl">
      <div className="card-body gap-6">
        {/* Logo / Título */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="bg-primary/10 p-3 rounded-full">
            <BriefcaseBusiness size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">Gestión de Empleados</h1>
          <p className="text-sm text-base-content/60 text-center">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Alerta de error */}
        {state.error && (
          <div role="alert" className="alert alert-error py-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        {/* Formulario */}
        <form action={formAction} className="flex flex-col gap-4">
          {/* Campo email */}
          <div className="form-control gap-1">
            <label className="label pb-0" htmlFor="email">
              <span className="label-text text-sm font-medium">Correo electrónico</span>
            </label>
            <label className="input input-bordered flex items-center gap-2 focus-within:input-primary">
              <Mail size={16} className="opacity-50 shrink-0" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="correo@empresa.com"
                className="grow"
                required
                autoComplete="email"
                disabled={isPending}
              />
            </label>
          </div>

          {/* Campo contraseña */}
          <div className="form-control gap-1">
            <label className="label pb-0" htmlFor="password">
              <span className="label-text text-sm font-medium">Contraseña</span>
            </label>
            <label className="input input-bordered flex items-center gap-2 focus-within:input-primary">
              <Lock size={16} className="opacity-50 shrink-0" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="grow"
                required
                autoComplete="current-password"
                disabled={isPending}
              />
            </label>
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="btn btn-primary mt-2 w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
