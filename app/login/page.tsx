import { LoginForm } from "@/components";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-100 via-indigo-50 to-cyan-100 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.2),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.2),transparent_30%)]" />
      <LoginForm />
    </main>
  );
}
