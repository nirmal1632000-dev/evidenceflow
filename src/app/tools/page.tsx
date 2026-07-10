import Link from "next/link";
import { SOFTWARE_CATALOG, softwareCategories } from "@/lib/software";

export default function ToolsPage() {
  const categories = softwareCategories();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Software learning modules
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        Not just a list of names — each tool is a short module:{" "}
        <strong>what it is for</strong>, <strong>pros &amp; cons</strong>,{" "}
        <strong>when and how to use it</strong> in a systematic review, pitfalls, and
        key references. EvidenceFlow remains your guided hub; these tools do specialised
        jobs (search, screening, analysis, GRADE).
      </p>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Core search sources (health intervention / RCTs):</strong>{" "}
          <Link href="/tools/software/pubmed" className="underline">
            PubMed/MEDLINE
          </Link>
          {" · "}
          <Link href="/tools/software/embase" className="underline">
            Embase
          </Link>
          {" · "}
          <Link href="/tools/software/cochrane-library" className="underline">
            CENTRAL
          </Link>
          {" · "}
          <Link href="/tools/software/clinicaltrials-gov" className="underline">
            ClinicalTrials.gov + ICTRP
          </Link>
          {" · topic DB as needed ("}
          <Link href="/tools/software/psycinfo" className="underline">
            PsycINFO
          </Link>
          {" / "}
          <Link href="/tools/software/cinahl" className="underline">
            CINAHL
          </Link>
          {") · "}
          <Link href="/tools/software/citationchaser" className="underline">
            citation chasing
          </Link>
          . Not{" "}
          <Link href="/tools/software/google-scholar" className="underline">
            Google Scholar alone
          </Link>
          .
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
          <strong>Starter workflow stack:</strong>{" "}
          <Link href="/tools/software/zotero" className="underline">
            Zotero
          </Link>{" "}
          →{" "}
          <Link href="/tools/software/rayyan" className="underline">
            Rayyan
          </Link>{" "}
          →{" "}
          <Link href="/tools/software/spreadsheets" className="underline">
            Sheets
          </Link>{" "}
          →{" "}
          <Link href="/tools/software/rob2" className="underline">
            RoB 2
          </Link>
          {" / "}
          <Link href="/tools/software/robins-i" className="underline">
            ROBINS-I
          </Link>{" "}
          +{" "}
          <Link href="/tools/software/robvis" className="underline">
            robvis
          </Link>{" "}
          →{" "}
          <Link href="/tools/software/revman" className="underline">
            RevMan
          </Link>{" "}
          or{" "}
          <Link href="/tools/software/r-metafor" className="underline">
            R metafor
          </Link>{" "}
          →{" "}
          <Link href="/tools/software/gradepro" className="underline">
            GRADEpro
          </Link>{" "}
          →{" "}
          <Link href="/tools/software/prisma" className="underline">
            PRISMA
          </Link>
          .
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Link
          href="/tools/calculator"
          className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950 hover:bg-teal-100"
        >
          <span>
            <strong>In-app MA calculators</strong>
            <span className="mt-0.5 block text-teal-900/80">
              Teaching only · MD / SMD · RR / OR · fixed or random (DL)
            </span>
          </span>
          <span className="font-semibold">Open →</span>
        </Link>
        <Link
          href="/tools/sensitivity"
          className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-950 hover:bg-indigo-100"
        >
          <span>
            <strong>Sensitivity &amp; funnel tools</strong>
            <span className="mt-0.5 block text-indigo-900/80">
              Leave-one-out · simple funnel sketch (teaching)
            </span>
          </span>
          <span className="font-semibold">Open →</span>
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <strong className="text-slate-900 dark:text-slate-100">How to study these modules:</strong>{" "}
        read pros/cons → follow “how to use” on a toy dataset → note pitfalls in your
        protocol → log the tool choice in the matching EvidenceFlow stage.
      </div>

      {categories.map((cat) => (
        <section key={cat} className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {cat}
          </h2>
          <ul className="mt-3 space-y-3">
            {SOFTWARE_CATALOG.filter((s) => s.category === cat).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/tools/software/${s.slug}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-700"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-slate-900 dark:text-slate-50">
                      {s.name}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        s.free
                          ? "bg-teal-50 text-teal-800"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {s.free ? "Free / freemium" : "Paid"}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-slate-400">
                      Module
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {s.bestFor}
                  </p>
                  <p className="mt-2 text-xs text-teal-700 dark:text-teal-300">
                    Pros · cons · workflow · pitfalls · references →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
