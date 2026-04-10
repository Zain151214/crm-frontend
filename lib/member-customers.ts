import { decodeClientToken } from "@/lib/client-auth";
import { getAccessToken } from "@/lib/http";
import type { Customer } from "@/types/crm";

export function getCurrentUserId(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  return decodeClientToken(token)?.sub ?? null;
}

export function customersAssignedToCurrentUser(customers: Customer[]): Customer[] {
  const id = getCurrentUserId();
  if (!id) return [];
  return customers.filter((c) => c.assignedToId === id);
}
