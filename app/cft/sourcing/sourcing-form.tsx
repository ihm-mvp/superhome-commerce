"use client";

import { useState, type FormEvent } from "react";
import CftFormShell, {
  Field,
  inputClass,
  optionClass,
} from "@/app/cft/_components/cft-form-shell";
import { PHASES, type Phase } from "@/lib/cft/fair-config";

const ENDPOINT =
  "https://jmduwafyyrmatyptfndy.supabase.co/functions/v1/cft-submit-lead";

export default function SourcingForm({ phase }: { phase: Phase }) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [specificProducts, setSpecificProducts] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function toggleCategory(value: string) {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (
      !name.trim() ||
      !companyName.trim() ||
      !email.trim() ||
      !selected.length
    ) {
      setMessage(
        "Please complete your name, company, email and at least one interest.",
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: `CFT_OCT2026_${phase.toUpperCase()}`,
          tourPhase: phase,
          name: name.trim(),
          companyName: companyName.trim(),
          email: email.trim(),
          productCategories: selected,
          specificProducts: specificProducts.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.success !== true) {
        throw new Error(
          data?.error || "Unable to submit. Please try again.",
        );
      }

      setMessage(
        "Thank you! We look forward to welcoming you to Shunde on 3 November.",
      );

      setName("");
      setCompanyName("");
      setEmail("");
      setSelected([]);
      setSpecificProducts("");
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Connection error. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <CftFormShell
      phase={phase}
      title="Phase 3 Business Visit"
      description="Join us for an afternoon of business visits in Shunde on 3 November. Tell us a little about your company and the products or opportunities you're interested in exploring."
    >
      <form
        onSubmit={submit}
        className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"
      >
        <Field label="Your Name" required>
          <input
            className={inputClass}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={120}
            required
          />
        </Field>

        <Field label="Company Name" required>
          <input
            className={inputClass}
            autoComplete="organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name"
            maxLength={200}
            required
          />
        </Field>

        <Field label="Email Address" required>
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            maxLength={254}
            required
          />
        </Field>

        <Field
          label="What products or areas are you interested in?"
          required
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {PHASES[phase].categories.map((category) => (
              <label
                key={category.value}
                className={optionClass}
              >
                <input
                  className="mt-1 accent-emerald-800"
                  type="checkbox"
                  checked={selected.includes(category.value)}
                  onChange={() => toggleCategory(category.value)}
                />
                <span>{category.label}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-500">
            Select all that interest you. There is no obligation to purchase.
          </p >
        </Field>

  <Field label="Anything specific you'd like to explore? (optional)">
          <textarea
            className={inputClass}
            rows={3}
            maxLength={300}
            value={specificProducts}
            onChange={(e) => setSpecificProducts(e.target.value)}
            placeholder="Products, designs, manufacturers or business opportunities..."
          />
        </Field>

        {message && (
          <p
            role="status"
            className={`mb-4 rounded-lg p-3 text-sm ${
              message.startsWith("Thank you")
                ? "bg-green-50 text-green-800"
                : "bg-amber-50 text-amber-900"
            }`}
          >
            {message}
          </p >
        )}

        <button
          type="submit"
          disabled={busy}
          className="min-h-12 w-full rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit My Interests"}
        </button>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          Phase: {PHASES[phase].label}. Your selections will help us
          understand the products and business opportunities that interest you.
        </p >
      </form>
    </CftFormShell>
  );
}