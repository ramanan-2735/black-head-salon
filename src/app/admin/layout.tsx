import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: { default: "Owner dashboard", template: "%s — Owner dashboard" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/services", label: "Services" },
] as const;

/** Owner dashboard shell. Demo only in this build. Premium adds a real login. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!config.isDemo) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line bg-ink-900 px-6 py-4 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-display text-xl tracking-[0.08em]">BLACK HEAD · OWNER</p>
            <p className="border-l border-brass-600 pl-3 text-xs tracking-[0.12em] text-brass-300 uppercase">
              Sample data. Demo dashboard with no login. Changes reset when the server restarts.
            </p>
          </div>
          <nav aria-label="Owner dashboard" className="flex gap-6 text-sm">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-bone-300 hover:text-brass-300">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-12 px-6 py-12 md:px-10">{children}</div>
    </div>
  );
}
