import SourcingForm from "./sourcing-form";
import { normalisePhase } from "@/lib/cft/fair-config";

export const metadata = { title: "Sourcing Requests | Canton Fair October 2026",icons: {
    icon: "/images/CantonFairTours-LOGO.png",
  }, };
export default async function SourcingPage({ searchParams }: { searchParams: Promise<{ phase?: string }> }) {
  const params = await searchParams;
  return <SourcingForm phase={normalisePhase(params.phase)} />;
}
