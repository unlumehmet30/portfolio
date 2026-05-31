"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "@/lib/api";

export const adminTokenKey = "mehmet-portfolio-admin-token";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const session = await loginAdmin({ username, password });
      window.sessionStorage.setItem(adminTokenKey, session.token);
      router.push("/admin");
    } catch (error) {
      setStatus("error");
      setError(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-6 shadow-soft-card">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
          <Lock size={18} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Manage portfolio content and messages.</p>
        </div>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="text-muted-foreground">Username</span>
        <Input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
      </label>

      <label className="mt-4 block space-y-2 text-sm">
        <span className="text-muted-foreground">Password</span>
        <Input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className={status === "error" ? "text-sm text-rose-500" : "text-sm text-muted-foreground"} role="status">
          {error || "Enter your admin credentials."}
        </p>
        <Button type="submit" disabled={status === "loading"}>
          <LogIn size={17} />
          {status === "loading" ? "Signing in" : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
