import Link from "next/link";
import type { BackLinkProps } from "@/types/components";

const baseClass =
  "inline-flex rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200";

export function BackLink({ href, children = "Back", className = "", flush = false }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={[flush ? "" : "mb-4", baseClass, className].filter(Boolean).join(" ")}
    >
      {children}
    </Link>
  );
}
