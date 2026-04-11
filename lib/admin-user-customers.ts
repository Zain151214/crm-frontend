import { CRM_API } from "@/api";
import type { Customer } from "@/types/crm";

export async function listCustomersAssignedToUser(userId: string): Promise<Customer[]> {
  const acc: Customer[] = [];
  const seen = new Set<string>();
  let page = 1;
  const limit = 100;

  for (let i = 0; i < 100; i++) {
    const res = await CRM_API.listCustomers({ page, limit, search: "" });
    for (const c of res.data) {
      if (c.assignedToId === userId && !seen.has(c.id)) {
        seen.add(c.id);
        acc.push(c);
      }
    }
    if (page >= res.meta.totalPages) break;
    page += 1;
  }

  acc.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  return acc;
}
