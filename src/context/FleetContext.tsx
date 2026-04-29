import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";

// ── Types ──────────────────────────────────────────────────────────────────
export type UAVStatus = "idle" | "running" | "landing";
export type LandingMode = "emergency" | "rth" | null;

export interface UAV {
  id: string;
  city: string;
  status: UAVStatus;
  landingMode: LandingMode;
  selected: boolean;
  /** Total operational flight hours for maintenance tracking */
  flightHours: number;
  /** WGS-84 coordinates — used by Dashboard to centre the map */
  lat: number;
  lng: number;
  emergencyLat?: number;
  emergencyLng?: number;
}

export interface FlightLog {
  id: string;
  uavId: string;
  city: string;
  date: string;
  time: string;
  duration: string;
  distance: number;
  efficiency: number;
  status: "ok" | "warn" | "emergency";
}

interface FleetContextValue {
  uavs: UAV[];
  activeUavId: string;
  activeUav: UAV;
  setActiveUavAndNavigate: (id: string) => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  setStatusSingle: (id: string, status: UAVStatus) => void;
  emergencyLandSingle: (id: string, lat?: number, lng?: number) => void;
  startSelected: () => void;
  stopSelected: () => void;
  emergencyLandSelected: () => void;
  flightLogs: FlightLog[];
  logFlightEvent: (uavId: string, eventData: Omit<FlightLog, "id" | "uavId" | "date" | "time">) => void;
}

// ── Seed data — 5 major Pakistani cities ──────────────────────────────────
const INITIAL_UAVS: UAV[] = [
  { id: "UAV-01", city: "Karachi",   status: "running", landingMode: null, selected: false, flightHours: 482, lat: 24.8567, lng: 67.2644 },
  { id: "UAV-02", city: "Lahore",    status: "idle",    landingMode: null, selected: false, flightHours: 120, lat: 31.5204, lng: 74.3587 },
  { id: "UAV-03", city: "Islamabad", status: "idle",    landingMode: null, selected: false, flightHours: 495, lat: 33.6844, lng: 73.0479 },
  { id: "UAV-04", city: "Peshawar",  status: "idle",    landingMode: null, selected: false, flightHours: 85,  lat: 34.0151, lng: 71.5249 },
  { id: "UAV-05", city: "Quetta",    status: "idle",    landingMode: null, selected: false, flightHours: 310, lat: 30.1798, lng: 66.9750 },
];

const INITIAL_LOGS: FlightLog[] = [
  { id: "FL-2310", uavId: "UAV-03", city: "Islamabad", date: "2026-04-27", time: "08:15", duration: "00:42:18", distance: 12.4, efficiency: 88, status: "ok" },
  { id: "FL-2309", uavId: "UAV-01", city: "Karachi", date: "2026-04-27", time: "14:30", duration: "01:05:02", distance: 18.7, efficiency: 92, status: "ok" },
  { id: "FL-2308", uavId: "UAV-02", city: "Lahore", date: "2026-04-26", time: "09:00", duration: "00:18:44", distance: 4.2, efficiency: 65, status: "warn" },
  { id: "FL-2307", uavId: "UAV-03", city: "Islamabad", date: "2026-04-26", time: "16:45", duration: "00:55:30", distance: 15.1, efficiency: 85, status: "ok" },
  { id: "FL-2304", uavId: "UAV-04", city: "Peshawar", date: "2026-04-24", time: "07:30", duration: "01:10:00", distance: 20.0, efficiency: 95, status: "ok" },
  { id: "FL-2302", uavId: "UAV-05", city: "Quetta", date: "2026-04-23", time: "10:05", duration: "00:25:00", distance: 6.5, efficiency: 70, status: "ok" },
];

// How many ticks (~1.5s each) to wait before auto-resolving landing → idle
const LANDING_RESOLVE_MS = 10000; // 10 s

// ── Context ────────────────────────────────────────────────────────────────
const FleetContext = createContext<FleetContextValue | null>(null);

export function FleetProvider({ children }: { children: ReactNode }) {
  const [uavs, setUavs] = useState<UAV[]>(INITIAL_UAVS);
  const [flightLogs, setFlightLogs] = useState<FlightLog[]>(INITIAL_LOGS);
  const [activeUavId, setActiveUavId] = useState("UAV-01");
  const router = useRouter();

  const activeUav = useMemo(
    () => uavs.find((u) => u.id === activeUavId) ?? uavs[0],
    [uavs, activeUavId]
  );

  /** Schedules automatic idle resolution after landing animation completes */
  const scheduleIdle = (id: string) => {
    setTimeout(() => {
      setUavs((prev) =>
        prev.map((u) =>
          u.id === id && u.status === "landing"
            ? { ...u, status: "idle", landingMode: null }
            : u
        )
      );
    }, LANDING_RESOLVE_MS);
  };

  const setActiveUavAndNavigate = (id: string) => {
    setActiveUavId(id);
    router.navigate({ to: "/dashboard" });
  };

  const toggleSelection = (id: string) =>
    setUavs((prev) => prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u)));

  const toggleSelectAll = () => {
    const allSelected = uavs.every((u) => u.selected);
    setUavs((prev) => prev.map((u) => ({ ...u, selected: !allSelected })));
  };

  /**
   * Start a single UAV, or RTH-land it (RTH = drone moves back to base before idle).
   * Calling with "idle" triggers RTH animation; status resolves to idle after LANDING_RESOLVE_MS.
   */
  const setStatusSingle = (id: string, status: UAVStatus) => {
    if (status === "idle") {
      // Treat "stop" as RTH landing
      setUavs((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "landing", landingMode: "rth" } : u))
      );
      scheduleIdle(id);
    } else {
      setUavs((prev) => prev.map((u) => (u.id === id ? { ...u, status, landingMode: null, emergencyLat: undefined, emergencyLng: undefined } : u)));
    }
  };

  /** Triggers an in-place emergency landing for a single drone */
  const emergencyLandSingle = (id: string, lat?: number, lng?: number) => {
    setUavs((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "landing", landingMode: "emergency", emergencyLat: lat, emergencyLng: lng } : u))
    );
    scheduleIdle(id);
  };

  /** Instantly forces a drone to idle (e.g. after evasion lands it) */
  const forceIdleSingle = (id: string, lat?: number, lng?: number) => {
    setUavs((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "idle", landingMode: null, emergencyLat: lat, emergencyLng: lng } : u))
    );
  };

  const startSelected = () =>
    setUavs((prev) =>
      prev.map((u) =>
        u.selected && u.status === "idle" ? { ...u, status: "running", landingMode: null, emergencyLat: undefined, emergencyLng: undefined } : u
      )
    );

  /** Stop selected = RTH for all selected active UAVs */
  const stopSelected = () => {
    const activeSelected = uavs.filter((u) => u.selected && u.status !== "idle");
    activeSelected.forEach((u) => scheduleIdle(u.id));
    setUavs((prev) =>
      prev.map((u) =>
        u.selected && u.status !== "idle"
          ? { ...u, status: "landing", landingMode: "rth" }
          : u
      )
    );
  };

  /** Emergency land all selected = in-place landing */
  const emergencyLandSelected = () => {
    const selected = uavs.filter((u) => u.selected);
    selected.forEach((u) => scheduleIdle(u.id));
    setUavs((prev) =>
      prev.map((u) =>
        u.selected ? { ...u, status: "landing", landingMode: "emergency" } : u
      )
    );
  };

  const logFlightEvent = (uavId: string, eventData: Omit<FlightLog, "id" | "uavId" | "date" | "time">) => {
    const now = new Date();
    const newLog: FlightLog = {
      id: `FL-${Math.floor(1000 + Math.random() * 9000)}`,
      uavId,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      ...eventData,
    };
    setFlightLogs(prev => [newLog, ...prev]);
  };

  return (
    <FleetContext.Provider
      value={{
        uavs,
        activeUavId,
        activeUav,
        setActiveUavAndNavigate,
        toggleSelection,
        toggleSelectAll,
        setStatusSingle,
        emergencyLandSingle,
        forceIdleSingle,
        startSelected,
        stopSelected,
        emergencyLandSelected,
        flightLogs,
        logFlightEvent,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const ctx = useContext(FleetContext);
  if (!ctx) throw new Error("useFleet must be used inside <FleetProvider>");
  return ctx;
}
