"use client";

import { Button } from "@/components/ui";
import { toastSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { logoutCurrentUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useMutation({
    mutationFn: logoutCurrentUser,
    onSuccess: () => {
      toastSuccess("You have been logged out.");
      router.push("/login");
    },
  });

  const onLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="cursor-pointer bg-rose-50 text-red-800 ring-1 ring-red-200/80 hover:bg-rose-100 hover:ring-red-300/80 focus-visible:outline-red-400 disabled:cursor-not-allowed"
      onClick={onLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
