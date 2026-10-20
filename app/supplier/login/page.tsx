
"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Mode = "signin" | "signup";

export default function SupplierLoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setMessage("");
    setErrorMessage("");
  }

  async function setupSupplierAccount(accessToken: string) {
    const response = await fetch("/api/supplier/account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.error || "Unable to set up your supplier profile."
      );
    }
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (!data.session) {
        throw new Error("Login succeeded but no session was returned.");
      }

      await setupSupplierAccount(data.session.access_token);
      window.location.href = "/supplier/products/new";
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in."
      );
      setBusy(false);
    }
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            company_name: companyName.trim(),
            contact_name: contactName.trim(),
            account_type: "supplier",
          },
          emailRedirectTo: `${window.location.origin}/supplier/login`,
        },
      });

      if (error) throw error;

      if (data.session) {
        await setupSupplierAccount(data.session.access_token);
        window.location.href = "/supplier/products/new";
        return;
      }

      setMessage(
        "注册成功，请登录"
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "无法生成您的账户"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            SMB 供应商门户
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            提交并管理您的产品
          </p >
        </header>

        <div
          className="mt-7 grid grid-cols-2 rounded-lg bg-gray-100 p-1"
          role="tablist"
          aria-label="Supplier account"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => switchMode("signin")}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition ${
              mode === "signin"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            登录
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => switchMode("signup")}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition ${
              mode === "signup"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            注册
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "signin"
              ? "欢迎回来"
              : "创建您的供应商账户"}
          </h2>

     <p className="mt-1 text-sm text-gray-600">
            {mode === "signin"
              ? "请登录以继续进行产品提交"
              : "注册您的公司，以便提交产品以供审核"}
          </p >
        </div>

        <form
          onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
          className="mt-6 space-y-4"
        >
          {mode === "signup" && (
            <>
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  公司 / 供应商 名称
                </label>
                <input
                  id="companyName"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  required
                  maxLength={200}
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="contactName"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  联系人姓名
                </label>
                <input
                  id="contactName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={150}
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
            邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              required
              minLength={mode === "signup" ? 8 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
            {mode === "signup" && (
              <p className="mt-1 text-xs text-gray-500">
                至少使用 8 个字符
              </p >
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? mode === "signin"
                ? "正在登录......"
                : "正在创建......"
              : mode === "signin"
                ? "登录"
                : "创建账户"}
          </button>
        </form>

        {message && (
          <div
            role="status"
            className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
          >
            {message}
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          {mode === "signin"
            ? "初次使用供应商门户？请选择上方的“注册”"
            : "已有账户？请选择上方的“登录”"}
        </p >
      </div>
    </main>
  );
}