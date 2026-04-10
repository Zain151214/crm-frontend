import type { UserRole } from "./auth";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  organizationId: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Note = {
  id: string;
  content: string;
  customerId: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
};

export type ActivityLog = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  organizationId: string;
  timestamp: string;
};

export type Paginated<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type OrganizationSummary = {
  id: string;
  name: string;
  createdAt: string;
  memberCount: number;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type CreateCustomerInput = {
  name: string;
  email: string;
  phone: string;
  assignedToId?: string;
};

export type ListCustomersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ListUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ListOrganizationsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ListActivityLogsParams = {
  page?: number;
  limit?: number;
  entityType?: string;
  action?: string;
};
