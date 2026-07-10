"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSessionUser,
  isSupabaseConfigured,
  resetPassword,
  signInWithGoogle,
  signInWithMagicLink,
  signInWithPassword,
  signUp,
} from "@/lib/cloud";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<
    "signin" | "signup" | "magic" | "reset"
  >("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    getSessionUser().then((u) => {
      if (u) router.replace("/workspace");
    });
  }, [configured, router]);

  async function handleGoogle() {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { error: err } = await signInWithGoogle();
      if (err) throw err;
      // Redirect handled by OAuth
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Enable Google provider in Supabase Auth settings."
      );
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (mode === "reset") {
        const { error: err } = await resetPassword(email);
        if (err) throw err;
        setMessage(
          "Password reset email sent (if the account exists). Check your inbox."
        );
      } else if (mode === "magic") {
        const { error: err } = await signInWithMagicLink(email);
        if (err) throw err;
        setMessage("Check your email for the magic link.");
      } else if (mode === "signup") {
        const { error: err } = await signUp(
          email,
          password,
          name || "Reviewer"
        );
        if (err) throw err;
        setMessage(
          "Account created. If email confirmation is enabled, check your inbox; otherwise you can sign in now."
        );
        setMode("signin");
      } else {
        const { error: err } = await signInWithPassword(email, password);
        if (err) throw err;
        router.push("/workspace");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">
          Sign in unavailable
        </h1>
        <p className="mt-3 text-slate-600">
          Cloud accounts are not enabled on this deployment. Use the{" "}
          <Link href="/workspace" className="text-teal-700 underline">
            workspace
          </Link>{" "}
          in local mode to run a review on this device.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">
        {mode === "signup"
          ? "Create account"
          : mode === "reset"
            ? "Reset password"
            : "Sign in"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign in to create team reviews, invite collaborators, and sync across
        devices.
      </p>

      <button
        type="button"
        disabled={loading}
        onClick={() => void handleGoogle()}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        or email
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {(
          [
            ["signin", "Password"],
            ["signup", "Sign up"],
            ["magic", "Magic link"],
            ["reset", "Reset"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-full px-3 py-1 ${
              mode === id
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              placeholder="Alex"
            />
          </label>
        )}
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        {(mode === "signin" || mode === "signup") && (
          <label className="block text-sm">
            <span className="font-medium text-slate-800">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
        )}
        {mode === "reset" && (
          <p className="text-xs text-slate-500">
            We will email a link to set a new password. After clicking it you can
            choose a new password on the reset page.
          </p>
        )}
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {message && <p className="text-sm text-teal-700">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : mode === "magic"
                ? "Send magic link"
                : mode === "reset"
                  ? "Send reset email"
                  : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Google sign-in requires enabling the Google provider in Supabase →
        Authentication → Providers, and adding your site URL to redirect allow
        list.
      </p>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/workspace" className="text-teal-700 underline">
          Continue with local-only mode
        </Link>
      </p>
    </div>
  );
}
