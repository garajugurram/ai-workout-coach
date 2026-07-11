import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Panel card used across screens. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-panel-2 p-3.5 ${className}`}
    >
      {children}
    </div>
  );
}

/** Primary / ghost / hot call-to-action, rendered as a link. */
export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "hot";
  className?: string;
}) {
  return (
    <Link href={href} className={`${btnClass(variant)} ${className}`}>
      {children}
    </Link>
  );
}

/** Primary / ghost / hot submit or action button. */
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "ghost" | "hot" }) {
  return (
    <button className={`${btnClass(variant)} ${className}`} {...props}>
      {children}
    </button>
  );
}

function btnClass(variant: "primary" | "ghost" | "hot") {
  const base =
    "block w-full rounded-xl px-4 py-3 text-center text-sm font-extrabold transition disabled:opacity-50";
  if (variant === "ghost")
    return `${base} border border-line bg-transparent text-ink hover:border-accent`;
  if (variant === "hot")
    return `${base} bg-linear-to-r from-hot to-[#ff8a5d] text-white`;
  return `${base} bg-accent text-white hover:opacity-90`;
}

/** Labelled field group. */
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel-2 p-3.5">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-dim">
        {label}
      </div>
      {children}
    </div>
  );
}

/** Coloured type pill (strength / cardio / mobility etc.). */
export function Pill({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: "hot" | "accent-2" | "accent";
}) {
  const tones: Record<string, string> = {
    hot: "bg-hot/15 text-hot",
    "accent-2": "bg-accent-2/15 text-accent-2",
    accent: "bg-accent/20 text-[#b3a2ff]",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9.5px] font-extrabold tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
