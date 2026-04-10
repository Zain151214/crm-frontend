import type {
  ActivityLog,
  AdminUserDetail,
  AssignCustomerInput,
  CreateCustomerInput,
  CreateUserInput,
  Customer,
  CustomerDetail,
  UpdateCustomerInput,
  ListActivityLogsParams,
  ListCustomersParams,
  ListOrganizationsParams,
  ListUsersParams,
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
  AdminUserDetail,
  Customer,
  CustomerDetail,
  Note,
  OrganizationSummary,
  Paginated,
  User,
} from "@/types/crm";

export const CRM_API = {
  async listUsers(params: ListUsersParams = {}): Promise<Paginated<User>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const search = params.search?.trim() ?? "";
    const q = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) q.set("search", search);

    const result = await apiRequest<Paginated<User> | User[]>(`/users?${q.toString()}`, {
      method: "GET",
    });

    if (Array.isArray(result)) {
      return {
        data: result,
        meta: {
          page,
          limit,
          total: result.length,
          totalPages: Math.max(1, Math.ceil(result.length / Math.max(1, limit))),
        },
      };
    }

    return result;
  },

  async getUserById(id: string): Promise<AdminUserDetail | null> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated.");

    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) return null;

    const body = (await res.json().catch(() => ({}))) as ApiErrorBody & Record<string, unknown>;
    if (!res.ok) {
      throw new Error(formatApiMessage(body));
    }

    return body as AdminUserDetail;
  },

  async createUser(input: CreateUserInput): Promise<User> {
    return apiRequest<User>("/users", { method: "POST", json: input });
  },

  async listOrganizations(
    params: ListOrganizationsParams = {},
  ): Promise<Paginated<OrganizationSummary>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const search = params.search?.trim() ?? "";
    const q = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) q.set("search", search);

    const result = await apiRequest<Paginated<OrganizationSummary> | OrganizationSummary[]>(
      `/organizations?${q.toString()}`,
      { method: "GET" },
    );

    if (Array.isArray(result)) {
      return {
        data: result,
        meta: {
          page,
          limit,
          total: result.length,
          totalPages: Math.max(1, Math.ceil(result.length / Math.max(1, limit))),
        },
      };
    }

    return result;
  },

  async getOrganizationById(id: string): Promise<OrganizationSummary | null> {
    let page = 1;
    const limit = 50;
    for (let i = 0; i < 40; i++) {
      const list = await this.listOrganizations({ page, limit, search: "" });
      const found = list.data.find((o) => o.id === id);
      if (found) return found;
      if (page >= list.meta.totalPages) break;
      page += 1;
    }
    return null;
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

  async listDeletedCustomers(params: ListCustomersParams): Promise<Paginated<Customer>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const search = params.search?.trim() ?? "";
    const q = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) q.set("search", search);
    return apiRequest<Paginated<Customer>>(`/customers/deleted?${q.toString()}`, { method: "GET" });
  },

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    return apiRequest<Customer>("/customers", { method: "POST", json: input });
  },

  async updateCustomer(customerId: string, input: UpdateCustomerInput): Promise<Customer> {
    return apiRequest<Customer>(`/customers/${customerId}`, {
      method: "PUT",
      json: input,
    });
  },

  async assignCustomer(customerId: string, input: AssignCustomerInput): Promise<Customer> {
    return apiRequest<Customer>(`/customers/${customerId}/assign`, {
      method: "PATCH",
      json: input,
    });
  },

  async deleteCustomer(customerId: string): Promise<Customer> {
    return apiRequest<Customer>(`/customers/${customerId}`, {
      method: "DELETE",
    });
  },

  async restoreCustomer(customerId: string): Promise<Customer> {
    return apiRequest<Customer>(`/customers/${customerId}/restore`, {
      method: "PATCH",
    });
  },

  async getCustomerById(id: string): Promise<CustomerDetail | null> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated.");

    const tryGet = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (tryGet.ok) {
      const raw = (await tryGet.json()) as CustomerDetail;
      return {
        ...raw,
        organizationName: raw.organizationName ?? "",
        assignedToName: raw.assignedToName ?? null,
        notes: Array.isArray(raw.notes) ? raw.notes : [],
      };
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
      if (found) {
        return {
          ...found,
          organizationName: "",
          assignedToName: null,
          notes: [],
        };
      }
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

