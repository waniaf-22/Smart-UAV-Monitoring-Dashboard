import { AlertTriangle, Wind, ArrowDownToLine, RotateCcw, Compass, Gauge, Eye, Thermometer, MapPin, Plane, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function WindAlert() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Wind className="h-8 w-8 text-primary" /> Weather Intelligence
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time meteorological monitoring and fleet safety control.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border">
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
            <AlertTriangle className="h-12 w-12 text-foreground animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[oklch(var(--warning))] mb-2">Critical Weather Alert</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">HIGH WIND WARNING</h2>
            <p className="text-lg text-foreground/90 max-w-2xl">
              Sustained winds of <span className="font-bold text-[oklch(var(--warning))]">38 km/h</span> with gusts up to <span className="font-bold text-destructive">52 km/h</span> detected. Coastal and southern operational sectors are severely impacted.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* METEOROLOGICAL DATA GRID */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Wind className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Wind Speed</span>
            </div>
            <div>
              <span className="text-4xl font-bold text-foreground">38</span>
              <span className="text-sm text-muted-foreground ml-1">km/h</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-destructive/5"></div>
            <div className="flex items-center gap-2 text-destructive mb-4 relative z-10">
              <AlertTriangle className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Peak Gusts</span>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-bold text-destructive">52</span>
              <span className="text-sm text-destructive/80 ml-1">km/h</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Compass className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Direction</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">NW <span className="text-sm text-muted-foreground font-normal">(315°)</span></span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Gauge className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Pressure</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">1008</span>
              <span className="text-sm text-muted-foreground ml-1">hPa</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Thermometer className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Temperature</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">24°C</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Eye className="h-4 w-4" /> <span className="text-xs uppercase font-bold tracking-wider">Visibility</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">8.5</span>
              <span className="text-sm text-muted-foreground ml-1">km</span>
            </div>
          </div>
          
          <div className="col-span-2 md:col-span-2 bg-secondary border border-border rounded-xl p-5 flex items-center justify-between">
             <div>
               <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-1">
                 <ShieldAlert className="h-4 w-4 text-[oklch(var(--warning))]" /> Automated Flight Advisory
               </h3>
               <p className="text-xs text-muted-foreground">Flight ceilings restricted to 50m. Expected battery drain increased by 40% due to compensation maneuvers.</p>
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
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-3">
                    <Plane className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-sm font-bold text-foreground">UAV-02 (Karachi)</p>
                      <p className="text-xs text-destructive">Severe Crosswinds</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-bold rounded bg-destructive text-destructive-foreground uppercase">In Flight</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[oklch(var(--warning))]/10 border border-[oklch(var(--warning))]/20">
                  <div className="flex items-center gap-3">
                    <Plane className="h-5 w-5 text-[oklch(var(--warning))]" />
                    <div>
                      <p className="text-sm font-bold text-foreground">UAV-11 (Hyderabad)</p>
                      <p className="text-xs text-[oklch(var(--warning))]">Elevated Gusts</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-bold rounded bg-[oklch(var(--warning))] text-background uppercase">In Flight</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
                  <div className="flex items-center gap-3">
                    <Plane className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold text-foreground">UAV-14 (Larkana)</p>
                      <p className="text-xs text-muted-foreground">Approaching Front</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-bold rounded bg-muted text-foreground uppercase">Grounded</span>
                </div>
             </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">Emergency Actions</h3>
            <div className="space-y-3">
              <Button asChild className="w-full h-12 font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90" style={{ boxShadow: "0 4px 14px 0 oklch(0.62 0.24 25 / 0.39)" }}>
                <Link to="/control">
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Ground Affected Fleet
                </Link>
              </Button>
              <Button variant="outline" className="w-full h-12 font-bold border-border bg-secondary text-foreground hover:bg-secondary/80">
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