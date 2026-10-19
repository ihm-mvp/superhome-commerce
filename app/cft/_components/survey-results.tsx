
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PHASES, type Phase } from "@/lib/cft/fair-config";

type SurveyRow = {
  id: string;
  created_at: string;
  source: string;
  tour_phase: string;
  respondent_name: string;
  satisfaction: number;
  highlights: string[];
  improvement: string | null;
  sourcing_categories: string[];
  outcome: string;
  purchase_stage: string;
  support_interests: string[];
  follow_up: string;
  follow_up_details: string | null;
};

const HIGHLIGHTS = [
  { value: "canton_fair", label: "Visiting the Canton Fair" },
  { value: "products_suppliers", label: "Discovering products and suppliers" },
  { value: "guidance", label: "Guidance and support from the tour team" },
  { value: "business_connections", label: "Business discussions and connections" },
  { value: "other_guests", label: "Meeting other participants" },
  { value: "guangzhou_culture", label: "Guangzhou food and culture" },
  { value: "shenzhen_extension", label: "Shenzhen extension" },
  { value: "accommodation_transport", label: "Accommodation and transport" },
  { value: "other", label: "Other" },
];

const OUTCOMES = [
  { value: "specific_leads", label: "Found specific products or suppliers to follow up" },
  { value: "need_more_information", label: "Found opportunities but need more information" },
  { value: "researching", label: "Still researching and comparing options" },
  { value: "none_yet", label: "No specific sourcing outcome yet" },
];

const STAGES = [
  { value: "ready_quote_sample", label: "Ready to request quotations or samples" },
  { value: "discussing_suppliers", label: "Discussing requirements with suppliers" },
  { value: "need_information", label: "Need more product or supplier information" },
  { value: "comparing", label: "Comparing suppliers or products" },
  { value: "future_research", label: "Researching for a future project" },
  { value: "no_current_plan", label: "No current purchasing plan" },
];

const SUPPORTS = [
  { value: "supplier_introduction", label: "Supplier introductions" },
  { value: "supplier_follow_up", label: "Supplier follow-up" },
  { value: "technical_information", label: "Product or technical information" },
  { value: "quotations", label: "Quotations" },
  { value: "samples", label: "Samples" },
  { value: "shipping_import", label: "Shipping or import guidance" },
  { value: "no_support", label: "No support needed" },
  { value: "other", label: "Other" },
];

const PHASE_OPTIONS: { value: "all" | Phase; label: string }[] = [
  { value: "all", label: "All phases" },
  { value: "phase1", label: "Phase 1" },
  { value: "phase2", label: "Phase 2" },
  { value: "phase3", label: "Phase 3" },
];

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-NZ", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function phaseLabel(value: string) {
  const key = value.toLowerCase() as Phase;
  return PHASES[key]?.label ?? value;
}

function CountList({
  options,
  rows,
  field,
}: {
  options: { value: string; label: string }[];
  rows: SurveyRow[];
  field: "highlights" | "sourcing_categories" | "support_interests";
}) {
  const counts = new Map<string, number>();

  rows.forEach((row) => {
    (row[field] ?? []).forEach((value) => {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });

  const answeredCount = options
    .map((option) => ({ ...option, count: counts.get(option.value) ?? 0 }))
    .filter((option) => option.count > 0);

  if (!answeredCount.length) {
    return <p className="text-sm text-gray-500">No selections recorded.</p >;
  }

  return (
    <div className="space-y-3">
      {answeredCount.map((option) => (
        <div key={option.value}>
          <div className="flex justify-between gap-3 text-sm">
            <span className="text-gray-700">{option.label}</span>
            <span className="font-medium tabular-nums text-gray-900">
              {option.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SingleChoiceCounts({
  rows,
  field,
  options,
}: {
  rows: SurveyRow[];
  field: "outcome" | "purchase_stage" | "follow_up";
  options: { value: string; label: string }[];
}) {
  const counts = new Map<string, number>();

  rows.forEach((row) => {
    const value = row[field];
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  const answered = options
    .map((option) => ({
      ...option,
      count: counts.get(option.value) ?? 0,
    }))
    .filter((option) => option.count > 0);

  if (!answered.length) {
    return (
      <p className="text-sm text-gray-500">
        No answers recorded.
      </p >
    );
  }

  return (
    <div className="space-y-3">
      {answered.map((option) => (
        <div
          key={option.value}
          className="flex justify-between gap-3 text-sm"
        >
          <span className="text-gray-700">{option.label}</span>
          <span className="font-medium tabular-nums text-gray-900">
            {option.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function Question({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <h3 className="mb-4 font-semibold text-gray-900">
        Q{number}. {title}
      </h3>
      {children}
    </section>
  );
}

function OpenAnswers({
  rows,
  field,
}: {
  rows: SurveyRow[];
  field: "improvement" | "follow_up_details";
}) {
  const answers = rows.filter((row) => {
    const value = row[field];
    return typeof value === "string" && value.trim().length > 0;
  });

  if (!answers.length) {
    return <p className="text-sm text-gray-500">No responses recorded.</p >;
  }

  return (
    <div className="space-y-4">
      {answers.map((row) => (
        <article
          key={row.id}
          className="rounded-lg border border-gray-100 bg-gray-50 p-3"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">
              {row.respondent_name}
            </span>
            <span>{phaseLabel(row.tour_phase)}</span>
            <span>{formatDate(row.created_at)}</span>
          </div>
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
            {row[field]}
          </p >
        </article>
      ))}
    </div>
  );
}

export default function SurveyResults() {
  const [rows, setRows] = useState<SurveyRow[]>([]);
  const [phase, setPhase] = useState<"all" | Phase>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("cft_post_survey_responses")
      .select(
        "id,created_at,source,tour_phase,respondent_name,satisfaction,highlights,improvement,sourcing_categories,outcome,purchase_stage,support_interests,follow_up,follow_up_details",
      )
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setRows([]);
    } else {
      setRows((data ?? []) as SurveyRow[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadResults();
  }, [loadResults]);

  const filteredRows = useMemo(
    () =>
      phase === "all"
        ? rows
        : rows.filter((row) => row.tour_phase.toLowerCase() === phase),
    [rows, phase],
  );

  const satisfactionCounts = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: filteredRows.filter((row) => row.satisfaction === score).length,
    label:
      score === 5
        ? "5 — Very satisfied"
        : score === 1
          ? "1 — Very dissatisfied"
          : String(score),
  }));

  const validScores = filteredRows
    .map((row) => row.satisfaction)
    .filter((score) => Number.isInteger(score) && score >= 1 && score <= 5);

  const average =
    validScores.length > 0
      ? (
          validScores.reduce((sum, score) => sum + score, 0) /
          validScores.length
        ).toFixed(1)
      : "—";

  const categoryOptions = useMemo(() => {
    const values = new Map<string, string>();

    (Object.keys(PHASES) as Phase[]).forEach((phaseKey) => {
      PHASES[phaseKey].categories.forEach((category) => {
        values.set(category.value, category.label);
      });
    });

    return [...values.entries()].map(([value, label]) => ({ value, label }));
  }, []);

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
            CFT Admin
          </p >
          <h2 className="mt-1 text-2xl font-semibold text-gray-900">
            Post-Tour Survey Results
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Questions and answers follow the original survey order.
          </p >
        </div>

        <div className="flex gap-2">
          <select
            aria-label="Filter by phase"
            value={phase}
            onChange={(event) =>
              setPhase(event.target.value as "all" | Phase)
            }
            className="min-h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800"
          >
            {PHASE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => void loadResults()}
            disabled={loading}
            className="min-h-10 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          Unable to load survey results: {error}
        </p >
      )}

      {loading && !error ? (
        <p className="text-sm text-gray-500">Loading survey results…</p >
      ) : !error ? (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Total responses</p >
              <p className="mt-1 text-2xl font-semibold">{filteredRows.length}</p >
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Average satisfaction</p >
              <p className="mt-1 text-2xl font-semibold">{average} / 5</p >
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Requested follow-up</p >
              <p className="mt-1 text-2xl font-semibold">
                {filteredRows.filter((row) => row.follow_up === "yes").length}
              </p >
            </div>
          </div>

          <div className="space-y-4">
            <Question number={1} title="Overall, how satisfied were you with the tour?">
              <div className="space-y-3">
                {satisfactionCounts.map((item) => (
                  <div key={item.score} className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-medium tabular-nums">{item.count}</span>
                  </div>
                ))}
              </div>
            </Question>

            <Question number={2} title="Which parts of the tour did you find most valuable? (optional)">
              <CountList options={HIGHLIGHTS} rows={filteredRows} field="highlights" />
            </Question>

            <Question number={3} title="What is one thing we could improve? (optional)">
              <OpenAnswers rows={filteredRows} field="improvement" />
            </Question>

            <Question number={4} title="Which product categories did you explore or want to follow up? (optional)">
              <CountList options={categoryOptions} rows={filteredRows} field="sourcing_categories" />
            </Question>

            <Question number={5} title="Did you identify products or suppliers worth following up?">
              <SingleChoiceCounts rows={filteredRows} field="outcome" options={OUTCOMES} />
            </Question>

            <Question number={6} title="Which best describes your current purchasing stage?">
              <SingleChoiceCounts rows={filteredRows} field="purchase_stage" options={STAGES} />
            </Question>

            <Question number={7} title="What follow-up support would be useful? (optional)">
              <CountList options={SUPPORTS} rows={filteredRows} field="support_interests" />
            </Question>

            <Question number={8} title="Would you like CFT to contact you about your sourcing interests?">
              <SingleChoiceCounts
                rows={filteredRows}
                field="follow_up"
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </Question>

            <Question number={9} title="Is there a specific product, supplier or next step you would like us to follow up? (optional)">
              <OpenAnswers rows={filteredRows} field="follow_up_details" />
            </Question>
          </div>
        </>
      ) : null}
    </section>
  );
}