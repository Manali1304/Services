"use client";

import { Users, ClipboardList, AlertCircle, Wrench, Hammer, PauseCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const stats = [
  {
    label: "Total Customers",
    value: 15932,
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    valueColor: "text-white",
    labelColor: "text-white/80",
    path: "/customer",
  },
  {
    label: "Total Complaints",
    value: 21124,
    icon: ClipboardList,
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    valueColor: "text-white",
    labelColor: "text-white/80",
  },
  {
    label: "Today's Complaints",
    value: 0,
    icon: AlertCircle,
    gradient: "from-red-500 to-rose-600",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    valueColor: "text-white",
    labelColor: "text-white/80",
  },
  {
    label: "Assigned to Engineer",
    value: 291,
    icon: Wrench,
    gradient: "from-green-500 to-emerald-600",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    valueColor: "text-white",
    labelColor: "text-white/80",
  },
  {
    label: "Need Installation",
    value: 2181,
    icon: Hammer,
    gradient: "from-orange-500 to-amber-600",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    valueColor: "text-white",
    labelColor: "text-white/80",
  },
  {
    label: "Hold Complaints",
    value: 61,
    icon: PauseCircle,
    gradient: "from-purple-500 to-pink-600",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    valueColor: "text-white",
    labelColor: "text-white/80",
  },
  {
    label: "Closed Complaints",
    value: 20833,
    icon: CheckCircle,
    gradient: "from-teal-500 to-cyan-600",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    valueColor: "text-white",
    labelColor: "text-white/80",
  },
];

function AnimatedNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}</span>;
}

export default function StatCards() {
  const router = useRouter();

  const handleCardClick = (stat: any) => {
    if (stat.path) {
      router.push(stat.path);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            onClick={() => handleCardClick(stat)}
            className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 flex flex-col gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${stat.path ? 'cursor-pointer' : ''}`}
          >
            <div className={`${stat.iconBg} w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm`}>
              <Icon size={20} className={stat.iconColor} />
            </div>
            <div>
              <p className={`${stat.labelColor} text-xs font-medium leading-tight`}>{stat.label}</p>
              <p className={`${stat.valueColor} text-2xl font-bold mt-1`}>
                <AnimatedNumber target={stat.value} />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}