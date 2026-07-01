import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { Billboard } from "@/data/billboards";

// Fix default Leaflet marker asset paths (Vite bundles break the defaults).
const iconRetina = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const iconUrl = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png";

function makeIcon(color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='34' height='46' viewBox='0 0 34 46'>
    <defs><filter id='s' x='-50%' y='-50%' width='200%' height='200%'><feDropShadow dx='0' dy='2' stdDeviation='1.5' flood-opacity='0.4'/></filter></defs>
    <path filter='url(#s)' d='M17 1C8.7 1 2 7.7 2 16c0 11 15 29 15 29s15-18 15-29C32 7.7 25.3 1 17 1z' fill='${color}' stroke='#0b0b12' stroke-width='1.5'/>
    <circle cx='17' cy='16' r='6' fill='#0b0b12'/>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    iconSize: [34, 46],
    iconAnchor: [17, 44],
    popupAnchor: [0, -40],
  });
}
// Reference defaults so bundler keeps them as valid URLs even if unused directly.
void iconRetina; void iconUrl; void shadowUrl;

const ICONS = {
  Available: makeIcon("#F4C430"),
  "Available Soon": makeIcon("#60A5FA"),
  "Coming Soon": makeIcon("#9CA3AF"),
  Selected: makeIcon("#22D3EE"),
};

function FitBounds({ billboards, selectedId }: { billboards: Billboard[]; selectedId: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedId) {
      const b = billboards.find((x) => x.id === selectedId);
      if (b) map.flyTo([b.coordinates.lat, b.coordinates.lng], 12, { duration: 0.8 });
      return;
    }
    if (billboards.length === 0) return;
    if (billboards.length === 1) {
      const b = billboards[0];
      map.flyTo([b.coordinates.lat, b.coordinates.lng], 10, { duration: 0.6 });
      return;
    }
    const bounds = L.latLngBounds(billboards.map((b) => [b.coordinates.lat, b.coordinates.lng]));
    map.flyToBounds(bounds, { padding: [40, 40], duration: 0.6 });
  }, [map, billboards, selectedId]);
  return null;
}

export function BillboardMap({
  billboards,
  selectedId,
  onSelect,
}: {
  billboards: Billboard[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <MapContainer
      center={[9.082, 8.6753]}
      zoom={6}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#e5e7eb" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {billboards.map((b) => (
        <Marker
          key={b.id}
          position={[b.coordinates.lat, b.coordinates.lng]}
          icon={selectedId === b.id ? ICONS.Selected : ICONS[b.availability]}
          eventHandlers={{ click: () => onSelect(b.id) }}
        />
      ))}
      <FitBounds billboards={billboards} selectedId={selectedId} />
    </MapContainer>
  );
}

export default BillboardMap;
