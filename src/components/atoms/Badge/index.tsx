import { ReactNode } from "react"

type BadgeVariant = "primary" | "secondary" | "accent" | "neutral"

interface BadgeProps {
      variant?: BadgeVariant
      outline?: boolean
      children: ReactNode
      className?: string
}

const variantMap: Record<BadgeVariant, string> = {
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      neutral: "",
}

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
      )
}
