import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search, MapPin, Filter, Eye, Ruler, Calendar as CalIcon,
  ChevronLeft, ChevronRight, X, ArrowRight, Landmark,
} from "lucide-react";

import { PageHero, Section } from "@/components";
import {
  BILLBOARDS, CITIES, BILLBOARD_TYPES, AVAILABILITIES, SIZE_CATEGORIES, PRICE_TIERS,
  heroImg, type Billboard,
} from "@/data/billboards";

// Load Leaflet CSS on this route only.
export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title: "Billboard Explorer — Interactive Map | Keikol" },
      {
        name: "description",
        content:
          "Explore Keikol's billboard inventory across Nigeria on an interactive map. Filter by city, price, size, type, and availability, and view traffic estimates, photos, and open dates.",
      },
      { property: "og:title", content: "Billboard Explorer — Interactive Map | Keikol" },
      {
        property: "og:description",
        content: "Interactive map, filters, traffic estimates, photos, and availability calendar for Keikol billboards.",
      },
      { property: "og:url", content: "/explorer" },
      { property: "og:image", content: heroImg },
    ],
    links: [
      { rel: "canonical", href: "/explorer" },
      { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" },
    ],
  }),
  component: ExplorerPage,
});

// Client-only map component (Leaflet touches window on mount).
const BillboardMap = lazy(() => import("@/components/BillboardMap"));

const PRICE_MIN = 0;
const PRICE_MAX = 15_000_000;

function formatNGN(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n}`;
}

function ExplorerPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState<(typeof CITIES)[number]>("All");
  const [type, setType] = useState<(typeof BILLBOARD_TYPES)[number]>("All");
  const [avail, setAvail] = useState<(typeof AVAILABILITIES)[number]>("All");
  const [size, setSize] = useState<(typeof SIZE_CATEGORIES)[number]>("All");
  const [tier, setTier] = useState<(typeof PRICE_TIERS)[number]>("All");
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    return BILLBOARDS.filter((b) => {
      if (city !== "All" && b.city !== city) return false;
      if (type !== "All" && b.billboardType !== type) return false;
      if (avail !== "All" && b.availability !== avail) return false;
      if (size !== "All" && b.sizeCategory !== size) return false;
      if (tier !== "All" && b.priceTier !== tier) return false;
      if (b.priceMonthlyNGN > maxPrice) return false;
      if (q) {
        const t = q.toLowerCase();
        if (
          !b.city.toLowerCase().includes(t) &&
          !b.area.toLowerCase().includes(t) &&
          !b.landmark.toLowerCase().includes(t) &&
          !b.nearbyLandmarks.some((l) => l.toLowerCase().includes(t))
        )
          return false;
      }
      return true;
    });
  }, [q, city, type, avail, size, tier, maxPrice]);

  const selected = selectedId ? BILLBOARDS.find((b) => b.id === selectedId) ?? null : null;

  const activeFilters =
    (q ? 1 : 0) +
    (city !== "All" ? 1 : 0) +
    (type !== "All" ? 1 : 0) +
    (avail !== "All" ? 1 : 0) +
    (size !== "All" ? 1 : 0) +
    (tier !== "All" ? 1 : 0) +
    (maxPrice !== PRICE_MAX ? 1 : 0);

  function clearFilters() {
    setQ(""); setCity("All"); setType("All"); setAvail("All");
    setSize("All"); setTier("All"); setMaxPrice(PRICE_MAX);
  }

  return (
    <>
      <PageHero
        eyebrow="Interactive Explorer"
        title={<>Find your next <span className="text-gradient-gold">billboard placement</span> in seconds.</>}
        subtitle="Explore Keikol's inventory on an interactive map. Filter by city, budget, size, type, and availability — then view traffic estimates, photos, and open dates."
        image={heroImg}
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Filter sidebar */}
          <aside className="rounded-2xl bg-card-premium p-5 shadow-elegant ring-hairline lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Filter className="h-4 w-4 text-gold" /> Filters
                {activeFilters > 0 && (
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold">
                    {activeFilters}
                  </span>
                )}
              </div>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="text-xs font-semibold text-gold hover:underline">
                  Clear
                </button>
              )}
            </div>

            <label className="relative mt-4 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search area, road, landmark…"
                className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-9 pr-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </label>

            <FilterGroup label="City">
              <ChipRow value={city} onChange={setCity} options={CITIES} />
            </FilterGroup>
            <FilterGroup label="Billboard Type">
              <ChipRow value={type} onChange={setType} options={BILLBOARD_TYPES} short />
            </FilterGroup>
            <FilterGroup label="Availability">
              <ChipRow value={avail} onChange={setAvail} options={AVAILABILITIES} />
            </FilterGroup>
            <FilterGroup label="Size">
              <ChipRow value={size} onChange={setSize} options={SIZE_CATEGORIES} />
            </FilterGroup>
            <FilterGroup label="Price Tier">
              <ChipRow value={tier} onChange={setTier} options={PRICE_TIERS} />
            </FilterGroup>
            <FilterGroup label={`Max monthly budget · ${formatNGN(maxPrice)}`}>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={500_000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[color:var(--color-gold)]"
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>{formatNGN(PRICE_MIN)}</span><span>{formatNGN(PRICE_MAX)}</span>
              </div>
            </FilterGroup>

            <div className="mt-5 rounded-xl bg-surface/60 p-3 text-xs text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filtered.length}</span> of {BILLBOARDS.length} billboards.
            </div>
          </aside>

          {/* Map + results */}
          <div className="flex flex-col gap-6">
            <div className="relative h-[520px] overflow-hidden rounded-2xl bg-card-premium shadow-elegant ring-hairline">
              {mounted ? (
                <Suspense fallback={<MapPlaceholder />}>
                  <BillboardMap billboards={filtered} selectedId={selectedId} onSelect={setSelectedId} />
                </Suspense>
              ) : (
                <MapPlaceholder />
              )}
              <div className="pointer-events-none absolute left-3 top-3 z-[500] flex flex-wrap gap-1.5">
                <Legend color="#F4C430" label="Available" />
                <Legend color="#60A5FA" label="Available Soon" />
                <Legend color="#9CA3AF" label="Coming Soon" />
              </div>
            </div>

            {/* Results grid — compact horizontal cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((b) => (
                <ResultCard
                  key={b.id}
                  b={b}
                  active={selectedId === b.id}
                  onClick={() => setSelectedId(b.id)}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full rounded-2xl border border-border bg-surface/40 p-10 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 font-display font-bold">No billboards match your filters</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold"
                  >
                    Clear filters <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {selected && <DetailDrawer billboard={selected} onClose={() => setSelectedId(null)} />}
    </>
  );
}

/* ---------- Sub-components ---------- */

function MapPlaceholder() {
  return (
    <div className="grid h-full w-full place-items-center bg-background/80">
      <div className="text-center text-muted-foreground">
        <MapPin className="mx-auto h-8 w-8 animate-pulse text-gold" />
        <p className="mt-2 text-sm">Loading interactive map…</p>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background/85 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ChipRow<T extends string>({
  value, onChange, options, short = false,
}: {
  value: T; onChange: (v: T) => void; options: readonly T[]; short?: boolean;
}) {
  const shorten = (s: string) => short ? s.replace(" Billboard", "") : s;
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
            value === o
              ? "border-gold bg-gold text-primary-foreground"
              : "border-border bg-surface/60 text-muted-foreground hover:border-gold/60 hover:text-foreground"
          }`}
        >
          {shorten(o)}
        </button>
      ))}
    </div>
  );
}

function ResultCard({ b, active, onClick }: { b: Billboard; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-stretch gap-3 overflow-hidden rounded-xl bg-card-premium p-2 text-left shadow-elegant ring-hairline transition-all hover:-translate-y-0.5 hover:shadow-glow ${
        active ? "outline outline-2 outline-gold" : ""
      }`}
    >
      <img src={b.image} alt={b.area} className="h-24 w-28 flex-none rounded-lg object-cover" />
      <div className="flex flex-1 flex-col justify-between py-1 pr-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold">{b.city}</p>
          <p className="font-display text-sm font-bold leading-tight">{b.area}</p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{b.billboardType} · {b.size}</p>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3 text-accent" />{b.estimatedDailyImpressions}</span>
          <span className="font-bold text-gold">{b.priceTier}</span>
        </div>
      </div>
    </button>
  );
}

/* ---------- Detail Drawer ---------- */

function DetailDrawer({ billboard: b, onClose }: { billboard: Billboard; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setImgIdx(0);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [b.id, onClose]);

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      <button
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-background shadow-2xl ring-1 ring-border">
        {/* Gallery */}
        <div className="relative aspect-[16/10] w-full flex-none bg-surface">
          <img src={b.gallery[imgIdx]} alt={`${b.area} — photo ${imgIdx + 1}`} className="h-full w-full object-cover" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur hover:bg-background"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          {b.gallery.length > 1 && (
            <>
              <button
                onClick={() => setImgIdx((i) => (i - 1 + b.gallery.length) % b.gallery.length)}
                className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 backdrop-blur"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % b.gallery.length)}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/80 backdrop-blur"
                aria-label="Next photo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {b.gallery.map((_, i) => (
                  <span key={i} className={`h-1.5 w-6 rounded-full ${i === imgIdx ? "bg-gold" : "bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur">
            {b.availability}
          </span>
        </div>

        <div className="flex-1 space-y-6 p-6">
          <header>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">{b.city}</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold">{b.area}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {b.landmark}
            </p>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-card-premium p-3 ring-hairline">
            <Stat icon={Eye} label="Daily traffic" value={b.estimatedDailyImpressions} />
            <Stat icon={Ruler} label="Size" value={b.size} />
            <Stat label="Price tier" value={b.priceTier} valueClass="text-gold" />
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>

          {/* Availability calendar */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-bold">
              <CalIcon className="h-4 w-4 text-gold" /> Availability calendar
            </h3>
            <AvailabilityCalendar bookedDates={b.bookedDates} />
            <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-accent" /> Open</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-muted" /> Booked</span>
            </div>
          </div>

          {/* Nearby landmarks */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-bold">
              <Landmark className="h-4 w-4 text-gold" /> Nearby landmarks
            </h3>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {b.nearbyLandmarks.map((l) => (
                <li key={l} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="font-display text-sm font-bold">Recommended for</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {b.recommendedIndustries.map((i) => (
                <span key={i} className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-muted-foreground">
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="sticky bottom-0 -mx-6 -mb-6 grid grid-cols-2 gap-2 border-t border-border bg-background/95 p-4 backdrop-blur">
            <Link
              to="/locations/$id"
              params={{ id: b.id }}
              className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-3 text-sm font-semibold hover:border-gold hover:text-gold"
            >
              View full details
            </Link>
            <Link
              to="/contact"
              search={{ billboard: b.id }}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-gold px-3 py-3 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              Request quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ icon: Icon, label, value, valueClass = "" }: {
  icon?: typeof Eye; label: string; value: string; valueClass?: string;
}) {
  return (
    <div className="text-center">
      <p className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </p>
      <p className={`mt-1 font-display text-sm font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

/* ---------- Availability calendar ---------- */

function AvailabilityCalendar({ bookedDates }: { bookedDates: string[] }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const base = new Date(Date.UTC(2026, 6, 1)); // Jul 2026
  const view = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + monthOffset, 1));
  const year = view.getUTCFullYear();
  const month = view.getUTCMonth();
  const monthName = view.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const bookedSet = new Set(bookedDates);

  const cells: Array<{ date?: number; iso?: string; booked?: boolean }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({});
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date: d, iso, booked: bookedSet.has(iso) });
  }

  return (
    <div className="mt-2 rounded-xl border border-border bg-surface/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
          disabled={monthOffset === 0}
          className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-40"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="font-display text-sm font-bold">{monthName}</span>
        <button
          onClick={() => setMonthOffset((m) => Math.min(3, m + 1))}
          disabled={monthOffset === 3}
          className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-40"
          aria-label="Next month"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted-foreground">
        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((c, i) => (
          <div
            key={i}
            className={`grid aspect-square place-items-center rounded-md text-[11px] font-semibold ${
              !c.date
                ? ""
                : c.booked
                  ? "bg-muted/40 text-muted-foreground line-through"
                  : "bg-accent/15 text-accent"
            }`}
          >
            {c.date ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}
