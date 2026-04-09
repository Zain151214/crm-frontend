"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { isStoredTokenValid } from "@/lib/client-auth";
import { Button, Input } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const existingToken = localStorage.getItem("accessToken");
    if (existingToken && isStoredTokenValid(existingToken)) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    setIsLoading(true);
    const result = await API.loginWithEmailPassword({ email, password });
    if (!result.ok) {
      setErrorMessage(result.message ?? "Invalid email or password.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
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
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {errorMessage ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </section>
  );
}
