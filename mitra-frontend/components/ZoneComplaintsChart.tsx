"use client";

const data = [
  { zone: "Jaipur",        complaints: 4800 },
  { zone: "Adilabad",      complaints: 3900 },
  { zone: "Hyderabad",     complaints: 3400 },
  { zone: "Rajgarh",       complaints: 3100 },
  { zone: "Ariyalur",      complaints: 2700 },
  { zone: "Jodhpur",       complaints: 2200 },
  { zone: "Akola",         complaints: 1800 },
  { zone: "Kurukshetra",   complaints: 1400 },
  { zone: "Mandya",        complaints: 1300 },
  { zone: "Patan",         complaints: 1200 },
  { zone: "Bhilwara",      complaints: 1150 },
  { zone: "Jalandhar",     complaints: 1100 },
  { zone: "Shopian",       complaints: 1050 },
  { zone: "Amravati",      complaints: 1000 },
  { zone: "Yavatmal",      complaints: 950  },
  { zone: "Ratlam",        complaints: 900  },
  { zone: "Yadgir",        complaints: 860  },
  { zone: "Ahmedabad",     complaints: 820  },
  { zone: "Bundi",         complaints: 780  },
  { zone: "Dindigul",      complaints: 740  },
  { zone: "Dhule",         complaints: 700  },
  { zone: "Prakasam",      complaints: 660  },
  { zone: "Gulbarga",      complaints: 630  },
  { zone: "Parbhani",      complaints: 610  },
  { zone: "Srikakulam",    complaints: 590  },
  { zone: "Banaskantha",   complaints: 570  },
  { zone: "Belgaum",       complaints: 560  },
  { zone: "Nizamabad",     complaints: 540  },
  { zone: "Erode",         complaints: 530  },
  { zone: "Porbandar",     complaints: 520  },
];

const MAX   = 5200;
const STEPS = [0, 1000, 2000, 3000, 4000, 5000];
const H     = 240;

const COLORS = [
  "#6366f1","#8b5cf6","#0ea5e9","#14b8a6","#f59e0b",
  "#f97316","#f43f5e","#ec4899","#a855f7","#06b6d4",
  "#10b981","#84cc16","#eab308","#ef4444","#3b82f6",
  "#8b5cf6","#0891b2","#059669","#d97706","#dc2626",
  "#7c3aed","#0284c7","#047857","#b45309","#b91c1c",
  "#6d28d9","#0369a1","#065f46","#92400e","#991b1b",
];

export default function ZoneComplaintsChart() {
  return (
    <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #e8ecf0" }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-black" style={{ color: "#111827" }}>Zone-wise Complaints</h2>
          <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>Top 30 zones by complaint volume</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe" }}>Top 30</span>
      </div>

      <div className="flex gap-3">
        {/* Y axis */}
        <div className="flex flex-col justify-between items-end shrink-0 pb-14" style={{ height: H + 56 }}>
          {[...STEPS].reverse().map((v) => (
            <span key={v} style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>
              {v === 0 ? "0" : `${v / 1000}k`}
            </span>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {/* Chart */}
          <div className="relative" style={{ height: H }}>
            {STEPS.map((_, i) => (
              <div key={i} className="absolute w-full"
                style={{ bottom: `${(i / (STEPS.length - 1)) * 100}%`, borderTop: i === 0 ? "1px solid #e2e8f0" : "1px dashed #f1f5f9" }} />
            ))}
            <div className="absolute inset-0 flex items-end gap-1 px-0.5">
              {data.map((d, i) => {
                const pct = (d.complaints / MAX) * 100;
                const color = COLORS[i % COLORS.length];
                return (
                  <div key={d.zone} className="flex-1 group relative"
                    style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div className="w-full rounded-t-md relative"
                      style={{ height: `${pct}%`, background: color, minHeight: 3, opacity: 0.85 }}>
                      <div
                        className="absolute -top-8 left-1/2 text-white text-xs font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                        style={{ transform: "translateX(-50%)", background: color, fontSize: 9 }}>
                        {d.complaints.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X labels */}
          <div className="flex gap-1 px-0.5 mt-1">
            {data.map((d) => (
              <div key={d.zone} className="flex-1 flex justify-center">
                <span style={{ fontSize: 8, color: "#374151", writingMode: "vertical-lr", transform: "rotate(180deg)", height: 52, fontWeight: 600 }}>
                  {d.zone}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend dots */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
        {data.map((d, i) => (
          <div key={d.zone} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span style={{ fontSize: 9, color: "#374151", fontWeight: 600 }}>{d.zone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}