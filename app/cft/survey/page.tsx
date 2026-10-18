import SurveyForm from "./survey-form";
import { normalisePhase } from "@/lib/cft/fair-config";
export const metadata = { title: "Post-Tour Survey | Canton Fair October 2026" };
export default async function SurveyPage({ searchParams }: { searchParams: Promise<{ phase?: string }> }) {
 const params = await searchParams;
 return <SurveyForm phase={normalisePhase(params.phase)} />;
}
