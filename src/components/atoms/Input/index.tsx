import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export function Input({ icon, className = "", ...props }: InputProps) {
  if (icon) {
    return (
      <label className="input input-bordered flex items-center gap-2 focus-within:input-primary">
        <span className="opacity-50 shrink-0">{icon}</span>
        <input
          className={["grow", className].filter(Boolean).join(" ")}
          {...props}
        />
      </label>
    );
  }
  return (
    <input
      className={["input input-bordered", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
