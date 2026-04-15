"use client";

const R    = 54;
const CIRC = 2 * 3.14159 * R;

function Donut({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct  = max > 0 ? value / max : 0;
  const dash = Math.round(pct * CIRC * 100) / 100;
  const gap  = Math.round((CIRC - dash) * 100) / 100;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle cx="70" cy="70" r={R} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`} strokeLinecap="round" transform="rotate(-90 70 70)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black" style={{ color: "#1f2937" }}>{value}</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color: "#6b7280" }}>{label}</span>
    </div>
  );
}

export default function EscalatedComplaints() {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #f0f0f0" }}>
      <div className="mb-5">
        <h2 className="text-base font-black text-gray-800">Escalated &amp; Severe Complaints</h2>
        <p className="text-xs text-gray-400 mt-0.5">Current open escalations</p>
      </div>
      <div className="flex items-center justify-around py-2">
        <Donut value={0}   max={300} color="#ef4444" label="Escalated" />
        <div style={{ width: 1, height: 100, background: "#f3f4f6" }} />
        <Donut value={230} max={300} color="#00acc1" label="Severe" />
      </div>
    </div>
  );
}