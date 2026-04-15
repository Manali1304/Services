"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Store, Monitor, MessageSquareWarning,
  Settings2, UserCog, Smartphone, CalendarCheck, Star, LogOut,
  ChevronDown, ChevronRight, Cpu, Layers, Package, UsersRound,
  ListChecks, ImageIcon, BookOpen, SlidersHorizontal,
  CalendarDays, CalendarRange, BarChart2, FileText, ClipboardList,
  Globe
} from "lucide-react";

// TYPES
type NavChild = { icon: React.ElementType; label: string; path: string };
type NavItem  = { icon: React.ElementType; label: string; path?: string; children?: NavChild[] };

// NAV ITEMS (UNCHANGED)
const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Customer", path: "/customer" },
  { icon: Store, label: "Dealer", path: "/dealer" },
  { icon: Monitor, label: "Customer Machine", path: "/customer-machine" },
  { icon: MessageSquareWarning, label: "Complaint", path: "/complaint" },
  {
    icon: Settings2, label: "Manage Machines", children: [
      { icon: Cpu, label: "Machine", path: "/manage-machines" },
      { icon: Layers, label: "Model", path: "/manage-machines/model" },
      { icon: Package, label: "Parts", path: "/manage-machines/parts" },
    ]
  },
  {
    icon: UserCog, label: "Service Engineer", children: [
      { icon: UsersRound, label: "Teams", path: "/service-engineer/teams" },
      { icon: ListChecks, label: "Service Engineer List", path: "/service-engineer/list" },
    ]
  },
  {
    icon: Smartphone, label: "Mobile Setting", children: [
      { icon: SlidersHorizontal, label: "Slider", path: "/mobile-setting/slider" },
      { icon: ImageIcon, label: "Media", path: "/mobile-setting/media" },
      { icon: BookOpen, label: "User Manual", path: "/mobile-setting/user-manual" },
    ]
  },
  {
    icon: CalendarCheck, label: "Attendance", children: [
      { icon: CalendarDays, label: "Daily Attendance", path: "/attendance/daily" },
      { icon: CalendarRange, label: "Monthly Attendance", path: "/attendance/monthly" },
    ]
  },
  { icon: Star, label: "Review", path: "/review" },
  { icon: BarChart2, label: "Collection", path: "/collection" },
  {
    icon: BarChart2, label: "Report", children: [
      { icon: FileText, label: "Dealer Report", path: "/report/dealer" },
      { icon: ClipboardList, label: "Pocket Report", path: "/report/pocket" },
    ]
  },
  {
    icon: Settings2, label: "Settings", children: [
      { icon: Smartphone, label: "App Version", path: "/settings/app-version" },
      { icon: Users, label: "User Management", path: "/settings/users" },
      { icon: Globe, label: "State Management", path: "/settings/state-management" },
      { icon: Globe, label: "District Management", path: "/settings/district-management" },
      { icon: Globe, label: "City Management", path: "/settings/city-management" },
      { icon: ClipboardList, label: "Complaint Category", path: "/settings/complaint-category" },
      { icon: ListChecks, label: "Checksheet Master", path: "/settings/checksheet-master" },
      { icon: ClipboardList, label: "Complaint SubCategory", path: "/settings/complaint-subcategory" },
      { icon: ClipboardList, label: "Complaint SubCategory 2", path: "/settings/complaint-subcategory-2" },
    ]
  }
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  const [expanded, setExpanded] = useState<string | null>(() => {
    if (pathname.startsWith("/manage-machines")) return "Manage Machines";
    if (pathname.startsWith("/service-engineer")) return "Service Engineer";
    if (pathname.startsWith("/mobile-setting")) return "Mobile Setting";
    if (pathname.startsWith("/attendance")) return "Attendance";
    if (pathname.startsWith("/report")) return "Report";
    if (pathname.startsWith("/settings")) return "Settings";
    return null;
  });

  const [active, setActive] = useState(() => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/customer") return "Customer";
    if (pathname === "/dealer") return "Dealer";
    if (pathname === "/customer-machine") return "Customer Machine";
    if (pathname === "/complaint") return "Complaint";
    if (pathname === "/review") return "Review";
    if (pathname === "/collection") return "Collection";

    for (const item of navItems) {
      if (item.children) {
        const child = item.children.find(c => c.path === pathname);
        if (child) return child.label;
      }
    }

    return "Dashboard";
  });

  const handleNavigation = (path: string, label: string) => {
    setActive(label);
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("mitra_authed");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-64"} flex flex-col transition-all duration-300 shrink-0 relative`}
      style={{
        background: "#f1f5f9",
        borderRight: "1px solid #e5e7eb"
      }}
    >

      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-100">
            <img src="/mitralogo.svg" alt="logo" width={20} />
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold text-base">m.i.t.r.a.</p>
              <p className="text-xs text-gray-500">Mahindra AgriTech</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border rounded-full flex items-center justify-center shadow"
      >
        <ChevronRight size={12} className={`${collapsed ? "" : "rotate-180"}`} />
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isOpen = expanded === item.label;
          const hasKids = !!item.children;
          const isActive = active === item.label || item.children?.some(c => c.label === active);

          return (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (hasKids && !collapsed) {
                    setExpanded(isOpen ? null : item.label);
                  } else if (item.path) {
                    handleNavigation(item.path, item.label);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <Icon size={18} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-base">{item.label}</span>
                    {hasKids && (
                      <ChevronDown size={14} className={`${isOpen ? "rotate-180" : ""}`} />
                    )}
                  </>
                )}
              </button>

              {hasKids && isOpen && !collapsed && (
                <div className="ml-4 mt-1 space-y-1 border-l pl-2">
                  {item.children!.map((child) => {
                    const CIcon = child.icon;
                    const isChildActive = active === child.label;

                    return (
                      <button
                        key={child.label}
                        onClick={() => handleNavigation(child.path, child.label)}
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs
                          ${isChildActive ? "bg-green-50 text-green-700" : "text-gray-500 hover:bg-gray-100"}`}
                      >
                        <CIcon size={14} />
                        <span>{child.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
