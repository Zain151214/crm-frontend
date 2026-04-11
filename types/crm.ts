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

export type CustomerDetailNote = {
  id: string;
  content: string;
  createdAt: string;
  createdByName: string;
};

export type CustomerDetail = Customer & {
  organizationName: string;
  assignedToName: string | null;
  notes: CustomerDetailNote[];
};

export type Note = {
  id: string;
  content: string;
  customerId: string;
  organizationId: string;
  createdById: string;
  createdAt: string;
};

export type NoteDetail = {
  id: string;
  content: string;
  createdAt: string;
  customerName: string;
  organizationName: string;
  createdByName: string;
};

export type ListNotesForCustomerParams = {
  search?: string;
};

export type ActivityLog = {
  id: string;
  entityType: string;
  entityId?: string;
  entityName?: string | null;
  action: string;
  performedBy?: string | null;
  performedByName?: string | null;
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
  memberCount?: number;
  _count?: { users: number };
};

export type OrganizationCreated = {
  id: string;
  name: string;
  createdAt: string;
};

export type CreateOrganizationInput = {
  name: string;
};

export type AdminOrganizationMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type AdminOrganizationDetail = {
  id: string;
  name: string;
  createdAt: string;
  users: AdminOrganizationMember[];
};

export type AdminUserAssignedCustomer = {
  id: string;
  name: string;
};

export type AdminUserDetail = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
  organization: OrganizationSummary | null;
  assignedCustomerNames: string[];
  assignedCustomerCount: number;
  assignedCustomers?: AdminUserAssignedCustomer[];
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId: string;
};

export type CreateCustomerInput = {
  name: string;
  email: string;
  phone: string;
  assignedToId?: string;
};

export type UpdateCustomerInput = {
  name: string;
  phone: string;
};

export type AssignCustomerInput = {
  userId: string;
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
