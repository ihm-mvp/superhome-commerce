"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PHASES, type Phase } from "@/lib/cft/fair-config";

type SurveyRow = {
  tour_phase: string | null;
  satisfaction: number | null;
  highlights: string[] | null;
  improvement: string | null;
  sourcing_categories: string[] | null;
  outcome: string | null;
  purchase_stage: string | null;
  support_interests: string[] | null;
  follow_up: string | null;
  created_at: string | null;
};

const PHASE_OPTIONS: { value: "all" | Phase; label: string }[] = [
  { value: "all", label: "All phases" },
  { value: "phase1", label: "Phase 1" },
  { value: "phase2", label: "Phase 2" },
  { value: "phase3", label: "Phase 3" },
];

const OUTCOME_LABELS: Record<string, string> = {
  specific_leads: "Found specific products or suppliers to follow up",
  need_more_information: "Opportunities found; more information needed",
  researching: "Still researching and comparing",
  none_yet: "No specific sourcing outcome yet",
};

const STAGE_LABELS: Record<string, string> = {
  ready_quote_sample: "Ready for quotations or samples",
  discussing_suppliers: "Discussing requirements with suppliers",
  need_information: "Needs more product or supplier information",
  comparing: "Comparing suppliers or products",
  future_research: "Researching for a future project",
  no_current_plan: "No current purchasing plan",
};

const SUPPORT_LABELS: Record<string, string> = {
  supplier_introduction: "Supplier introductions",
  supplier_follow_up: "Supplier follow-up",
  technical_information: "Product or technical information",
  quotations: "Quotations",
  samples: "Samples",
  shipping_import: "Shipping or import guidance",
  no_support: "No support needed",
  other: "Other",
};

const HIGHLIGHT_LABELS: Record<string, string> = {
  canton_fair: "Visiting the Canton Fair",
  products_suppliers: "Discovering products and suppliers",
  guidance: "Guidance from the tour team",
  business_connections: "Business discussions and connections",
  other_guests: "Meeting other participants",
  guangzhou_culture: "Guangzhou food and culture",
  shenzhen_extension: "Shenzhen extension",
  accommodation_transport: "Accommodation and transport",
  other: "Other",
};

function labelFor(
  value: string,
  labels: Record<string, string>,
): string {
  return labels[value] ?? value.replaceAll("_", " ");
}

function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p >
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p >
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p >}
    </div>
  );
}

function Breakdown({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((item) => item.count));

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <h3 className="mb-4 font-semibold text-gray-900">{title}</h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No responses yet.</p >
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-start justify-between gap-3 text-sm">
                <span className="text-gray-700">{item.label}</span>
                <span className="shrink-0 font-medium tabular-nums text-gray-900">
                  {item.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-700"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
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
        "tour_phase,satisfaction,highlights,improvement,sourcing_categories,outcome,purchase_stage,support_interests,follow_up,created_at",
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
        : rows.filter(
            (row) => row.tour_phase?.toLowerCase() === phase,
          ),
    [rows, phase],
  );

  const averageSatisfaction = useMemo(() => {
    const scores = filteredRows
      .map((row) => row.satisfaction)
      .filter((score): score is number => score !== null && score >= 1 && score <= 5);

    if (scores.length === 0) return "—";

    return (
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    ).toFixed(1);
  }, [filteredRows]);

  const satisfactionBreakdown = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((score) => ({
        label:
          score === 5
            ? "5 — Very satisfied"
            : score === 1
              ? "1 — Very dissatisfied"
              : String(score),
        count: filteredRows.filter((row) => row.satisfaction === score).length,
      })),
    [filteredRows],
  );

  const outcomeBreakdown = useMemo(
    () =>
      Object.entries(OUTCOME_LABELS).map(([value, label]) => ({
        label,
        count: filteredRows.filter((row) => row.outcome === value).length,
      })),
    [filteredRows],
  );

  const stageBreakdown = useMemo(
    () =>
      Object.entries(STAGE_LABELS).map(([value, label]) => ({
        label,
        count: filteredRows.filter((row) => row.purchase_stage === value).length,
      })),
    [filteredRows],
  );

  const followUpBreakdown = useMemo(
    () => [
      {
        label: "Would like CFT follow-up",
        count: filteredRows.filter((row) => row.follow_up === "yes").length,
      },
      {
        label: "Does not want follow-up",
        count: filteredRows.filter((row) => row.follow_up === "no").length,
      },
    ],
    [filteredRows],
  );

  const categoryBreakdown = useMemo(() => {
    const labels = new Map<string, string>();

    (Object.keys(PHASES) as Phase[]).forEach((phaseKey) => {
      PHASES[phaseKey].categories.forEach((category) => {
        labels.set(category.value, category.label);
      });
    });

    const counts = new Map<string, number>();

    filteredRows.forEach((row) => {
      (row.sourcing_categories ?? []).forEach((category) => {
        counts.set(category, (counts.get(category) ?? 0) + 1);
      });
    });

    return [...counts.entries()]
      .map(([value, count]) => ({
        label: labels.get(value) ?? value.replaceAll("_", " "),
        count,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [filteredRows]);

  const highlightBreakdown = useMemo(() => {
    const counts = new Map<string, number>();

    filteredRows.forEach((row) => {
      (row.highlights ?? []).forEach((value) => {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      });
    });

    return [...counts.entries()]
      .map(([value, count]) => ({
        label: labelFor(value, HIGHLIGHT_LABELS),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredRows]);

  const supportBreakdown = useMemo(() => {
    const counts = new Map<string, number>();

    filteredRows.forEach((row) => {
      (row.support_interests ?? []).forEach((value) => {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      });
    });

    return [...counts.entries()]
      .map(([value, count]) => ({
        label: labelFor(value, SUPPORT_LABELS),
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredRows]);

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
          <p className="mt-2 text-sm leading-5 text-gray-600">
            Live results from submitted questionnaires. Personal contact details
            are not displayed here.
          </p >
        </div>

        <div className="flex gap-2">
          <select
            aria-label="Filter results by phase"
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
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Unable to load survey results.</p >
          <p className="mt-1 break-words">{error}</p >
          <p className="mt-2">
            Check the SELECT policy for{" "}
            <code>cft_post_survey_responses</code>. Do not expose the Supabase
            Service Role Key in browser code.
          </p >
        </div>
      )}

      {loading && !error ? (
        <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
          Loading survey results…
        </p >
      ) : !error ? (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Responses" value={filteredRows.length} />
            <Metric
              label="Phase 1"
              value={rows.filter((row) => row.tour_phase?.toLowerCase() === "phase1").length}
            />
            <Metric
              label="Phase 2"
              value={rows.filter((row) => row.tour_phase?.toLowerCase() === "phase2").length}
            />
            <Metric
              label="Phase 3"
              value={rows.filter((row) => row.tour_phase?.toLowerCase() === "phase3").length}
            />
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Metric
              label="Average satisfaction"
              value={averageSatisfaction}
              note="Out of 5"
            />
            <Metric
              label="Requests for follow-up"
              value={filteredRows.filter((row) => row.follow_up === "yes").length}
              note="Participants who answered Yes"
            />
          </div>

          <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Breakdown
              title="Q1 · Overall satisfaction"
              items={satisfactionBreakdown}
            />
            <Breakdown
              title="Q5 · Sourcing outcome"
              items={outcomeBreakdown}
            />
            <Breakdown
              title="Q6 · Purchasing stage"
              items={stageBreakdown}
            />
            <Breakdown
              title="Q8 · Follow-up preference"
              items={followUpBreakdown}
            />
            <Breakdown
              title="Q2 · Most valuable parts of the tour"
              items={highlightBreakdown}
            />
            <Breakdown
              title="Q7 · Follow-up support interests"
              items={supportBreakdown}
            />
          </div>

          <Breakdown
            title="Q4 · Product category interests"
            items={categoryBreakdown}
          />

          <section className="mt-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <h3 className="font-semibold text-gray-900">
              Recent responses
            </h3>

            {filteredRows.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                No responses for this phase yet.
              </p >
            ) : (
              <div className="mt-3 divide-y divide-gray-100">
                {filteredRows.map((row, index) => (
                  <div
                    key={`${row.created_at ?? "response"}-${index}`}
                    className="py-4 first:pt-1 last:pb-1"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {PHASE_OPTIONS.find(
                          (option) =>
                            option.value === row.tour_phase?.toLowerCase(),
                        )?.label ?? row.tour_phase ?? "Unknown phase"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(row.created_at)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-800">
                      <span className="font-medium">Satisfaction:</span>{" "}
                      {row.satisfaction ?? "—"} / 5
                      <span className="mx-2 text-gray-300">·</span>
                      <span className="font-medium">Follow-up:</span>{" "}
                      {row.follow_up === "yes"
                        ? "Yes"
                        : row.follow_up === "no"
                          ? "No"
                          : "—"}
                    </p >

  <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Outcome:</span>{" "}
                      {row.outcome
                        ? labelFor(row.outcome, OUTCOME_LABELS)
                        : "—"}
                    </p >

                    {row.sourcing_categories?.length ? (
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Categories:</span>{" "}
                        {categoryBreakdown
                          .filter((category) =>
                            row.sourcing_categories?.some(
                              (value) =>
                                labelFor(value, Object.fromEntries(
                                  [...PHASES.phase1.categories, ...PHASES.phase2.categories, ...PHASES.phase3.categories]
                                    .map((item) => [item.value, item.label]),
                                )) === category.label,
                            ),
                          )
                          .map((category) => category.label)
                          .join(", ") ||
                          row.sourcing_categories.join(", ")}
                      </p >
                    ) : null}

                    {row.improvement && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                        <span className="font-medium">Improvement feedback:</span>{" "}
                        {row.improvement}
                      </p >
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}