import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera } from "lucide-react";

export const Route = createFileRoute("/photographers")({
  head: () => ({
    meta: [
      { title: "Photography & Videography — Keikol" },
      {
        name: "description",
        content:
          "A curated directory of vetted photographers and videographers, matched to your brand, budget, and shoot.",
      },
      { property: "og:title", content: "Photography & Videography — Keikol" },
      {
        property: "og:description",
        content:
          "A curated directory of vetted photographers and videographers, matched to your brand, budget, and shoot.",
      },
    ],
  }),
  component: PhotographersPage,
});

function PhotographersPage() {
  return (
    <section className="relative isolate overflow-hidden bg-hero pt-32 lg:pt-40">
      <div className="mx-auto max-w-3xl px-5 pb-32 text-center lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <Camera className="h-3.5 w-3.5 text-gold" />
          Coming soon
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          A curated network of{" "}
          <span className="text-gradient-gold">photographers & videographers.</span>
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          We're onboarding vetted creators across Nigeria — matched to your brand,
          budget, and shoot type. Get in touch to be first in line when the
          directory opens.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
          >
            Talk to us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
