import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookies";
import { decodeClientToken, isStoredTokenValid } from "@/lib/client-auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  if (!token || !isStoredTokenValid(token)) {
    redirect("/login");
  }
  const payload = decodeClientToken(token);
  const role = payload?.role === "admin" || payload?.role === "member" ? payload.role : null;
  if (!role) {
    redirect("/login");
  }
  if (role === "admin") {
    redirect("/dashboard/admin/organizations");
  }
  redirect("/dashboard/member/customers");
}
