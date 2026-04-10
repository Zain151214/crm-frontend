import type {
  ActivityLog,
  CreateCustomerInput,
  CreateUserInput,
  Customer,
  ListActivityLogsParams,
  ListCustomersParams,
  Note,
  OrganizationSummary,
  Paginated,
  User,
} from "@/types/crm";
import type { ApiErrorBody } from "@/types/http";
import {
  apiRequest,
  API_BASE_URL,
  formatApiMessage,
  getAccessToken,
} from "@/lib/http";

export type {
  ActivityLog,
  Customer,
  Note,
  OrganizationSummary,
  Paginated,
  User,
} from "@/types/crm";

export const CRM_API = {
  async listUsers(): Promise<User[]> {
    return apiRequest<User[]>("/users", { method: "GET" });
  },

  async getUserById(id: string): Promise<User | null> {
    const users = await this.listUsers();
    return users.find((u) => u.id === id) ?? null;
  },

  async createUser(input: CreateUserInput): Promise<User> {
    return apiRequest<User>("/users", { method: "POST", json: input });
  },

  async listOrganizations(): Promise<OrganizationSummary[]> {
   return apiRequest<OrganizationSummary[]>("/organizations", { method: "GET" });
  },

  async getOrganizationById(id: string): Promise<OrganizationSummary | null> {
    const list = await this.listOrganizations();
    return list.find((o) => o.id === id) ?? null;
  },

  async listCustomers(params: ListCustomersParams): Promise<Paginated<Customer>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const search = params.search?.trim() ?? "";
    const q = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) q.set("search", search);
    return apiRequest<Paginated<Customer>>(`/customers?${q.toString()}`, { method: "GET" });
  },

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    return apiRequest<Customer>("/customers", { method: "POST", json: input });
  },

  async getCustomerById(id: string): Promise<Customer | null> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated.");

    const tryGet = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (tryGet.ok) {
      return (await tryGet.json()) as Customer;
    }

    if (tryGet.status !== 404) {
      const body = (await tryGet.json().catch(() => ({}))) as ApiErrorBody;
      throw new Error(formatApiMessage(body));
    }

    let page = 1;
    const limit = 50;
    for (let i = 0; i < 40; i++) {
      const list = await this.listCustomers({ page, limit, search: "" });
      const found = list.data.find((c) => c.id === id);
      if (found) return found;
      if (page >= list.meta.totalPages) break;
      page += 1;
    }
    return null;
  },

  async listNotesForCustomer(customerId: string): Promise<Note[]> {
    return apiRequest<Note[]>(`/customers/${customerId}/notes`, { method: "GET" });
  },

  async createNote(customerId: string, input: { content: string }): Promise<Note> {
    return apiRequest<Note>(`/customers/${customerId}/notes`, {
      method: "POST",
      json: input,
    });
  },

  async getNoteById(customerId: string, noteId: string): Promise<Note | null> {
    const notes = await this.listNotesForCustomer(customerId);
    return notes.find((n) => n.id === noteId) ?? null;
  },

  async listActivityLogs(params: ListActivityLogsParams): Promise<Paginated<ActivityLog>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const q = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (params.entityType) q.set("entityType", params.entityType);
    if (params.action) q.set("action", params.action);
    return apiRequest<Paginated<ActivityLog>>(`/activity-logs?${q.toString()}`, {
      method: "GET",
    });
  },
};

