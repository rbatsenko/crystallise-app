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
        <h1 className="text-2xl font-semibold mb-1">Crystallise Admin</h1>
        <p className="text-sm text-slate-500 mb-8">
          Sign in with an email on the allowlist.
        </p>

        {notAdmin && (
          <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200">
            That account isn&apos;t in the admin allowlist.
          </div>
        )}

        {state === "magic_sent" ? (
          <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
            Check <strong>{email}</strong> for a sign-in link.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@crystallise.example"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:bg-slate-900 dark:border-slate-700"
            />
            {mode === "password" && (
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 dark:bg-slate-900 dark:border-slate-700"
              />
            )}
            <button
              type="submit"
              disabled={state === "submitting"}
              className="w-full rounded-md bg-slate-900 text-white px-3 py-2 text-sm font-medium disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
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
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-4"
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
