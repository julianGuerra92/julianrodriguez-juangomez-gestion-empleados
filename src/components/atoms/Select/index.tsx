interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: SelectOption[];
  className?: string;
}

export function Select({
  value,
  onChange,
  disabled = false,
  options,
  className = "",
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={["select select-bordered", className]
        .filter(Boolean)
        .join(" ")}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
