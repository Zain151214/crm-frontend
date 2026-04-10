"use client";

import { Input } from "@/components/ui";
import type { ListHeaderProps } from "@/types/components";

export function ListHeader({
  title,
  search,
  onSearchChange,
  action,
  searchLabel = "Search by name or email",
  searchPlaceholder = "Type to search...",
  description = "Manage and explore records with fast search.",
  showSearch = true,
}: ListHeaderProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-lg shadow-indigo-950/5 backdrop-blur md:flex-row md:items-end md:justify-between">
      <div className="w-full md:max-w-sm">
        <h1 className="text-xl font-bold text-zinc-900 md:text-2xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
        {showSearch ? (
          <div className="mt-2">
            <Input
              id="search"
              label={searchLabel}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>
        ) : null}
      </div>
      {action}
    </div>
  );
}
