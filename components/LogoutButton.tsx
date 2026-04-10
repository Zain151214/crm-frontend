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
    <Button type="button" variant="ghost" onClick={onLogout} disabled={logoutMutation.isPending}>
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
