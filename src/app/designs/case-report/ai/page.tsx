import { CaseAiDraftStudio } from "@/components/CaseAiDraft";

export const metadata = {
  title: "AI case report draft · EvidenceFlow",
  description:
    "Paste de-identified crude notes and generate an editable CARE-style case report draft for Word or the case track.",
};

export default function CaseReportAiPage() {
  return <CaseAiDraftStudio />;
}
