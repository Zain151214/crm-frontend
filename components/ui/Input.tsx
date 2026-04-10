import type { InputProps } from "@/types/components";

export function Input({
  id,
  label,
  type = "text",
  error,
  className = "",
  endAdornment,
  ...props
}: InputProps) {
  const inputClassName = [
    "block w-full rounded-xl border border-zinc-300 bg-white py-2.5 text-sm text-zinc-900 outline-none",
    endAdornment ? "pl-3 pr-10" : "px-3",
    "transition-shadow placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100",
    error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
        {label}
      </label>
      {endAdornment ? (
        <div className="relative">
          <input id={id} type={type} className={inputClassName} {...props} />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">{endAdornment}</div>
        </div>
      ) : (
        <input id={id} type={type} className={inputClassName} {...props} />
      )}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
