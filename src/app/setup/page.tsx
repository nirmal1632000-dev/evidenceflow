import Link from "next/link";

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Enable multi-device team reviews
      </h1>
      <p className="mt-2 text-slate-600">
        EvidenceFlow uses a free{" "}
        <a
          href="https://supabase.com"
          className="text-teal-700 underline"
          target="_blank"
          rel="noreferrer"
        >
          Supabase
        </a>{" "}
        project for auth + shared project storage. About 10 minutes once.
      </p>

      <ol className="mt-8 list-decimal space-y-6 pl-5 text-slate-700">
        <li>
          <strong className="text-slate-900">Create a Supabase project</strong>
          <p className="mt-1 text-sm">
            Dashboard → New project → pick a password and region. Wait until it is ready.
          </p>
        </li>
        <li>
          <strong className="text-slate-900">Run the database schema</strong>
          <p className="mt-1 text-sm">
            SQL Editor → New query → paste everything from{" "}
            <code className="rounded bg-slate-100 px-1">supabase/schema.sql</code> in
            this repo → Run.
          </p>
        </li>
        <li>
          <strong className="text-slate-900">Copy API keys</strong>
          <p className="mt-1 text-sm">
            Project Settings → API → copy <em>Project URL</em> and{" "}
            <em>anon public</em> key.
          </p>
        </li>
        <li>
          <strong className="text-slate-900">Local env</strong>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`# .env.local in evidenceflow folder
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}
          </pre>
        </li>
        <li>
          <strong className="text-slate-900">Vercel (public site)</strong>
          <p className="mt-1 text-sm">
            Vercel project → Settings → Environment Variables → add the same two{" "}
            <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_*</code> vars for
            Production → Redeploy.
          </p>
        </li>
        <li>
          <strong className="text-slate-900">Auth URLs in Supabase</strong>
          <p className="mt-1 text-sm">
            Authentication → URL Configuration:
          </p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            <li>
              Site URL:{" "}
              <code className="rounded bg-slate-100 px-1">
                https://evidenceflow-iota.vercel.app
              </code>
            </li>
            <li>
              Redirect URLs include:
              <br />
              <code className="rounded bg-slate-100 px-1">
                https://evidenceflow-iota.vercel.app/auth/callback
              </code>
              <br />
              <code className="rounded bg-slate-100 px-1">
                http://localhost:3000/auth/callback
              </code>
            </li>
          </ul>
        </li>
        <li>
          <strong className="text-slate-900">Optional: disable email confirm for testing</strong>
          <p className="mt-1 text-sm">
            Authentication → Providers → Email → turn off “Confirm email” while you
            test (turn back on for public use).
          </p>
        </li>
        <li>
          <strong className="text-slate-900">Optional: enable Realtime (faster team sync)</strong>
          <p className="mt-1 text-sm">
            SQL Editor → run:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`alter publication supabase_realtime add table public.stage_data;
alter publication supabase_realtime add table public.project_activity;
alter publication supabase_realtime add table public.projects;`}
          </pre>
          <p className="mt-1 text-sm text-slate-500">
            Ignore errors if a table is already added. Without this, the app still
            polls every ~30s.
          </p>
        </li>
      </ol>

      <div className="mt-10 rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm text-teal-950">
        <p className="font-semibold">How team collaboration works after setup</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Each person creates an account and signs in.</li>
          <li>Owner creates a <strong>Team project</strong> (cloud).</li>
          <li>Share the 8-character <strong>invite code</strong>.</li>
          <li>Collaborators click Join with code → same review, live-synced stages.</li>
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/auth"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Go to sign in
        </Link>
        <Link
          href="/workspace"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Local workspace
        </Link>
      </div>
    </div>
  );
}
