"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatCards from "@/components/StatCards";
import ZoneComplaintsChart from "@/components/ZoneComplaintsChart";
import ZoneMTTRChart from "@/components/ZoneMTTRChart";
import EscalatedComplaints from "@/components/EscalatedComplaints";
import ComplaintsAging from "@/components/ComplaintsAging";
import ZoneRatings from "@/components/ZoneRatings";
import RatingsDistribution from "@/components/RatingsDistribution";
import TopEngineers from "@/components/TopEngineers";

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden font-sans"
      style={{ background: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 40%, #fff1f2 100%)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Row 1 — Stat cards */}
          <StatCards />

          {/* Row 2 — Zone charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <ZoneComplaintsChart />
            <ZoneMTTRChart />
          </div>

          {/* Row 3 — Escalated + Aging */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <EscalatedComplaints />
            <ComplaintsAging />
          </div>

          {/* Row 4 — Zone ratings */}
          <ZoneRatings />

          {/* Row 5 — Ratings distribution */}
          <RatingsDistribution />

          {/* Row 6 — Top engineers */}
          <TopEngineers />

        </main>
      </div>
    </div>
  );
}