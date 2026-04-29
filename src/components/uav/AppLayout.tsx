import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, AlertTriangle, Gamepad2, FileBarChart, LogOut, Plane, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/control", label: "Control Panel", icon: Gamepad2 },
  { to: "/alerts", label: "Weather Alert", icon: AlertTriangle },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-canvas)" }}>
      <aside className="w-64 shrink-0 border-r border-border bg-card/60 backdrop-blur flex flex-col">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-border">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">AeroCommand</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">UAV Console</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}