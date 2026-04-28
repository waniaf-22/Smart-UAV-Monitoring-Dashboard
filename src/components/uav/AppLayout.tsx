import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, AlertTriangle, Gamepad2, FileBarChart, LogOut, Plane, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/control", label: "Control Panel", icon: Gamepad2 },
  { to: "/alerts", label: "Wind Alert", icon: AlertTriangle },
  { to: "/reports", label: "Reports", icon: FileBarChart },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  const NavContent = () => (
    <>
      <div className="h-16 flex items-center gap-3 px-5 border-b border-border shrink-0">
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

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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

      <div className="p-3 border-t border-border shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "var(--gradient-canvas)" }}>
      {/* Mobile Header */}
      <header className="md:hidden h-16 border-b border-border bg-card/60 backdrop-blur flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Plane className="h-4 w-4 text-primary-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground">AeroCommand</p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col bg-card border-r-border">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Access different sections of the UAV dashboard.</SheetDescription>
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-card/60 backdrop-blur flex-col h-screen sticky top-0">
        <NavContent />
      </aside>

      <main className="flex-1 min-w-0 overflow-auto h-[calc(100vh-4rem)] md:h-screen">
        {children}
      </main>
    </div>
  );
}