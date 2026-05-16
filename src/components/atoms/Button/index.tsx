import { ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "outline" | "error"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantMap: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  ghost: "btn-ghost",
  outline: "btn-outline",
  error: "btn-error",
}

const sizeMap: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
}

export function Button({
  variant,
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={["btn", variant ? variantMap[variant] : "", sizeMap[size], className]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
