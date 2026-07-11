import Link from "next/link";
import type { ReactNode } from "react";

/** Mobile-first centered column that every screen renders inside. */
export function AppShell({
  children,
  title,
  subtitle,
  back,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  back?: { href: string; label?: string };
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-6">
      {back && (
        <Link
          href={back.href}
          className="mb-4 text-sm font-semibold text-muted hover:text-ink"
        >
          ← {back.label ?? "Back"}
        </Link>
      )}
      {title && (
        <header className="mb-5">
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}
