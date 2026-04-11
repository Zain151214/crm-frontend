import { CustomerDetail } from "@/api/crm";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export type LoaderProps = {
  label?: string;
  variant?: "section" | "inline";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  endAdornment?: ReactNode;
};

export type ListHeaderProps = {
  title: string;
  search: string;
  onSearchChange: (value: string) => void;
  action?: ReactNode;
  searchLabel?: string;
  searchPlaceholder?: string;
  description?: string;
  showSearch?: boolean;
};

export type PaginationControlsProps = {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (nextPage: number) => void;
};

export type BackLinkProps = {
  href: string;
  children?: ReactNode;
  className?: string;
  flush?: boolean;
};

export type QueryProviderProps = {
  children: ReactNode;
};

export type DashboardLayoutProps = {
  children: ReactNode;
};

export type SidebarNavItem = {
  label: string;
  href: string;
};

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export type EditCustomerDialogProps = {
  open: boolean;
  email: string;
  initialName: string;
  initialPhone: string;
  loading?: boolean;
  onCancel: () => void;
  onSave: (values: { name: string; phone: string }) => void;
};

export type Props = {
  data: CustomerDetail;
};