import type { ReactNode } from "react";
import type { Phase } from "@/lib/cft/fair-config";
import { PHASES } from "@/lib/cft/fair-config";

export default function CftFormShell({ phase, title, description, children }: { phase: Phase; title: string; description: string; children: ReactNode }) {
  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-7 sm:px-8 sm:py-10">
    <header className="mb-7 rounded-2xl bg-emerald-900 px-5 py-6 text-white sm:px-7">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">Canton Fair · October 2026 · {PHASES[phase].label}</p>
      <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
      <p className="mt-3 leading-6 text-emerald-50">{description}</p>
    </header>
    {children}
    <p className="mt-8 border-t border-gray-200 pt-4 text-xs leading-5 text-gray-500">Your information will be used to understand your sourcing interests and provide follow-up only according to your stated preference.</p>
  </main>;
}

export function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <fieldset className="mb-6"><legend className="mb-2 text-sm font-semibold text-gray-800">{label}{required && <span className="ml-1 text-red-600">*</span>}</legend>{children}</fieldset>;
}
export const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";
export const optionClass = "flex items-start gap-3 rounded-lg border border-gray-200 px-3 py-3 text-sm leading-5 text-gray-700";
