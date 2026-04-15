"use client";

const ratings = [
  { stars: 5, count: 1991, label: "5-Star Ratings",  barColor: "#f59e0b", textColor: "#92400e", bg: "#fffbeb", border: "#fde68a" },
  { stars: 4, count: 156,  label: "4-Star Ratings",  barColor: "#10b981", textColor: "#065f46", bg: "#ecfdf5", border: "#6ee7b7" },
  { stars: 3, count: 68,   label: "3-Star Ratings",  barColor: "#06b6d4", textColor: "#164e63", bg: "#ecfeff", border: "#67e8f9" },
  { stars: 2, count: 34,   label: "2-Star Ratings",  barColor: "#f97316", textColor: "#7c2d12", bg: "#fff7ed", border: "#fdba74" },
  { stars: 1, count: 96,   label: "1-Star Ratings",  barColor: "#f43f5e", textColor: "#881337", bg: "#fff1f2", border: "#fda4af" },
];

const total = ratings.reduce((s, r) => s + r.count, 0);
const maxCount = Math.max(...ratings.map((r) => r.count));

function StarIcons({ filled, color }: { filled: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ color: s <= filled ? color : "#e2e8f0", fontSize: 16, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

export default function RatingsDistribution() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e8ecf0" }}>

      {/* Header band */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" }}>
        <div>
          <h2 className="text-base font-black text-white">Customer Ratings Distribution</h2>
          <p className="text-xs mt-0.5" style={{ color: "#a5b4fc" }}>
            {total.toLocaleString()} total ratings · all time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-1.5 rounded-full flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <span style={{ color: "#fbbf24", fontSize: 14 }}>★</span>
            <span className="text-sm font-black text-white">4.7 Avg</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6" style={{ background: "#fff" }}>

        {/* Horizontal bar rows */}
        <div className="space-y-4">
          {ratings.map((r) => {
            const barW = Math.round((r.count / maxCount) * 100);
            const pct  = Math.round((r.count / total) * 100);
            return (
              <div key={r.stars} className="flex items-center gap-4">
                {/* Stars */}
                <div className="shrink-0 w-28">
                  <StarIcons filled={r.stars} color={r.barColor} />
                </div>

                {/* Bar */}
                <div className="flex-1 h-8 rounded-xl overflow-hidden relative"
                  style={{ background: "#f8fafc" }}>
                  <div
                    className="h-full rounded-xl flex items-center px-3 transition-all duration-700"
                    style={{ width: `${barW}%`, background: `linear-gradient(90deg, ${r.barColor}cc, ${r.barColor})`, minWidth: 40 }}>
                    <span className="text-xs font-black text-white">{r.count.toLocaleString()}</span>
                  </div>
                </div>

                {/* Pct badge */}
                <div className="shrink-0 w-16 text-right">
                  <span className="text-sm font-black px-2.5 py-1 rounded-lg"
                    style={{ background: r.bg, color: r.textColor, border: `1px solid ${r.border}` }}>
                    {pct}%
                  </span>
                </div>

                {/* Label */}
                <span className="shrink-0 text-xs font-semibold w-24" style={{ color: "#94a3b8" }}>
                  {r.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-5 gap-3 mt-6 pt-6" style={{ borderTop: "1px solid #f1f5f9" }}>
          {ratings.map((r) => (
            <div key={r.stars}
              className="rounded-xl p-3 text-center transition-all hover:shadow-sm cursor-default"
              style={{ background: r.bg, border: `1px solid ${r.border}` }}>
              <p className="text-2xl font-black" style={{ color: r.barColor }}>{r.count.toLocaleString()}</p>
              <div className="flex justify-center mt-1">
                <StarIcons filled={r.stars} color={r.barColor} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
