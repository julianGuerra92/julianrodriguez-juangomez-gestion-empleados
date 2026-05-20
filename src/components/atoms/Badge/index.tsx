import { ReactNode } from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "success"
  | "warning"
  | "error";

interface BadgeProps {
      readonly variant?: BadgeVariant;
      readonly outline?: boolean;
      readonly children: ReactNode;
      readonly className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      neutral: "",
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-error",
};

export function Badge({
      variant = "neutral",
      outline = false,
      children,
      className = "",
}: BadgeProps) {
      return (
            <div
                  className={[
                        "badge",
                        variantMap[variant],
                        outline ? "badge-outline" : "",
                        className,
                  ]
                        .filter(Boolean)
                        .join(" ")}
            >
                  {children}
            </div>
      );
}
