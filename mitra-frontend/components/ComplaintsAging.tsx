"use client";

const aging = [
  { label: "Less than 24h", value: 14004, color: "#4caf50", dot: "#4caf50" },
  { label: "24–72 hours",   value: 2557,  color: "#f9a825", dot: "#f9a825" },
  { label: "More than 72h", value: 4272,  color: "#ef4444", dot: "#ef4444" },
];
const total = aging.reduce((s, a) => s + a.value, 0);

export default function ComplaintsAging() {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #f0f0f0" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-black text-gray-800">Complaints Aging</h2>
          <p className="text-xs text-gray-400 mt-0.5">Resolution time breakdown</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#f3f4f6", color: "#6b7280" }}>
          Total: {total.toLocaleString()}
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-5">
        {aging.map((a) => (
          <div key={a.label} style={{ width: `${(a.value / total) * 100}%`, background: a.color }} />
        ))}
      </div>

      <div className="space-y-4">
        {aging.map((a) => (
          <div key={a.label} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: a.dot }} />
            <span className="text-sm text-gray-600 w-32 shrink-0">{a.label}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
              <div className="h-full rounded-full" style={{ width: `${(a.value / aging[0].value) * 100}%`, background: a.color }} />
            </div>
            <span className="text-base font-black w-16 text-right" style={{ color: a.color }}>
              {a.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}