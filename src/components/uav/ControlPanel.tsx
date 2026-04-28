import { useState } from "react";
import { Play, Square, Siren, Plane, Home as HomeIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Status = "idle" | "running" | "landing";

export function ControlPanel() {
  const [status, setStatus] = useState<Status>("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const start = () => {
    setStatus("running");
    toast.success("UAV started", { description: "Motors armed. Lifting off." });
  };
  const stop = () => {
    setStatus("idle");
    toast("UAV stopped", { description: "Motors disarmed." });
  };
  const emergencyLand = () => {
    setStatus("landing");
    setConfirmOpen(false);
    toast.error("Emergency landing initiated", { description: "Descending immediately." });
  };

  const badge = {
    idle: { label: "Idle", color: "bg-muted text-foreground" },
    running: { label: "In Flight", color: "bg-[oklch(var(--success))] text-primary-foreground" },
    landing: { label: "Emergency Landing", color: "bg-destructive text-destructive-foreground" },
  }[status];

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Control Panel</h1>
        <p className="text-sm text-muted-foreground">Direct command interface for UAV-07.</p>
      </header>

      <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Plane className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Status</p>
            <p className="text-xl font-bold text-foreground">UAV-07</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={start}
          disabled={status === "running"}
          className="h-32 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl flex flex-col gap-2"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <Play className="h-8 w-8" />
          Start UAV
        </Button>
        <Button
          onClick={stop}
          disabled={status === "idle"}
          variant="outline"
          className="h-32 text-lg font-bold border-2 border-border bg-secondary text-foreground hover:bg-secondary/70 hover:border-primary rounded-2xl flex flex-col gap-2"
        >
          <Square className="h-8 w-8" />
          Stop UAV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button variant="outline" className="h-14 border-border bg-secondary text-foreground hover:bg-secondary/70">
          <HomeIcon className="h-4 w-4 mr-2" /> Return Home
        </Button>
        <Button variant="outline" className="h-14 border-border bg-secondary text-foreground hover:bg-secondary/70">
          <Camera className="h-4 w-4 mr-2" /> Capture
        </Button>
        <Button variant="outline" className="h-14 border-border bg-secondary text-foreground hover:bg-secondary/70">
          <Plane className="h-4 w-4 mr-2" /> Auto Hover
        </Button>
      </div>

      <div
        className="rounded-2xl p-6 border-2"
        style={{
          borderColor: "oklch(0.62 0.24 25)",
          background: "linear-gradient(180deg, oklch(0.3 0.12 25) 0%, oklch(0.22 0.06 25) 100%)",
        }}
      >
        <div className="flex items-start gap-3 mb-4">
          <Siren className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Emergency Controls</h3>
            <p className="text-xs text-muted-foreground mt-1">Use only in critical situations. Requires confirmation.</p>
          </div>
        </div>
        <Button
          onClick={() => setConfirmOpen(true)}
          className="w-full h-16 text-lg font-extrabold uppercase tracking-wider bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
          style={{ boxShadow: "0 10px 40px -10px oklch(0.62 0.24 25 / 0.7)" }}
        >
          <Siren className="h-6 w-6 mr-2" />
          Emergency Landing
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mb-2">
              <Siren className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-foreground">Confirm Emergency Landing</DialogTitle>
            <DialogDescription className="text-center">
              The UAV will immediately descend and land at its current position. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="border-border bg-secondary text-foreground hover:bg-secondary/70">
              Cancel
            </Button>
            <Button onClick={emergencyLand} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, Land Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}