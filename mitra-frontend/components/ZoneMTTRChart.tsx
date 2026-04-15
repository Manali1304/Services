"use client";

const zones = [
  { name: "Jaipur",                   hours: 3050.0  },
  { name: "Adilabad",                 hours: 2881.0  },
  { name: "Hyderabad",                hours: 2469.0  },
  { name: "Rajgarh",                  hours: 2009.0  },
  { name: "Ariyalur",                 hours: 1819.0  },
  { name: "Jodhpur",                  hours: 1580.0  },
  { name: "Akola",                    hours: 727.5   },
  { name: "Kurukshetra",              hours: 678.5   },
  { name: "Mandya",                   hours: 672.0   },
  { name: "Patan",                    hours: 596.0   },
  { name: "Bhilwara",                 hours: 590.9   },
  { name: "Jalandhar",                hours: 571.3   },
  { name: "Shopian",                  hours: 529.0   },
  { name: "Amravati",                 hours: 523.4   },
  { name: "Yavatmal",                 hours: 491.5   },
  { name: "Ratlam",                   hours: 461.0   },
  { name: "Yadgir",                   hours: 441.0   },
  { name: "Ahmedabad",                hours: 409.3   },
  { name: "Bundi",                    hours: 394.3   },
  { name: "Dindigul",                 hours: 347.5   },
  { name: "Dhule",                    hours: 335.5   },
  { name: "Prakasam",                 hours: 322.0   },
  { name: "Gulbarga",                 hours: 307.5   },
  { name: "Parbhani",                 hours: 307.0   },
  { name: "Srikakulam",               hours: 299.0   },
  { name: "Banaskantha",              hours: 286.3   },
  { name: "Belgaum",                  hours: 283.7   },
  { name: "Nizamabad",                hours: 283.0   },
  { name: "Erode",                    hours: 282.0   },
  { name: "Porbandar",                hours: 281.0   },
  { name: "Kachchh",                  hours: 279.7   },
  { name: "Kolar",                    hours: 264.3   },
  { name: "Kurnool",                  hours: 257.2   },
  { name: "Vidisha",                  hours: 256.0   },
  { name: "Navsari",                  hours: 253.2   },
  { name: "Anantapur",                hours: 233.2   },
  { name: "Jalor",                    hours: 204.0   },
  { name: "Tumkur",                   hours: 190.6   },
  { name: "Nagpur",                   hours: 189.0   },
  { name: "Latur",                    hours: 181.2   },
  { name: "Bagalkot",                 hours: 171.3   },
  { name: "Umaria",                   hours: 170.5   },
  { name: "Kolhapur",                 hours: 162.5   },
  { name: "Bijapur (Karnataka)",      hours: 161.1   },
  { name: "Valsad",                   hours: 158.0   },
  { name: "Solapur",                  hours: 155.1   },
  { name: "Rangareddy",               hours: 154.7   },
  { name: "Barmer",                   hours: 152.2   },
  { name: "Patiala",                  hours: 150.3   },
  { name: "Firozpur",                 hours: 149.7   },
  { name: "Koppal",                   hours: 145.3   },
  { name: "Nashik",                   hours: 133.8   },
  { name: "Dharashiv",                hours: 132.1   },
  { name: "Chikkaballapur",           hours: 125.8   },
  { name: "Mahbubnagar",              hours: 121.3   },
  { name: "Buldhana",                 hours: 112.7   },
  { name: "Sangrur",                  hours: 112.0   },
  { name: "Harda",                    hours: 101.7   },
  { name: "Jaisalmer",                hours: 99.7    },
  { name: "Sabarkantha",              hours: 97.7    },
  { name: "Jalgaon",                  hours: 97.7    },
  { name: "Surendra Nagar",           hours: 93.1    },
  { name: "Jalna",                    hours: 91.4    },
  { name: "Bangalore",                hours: 89.5    },
  { name: "Pune",                     hours: 82.3    },
  { name: "Chittoor",                 hours: 78.4    },
  { name: "Chatrapati Sambhaji Nagar",hours: 78.0    },
  { name: "Bellary",                  hours: 76.3    },
  { name: "Washim",                   hours: 75.3    },
  { name: "Ahilyanagar",              hours: 73.7    },
  { name: "Theni",                    hours: 72.0    },
  { name: "Davanagere",               hours: 71.5    },
  { name: "Sirsa",                    hours: 69.8    },
  { name: "Gadag",                    hours: 69.2    },
  { name: "Amritsar",                 hours: 64.3    },
  { name: "Fazilka",                  hours: 62.6    },
  { name: "Hassan",                   hours: 59.4    },
  { name: "Bangalore Rural",          hours: 58.7    },
  { name: "Ganganagar",               hours: 58.3    },
  { name: "Guntur",                   hours: 57.5    },
  { name: "Nalgonda",                 hours: 54.8    },
  { name: "Chitradurga",              hours: 49.7    },
  { name: "Yamuna Nagar",             hours: 45.0    },
  { name: "Satara",                   hours: 38.8    },
  { name: "Fatehabad",                hours: 30.0    },
  { name: "Sangli",                   hours: 28.3    },
  { name: "Muktsar",                  hours: 27.0    },
  { name: "Faridabad",                hours: 23.0    },
  { name: "Raichur",                  hours: 22.3    },
  { name: "Sirohi",                   hours: 20.2    },
  { name: "Kadapa (Cuddapah)",        hours: 19.5    },
  { name: "Surat",                    hours: 19.0    },
  { name: "Khargone (West Nimar)",    hours: 17.0    },
  { name: "Hanumangarh",              hours: 16.0    },
  { name: "Hisar",                    hours: 10.0    },
  { name: "Morbi",                    hours: 9.0     },
  { name: "Chandrapur",               hours: 6.5     },
  { name: "Beed",                     hours: 2.6     },
  { name: "Mahesana",                 hours: 0.5     },
  { name: "Bharuch",                  hours: 0.0     },
  { name: "Chickmagalur",             hours: 0.0     },
  { name: "Jamnagar",                 hours: -0.5    },
  { name: "Nanded",                   hours: -1.0    },
  { name: "Karnal",                   hours: -2.0    },
  { name: "Coimbatore",               hours: -4.0    },
  { name: "South Goa",                hours: -4.7    },
  { name: "New Delhi",                hours: -5.0    },
  { name: "Dharmapuri",               hours: -5.0    },
  { name: "Nandurbar",                hours: -5.0    },
  { name: "Raigarh (Maharashtra)",    hours: -5.0    },
  { name: "Suryapet",                 hours: -5.0    },
];

const maxH = Math.max(...zones.map((z) => z.hours));

function getColor(hours: number): string {
  if (hours >= 2000) return "#6366f1";
  if (hours >= 1000) return "#8b5cf6";
  if (hours >= 500)  return "#0ea5e9";
  if (hours >= 200)  return "#14b8a6";
  if (hours >= 100)  return "#f59e0b";
  if (hours >= 50)   return "#f97316";
  if (hours >= 0)    return "#22c55e";
  return "#f43f5e";
}

export default function ZoneMTTRChart() {
  return (
    <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #e8ecf0" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-black" style={{ color: "#111827" }}>Zone-wise MTTR</h2>
          <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>Mean Time To Resolution (hours) · {zones.length} zones</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe" }}>Live</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: "≥2000h", color: "#6366f1" },
          { label: "≥1000h", color: "#8b5cf6" },
          { label: "≥500h",  color: "#0ea5e9" },
          { label: "≥200h",  color: "#14b8a6" },
          { label: "≥100h",  color: "#f59e0b" },
          { label: "≥50h",   color: "#f97316" },
          { label: "≥0h",    color: "#22c55e" },
          { label: "<0h",    color: "#f43f5e" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
            <span style={{ fontSize: 10, color: "#374151", fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Scrollable list */}
      <div style={{ maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
        <div className="space-y-2">
          {zones.map((z) => {
            const color = getColor(z.hours);
            const pct   = maxH > 0 ? Math.max(0, (z.hours / maxH) * 100) : 0;
            return (
              <div key={z.name} className="flex items-center gap-3">
                <span className="text-xs font-semibold shrink-0 w-40 truncate" style={{ color: "#111827" }}
                  title={z.name}>{z.name}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: color, minWidth: z.hours !== 0 ? 3 : 0 }} />
                </div>
                <span className="text-xs font-bold shrink-0 w-20 text-right"
                  style={{ color: z.hours < 0 ? "#f43f5e" : color }}>
                  {z.hours.toFixed(1)} h
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs mt-3 pt-3" style={{ color: "#6b7280", borderTop: "1px solid #f1f5f9" }}>
        Negative values indicate faster than average resolution
      </p>
    </div>
  );
}