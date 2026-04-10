import type { LoaderProps } from "@/types/components";

const sizeMap = {
  sm: "h-5 w-5 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-14 w-14 border-[3px]",
} as const;

export function Loader({ label, variant = "section", size = "md", className = "" }: LoaderProps) {
  const wrapper =
    variant === "section"
      ? [
          "flex w-full flex-col items-center justify-center gap-3 py-10",
          "min-h-[10rem]",
          className,
        ]
          .filter(Boolean)
          .join(" ")
      : ["flex flex-row items-center gap-2.5", className].filter(Boolean).join(" ");

  return (
    <div className={wrapper} role="status" aria-live="polite" aria-busy="true">
      <div
        className={[
          "shrink-0 rounded-full border-solid border-indigo-100/90",
          "border-t-indigo-600 border-r-cyan-500 border-b-transparent border-l-transparent",
          "animate-spin shadow-sm shadow-indigo-200/40",
          sizeMap[size],
        ].join(" ")}
        aria-hidden
      />
      {label ? (
        <p
          className={[
            "text-sm font-medium text-zinc-500",
            variant === "section" ? "text-center" : "",
          ].join(" ")}
        >
          {label}
        </p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
