import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Gauge } from "lucide-react";

import { Section } from "./Section";

export function CTASection({
  headline = (
    <>
      Ready to put your brand in front of <span className="text-gradient-gold">thousands every day?</span>
    </>
  ),
  subheadline = "Start your next outdoor advertising campaign with Keikol and discover billboard placements built for visibility, credibility, and growth.",
}: {
  headline?: ReactNode;
  subheadline?: string;
}) {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl bg-card-premium p-10 shadow-elegant ring-hairline sm:p-14">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Gauge className="mx-auto h-10 w-10 text-gold" />
          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {headline}
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">{subheadline}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
            >
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              Explore Locations
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
