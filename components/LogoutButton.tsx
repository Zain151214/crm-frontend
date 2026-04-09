"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { Button } from "@/components/ui";

export function LogoutButton() {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: API.logoutCurrentUser,
  });

  const onLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button type="button" variant="ghost" onClick={onLogout} disabled={logoutMutation.isPending}>
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
