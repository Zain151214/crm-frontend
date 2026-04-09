import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({
  id,
  label,
  type = "text",
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={[
          "block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none",
          "transition-shadow placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100",
          error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
