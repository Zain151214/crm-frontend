"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { loginWithEmailPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useMutation({
    mutationFn: loginWithEmailPassword,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await loginMutation.mutateAsync({ email, password });
    if (!result.ok) {
      toastError(result.message ?? "Invalid email or password.");
      return;
    }
    toastSuccess("Signed in successfully.");
    router.push("/dashboard");
  };

  return (
    <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl shadow-indigo-950/10 backdrop-blur-md">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-200/60 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-cyan-200/50 blur-2xl" />

      <div className="relative">
        <p className="text-sm font-medium text-indigo-700">Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
          Sign in to your account
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Continue managing your CRM dashboard with secure access.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                    <path d="m2 2 20 20" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            }
          />

          <Button type="submit" fullWidth disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </section>
  );
}
