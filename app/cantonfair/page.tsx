import type { Metadata } from "next";
import ExhibitorDirectory from "./_components/exhibitor-directory";

export const metadata: Metadata = {
  title: "Shunde Exhibitor Directory | Canton Fair October 2026",
  description:
    "Search Shunde exhibitors at the 140th Canton Fair by company, exhibition section, and booth number.",
};

export default function CantonFairDirectoryPage() {
  return <ExhibitorDirectory />;
}
