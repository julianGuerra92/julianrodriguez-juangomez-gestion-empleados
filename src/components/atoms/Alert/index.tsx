import { ReactNode } from "react";

type AlertVariant = "error" | "success" | "info" | "warning";

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  role?: string;
}

const variantMap: Record<AlertVariant, string> = {
  error: "alert-error",
  success: "alert-success",
  info: "alert-info",
  warning: "alert-warning",
};

export function Alert({ variant = "error", children, role }: AlertProps) {
  return (
    <div
      role={role}
      className={["alert", variantMap[variant], "py-2 text-sm"].join(" ")}
    >
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
      <span>{children}</span>
    </div>
  );
}
