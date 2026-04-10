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

