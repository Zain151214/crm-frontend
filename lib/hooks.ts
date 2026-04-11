import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function useSearchPaginationQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [page, setPage] = useState(() =>
    Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1),
  );

  const debouncedSearch = useDebouncedValue(search, 350);
  const urlQuery = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams();
    const q = debouncedSearch.trim();
    if (q) params.set("search", q);
    if (page > 1) params.set("page", String(page));
    const next = params.toString();
    if (next === urlQuery) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [debouncedSearch, page, pathname, router, urlQuery]);

  useEffect(() => {
    const syncFromHistory = () => {
      if (window.location.pathname !== pathname) return;
      const p = new URLSearchParams(window.location.search);
      setSearch(p.get("search") ?? "");
      setPage(Math.max(1, Number.parseInt(p.get("page") ?? "1", 10) || 1));
    };
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, [pathname]);

  return { search, setSearch, page, setPage, debouncedSearch };
}
