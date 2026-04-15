"use client";

const zones = [
  { name: "Chittoor",       rating: 5.0, customers: 2   },
  { name: "Jalgaon",        rating: 5.0, customers: 1   },
  { name: "Kolhapur",       rating: 5.0, customers: 1   },
  { name: "Latur",          rating: 5.0, customers: 10  },
  { name: "Kolar",          rating: 5.0, customers: 1   },
  { name: "Dharashiv",      rating: 5.0, customers: 87  },
  { name: "Satara",         rating: 5.0, customers: 56  },
  { name: "Yavatmal",       rating: 5.0, customers: 1   },
  { name: "Anantapur",      rating: 5.0, customers: 1   },
  { name: "Jalna",          rating: 5.0, customers: 91  },
  { name: "Kadapa",         rating: 5.0, customers: 1   },
  { name: "Hassan",         rating: 5.0, customers: 1   },
  { name: "Srikakulam",     rating: 5.0, customers: 2   },
  { name: "Gadag",          rating: 5.0, customers: 1   },
  { name: "Davanagere",     rating: 5.0, customers: 2   },
  { name: "Chikkaballapur", rating: 5.0, customers: 2   },
  { name: "Bijapur (KA)",   rating: 5.0, customers: 5   },
  { name: "Buldhana",       rating: 5.0, customers: 4   },
  { name: "Kachchh",        rating: 4.9, customers: 23  },
  { name: "Sangli",         rating: 4.9, customers: 560 },
  { name: "Beed",           rating: 4.9, customers: 13  },
  { name: "Solapur",        rating: 4.8, customers: 358 },
  { name: "Ahilyanagar",    rating: 4.8, customers: 270 },
  { name: "CS Nagar",       rating: 4.8, customers: 131 },
  { name: "South Goa",      rating: 4.7, customers: 2   },
  { name: "Pune",           rating: 4.7, customers: 121 },
  { name: "Jalor",          rating: 4.6, customers: 35  },
  { name: "Chitradurga",    rating: 4.5, customers: 2   },
  { name: "Bagalkot",       rating: 4.5, customers: 7   },
  { name: "Bellary",        rating: 4.4, customers: 20  },
  { name: "Nashik",         rating: 4.4, customers: 263 },
  { name: "Nalgonda",       rating: 4.0, customers: 1   },
  { name: "Firozpur",       rating: 4.0, customers: 1   },
  { name: "Bangalore Rural",rating: 3.3, customers: 1   },
  { name: "Koppal",         rating: 3.0, customers: 4   },
  { name: "Belgaum",        rating: 1.0, customers: 1   },
];

function ratingBadge(r: number): { bg: string; color: string; label: string } {
  if (r >= 4.5) return { bg: "#f0fdf4", color: "#16a34a", label: "Excellent" };
  if (r >= 4.0) return { bg: "#fffbeb", color: "#d97706", label: "Good" };
  if (r >= 3.0) return { bg: "#fff7ed", color: "#ea580c", label: "Average" };
  return { bg: "#fef2f2", color: "#dc2626", label: "Poor" };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ color: rating >= s - 0.4 ? "#fbbf24" : "#e5e7eb", fontSize: 13, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

export default function ZoneRatings() {
  return (
    <div className="rounded-xl p-6" style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-black" style={{ color: "#111827" }}>Average Zone-wise Rating</h2>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{zones.length} zones · customer satisfaction scores</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}>
          ★ Avg 4.7
        </span>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}>
        {zones.map((z) => {
          const badge = ratingBadge(z.rating);
          return (
            <div
              key={z.name}
              className="rounded-xl p-3 flex flex-col gap-2 cursor-default transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ border: "1px solid #f3f4f6", background: "#fafafa" }}
            >
              <Stars rating={z.rating} />
              <div className="flex items-center justify-between">
                <span className="text-xl font-black" style={{ color: "#111827" }}>{z.rating.toFixed(1)}</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
              </div>
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 6 }}>
                <p className="text-xs font-semibold truncate" style={{ color: "#374151" }}>{z.name}</p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>{z.customers} {z.customers === 1 ? "customer" : "customers"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}