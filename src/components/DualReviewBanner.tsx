"use client";

const TIPS: Record<string, string> = {
  question:
    "Agree PICO wording with both reviewers before search — misaligned questions cause screening chaos later.",
  eligibility:
    "Pilot eligibility on 20–50 titles together. High disagreement → criteria are still too vague.",
  protocol:
    "Pre-specify dual processes: independent screen, independent extract for outcomes, independent RoB, named conflict resolver.",
  search:
    "One person may draft the search; a second (ideally a librarian) should PRESS-review before the final run.",
  screening:
    "Dual independent title/abstract and full-text screening is the gold standard. Log conflicts and resolution rules.",
  extraction:
    "Dual-extract effect sizes and N’s; single extract for simple descriptive fields with spot checks is a common compromise.",
  rob: "Two reviewers rate RoB independently; discuss domain-level disagreements with quotes from the paper.",
  synthesis:
    "Decide together whether pooling is clinically sensible — do not leave this only to the statistician after the fact.",
  metaanalysis:
    "Analyst runs models; a second person checks data entry against extraction sheets and forest-plot direction.",
  grade:
    "GRADE judgments benefit from dual discussion — especially imprecision and risk of bias downgrades.",
  reporting:
    "Both reviewers should verify PRISMA numbers and that conclusions match certainty language.",
};

export function DualReviewBanner({ stageId }: { stageId: string }) {
  const tip = TIPS[stageId] || TIPS.protocol;
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">Dual-review guidance</p>
      <p className="mt-1 text-amber-950/90">{tip}</p>
    </div>
  );
}
