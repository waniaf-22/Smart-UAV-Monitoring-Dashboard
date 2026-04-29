import { AlertTriangle, Wind, ArrowDownToLine, RotateCcw, Compass, Gauge, Eye, Thermometer, MapPin, Plane, ShieldAlert, CloudLightning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { useFleet } from "@/context/FleetContext";
import { dashboardState } from "./Dashboard";
import { toast } from "sonner";

export function WeatherAlert() {
  const { uavs, activeUav, emergencyLandSingle, logFlightEvent } = useFleet();
  const router = useRouter();

  // Identify UAVs running in the same city as the active one (since storm is local to active city)
  const threatenedUavs = uavs.filter((u) => u.city === activeUav.city && u.status === "running");
  
  const handleGroundFleet = () => {
    if (threatenedUavs.length === 0) return;
    threatenedUavs.forEach((u) => {
      emergencyLandSingle(u.id);
      logFlightEvent(u.id, {
        city: u.city,
        duration: "00:15:32",
        distance: 4.2,
        efficiency: 15,
        status: "emergency",
      });
    });
    toast.success("Emergency Landing Initiated", { description: "Threatened UAVs ordered to evade and land immediately." });
    router.navigate({ to: "/control" });
  };

  const handleAcknowledge = () => {
    dashboardState.stormAlertFired = true; // Acknowledged, won't pop up again
    dashboardState.stormAlertOpen = false;
    router.navigate({ to: "/dashboard" });
  };
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CloudLightning className="h-8 w-8 text-primary" /> Weather Intelligence
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time meteorological monitoring and fleet safety control. • <span className="text-destructive font-medium">{activeUav.city} Sector</span></p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-destructive bg-destructive/10 px-4 py-2 rounded-full border border-destructive/30">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"></div>
          Active Severe Weather Warning
        </div>
      </header>

      {/* TOP CRITICAL BANNER */}
      <div 
        className="rounded-2xl border-2 overflow-hidden relative"
        style={{
          borderColor: "oklch(0.62 0.24 25)",
          background: "linear-gradient(135deg, oklch(0.32 0.12 30) 0%, oklch(0.20 0.06 25) 100%)",
          boxShadow: "0 10px 40px -10px oklch(0.62 0.24 25 / 0.5)",
        }}
      >
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Wind className="w-64 h-64" />
        </div>
        <div className="px-6 py-8 md:px-10 md:py-12 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="inline-flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "oklch(0.62 0.24 25)",
              boxShadow: "0 0 60px oklch(0.62 0.24 25 / 0.8)",
            }}>
            <CloudLightning className="h-12 w-12 text-white animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-500 mb-2">Critical Weather Alert</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">SEVERE THUNDERSTORM</h2>
            <p className="text-lg text-white/90 max-w-2xl">
              Microburst moving SE at <span className="font-bold text-amber-400">{dashboardState.stormEtaSeconds > 0 ? Math.round(dashboardState.stormEtaSeconds) : "—"} km/h</span> detected. Heavy rain core will reach the {activeUav.city} sector in <span className="font-bold text-red-400">{dashboardState.stormEtaSeconds > 0 ? dashboardState.stormEtaSeconds : 0} seconds</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* METEOROLOGICAL DATA GRID */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Wind className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Storm Speed</span>
            </div>
            <div>
              <span className="text-4xl font-bold text-foreground">55</span>
              <span className="text-sm text-muted-foreground ml-1">km/h</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-destructive/5"></div>
            <div className="flex items-center gap-2 text-destructive mb-4 relative z-10">
              <CloudLightning className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Impact ETA</span>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-bold text-destructive">{dashboardState.stormEtaSeconds > 0 ? dashboardState.stormEtaSeconds : 0}</span>
              <span className="text-sm text-destructive/80 ml-1">sec</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Compass className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Direction</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">SE <span className="text-sm text-muted-foreground font-normal">(135°)</span></span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Gauge className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Pressure</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">982</span>
              <span className="text-sm text-muted-foreground ml-1">hPa</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Thermometer className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Temperature</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">18°C</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Eye className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Visibility</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-destructive">0.8</span>
              <span className="text-sm text-muted-foreground ml-1">km</span>
            </div>
          </div>
          
          <div className="col-span-2 md:col-span-2 bg-warning/10 border border-warning/30 rounded-xl p-5 flex items-center justify-between">
             <div>
               <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-1">
                 <ShieldAlert className="h-4 w-4 text-warning" /> Automated Flight Advisory
               </h3>
               <p className="text-xs text-muted-foreground">High wind sheer detected. RTH may be compromised. Recommended immediate local grounding or evasion maneuvers.</p>
             </div>
          </div>
        </div>

        {/* COMMAND & FLEET STATUS (Sidebar) */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
             <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
               <MapPin className="h-4 w-4 text-primary" /> Affected Fleet Zones
             </h3>
             <div className="space-y-3">
                {threatenedUavs.length > 0 ? (
                  threatenedUavs.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-3">
                        <Plane className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="text-sm font-bold text-foreground">{u.id} ({u.city})</p>
                          <p className="text-xs text-destructive">In Storm Path</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-[10px] font-bold rounded bg-destructive text-destructive-foreground uppercase">Threatened</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                    <div className="flex items-center gap-3">
                      <Plane className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-bold text-foreground">No UAVs in Danger</p>
                        <p className="text-xs text-muted-foreground">Fleet is grounded or outside storm path</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-[10px] font-bold rounded bg-muted text-foreground uppercase">Safe</span>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">Emergency Actions</h3>
            <div className="space-y-3">
              <Button onClick={handleGroundFleet} disabled={threatenedUavs.length === 0} className="w-full h-12 font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50" style={{ boxShadow: "0 4px 14px 0 oklch(0.62 0.24 25 / 0.39)" }}>
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Evade & Land Affected Fleet
              </Button>
              <Button onClick={handleAcknowledge} variant="outline" className="w-full h-12 font-bold border-border bg-card text-foreground hover:bg-secondary/50">
                <RotateCcw className="h-4 w-4 mr-2" />
                Acknowledge Warning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}