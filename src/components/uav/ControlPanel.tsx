import { useState, useRef, useEffect } from "react";
import { useFleetShortcuts } from "@/hooks/useFleetShortcuts";
import { Play, Square, Siren, Plane, Camera, Home as HomeIcon, Gamepad2, MonitorDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useFleet } from "@/context/FleetContext";

const badgeStyles = {
  idle:    { label: "Idle",      color: "bg-muted text-foreground" },
  running: { label: "In Flight", color: "text-green-500 bg-green-500/10 border border-green-500/20" },
  landing: { label: "Landing",   color: "text-green-500 bg-green-500/10 border border-green-500/20 animate-pulse" },
};

export function ControlPanel() {
  const {
    uavs,
    activeUavId,
    setActiveUavAndNavigate,
    toggleSelection,
    toggleSelectAll,
    setStatusSingle,
    startSelected,
    stopSelected,
    emergencyLandSelected,
  } = useFleet();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectedUAVs = uavs.filter((u) => u.selected);
  const activeUAVs   = uavs.filter((u) => u.status === "running");
  const allSelected  = selectedUAVs.length === uavs.length && uavs.length > 0;

  const handleStartSelected = () => {
    const idleSelected = selectedUAVs.filter((u) => u.status === "idle");
    if (idleSelected.length === 0) return;
    startSelected();
    toast.success(`${idleSelected.length} UAV(s) started`, { description: "Simultaneous lift-off initiated." });
  };

  const handleStopSelected = () => {
    const activeSelected = selectedUAVs.filter((u) => u.status !== "idle");
    if (activeSelected.length === 0) return;
    stopSelected();
    toast(`${activeSelected.length} UAV(s) stopped`, { description: "Motors disarmed." });
  };

  const handleStatusSingle = (id: string, status: "running" | "idle") => {
    setStatusSingle(id, status);
    if (status === "running") toast.success(`${id} started`, { description: "Motors armed. Lifting off." });
    if (status === "idle")    toast(`${id} stopped`, { description: "Motors disarmed." });
  };

  const handleEmergencyConfirm = () => {
    emergencyLandSelected();
    setConfirmOpen(false);
    toast.error("Emergency landing initiated", { description: "Selected UAVs descending immediately." });
  };

  const handleMonitor = (id: string) => {
    setActiveUavAndNavigate(id);
    toast.success(`Monitoring ${id}`, { description: "Dashboard updated to live telemetry feed." });
  };

  // ── Keyboard Shortcuts (defined AFTER handlers to avoid stale closures) ─
  // Use refs so the event listener always calls the latest function version.
  const handlersRef = useRef({ handleStartSelected: () => {}, handleStopSelected: () => {} });
  useEffect(() => {
    handlersRef.current = { handleStartSelected, handleStopSelected };
  });

  useFleetShortcuts({
    onSelectAll: toggleSelectAll,
    onStart:     () => handlersRef.current.handleStartSelected(),
    onStop:      () => handlersRef.current.handleStopSelected(),
    onEmergency: () => setConfirmOpen(true),
  });
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Gamepad2 className="h-8 w-8 text-primary" /> Fleet Control
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage {uavs.length} assigned UAVs across major cities. Active:{" "}
          <span className="text-[oklch(var(--success))] font-semibold">{activeUAVs.length}</span>
        </p>
      </header>

      {/* Bulk Action Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-6 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground">
            <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
            Select All
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono rounded bg-secondary border border-border text-muted-foreground">Ctrl+A</kbd>
          </label>
          <span className="text-sm text-muted-foreground border-l border-border pl-4">
            {selectedUAVs.length} Selected
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleStartSelected}
            disabled={selectedUAVs.length === 0 || selectedUAVs.every((u) => u.status === "running")}
            className="h-10 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            style={selectedUAVs.length > 0 ? { boxShadow: "var(--shadow-glow)" } : {}}
          >
            <Play className="h-4 w-4" /> Start Selected
            <kbd className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-primary-foreground/20 text-primary-foreground/80">Ctrl+S</kbd>
          </Button>
          <Button
            onClick={handleStopSelected}
            disabled={selectedUAVs.length === 0 || selectedUAVs.every((u) => u.status === "idle")}
            variant="outline"
            className="h-10 text-sm font-bold border-border bg-secondary text-foreground hover:bg-secondary/70 gap-2"
          >
            <Square className="h-4 w-4" /> Stop Selected
            <kbd className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-secondary-foreground/10 text-muted-foreground">Ctrl+X</kbd>
          </Button>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={selectedUAVs.length === 0}
            className="h-10 text-sm font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
          >
            <Siren className="h-4 w-4" /> Emergency Land
            <kbd className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-destructive-foreground/20 text-destructive-foreground/80">Ctrl+E</kbd>
          </Button>
        </div>
      </div>

      {/* UAV List */}
      <div className="flex flex-col gap-3">
        {uavs.map((uav) => {
          const badge    = badgeStyles[uav.status];
          const isActive = uav.id === activeUavId;
          return (
            <div
              key={uav.id}
              className={`bg-card border rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4 relative transition-all duration-300 ${
                uav.selected ? "border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" : "border-border"
              }`}
            >
              {/* Checkbox & Plane Icon */}
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <Checkbox checked={uav.selected} onCheckedChange={() => toggleSelection(uav.id)} />
                <div
                  className={`h-10 w-10 rounded-lg flex shrink-0 items-center justify-center transition-colors cursor-pointer ${
                    uav.status !== "idle"
                      ? "text-green-500 bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => toggleSelection(uav.id)}
                >
                  <Plane className="h-5 w-5" />
                </div>

                {/* Mobile Info */}
                <div className="flex-1 sm:hidden cursor-pointer" onClick={() => toggleSelection(uav.id)}>
                  <h3 className="text-base font-bold text-foreground truncate">{uav.city}</h3>
                  <p className="text-xs text-muted-foreground">{uav.id}</p>
                </div>

                {/* Mobile Status Badge */}
                <div className="sm:hidden shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Desktop Info */}
              <div className="hidden sm:block flex-1 min-w-0 cursor-pointer" onClick={() => toggleSelection(uav.id)}>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-foreground truncate" title={uav.city}>
                    {uav.city}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                    {badge.label}
                  </span>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/40 flex items-center gap-1">
                      <MonitorDot className="h-3 w-3" /> Monitoring
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{uav.id}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex gap-2 flex-1 sm:flex-none">
                  <Button
                    onClick={() => handleStatusSingle(uav.id, "running")}
                    disabled={uav.status === "running"}
                    variant={uav.status === "idle" ? "default" : "outline"}
                    className="flex-1 sm:flex-none text-xs h-8 px-3 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border-transparent"
                  >
                    <Play className="h-3 w-3 mr-1" /> Start
                  </Button>
                  <Button
                    onClick={() => handleStatusSingle(uav.id, "idle")}
                    disabled={uav.status === "idle"}
                    variant="outline"
                    className="flex-1 sm:flex-none text-xs h-8 px-3 border-border bg-secondary hover:bg-secondary/70 text-foreground"
                  >
                    <Square className="h-3 w-3 mr-1" /> Stop
                  </Button>
                </div>

                <div className="hidden sm:block w-px h-6 bg-border mx-1" />

                <div className="flex gap-1 shrink-0">
                  <button
                    className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    title="Return Home"
                  >
                    <HomeIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    title="Capture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  {/* ── Monitor on Dashboard ───────────────────────────── */}
                  <button
                    onClick={() => handleMonitor(uav.id)}
                    title="Monitor live telemetry on Dashboard"
                    className={`h-8 px-2 rounded flex items-center gap-1 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <MonitorDot className="h-4 w-4" />
                    <span className="hidden lg:inline">{isActive ? "Live" : "Monitor"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Landing Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mb-2">
              <Siren className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-foreground">Confirm Fleet Emergency Landing</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              {selectedUAVs.length} selected UAV(s) will immediately descend and land at their current positions. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="border-border bg-secondary text-foreground hover:bg-secondary/70"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEmergencyConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              Yes, Land All Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}