"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { Button } from "@/components/ui";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    setIsLoading(true);
    await API.logoutCurrentUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button type="button" variant="ghost" onClick={onLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
