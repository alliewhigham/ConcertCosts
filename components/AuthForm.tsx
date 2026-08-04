"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setMessage(
        "Account created! If email confirmation is turned on, check your inbox, then log in."
      );
      setMode("login");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card w-full max-w-md bg-base-100/95 shadow-2xl border border-base-300 backdrop-blur">
      <div className="card-body gap-5">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm opacity-70">
            {mode === "login"
              ? "Log in to track your concert spending and fun."
              : "Sign up free — your concerts stay private to you."}
          </p>
        </div>

        <div role="tablist" className="tabs tabs-box bg-base-200 p-1">
          <button
            type="button"
            role="tab"
            className={`tab flex-1 ${mode === "login" ? "tab-active" : ""}`}
            onClick={() => {
              setMode("login");
              setError(null);
              setMessage(null);
            }}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            className={`tab flex-1 ${mode === "signup" ? "tab-active" : ""}`}
            onClick={() => {
              setMode("signup");
              setError(null);
              setMessage(null);
            }}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[7rem_1fr] items-center gap-x-3 gap-y-4">
            <label htmlFor="email" className="text-sm font-medium text-right">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <label htmlFor="password" className="text-sm font-medium text-right">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <div role="alert" className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div role="alert" className="alert alert-success text-sm py-2">
              <span>{message}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
