import { decodeClientToken } from "@/lib/client-auth";

type ApiError = {
  message?: string;
  accessToken?: string;
};

const API_BASE_URL = process.env.AUTH_API_BASE_URL ?? "http://localhost:3002";

export const API = {
  async loginWithEmailPassword(params: {
    email: string;
    password: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      credentials: "include",
    });

    const data = (await response.json().catch(() => ({}))) as ApiError;

    if (response.ok && typeof data.accessToken === "string" && data.accessToken.length > 0) {
      const decodedUser = decodeClientToken(data.accessToken);

      localStorage.setItem("accessToken", data.accessToken);
      if (decodedUser) {
        localStorage.setItem("authUser", JSON.stringify(decodedUser));
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      message: data.message,
    };
  },

  async logoutCurrentUser() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    return { ok: true, status: 200, message: "Logged out successfully" };
  },
};