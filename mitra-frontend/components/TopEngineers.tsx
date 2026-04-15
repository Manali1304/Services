"use client";

const lowestMTTR = [
  { name: "Ajit Gavandare",  mttr: -5, complaints: 1,   initials: "AG" },
  { name: "Yogesh Kokate",   mttr: -5, complaints: 2,   initials: "YK" },
  { name: "Akash Nawale",    mttr: -5, complaints: 3,   initials: "AN" },
];

const highestRating = [
  { name: "Sandip Bhosale",  rating: 5, complaints: 33,  initials: "SB" },
  { name: "Ankush Khandare", rating: 5, complaints: 335, initials: "AK" },
  { name: "Mahesh Jadhav",   rating: 5, complaints: 548, initials: "MJ" },
];

const medals = [
  { label: "1st", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", ring: "#fde68a", shadow: "rgba(245,158,11,0.4)" },
  { label: "2nd", gradient: "linear-gradient(135deg, #94a3b8, #64748b)", ring: "#cbd5e1", shadow: "rgba(148,163,184,0.4)" },
  { label: "3rd", gradient: "linear-gradient(135deg, #f97316, #ea580c)", ring: "#fdba74", shadow: "rgba(249,115,22,0.4)" },
];

function EngineerAvatar({ initials, idx }: { initials: string; idx: number }) {
  const m = medals[idx];
  return (
    <div className="relative mx-auto" style={{ width: 72, height: 72 }}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full"
        style={{ background: m.ring, padding: 3 }}>
        <div className="w-full h-full rounded-full flex items-center justify-center"
          style={{ background: m.gradient, boxShadow: `0 6px 20px ${m.shadow}` }}>
          <span className="text-xl font-black text-white">{initials}</span>
        </div>
      </div>
      {/* Medal badge */}
      <div className="absolute -bottom-1.5 left-1/2 text-xs font-black px-1.5 rounded-full text-white"
        style={{ transform: "translateX(-50%)", background: m.gradient, fontSize: 9, paddingTop: 1, paddingBottom: 1, border: "1.5px solid white" }}>
        {m.label}
      </div>
    </div>
  );
}

function MTTRCard({ e, idx }: { e: typeof lowestMTTR[0]; idx: number }) {
  const m = medals[idx];
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md"
      style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <EngineerAvatar initials={e.initials} idx={idx} />
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate" style={{ color: "#1e1b4b" }}>{e.name}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #6ee7b7" }}>
            MTTR: {e.mttr}h
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe" }}>
            {e.complaints} {e.complaints === 1 ? "complaint" : "complaints"}
          </span>
        </div>
      </div>
      <div className="text-2xl font-black shrink-0" style={{ background: m.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        #{idx + 1}
      </div>
    </div>
  );
}

function RatingCard({ e, idx }: { e: typeof highestRating[0]; idx: number }) {
  const m = medals[idx];
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md"
      style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <EngineerAvatar initials={e.initials} idx={idx} />
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate" style={{ color: "#1e1b4b" }}>{e.name}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" }}>
            {"★".repeat(e.rating)} {e.rating}.0
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#fdf2f8", color: "#701a75", border: "1px solid #f0abfc" }}>
            {e.complaints} complaints
          </span>
        </div>
      </div>
      <div className="text-2xl font-black shrink-0" style={{ background: m.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        #{idx + 1}
      </div>
    </div>
  );
}

export default function TopEngineers() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

      {/* Lowest MTTR */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e8ecf0" }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
          <div>
            <h2 className="text-base font-black text-white">Top 3 Engineers</h2>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>Lowest MTTR · Fastest Resolvers</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span style={{ fontSize: 18 }}>⚡</span>
          </div>
        </div>
        {/* Cards */}
        <div className="p-5 space-y-3" style={{ background: "#fff" }}>
          {lowestMTTR.map((e, i) => (
            <MTTRCard key={e.name} e={e} idx={i} />
          ))}
        </div>
      </div>

      {/* Highest Rating */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e8ecf0" }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #451a03 0%, #78350f 100%)" }}>
          <div>
            <h2 className="text-base font-black text-white">Top 3 Engineers</h2>
            <p className="text-xs mt-0.5" style={{ color: "#fde68a" }}>Highest Rating · Best Satisfaction</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span style={{ fontSize: 18 }}>🏆</span>
          </div>
        </div>
        {/* Cards */}
        <div className="p-5 space-y-3" style={{ background: "#fff" }}>
          {highestRating.map((e, i) => (
            <RatingCard key={e.name} e={e} idx={i} />
          ))}
        </div>
      </div>

    </div>
  );
}
