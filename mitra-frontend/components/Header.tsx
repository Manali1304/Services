"use client";

import { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const years  = ["2023","2024","2025","2026"];

export default function Header() {
  const [month, setMonth] = useState("");
  const [year,  setYear]  = useState("");
  const [from,  setFrom]  = useState("");
  const [to,    setTo]    = useState("");

  return (
    <header className="h-16 bg-white flex items-center px-6 gap-4 shrink-0" style={{ borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>

      {/* Filters */}
      <div className="flex items-end gap-3 flex-1">
        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#9ca3af" }}>Month</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 min-w-[110px]"
            style={{ border: "1px solid #e5e7eb", background: "white", color: "#374151" }}>
            <option value="">Month</option>
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#9ca3af" }}>Year</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 min-w-[90px]"
            style={{ border: "1px solid #e5e7eb", background: "white", color: "#374151" }}>
            <option value="">Year</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#9ca3af" }}>From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5"
            style={{ border: "1px solid #e5e7eb", color: "#374151" }} />
        </div>

        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#9ca3af" }}>To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5"
            style={{ border: "1px solid #e5e7eb", color: "#374151" }} />
        </div>

        <button className="text-sm font-bold text-white px-6 py-1.5 rounded-lg transition-all hover:opacity-90 active:scale-95"
          style={{ background: "#4caf50", boxShadow: "0 2px 8px rgba(76,175,80,0.35)" }}>
          Apply
        </button>
        <button onClick={() => { setMonth(""); setYear(""); setFrom(""); setTo(""); }}
          className="text-sm font-semibold px-5 py-1.5 rounded-lg transition-all hover:bg-gray-200"
          style={{ background: "#f3f4f6", color: "#6b7280" }}>
          Reset
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
          style={{ border: "1px solid #e5e7eb" }}>
          <Bell size={16} color="#6b7280" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
        </button>
        <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ border: "1px solid #e5e7eb" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#4caf50" }}>
            <span className="text-white text-xs font-black">A</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: "#374151" }}>Admin</span>
          <ChevronDown size={14} color="#9ca3af" />
        </div>
      </div>
    </header>
  );
}