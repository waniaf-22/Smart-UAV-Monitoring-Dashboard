import { useState, useMemo } from "react";
import { Play, Square, Siren, Plane, CheckSquare, Square as SquareOutline, Camera, Home as HomeIcon } from "lucide-react";
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

type Status = "idle" | "running" | "landing";

interface UAV {
  id: string;
  city: string;
  status: Status;
  selected: boolean;
}

const INITIAL_UAVS: UAV[] = [
  { id: "UAV-01", city: "Islamabad", status: "idle", selected: false },
  { id: "UAV-02", city: "Karachi", status: "idle", selected: false },
  { id: "UAV-03", city: "Lahore", status: "idle", selected: false },
  { id: "UAV-04", city: "Peshawar", status: "idle", selected: false },
  { id: "UAV-05", city: "Quetta", status: "idle", selected: false },
  { id: "UAV-06", city: "Multan", status: "idle", selected: false },
  { id: "UAV-07", city: "Faisalabad", status: "idle", selected: false },
  { id: "UAV-08", city: "Rawalpindi", status: "idle", selected: false },
  { id: "UAV-09", city: "Gujranwala", status: "idle", selected: false },
  { id: "UAV-10", city: "Sialkot", status: "idle", selected: false },
  { id: "UAV-11", city: "Hyderabad", status: "idle", selected: false },
  { id: "UAV-12", city: "Bahawalpur", status: "idle", selected: false },
  { id: "UAV-13", city: "Sukkur", status: "idle", selected: false },
  { id: "UAV-14", city: "Larkana", status: "idle", selected: false },
];

const badgeStyles = {
  idle: { label: "Idle", color: "bg-muted text-foreground" },
  running: { label: "In Flight", color: "bg-[oklch(var(--success))] text-primary-foreground" },
  landing: { label: "Landing", color: "bg-destructive text-destructive-foreground" },
};

export function ControlPanel() {
  const [uavs, setUavs] = useState<UAV[]>(INITIAL_UAVS);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Derived state
  const selectedUAVs = useMemo(() => uavs.filter((u) => u.selected), [uavs]);
  const activeUAVs = useMemo(() => uavs.filter((u) => u.status === "running"), [uavs]);
  const allSelected = selectedUAVs.length === uavs.length && uavs.length > 0;

  // Actions
  const toggleSelection = (id: string) => {
    setUavs((prev) => prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u)));
  };

  const toggleSelectAll = () => {
    setUavs((prev) => prev.map((u) => ({ ...u, selected: !allSelected })));
  };

  const setStatusSingle = (id: string, status: Status) => {
    setUavs((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    if (status === "running") toast.success(`${id} started`, { description: "Motors armed. Lifting off." });
    if (status === "idle") toast(`${id} stopped`, { description: "Motors disarmed." });
  };

  const startSelected = () => {
    const idleSelected = selectedUAVs.filter((u) => u.status === "idle");
    if (idleSelected.length === 0) return;
    setUavs((prev) => prev.map((u) => (u.selected && u.status === "idle" ? { ...u, status: "running" } : u)));
    toast.success(`${idleSelected.length} UAV(s) started`, { description: "Simultaneous lift-off initiated." });
  };

  const stopSelected = () => {
    const activeSelected = selectedUAVs.filter((u) => u.status !== "idle");
    if (activeSelected.length === 0) return;
    setUavs((prev) => prev.map((u) => (u.selected && u.status !== "idle" ? { ...u, status: "idle" } : u)));
    toast(`${activeSelected.length} UAV(s) stopped`, { description: "Motors disarmed." });
  };

  const emergencyLandSelected = () => {
    setUavs((prev) => prev.map((u) => (u.selected ? { ...u, status: "landing" } : u)));
    setConfirmOpen(false);
    toast.error("Emergency landing initiated", { description: "Selected UAVs descending immediately." });
  };

  return (
    <div className="p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Fleet Control</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage {uavs.length} assigned UAVs across major cities. Active: {activeUAVs.length}
        </p>
      </header>

      {/* Bulk Action Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-6 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground">
            <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
            Select All
          </label>
          <span className="text-sm text-muted-foreground border-l border-border pl-4">
            {selectedUAVs.length} Selected
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={startSelected}
            disabled={selectedUAVs.length === 0 || selectedUAVs.every((u) => u.status === "running")}
            className="h-10 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            style={selectedUAVs.length > 0 ? { boxShadow: "var(--shadow-glow)" } : {}}
          >
            <Play className="h-4 w-4 mr-2" /> Start Selected
          </Button>
          <Button
            onClick={stopSelected}
            disabled={selectedUAVs.length === 0 || selectedUAVs.every((u) => u.status === "idle")}
            variant="outline"
            className="h-10 text-sm font-bold border-border bg-secondary text-foreground hover:bg-secondary/70"
          >
            <Square className="h-4 w-4 mr-2" /> Stop Selected
          </Button>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={selectedUAVs.length === 0}
            className="h-10 text-sm font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Siren className="h-4 w-4 mr-2" /> Emergency Land
          </Button>
        </div>
      </div>

      {/* UAV List */}
      <div className="flex flex-col gap-3">
        {uavs.map((uav) => {
          const badge = badgeStyles[uav.status];
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
                    uav.status === "running"
                      ? "bg-[oklch(var(--success))] text-primary-foreground shadow-[0_0_20px_oklch(var(--success)_/_0.4)]"
                      : uav.status === "landing"
                      ? "bg-destructive text-destructive-foreground animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => toggleSelection(uav.id)}
                >
                  <Plane className="h-5 w-5" />
                </div>
                
                {/* Mobile Info View */}
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

              {/* Desktop Info View */}
              <div className="hidden sm:block flex-1 min-w-0 cursor-pointer" onClick={() => toggleSelection(uav.id)}>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-foreground truncate" title={uav.city}>
                    {uav.city}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{uav.id}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex gap-2 flex-1 sm:flex-none">
                  <Button
                    onClick={() => setStatusSingle(uav.id, "running")}
                    disabled={uav.status === "running"}
                    variant={uav.status === "idle" ? "default" : "outline"}
                    className="flex-1 sm:flex-none text-xs h-8 px-3 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground border-transparent"
                  >
                    <Play className="h-3 w-3 mr-1" /> Start
                  </Button>
                  <Button
                    onClick={() => setStatusSingle(uav.id, "idle")}
                    disabled={uav.status === "idle"}
                    variant="outline"
                    className="flex-1 sm:flex-none text-xs h-8 px-3 border-border bg-secondary hover:bg-secondary/70 text-foreground"
                  >
                    <Square className="h-3 w-3 mr-1" /> Stop
                  </Button>
                </div>

                <div className="hidden sm:block w-px h-6 bg-border mx-1"></div>

                <div className="flex gap-1 shrink-0">
                  <button className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Return Home">
                    <HomeIcon className="h-4 w-4" />
                  </button>
                  <button className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Capture">
                    <Camera className="h-4 w-4" />
                  </button>
                  <button className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Auto Hover">
                    <Plane className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mb-2">
              <Siren className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center text-foreground">Confirm Fleet Emergency Landing</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              {selectedUAVs.length} selected UAVs will immediately descend and land at their current positions. Continue?
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
              onClick={emergencyLandSelected}
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