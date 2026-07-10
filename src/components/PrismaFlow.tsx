"use client";

type Counts = {
  identified?: number | string;
  duplicates?: number | string;
  titleAbstractScreened?: number | string;
  fullTextAssessed?: number | string;
  included?: number | string;
};

function n(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)))
    return Number(v);
  return null;
}

function Box({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-center shadow-sm ${
        accent
          ? "border-teal-500 bg-teal-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      {sub && <p className="text-[10px] text-slate-500">{sub}</p>}
    </div>
  );
}

export function PrismaFlow({ data }: { data: Counts }) {
  const identified = n(data.identified);
  const duplicates = n(data.duplicates);
  const screened = n(data.titleAbstractScreened);
  const fullText = n(data.fullTextAssessed);
  const included = n(data.included);

  const afterDedupe =
    identified != null && duplicates != null
      ? Math.max(0, identified - duplicates)
      : null;

  const excludedTiAb =
    screened != null && fullText != null
      ? Math.max(0, screened - fullText)
      : screened != null && afterDedupe != null && fullText == null
        ? null
        : screened != null && fullText != null
          ? Math.max(0, screened - fullText)
          : null;

  // Prefer: screened should equal afterDedupe in ideal PRISMA; we show both
  const tiAbExcluded =
    screened != null && fullText != null
      ? Math.max(0, screened - fullText)
      : null;

  const ftExcluded =
    fullText != null && included != null
      ? Math.max(0, fullText - included)
      : null;

  const hasAny =
    identified != null ||
    duplicates != null ||
    screened != null ||
    fullText != null ||
    included != null;

  if (!hasAny) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Enter PRISMA counts in the form (identified, duplicates, screened,
        full text, included) to preview the flow diagram.
      </div>
    );
  }

  const fmt = (v: number | null) => (v == null ? "—" : String(v));

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <h3 className="text-sm font-semibold text-slate-900">
        PRISMA flow preview
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Auto-calculated from your screening numbers. Verify against Rayyan/Covidence
        exports before publication.
      </p>

      <div className="mt-4 flex flex-col items-stretch gap-2 sm:mx-auto sm:max-w-sm">
        <Box
          label="Records identified"
          value={fmt(identified)}
          sub="All databases / sources"
        />
        <Arrow />
        <Box
          label="Duplicates removed"
          value={fmt(duplicates)}
          sub={
            afterDedupe != null
              ? `${afterDedupe} after de-duplication`
              : undefined
          }
        />
        <Arrow />
        <Box
          label="Title/abstract screened"
          value={fmt(screened)}
          sub={
            tiAbExcluded != null
              ? `${tiAbExcluded} excluded at title/abstract`
              : undefined
          }
        />
        <Arrow />
        <Box
          label="Full texts assessed"
          value={fmt(fullText)}
          sub={
            ftExcluded != null
              ? `${ftExcluded} excluded at full text`
              : undefined
          }
        />
        <Arrow />
        <Box
          label="Studies included"
          value={fmt(included)}
          accent
          sub="In qualitative and/or quantitative synthesis"
        />
      </div>

      {excludedTiAb != null && excludedTiAb === 0 && screened != null && fullText != null && screened > 0 && (
        <p className="mt-3 text-xs text-amber-800">
          Tip: if full-text count equals title/abstract screened, confirm that is
          intentional (unusual for large searches).
        </p>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center text-slate-300" aria-hidden>
      ↓
    </div>
  );
}
