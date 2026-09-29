import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, Briefcase, Users, KanbanSquare, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/companies", label: "Companies", icon: Building2 },
  { to: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { to: "/dashboard/applicants", label: "Applicants", icon: Users },
  { to: "/dashboard/tracking", label: "Tracking", icon: KanbanSquare },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500 text-xs font-semibold text-white">
            H
          </div>
          <span className="text-sm font-medium tracking-wide text-slate-900">
            Hirely
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 px-3 py-3">
          <div className="mb-1 flex items-center gap-2.5 rounded-md px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[11px] font-medium text-slate-600">
              {user?.email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-slate-900">
                {user?.email}
              </p>
              <p className="text-[11px] text-slate-500">
                {user?.role.replace("_", " ").toLowerCase()}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}