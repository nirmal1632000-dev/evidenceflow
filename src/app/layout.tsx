import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Onboarding } from "@/components/Onboarding";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EvidenceFlow — Learn evidence methods by doing",
  description:
    "Watch · Do guides for case reports, study designs, and systematic reviews / meta-analysis. Mobile-friendly educational workspace.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('evidenceflow-theme');
    var dark = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <Nav />
          <Onboarding />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500 sm:px-6 dark:text-slate-400">
              <p className="font-medium text-slate-700 dark:text-slate-200">
                EvidenceFlow
              </p>
              <p className="mt-1 max-w-2xl">
                Educational tool for learning clinical evidence methods by doing
                (Watch · Do) — study designs and systematic reviews. Not a
                substitute for methodological expertise, ethics approval, or journal
                requirements. Cite CARE / STROBE / CONSORT / PRISMA / Cochrane / GRADE
                sources as appropriate.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
