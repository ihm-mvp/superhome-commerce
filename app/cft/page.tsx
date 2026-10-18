import Link from "next/link";

export const metadata = { title: "Canton Fair · October 2026", description: "Canton Fair October 2026 sourcing requests and post-tour survey links." };

const cards = [
  { group: "During the tour · Kick-off Breakfast", title: "Sourcing Requests", phase: "Phase 1", href: "/cft/sourcing?phase=phase1" },
  { group: "During the tour · Kick-off Breakfast", title: "Sourcing Requests", phase: "Phase 2", href: "/cft/sourcing?phase=phase2" },
  { group: "During the tour · Kick-off Breakfast", title: "Sourcing Requests", phase: "Phase 3", href: "/cft/sourcing?phase=phase3" },
  { group: "After the tour · Farewell Dinner", title: "Post-Tour Survey", phase: "Phase 1", href: "/cft/survey?phase=phase1" },
  { group: "After the tour · Farewell Dinner", title: "Post-Tour Survey", phase: "Phase 2", href: "/cft/survey?phase=phase2" },
  { group: "After the tour · Farewell Dinner", title: "Post-Tour Survey", phase: "Phase 3", href: "/cft/survey?phase=phase3" },
];

export default function CftHomePage() {
  return <main className="mx-auto min-h-screen max-w-3xl px-5 py-8 sm:px-8">
    <header className="mb-8 border-b border-gray-200 pb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Canton Fair · October 2026</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Share Cards</h1>
      <p className="mt-3 max-w-xl leading-6 text-gray-600">Choose a scenario, then copy its link and share it with the relevant WeChat group. Recipients open the selected form directly.</p>
    </header>
    {["During the tour · Kick-off Breakfast", "After the tour · Farewell Dinner"].map(group => <section key={group} className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">{group}</h2>
      <div className="space-y-3">{cards.filter(c => c.group === group).map(card => <div key={card.href} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-medium text-gray-900">{card.title}</p><p className="mt-1 text-sm text-gray-500">{card.phase}</p></div>
        <Link href={card.href} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900">Open {card.phase} link</Link>
      </div>)}</div>
    </section>)}
    <p className="border-t border-gray-100 pt-4 text-xs leading-5 text-gray-500">Admin page for preparing links. Share the specific form URL with participants, not this page.</p>
  </main>;
}
