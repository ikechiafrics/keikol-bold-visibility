import type { ReactNode } from "react";

export function Section({
  id,
  children,
  tone = "default",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tone?: "default" | "surface";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative py-20 sm:py-28 ${tone === "surface" ? "bg-surface/40" : ""} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">{children}</div>
    </section>
  );
}
