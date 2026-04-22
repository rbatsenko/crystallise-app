"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@crystallise/supabase/browser";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

type Mode = "password" | "magic";
type State = "idle" | "submitting" | "magic_sent" | "error";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const notAdmin = searchParams.get("error") === "not_admin";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg(null);

    const supabase = createClient();

    if (mode === "password") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setState("error");
        setErrorMsg(error.message);
        return;
      }
      router.push("/proposals");
      router.refresh();
      return;
    }

    // Silently short-circuit for non-allowlisted emails: same UX, but no
    // email is sent so we don't burn the inbound SMTP rate limit on strangers.
    const { data: allowed, error: rpcError } = await supabase.rpc(
      "is_allowlisted",
      { check_email: email.trim() },
    );
    if (rpcError) {
      setState("error");
      setErrorMsg(rpcError.message);
      return;
    }
    if (!allowed) {
      setState("magic_sent");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setState("error");
      setErrorMsg(error.message);
      return;
    }
    setState("magic_sent");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--color-accent)] text-white text-xs font-bold">
            C
          </span>
          <h1 className="text-xl font-semibold tracking-tight">
            Crystallise Admin
          </h1>
        </div>
        <p className="text-sm text-[color:var(--color-text-muted)] mb-8">
          Sign in with an email on the allowlist.
        </p>

        {notAdmin && (
          <div className="mb-6 rounded-md border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200">
            That account isn&apos;t in the admin allowlist.
          </div>
        )}

        {state === "magic_sent" ? (
          <div className="rounded-md border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-200">
            Check <strong>{email}</strong> for a sign-in link.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@crystallise.example"
              className="w-full rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
            />
            {mode === "password" && (
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
              />
            )}
            <button
              type="submit"
              disabled={state === "submitting"}
              className="w-full rounded-md bg-[color:var(--color-text)] text-[color:var(--color-surface)] px-3 py-2 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {state === "submitting"
                ? mode === "password"
                  ? "Signing in…"
                  : "Sending…"
                : mode === "password"
                  ? "Sign in"
                  : "Email me a sign-in link"}
            </button>
            {errorMsg && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errorMsg}
              </p>
            )}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "password" ? "magic" : "password");
                  setErrorMsg(null);
                }}
                className="text-xs text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] underline underline-offset-4"
              >
                {mode === "password"
                  ? "Or email me a sign-in link instead"
                  : "Or sign in with password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
