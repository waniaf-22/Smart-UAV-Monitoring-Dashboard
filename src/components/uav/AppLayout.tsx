import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, AlertTriangle, Gamepad2, FileBarChart, LogOut, Plane, User, Settings, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

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
  const { sidebarCollapsed, setSidebarCollapsed } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-canvas)" }}>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 shrink-0 border-r border-border bg-card/95 md:bg-card/60 backdrop-blur flex flex-col transition-all duration-300",
        sidebarCollapsed ? "md:w-20" : "md:w-64",
        mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between gap-3 px-4 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            {(!sidebarCollapsed || mobileOpen) && (
              <div className="whitespace-nowrap transition-opacity duration-300">
                <p className="text-sm font-bold text-foreground leading-tight">AeroCommand</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">UAV Console</p>
              </div>
            )}
          </div>
          {/* Desktop collapse button */}
          {!sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(true)} className="hidden md:block text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {/* Mobile close button */}
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {!mobileOpen && sidebarCollapsed && (
          <button onClick={() => setSidebarCollapsed(false)} className="hidden md:block mx-auto mt-4 text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={sidebarCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  sidebarCollapsed && "justify-center px-0",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", sidebarCollapsed && !mobileOpen && "h-5 w-5")} />
                {(!sidebarCollapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to="/"
            title={(sidebarCollapsed && !mobileOpen) ? "Sign out" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
              (sidebarCollapsed && !mobileOpen) && "justify-center px-0"
            )}
          >
            <LogOut className={cn("h-4 w-4 shrink-0", sidebarCollapsed && !mobileOpen && "h-5 w-5")} />
            {(!sidebarCollapsed || mobileOpen) && <span>Sign out</span>}
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-14 shrink-0 border-b border-border bg-card/60 backdrop-blur flex items-center px-4 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-foreground">
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-2 font-bold text-sm tracking-tight flex items-center gap-2">
            <Plane className="h-4 w-4 text-primary" /> AeroCommand
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}