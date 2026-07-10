/** Shared teaching meta-analysis math (not for publication). */

export function num(s: string | number) {
  const v = typeof s === "number" ? s : Number(s);
  return Number.isFinite(v) ? v : NaN;
}

export interface Effect {
  study: string;
  yi: number; // effect on analysis scale (MD, log RR, etc.)
  sei: number;
  label?: string; // back-transformed display
}

export interface PoolResult {
  model: "fixed" | "random";
  k: number;
  pooled: number;
  se: number;
  low: number;
  high: number;
  Q: number;
  df: number;
  I2: number;
  tau2: number;
  effects: {
    study: string;
    yi: number;
    sei: number;
    w: number;
    low: number;
    high: number;
  }[];
}

/** Inverse-variance fixed + DerSimonian–Laird random effects */
export function poolEffects(
  effectsIn: Effect[],
  model: "fixed" | "random"
): PoolResult | null {
  const effects = effectsIn.filter((e) => e.sei > 0 && Number.isFinite(e.yi));
  if (!effects.length) return null;

  const wFixed = effects.map((e) => 1 / (e.sei * e.sei));
  const sumW = wFixed.reduce((a, b) => a + b, 0);
  const fixedYi = effects.reduce((a, e, i) => a + wFixed[i] * e.yi, 0) / sumW;
  const Q = effects.reduce(
    (a, e, i) => a + wFixed[i] * (e.yi - fixedYi) ** 2,
    0
  );
  const df = effects.length - 1;
  const C =
    sumW -
    effects.reduce((a, _, i) => a + wFixed[i] * wFixed[i], 0) / sumW;
  const tau2 =
    df > 0 && C > 0 ? Math.max(0, (Q - df) / C) : 0;
  const I2 = df > 0 && Q > 0 ? Math.max(0, ((Q - df) / Q) * 100) : 0;

  const weights =
    model === "random"
      ? effects.map((e) => 1 / (e.sei * e.sei + tau2))
      : wFixed;
  const sumWr = weights.reduce((a, b) => a + b, 0);
  const pooled =
    effects.reduce((a, e, i) => a + weights[i] * e.yi, 0) / sumWr;
  const se = Math.sqrt(1 / sumWr);

  return {
    model,
    k: effects.length,
    pooled,
    se,
    low: pooled - 1.96 * se,
    high: pooled + 1.96 * se,
    Q,
    df,
    I2,
    tau2,
    effects: effects.map((e, i) => ({
      study: e.study,
      yi: e.yi,
      sei: e.sei,
      w: weights[i],
      low: e.yi - 1.96 * e.sei,
      high: e.yi + 1.96 * e.sei,
    })),
  };
}

/** Hedges' g (bias-corrected SMD) from two arms */
export function hedgesG(
  m1: number,
  sd1: number,
  n1: number,
  m2: number,
  sd2: number,
  n2: number
): { g: number; se: number } | null {
  if (n1 < 2 || n2 < 2 || sd1 <= 0 || sd2 <= 0) return null;
  const sp = Math.sqrt(
    ((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2)
  );
  if (sp <= 0) return null;
  const d = (m1 - m2) / sp;
  const J = 1 - 3 / (4 * (n1 + n2 - 2) - 1);
  const g = J * d;
  // approximate SE of g
  const se = Math.sqrt(
    (n1 + n2) / (n1 * n2) + (g * g) / (2 * (n1 + n2 - 2))
  );
  return { g, se };
}

export function mdEffect(
  m1: number,
  sd1: number,
  n1: number,
  m2: number,
  sd2: number,
  n2: number
): { md: number; se: number } | null {
  if (n1 < 2 || n2 < 2 || sd1 <= 0 || sd2 <= 0) return null;
  const md = m1 - m2;
  const se = Math.sqrt((sd1 * sd1) / n1 + (sd2 * sd2) / n2);
  if (se <= 0) return null;
  return { md, se };
}
