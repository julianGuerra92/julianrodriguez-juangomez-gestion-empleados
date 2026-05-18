"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/login";
import { Mail, Lock, BriefcaseBusiness } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { Alert } from "@/components/atoms/Alert";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-2xl">
      <div className="card-body gap-6">
        {/* Logo / Título */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="bg-primary/10 p-3 rounded-full">
            <BriefcaseBusiness size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">
            Gestión de Empleados
          </h1>
          <p className="text-sm text-base-content/60 text-center">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Alerta de error */}
        {state.error && (
          <Alert variant="error" role="alert">
            {state.error}
          </Alert>
        )}

        {/* Formulario */}
        <form action={formAction} className="flex flex-col gap-4">
          <FormField
            label="Correo electrónico"
            id="email"
            name="email"
            type="email"
            placeholder="correo@empresa.com"
            icon={<Mail size={16} />}
            required
            autoComplete="email"
            disabled={isPending}
          />
          <FormField
            label="Contraseña"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={16} />}
            required
            autoComplete="current-password"
            disabled={isPending}
          />
          <Button
            type="submit"
            variant="primary"
            className="mt-2 w-full"
            isLoading={isPending}
          >
            {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}
