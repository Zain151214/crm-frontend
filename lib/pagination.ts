export function filterByNameOrEmail<T extends { name?: string; email?: string }>(
  items: T[],
  query: string,
) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => {
    const name = (item.name ?? "").toLowerCase();
    const email = (item.email ?? "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    totalPages,
  };
}
