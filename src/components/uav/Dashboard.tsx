import { useEffect, useState } from "react";
import { Battery, Gauge, MountainSnow, Wind, Satellite, Signal, Compass, Plane } from "lucide-react";
import { StatCard } from "./StatCard";

export function Dashboard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  const battery = 78 - (tick % 6);
  const altitude = 124 + ((tick * 3) % 18);
  const speed = 42 + ((tick * 2) % 9);
  const wind = 12 + (tick % 4);

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mission Dashboard</h1>
          <p className="text-sm text-muted-foreground">UAV-07 • Sector B • Live telemetry</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(var(--success))] animate-pulse" />
          <span className="text-foreground font-medium">In Flight</span>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Battery} label="Battery" value={battery} unit="%" tone={battery < 20 ? "danger" : "success"} />
        <StatCard icon={MountainSnow} label="Altitude" value={altitude} unit="m" />
        <StatCard icon={Gauge} label="Speed" value={speed} unit="km/h" />
        <StatCard icon={Wind} label="Wind" value={wind} unit="km/h" tone={wind > 20 ? "warning" : "default"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Satellite className="h-4 w-4 text-primary" /> Live Map View
            </h2>
            <span className="text-xs text-muted-foreground">37.7749° N, 122.4194° W</span>
          </div>
          <div
            className="relative h-[420px]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, oklch(0.32 0.06 200) 0%, oklch(0.18 0.03 250) 70%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.5 0.05 200 / 0.2) 1px, transparent 1px), linear-gradient(90deg, oklch(0.5 0.05 200 / 0.2) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {[1, 2, 3].map((r) => (
                <div
                  key={r}
                  className="absolute rounded-full border border-primary/30"
                  style={{ width: r * 130, height: r * 130 }}
                />
              ))}
              <div
                className="absolute h-3 w-3 rounded-full bg-primary"
                style={{ boxShadow: "0 0 24px 6px oklch(0.7 0.22 38 / 0.7)" }}
              />
              <Plane
                className="absolute h-7 w-7 text-primary"
                style={{ transform: `translate(${Math.sin(tick / 4) * 80}px, ${Math.cos(tick / 4) * 60}px) rotate(${tick * 8}deg)` }}
              />
            </div>
            <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur border border-border rounded-md px-3 py-1.5 text-xs text-muted-foreground">
              Map placeholder • Tactical radar view
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Signal className="h-4 w-4 text-primary" /> Signal Quality
            </h3>
            <div className="space-y-3">
              {[
                { label: "RC Link", value: 96 },
                { label: "GPS Fix", value: 88 },
                { label: "Video Stream", value: 72 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="text-foreground font-medium">{s.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" /> Heading
            </h3>
            <div className="flex items-center justify-center py-2">
              <div className="relative h-28 w-28 rounded-full border-2 border-border flex items-center justify-center">
                <div
                  className="absolute h-12 w-1 bg-primary rounded-full"
                  style={{
                    bottom: "50%",
                    transform: `rotate(${(tick * 8) % 360}deg)`,
                    transformOrigin: "bottom center",
                  }}
                />
                <span className="absolute top-1 text-xs text-muted-foreground">N</span>
                <span className="absolute bottom-1 text-xs text-muted-foreground">S</span>
                <span className="absolute left-1 text-xs text-muted-foreground">W</span>
                <span className="absolute right-1 text-xs text-muted-foreground">E</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}