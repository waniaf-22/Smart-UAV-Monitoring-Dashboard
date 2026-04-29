import { useEffect, useRef, useState } from "react";
import { Battery, Gauge, MountainSnow, Wind, Satellite, Signal, Plane, Layers, CloudRain, AlertTriangle, Clock, Activity, Radio, Wifi, Video, CheckCircle2, Thermometer, Droplets, Eye, Gauge as GaugeIcon, MonitorDot, Siren, Home, ShieldAlert, TriangleAlert, LocateFixed, CloudLightning } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { StatCard } from "./StatCard";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useFleet } from "@/context/FleetContext";
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

// Satellite-mode icons
const uavIconSat = L.divIcon({
  html: `<div style="background-color: #10b981; border: 2.5px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.6);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8.5L8 12l-4 4-2.5-.5-1.5 1.5L4 20l3-4 4-4 3.5 5.5 1.7-1.3z"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
const uavIconIdleSat = L.divIcon({
  html: `<div style="background-color: #ef4444; border: 2.5px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.6);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8.5L8 12l-4 4-2.5-.5-1.5 1.5L4 20l3-4 4-4 3.5 5.5 1.7-1.3z"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
const uavIconLandingSat = L.divIcon({
  html: `<div style="background-color: #f59e0b; border: 2.5px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.6);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8.5L8 12l-4 4-2.5-.5-1.5 1.5L4 20l3-4 4-4 3.5 5.5 1.7-1.3z"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Weather-mode icons
const uavIconWeather = L.divIcon({
  html: `<div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 6px #10b981) drop-shadow(0 0 12px #10b981);"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8.5L8 12l-4 4-2.5-.5-1.5 1.5L4 20l3-4 4-4 3.5 5.5 1.7-1.3z"/></svg></div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});
const uavIconIdleWeather = L.divIcon({
  html: `<div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 6px #ef4444) drop-shadow(0 0 12px #ef4444);"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8.5L8 12l-4 4-2.5-.5-1.5 1.5L4 20l3-4 4-4 3.5 5.5 1.7-1.3z"/></svg></div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});
const uavIconLandingWeather = L.divIcon({
  html: `<div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 6px #f59e0b) drop-shadow(0 0 12px #f59e0b);"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8.5L8 12l-4 4-2.5-.5-1.5 1.5L4 20l3-4 4-4 3.5 5.5 1.7-1.3z"/></svg></div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const stormIcon = L.divIcon({
  html: `<div style="background: rgba(239, 68, 68, 0.2); border-radius: 50%; padding: 6px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); border: 1px solid rgba(239, 68, 68, 0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"></path><path d="m13 12-3 5h4l-3 5"></path></svg></div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});
const baseIconSat = L.divIcon({
  html: `<div style="background-color: #3b82f6; border: 2.5px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.6);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
const baseIconWeather = L.divIcon({
  html: `<div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 6px #3b82f6) drop-shadow(0 0 12px #3b82f6);"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const MISSION_EVENTS = [
  { time: "-0m",  text: "Entering Sector B",        ok: true  },
  { time: "-4m",  text: "Wind speed normal",         ok: true  },
  { time: "-9m",  text: "Storm detected NW",         ok: false },
  { time: "-14m", text: "GPS lock acquired",          ok: true  },
  { time: "-21m", text: "Takeoff from base",          ok: true  },
];

// ── Global Dashboard State (persists across page navigations) ───────────────
export const dashboardState = {
  tick: 0,
  mapMode: "weather" as "satellite" | "weather",
  timeOffset: 0,
  batteryAlertFired: false,
  stormAlertFired: false,
  isEvading: false,
  stormAlertOpen: false,
  stormRecommendation: null as "rth" | "land" | "evade" | null,
  stormEtaSeconds: 0,
  evadeStartPos: { lat: 0, lng: 0 },
  evadeDir: { dlat: 0, dlng: 0 },
  evadeStartTick: 0,
  history: {
    Temperature: [] as number[], Humidity: [] as number[], Pressure: [] as number[], Visibility: [] as number[], "UV Index": [] as number[]
  },
  frozenPos: null as { lat: number; lng: number } | null,
  landingStartTick: 0,
  prevStatus: null as string | null,
  prevUavId: null as string | null,
};

export function Dashboard() {
  const { activeUav, activeUavId, setStatusSingle, emergencyLandSingle } = useFleet();

  // Derive map centre from the active UAV coordinates
  const baseLat = activeUav.lat;
  const baseLng = activeUav.lng;

  const [tick, setTick] = useState(dashboardState.tick);
  const [mapMode, setMapMode] = useState<"satellite" | "weather">(dashboardState.mapMode);
  const [timeOffset, setTimeOffset] = useState(dashboardState.timeOffset);
  const [selectedMetric, setSelectedMetric] = useState("Temperature");
  const [hoverPoint, setHoverPoint] = useState<{ idx: number; x: number; y: number; value: number } | null>(null);

  // Sync basic state to globals
  useEffect(() => { dashboardState.mapMode = mapMode; }, [mapMode]);
  useEffect(() => { dashboardState.timeOffset = timeOffset; }, [timeOffset]);

  // Error Prevention state
  const [confirmEmergency, setConfirmEmergency] = useState(false);
  const [confirmRTH, setConfirmRTH] = useState(false);
  const [batteryAlertOpen, setBatteryAlertOpen] = useState(false);
  const batteryAlertFiredRef = useRef(dashboardState.batteryAlertFired);

  // Storm threat state
  const [stormAlertOpen, setStormAlertOpen] = useState(dashboardState.stormAlertOpen);
  const [stormRecommendation, setStormRecommendation] = useState<"rth" | "land" | "evade" | null>(dashboardState.stormRecommendation);
  const [stormEtaSeconds, setStormEtaSeconds] = useState(dashboardState.stormEtaSeconds);
  const stormAlertFiredRef = useRef(dashboardState.stormAlertFired);
  const [isEvading, setIsEvading] = useState(dashboardState.isEvading);
  const evadeStartPosRef = useRef(dashboardState.evadeStartPos);
  const evadeDirRef = useRef(dashboardState.evadeDir); // deg/s unit vector scaled to 100 km/h
  const evadeStartTickRef = useRef(dashboardState.evadeStartTick);
  const EVADE_DURATION_TICKS = 15; // ~22 s at 100 km/h

  // Refs for status-aware position and landing animation
  const ORBIT_RADIUS = 0.0045; // 50% larger than original 0.003
  const LANDING_TICKS = 7;     // ticks to complete landing animation
  const frozenPosRef = useRef(dashboardState.frozenPos ?? { lat: activeUav.lat, lng: activeUav.lng });
  const landingStartTickRef = useRef(dashboardState.landingStartTick);
  const prevStatusRef = useRef(dashboardState.prevStatus ?? activeUav.status);
  const prevUavIdRef = useRef(dashboardState.prevUavId ?? activeUavId);
  // Stale-closure-safe ref for status used inside the interval
  const activeUavStatusRef = useRef(activeUav.status);
  activeUavStatusRef.current = activeUav.status;

  // Sync refs to global state
  useEffect(() => {
    dashboardState.batteryAlertFired = batteryAlertFiredRef.current;
    dashboardState.stormAlertFired = stormAlertFiredRef.current;
    dashboardState.isEvading = isEvading;
    dashboardState.stormAlertOpen = stormAlertOpen;
    dashboardState.stormRecommendation = stormRecommendation;
    dashboardState.stormEtaSeconds = stormEtaSeconds;
    dashboardState.evadeStartPos = evadeStartPosRef.current;
    dashboardState.evadeDir = evadeDirRef.current;
    dashboardState.evadeStartTick = evadeStartTickRef.current;
    dashboardState.frozenPos = frozenPosRef.current;
    dashboardState.landingStartTick = landingStartTickRef.current;
    dashboardState.prevStatus = prevStatusRef.current;
    dashboardState.prevUavId = prevUavIdRef.current;
  });

  // Detect UAV switch — reset frozen pos AND global state
  if (prevUavIdRef.current !== activeUavId) {
    prevUavIdRef.current = activeUavId;
    prevStatusRef.current = activeUav.status;
    frozenPosRef.current = { lat: activeUav.lat, lng: activeUav.lng };
    landingStartTickRef.current = 0;
    
    // Hard reset globals for new drone
    dashboardState.tick = 0;
    dashboardState.timeOffset = 0;
    Object.keys(dashboardState.history).forEach((k) => { dashboardState.history[k as keyof typeof dashboardState.history] = []; });
    batteryAlertFiredRef.current = false;
    stormAlertFiredRef.current = false;
    setIsEvading(false);
    setStormAlertOpen(false);
    setStormRecommendation(null);
  }

  // Running orbit position
  const runLat = baseLat + Math.sin(tick / 8) * ORBIT_RADIUS;
  const runLng = baseLng + Math.cos(tick / 8) * ORBIT_RADIUS;

  // Detect transition to landing — freeze last running position
  if (prevStatusRef.current !== activeUav.status) {
    if (activeUav.status === "landing") {
      if (prevStatusRef.current === "idle") {
        // If it never ran, freeze at base. If it was running, frozenPosRef already has the exact runLat/runLng!
        frozenPosRef.current = { lat: baseLat, lng: baseLng };
      }
      landingStartTickRef.current = tick;
    }
    prevStatusRef.current = activeUav.status;
  }

  // While running, continuously update the frozen position (so landing starts from current spot)
  if (activeUav.status === "running") {
    frozenPosRef.current = { lat: runLat, lng: runLng };
  }

  const landingProgress =
    activeUav.status === "landing"
      ? Math.min(1, (tick - landingStartTickRef.current) / LANDING_TICKS)
      : 0;

  // ── Status-aware telemetry ────────────────────────────────────────────────
  let uavLat: number, uavLng: number, altitude: number, speed: number;

  if (activeUav.status === "idle") {
    // If it emergency landed previously, it stays there. Otherwise base.
    uavLat = activeUav.emergencyLat ?? baseLat;
    uavLng = activeUav.emergencyLng ?? baseLng;
    altitude = 0;
    speed = 0;
  } else if (activeUav.status === "running") {
    if (isEvading) {
      // Move away from storm at 100 km/h
      const EVADE_SPD = 100 / 3.6 / 111000; // deg/s
      const elapsed = Math.min(tick - evadeStartTickRef.current, EVADE_DURATION_TICKS) * 1.5;
      uavLat = evadeStartPosRef.current.lat + evadeDirRef.current.dlat * EVADE_SPD * elapsed;
      uavLng = evadeStartPosRef.current.lng + evadeDirRef.current.dlng * EVADE_SPD * elapsed;
      altitude = 130;
      speed = 100;
    } else {
      uavLat = runLat;
      uavLng = runLng;
      altitude = 124 + ((tick * 3) % 18);
      speed = 42 + ((tick * 2) % 9);
    }
  } else {
    // landing
    const isEmergency = activeUav.landingMode === "emergency";
    if (isEmergency) {
      // Freeze in place; altitude drops
      uavLat = frozenPosRef.current.lat;
      uavLng = frozenPosRef.current.lng;
    } else {
      // RTH — lerp toward base
      uavLat = frozenPosRef.current.lat + (baseLat - frozenPosRef.current.lat) * landingProgress;
      uavLng = frozenPosRef.current.lng + (baseLng - frozenPosRef.current.lng) * landingProgress;
    }
    altitude = Math.max(0, Math.round(130 * (1 - landingProgress)));
    speed = Math.max(0, Math.round(42 * (1 - landingProgress)));
  }
  // Rolling history: 40 samples × 1.5s = 60s of data
  const HISTORY_LEN = 40;
  const historyRef = useRef(dashboardState.history);
  const metricMeta: Record<string, { color: string; unit: string; base: number; variance: number }> = {
    Temperature: { color: "#f97316", unit: "°C",   base: 29,   variance: 2   },
    Humidity:    { color: "#22d3ee", unit: "%",    base: 60,   variance: 5   },
    Pressure:    { color: "#a78bfa", unit: " hPa", base: 996,  variance: 3   },
    Visibility:  { color: "#4ade80", unit: " km",  base: 5.5,  variance: 1.2 },
    "UV Index":  { color: "#fbbf24", unit: "",     base: 8.5,  variance: 1.0 },
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        dashboardState.tick = next;
        // Only record telemetry while actively flying
        if (activeUavStatusRef.current === "running") {
          const newVals: Record<string, number> = {
            Temperature: 29 + (next % 3),
            Humidity:    60 + (next % 8),
            Pressure:    996 + (next % 3),
            Visibility:  parseFloat((5.5 - (next % 4) * 0.2).toFixed(1)),
            "UV Index":  8 + (next % 2),
          };
          Object.keys(newVals).forEach((k) => {
            const arr = historyRef.current[k];
            const noise = (Math.random() - 0.5) * metricMeta[k].variance * 0.6;
            arr.push(+(newVals[k] + noise).toFixed(2));
            if (arr.length > HISTORY_LEN) arr.shift();
          });
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Reset tick only if UAV changes (handled in render block above)
  useEffect(() => {
    if (dashboardState.tick === 0) {
      setTick(0);
      setMapMode("weather");
      setTimeOffset(0);
    }
  }, [activeUavId]);

  // battery is status-aware (idle = full, flying = draining)
  const battery = activeUav.status === "idle" ? 100 : 78 - (tick % 6);
  useEffect(() => {
    if (battery < 20 && !batteryAlertFiredRef.current && activeUav.status === "running") {
      batteryAlertFiredRef.current = true;
      setBatteryAlertOpen(true);
    }
  }, [battery, activeUav.status]);

  // ── Storm Threat Assessment ────────────────────────────────────────────────
  useEffect(() => {
    if (activeUav.status !== "running" || stormAlertFiredRef.current || isEvading) return;
    const R = 111000;
    const cosLat = Math.cos(baseLat * Math.PI / 180);
    // Recompute storm position from tick (avoids stale closure)
    const sLat = baseLat + 0.0121 - tick * 0.00014;
    const sLng = baseLng - 0.0134 + tick * 0.00016;
    // Storm velocity in m/s (SE direction, ~15 m/s = 54 km/h)
    const svLat = -0.00014 / 1.5 * R;
    const svLng =  0.00016 / 1.5 * R * cosLat;
    // Current UAV orbit position
    const cLat = baseLat + Math.sin(tick / 8) * 0.0045;
    const cLng = baseLng + Math.cos(tick / 8) * 0.0045;
    // Vector from storm to UAV (m)
    const dLat = (cLat - sLat) * R;
    const dLng = (cLng - sLng) * R * cosLat;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    const outerRadius = 1600; // m (green circle)
    const heavyRainRadius = 800; // m (red circle)
    const gapOuter = Math.max(0, dist - outerRadius);
    const gapHeavy = Math.max(0, dist - heavyRainRadius);
    if (gapOuter === 0 && tick === 0) return; // Let it run a bit
    // How fast is storm closing on UAV?
    const uLat = dLat / dist, uLng = dLng / dist;
    const approach = (svLat * uLat + svLng * uLng); // positive = approaching
    if (approach <= 0) return; // storm moving away
    const etaOuter = gapOuter / approach;
    if (etaOuter > 10) return; // wait until exactly 10s away from OUTER edge
    
    const etaHeavy = gapHeavy / approach;
    
    // Decision logic based on heavy rain
    const distBase = Math.sqrt(((cLat - baseLat) * R) ** 2 + ((cLng - baseLng) * R * cosLat) ** 2);
    const rthS = distBase / (42 / 3.6); // time to RTH at cruise speed
    const SAFETY = 20;
    let rec: "rth" | "land" | "evade";
    if (rthS + SAFETY <= etaHeavy)      rec = "rth";
    else if (10 + SAFETY <= etaHeavy)   rec = "land";
    else                                rec = "evade";
    stormAlertFiredRef.current = true;
    setStormEtaSeconds(Math.round(etaHeavy));
    setStormRecommendation(rec);
    setStormAlertOpen(true);
  }, [tick, isEvading, activeUav.status]);

  // ── Evade auto-land when evasion distance covered ─────────────────────────
  useEffect(() => {
    if (!isEvading || activeUav.status !== "running") return;
    const elapsed = tick - evadeStartTickRef.current;
    if (elapsed < EVADE_DURATION_TICKS) return;
    const EVADE_SPD = 100 / 3.6 / 111000;
    const sec = elapsed * 1.5;
    const finalLat = evadeStartPosRef.current.lat + evadeDirRef.current.dlat * EVADE_SPD * sec;
    const finalLng = evadeStartPosRef.current.lng + evadeDirRef.current.dlng * EVADE_SPD * sec;
    setIsEvading(false);
    emergencyLandSingle(activeUav.id, finalLat, finalLng);
  }, [tick, isEvading, activeUav.status]);

  const activeHistory = historyRef.current[selectedMetric] ?? [];
  const activeMeta    = metricMeta[selectedMetric];

  // Chart geometry helpers (chartX=60 left margin for Y-axis)
  const CX = 60; // chart left offset
  const CW = 340; // chart width
  const CH = 110; // chart height

  const dataMin = activeHistory.length ? Math.min(...activeHistory) : activeMeta.base - activeMeta.variance;
  const dataMax = activeHistory.length ? Math.max(...activeHistory) : activeMeta.base + activeMeta.variance;
  const pad     = (dataMax - dataMin) * 0.15 || 1;
  const yMin    = dataMin - pad;
  const yMax    = dataMax + pad;

  const toX = (i: number) => CX + (activeHistory.length <= 1 ? CW : (i / (activeHistory.length - 1)) * CW);
  const toY = (v: number) => 8 + CH - ((v - yMin) / (yMax - yMin)) * CH;

  const polyPoints = activeHistory.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const areaPoints = activeHistory.length
    ? `${CX},${8 + CH} ${polyPoints} ${toX(activeHistory.length - 1)},${8 + CH}`
    : "";

  // Y-axis ticks (4 evenly spaced)
  const yTicks = [0, 1, 2, 3].map(i => yMin + ((yMax - yMin) * i) / 3);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgW = rect.width;
    const relX = (e.clientX - rect.left) / svgW * (CX + CW + 10); // scale to viewBox
    if (relX < CX || activeHistory.length < 2) { setHoverPoint(null); return; }
    const frac = (relX - CX) / CW;
    const idx  = Math.round(frac * (activeHistory.length - 1));
    const clamped = Math.max(0, Math.min(activeHistory.length - 1, idx));
    setHoverPoint({ idx: clamped, x: toX(clamped), y: toY(activeHistory[clamped]), value: activeHistory[clamped] });
  };

  // Remove the duplicate battery const below (already declared above)
  const wind = 12 + (tick % 4);
  const heading = (tick * 8) % 360;

  // Mock Storm Cell: live position drifts with tick, time offset shifts it further along path
  const stormBaseLat = baseLat + 0.0121;
  const stormBaseLng = baseLng - 0.0134;
  const stormLat = stormBaseLat - (tick * 0.00014) - (timeOffset * 0.008);
  const stormLng = stormBaseLng + (tick * 0.00016) + (timeOffset * 0.008);

  // Labels for time slider ticks
  const now = new Date();
  const getTimeLabel = (offset: number) => {
    const d = new Date(now.getTime() + offset * 3600 * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Storm intensity changes over time
  const stormOpacity = Math.max(0.15, Math.min(0.65, 0.5 + timeOffset * 0.04));
  const stormRadius = Math.max(400, 800 + timeOffset * 80);

  // Tile display: read last recorded value from the rolling buffer (same source as chart)
  const lastVal = (key: string, fallback: number) =>
    historyRef.current[key].length > 0 ? historyRef.current[key][historyRef.current[key].length - 1] : fallback;
  const temperature = lastVal("Temperature", 29);
  const humidity    = lastVal("Humidity",    60);
  const pressure    = lastVal("Pressure",    996);
  const visibility  = lastVal("Visibility",  5.5);
  const uvIndex     = lastVal("UV Index",    8.5);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" /> Mission Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <MonitorDot className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground">{activeUav.id}</span>
            <span>•</span>
            <span>{activeUav.city}</span>
            <span>•</span>
            <span>Live telemetry</span>
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            to="/control"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/60 px-3 py-1.5 rounded-full border border-border transition-colors"
          >
            <Plane className="h-3.5 w-3.5" /> Switch UAV
          </Link>
          <div className="flex items-center gap-2 text-sm bg-card/50 px-3 py-1.5 rounded-full border border-border">
            <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${
              activeUav.status === "running" ? "bg-[oklch(var(--success))]" :
              activeUav.status === "landing" ? "bg-destructive" : "bg-muted-foreground"
            }`} />
            <span className="text-foreground font-medium">
              {activeUav.status === "running" ? "In Flight" : activeUav.status === "landing" ? "Landing" : "Grounded"}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Battery} label="Battery" value={battery} unit="%" tone={battery < 20 ? "danger" : "success"} tooltip="Current power reserves. Return to base if below 20%." />
        <StatCard icon={MountainSnow} label="Altitude" value={altitude} unit="m" tooltip="Distance above ground level. Max allowed 150m." />
        <StatCard icon={Gauge} label="Speed" value={speed} unit="km/h" tooltip="Current ground speed." />
        <StatCard icon={Wind} label="Wind" value={wind} unit="km/h" tone={wind > 20 ? "warning" : "default"} tooltip="Local wind speed. >20km/h triggers warnings." />
      </div>

      {/* ── Quick Actions Bar (Error Prevention) ─────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Tactical Command — {activeUav.id}</p>
            <p className="text-xs text-muted-foreground">All critical actions require confirmation before execution.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => setConfirmRTH(true)}
            disabled={activeUav.status !== "running"}
            variant="outline"
            className="h-10 font-bold border-border bg-secondary text-foreground hover:bg-secondary/70 gap-2"
          >
            <Home className="h-4 w-4" /> Return to Base
          </Button>
          <Button
            onClick={() => setConfirmEmergency(true)}
            disabled={activeUav.status === "idle"}
            className="h-10 font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            style={{ boxShadow: activeUav.status === "idle" ? "none" : "0 4px 20px -4px oklch(0.62 0.24 25 / 0.6)" }}
          >
            <Siren className="h-4 w-4" /> Emergency Land
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Satellite className="h-4 w-4 text-primary" /> Live Map View
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">{uavLat.toFixed(4)}° N, {Math.abs(uavLng).toFixed(4)}° E</span>
              <button 
                onClick={() => setMapMode(m => m === "satellite" ? "weather" : "satellite")}
                className="flex items-center gap-1.5 text-xs font-medium bg-secondary hover:bg-secondary/80 text-foreground px-2.5 py-1.5 rounded-md border border-border transition-colors cursor-pointer"
              >
                {mapMode === "satellite" ? <CloudRain className="h-3.5 w-3.5 text-blue-400" /> : <Layers className="h-3.5 w-3.5 text-primary" />}
                {mapMode === "satellite" ? "Weather Radar" : "Satellite View"}
              </button>
            </div>
          </div>
          <div className="relative h-[420px] w-full bg-secondary">
            <MapContainer center={[baseLat, baseLng]} zoom={15} style={{ height: "100%", width: "100%", zIndex: 0 }} zoomControl={false}>
              <RecenterButton center={[baseLat, baseLng]} zoom={15} />
              
              {mapMode === "satellite" ? (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri"
                />
              ) : (
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; CARTO"
                />
              )}

              {mapMode === "weather" && (
                <>
                  <Circle center={[stormLat, stormLng]} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: stormOpacity }} radius={stormRadius} />
                  <Circle center={[stormLat + 0.001, stormLng - 0.001]} pathOptions={{ color: 'transparent', fillColor: '#eab308', fillOpacity: stormOpacity * 0.8 }} radius={stormRadius * 1.5} />
                  <Circle center={[stormLat + 0.002, stormLng - 0.002]} pathOptions={{ color: 'transparent', fillColor: '#22c55e', fillOpacity: stormOpacity * 0.5 }} radius={stormRadius * 2.0} />
                  <Marker position={[stormLat, stormLng]} icon={stormIcon}>
                    <Popup className="text-xs">
                      <strong className="text-destructive">Severe Thunderstorm</strong><br />
                      Moving SE at 55km/h<br />
                      High wind sheer detected.
                    </Popup>
                  </Marker>
                </>
              )}

              <Marker position={[baseLat, baseLng]} icon={mapMode === "satellite" ? baseIconSat : baseIconWeather}>
                <Popup className="text-xs">
                  <strong>{activeUav.city} Base</strong><br />
                  Home Waypoint
                </Popup>
              </Marker>
              <Marker position={[uavLat, uavLng]} icon={
                activeUav.status === "idle"
                  ? (mapMode === "satellite" ? uavIconIdleSat : uavIconIdleWeather)
                  : activeUav.status === "landing"
                  ? (mapMode === "satellite" ? uavIconLandingSat : uavIconLandingWeather)
                  : (mapMode === "satellite" ? uavIconSat : uavIconWeather)
              }>
                <Popup className="text-xs">
                  <strong>{activeUav.id} Live Telemetry</strong><br />
                  {activeUav.city}<br />
                  Altitude: {altitude}m<br />
                  Speed: {speed}km/h
                </Popup>
              </Marker>
            </MapContainer>
            
            {mapMode === "weather" && (
              <div className="absolute top-3 right-3 z-10 bg-background/95 backdrop-blur border border-destructive/50 rounded-lg p-3 shadow-sm w-44">
                <div className="flex items-center gap-2 text-destructive mb-3 font-semibold text-xs">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Weather Alert</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" /> Severe Storm
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" /> Heavy Rain
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" /> Light Rain
                  </div>
                </div>
              </div>
            )}

            {/* Compass overlay — always visible on map, satellite mode top-left, weather mode top-left */}
            <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur border border-border rounded-full p-1 shadow-sm pointer-events-none" style={{ width: 56, height: 56 }}>
              <div className="relative w-full h-full flex items-center justify-center">
                <span className="absolute top-0.5 text-[9px] text-muted-foreground font-bold leading-none">N</span>
                <span className="absolute bottom-0.5 text-[9px] text-muted-foreground leading-none">S</span>
                <span className="absolute left-0.5 text-[9px] text-muted-foreground leading-none">W</span>
                <span className="absolute right-0.5 text-[9px] text-muted-foreground leading-none">E</span>
                <div
                  className="absolute w-0.5 rounded-full"
                  style={{ height: 18, background: 'linear-gradient(to top, #6b7280, #ef4444)', bottom: '50%', transformOrigin: 'bottom center', transform: `rotate(${heading}deg)` }}
                />
                <div className="h-1.5 w-1.5 rounded-full bg-primary z-10" />
              </div>
            </div>

            <div className="absolute bottom-3 left-3 z-10 bg-background/80 backdrop-blur border border-border rounded-md px-3 py-1.5 text-xs text-muted-foreground shadow-sm pointer-events-none">
              {mapMode === "satellite" ? "Esri Satellite View" : "Tactical Weather Radar"} • Drag to pan
            </div>

            {/* Time Slider — only in Weather Mode */}
            {mapMode === "weather" && (
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-md border-t border-border/60 px-4 pt-3 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    Weather Timeline
                  </div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    timeOffset < 0
                      ? 'bg-blue-500/20 text-blue-400'
                      : timeOffset > 0
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {timeOffset < 0 ? `${Math.abs(timeOffset)}h Ago` : timeOffset > 0 ? `+${timeOffset}h Forecast` : '⬤ Live'}
                  </div>
                </div>

                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={1}
                  value={timeOffset}
                  onChange={(e) => setTimeOffset(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((timeOffset + 4) / 8) * 100}%, #334155 ${((timeOffset + 4) / 8) * 100}%, #334155 100%)`
                  }}
                />

                <div className="flex justify-between mt-1.5">
                  {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((h) => (
                    <button
                      key={h}
                      onClick={() => setTimeOffset(h)}
                      className={`text-[10px] flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                        h === timeOffset ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className={`w-0.5 h-1.5 rounded-full ${h === timeOffset ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                      <span>{h === 0 ? 'Now' : getTimeLabel(h)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar — System Health + Mission Events */}
        <div className="h-full">
          <div className="bg-card border border-border rounded-2xl p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Signal className="h-4 w-4 text-primary" /> System Health
            </h3>
            <div className="space-y-2.5">
              {[
                { label: "RC Link",      value: 96, icon: Radio },
                { label: "GPS Fix",      value: 88, icon: Satellite },
                { label: "Video Stream", value: 72, icon: Video },
                { label: "Telemetry",    value: 91, icon: Wifi },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <s.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className={`font-semibold ${ s.value >= 85 ? 'text-green-400' : s.value >= 70 ? 'text-yellow-400' : 'text-red-400' }`}>{s.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${ s.value >= 85 ? 'bg-green-500' : s.value >= 70 ? 'bg-yellow-500' : 'bg-red-500' }`} style={{ width: `${s.value}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-3 flex-1 flex flex-col">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 shrink-0">
                <Activity className="h-4 w-4 text-primary" /> Mission Events
              </h3>
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {MISSION_EVENTS.map((e, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${ e.ok ? 'text-green-400' : 'text-red-400' }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug">{e.text}</p>
                      <p className="text-[10px] text-muted-foreground">{e.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Conditions — full width, tiles + live chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <CloudRain className="h-4 w-4 text-primary" /> Environmental Conditions
          <span className="ml-auto text-[10px] text-muted-foreground font-normal">{activeUav.id} • {activeUav.city} • Click a metric to inspect</span>
        </h3>
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Metric tiles */}
          <div className="flex lg:flex-col gap-3 lg:w-44 shrink-0">
            {[
              { label: "Temperature", value: `${temperature}°C`,   icon: Thermometer, color: temperature > 35 ? "#ef4444" : "#f97316",  sub: temperature > 35 ? "High" : "Moderate" },
              { label: "Humidity",    value: `${humidity}%`,       icon: Droplets,    color: humidity > 70 ? "#3b82f6" : "#22d3ee",     sub: humidity > 70 ? "Humid" : "Comfortable" },
              { label: "Pressure",    value: `${pressure} hPa`,    icon: GaugeIcon,   color: "#a78bfa",                                  sub: "Normal" },
              { label: "Visibility",  value: `${visibility} km`,   icon: Eye,         color: visibility < 5 ? "#eab308" : "#4ade80",    sub: visibility < 5 ? "Reduced" : "Clear" },
              { label: "UV Index",    value: `${uvIndex}`,         icon: MountainSnow,color: uvIndex >= 8 ? "#ef4444" : uvIndex >= 6 ? "#f97316" : "#fbbf24", sub: uvIndex >= 8 ? "Very High" : "High" },
            ].map((item) => {
              const active = selectedMetric === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setSelectedMetric(item.label)}
                  className={`flex items-center gap-3 lg:flex-row rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer border ${
                    active ? 'border-primary/60 bg-primary/10' : 'border-border bg-secondary/40 hover:bg-secondary/70'
                  }`}
                >
                  <item.icon style={{ color: item.color }} className="h-4 w-4 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                  {active && <div className="ml-auto w-1 h-8 rounded-full hidden lg:block" style={{ background: item.color }} />}
                </button>
              );
            })}
          </div>

          {/* Live Chart */}
          <div className="flex-1 bg-secondary/30 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">{selectedMetric} — Last 1 min</span>
              <span className="text-xs text-muted-foreground">Live • 1.5s interval • Click line to inspect</span>
            </div>
            <div className="flex-1 relative min-h-[140px]">
              <svg
                width="100%" height="100%"
                viewBox={`0 0 ${CX + CW + 10} ${8 + CH + 4}`}
                preserveAspectRatio="none"
                className="absolute inset-0 cursor-crosshair"
                onClick={handleSvgClick}
              >
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeMeta.color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={activeMeta.color} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-axis labels + grid lines */}
                {yTicks.map((v, i) => {
                  const yPos = toY(v);
                  return (
                    <g key={i}>
                      <line x1={CX} y1={yPos} x2={CX + CW} y2={yPos}
                        stroke="white" strokeOpacity="0.06" strokeWidth="1" />
                      <text x={CX - 6} y={yPos + 3.5} textAnchor="end"
                        fontSize="8" fill="#94a3b8">
                        {+v.toFixed(1)}{activeMeta.unit}
                      </text>
                    </g>
                  );
                })}

                {/* Y-axis line */}
                <line x1={CX} y1="8" x2={CX} y2={8 + CH}
                  stroke="white" strokeOpacity="0.15" strokeWidth="1" />

                {/* Area */}
                {areaPoints && <polygon points={areaPoints} fill="url(#sparkGrad)" />}

                {/* Line */}
                {polyPoints && (
                  <polyline points={polyPoints} fill="none"
                    stroke={activeMeta.color} strokeWidth="2"
                    strokeLinejoin="round" strokeLinecap="round" />
                )}

                {/* Live dot at end */}
                {activeHistory.length > 0 && (
                  <circle
                    cx={toX(activeHistory.length - 1)}
                    cy={toY(activeHistory[activeHistory.length - 1])}
                    r="4" fill={activeMeta.color} stroke="white" strokeWidth="1.5"
                  />
                )}

                {/* Hover crosshair + tooltip */}
                {hoverPoint && (
                  <g>
                    <line x1={hoverPoint.x} y1="8" x2={hoverPoint.x} y2={8 + CH}
                      stroke={activeMeta.color} strokeOpacity="0.6" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx={hoverPoint.x} cy={hoverPoint.y} r="5"
                      fill={activeMeta.color} stroke="white" strokeWidth="2" />
                    <rect
                      x={Math.min(hoverPoint.x - 28, CX + CW - 60)}
                      y={hoverPoint.y - 26}
                      width="60" height="20" rx="4"
                      fill="#1e293b" stroke={activeMeta.color} strokeWidth="1" strokeOpacity="0.7"
                    />
                    <text
                      x={Math.min(hoverPoint.x - 28, CX + CW - 60) + 30}
                      y={hoverPoint.y - 12}
                      textAnchor="middle" fontSize="9" fontWeight="700"
                      fill={activeMeta.color}
                    >
                      {hoverPoint.value}{activeMeta.unit}
                    </text>
                  </g>
                )}
              </svg>
            </div>
            {/* X-axis labels */}
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground" style={{ paddingLeft: CX, paddingRight: 10 }}>
              <span>-60s</span><span>-45s</span><span>-30s</span><span>-15s</span><span>Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Storm Threat Alert Modal ──────────────────────────────────────── */}
      <Dialog open={stormAlertOpen} onOpenChange={setStormAlertOpen}>
        <DialogContent className="bg-card border-amber-500/50 max-w-lg" style={{ boxShadow: "0 0 60px -10px rgba(245,158,11,0.4)" }}>
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-3 animate-pulse">
              <CloudLightning className="h-7 w-7 text-amber-400" />
            </div>
            <DialogTitle className="text-center text-amber-400 text-lg font-extrabold uppercase tracking-wider">
              ⚠ Incoming Storm Detected
            </DialogTitle>
            <DialogDescription className="text-center mt-2 space-y-2">
              <span className="block font-semibold text-foreground">{activeUav.id} — {activeUav.city}</span>
              <span className="block text-muted-foreground">
                Heavy rain radius will reach UAV in approximately{" "}
                <span className="text-amber-400 font-bold">{stormEtaSeconds}s</span>.
              </span>
              {stormRecommendation === "rth" && (
                <span className="block mt-2 text-sm bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 text-primary font-medium">
                  ✦ System Recommendation: <strong>Return to Base</strong> — sufficient time to reach home waypoint safely before storm arrives.
                </span>
              )}
              {stormRecommendation === "land" && (
                <span className="block mt-2 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-amber-300 font-medium">
                  ✦ System Recommendation: <strong>Land Immediately</strong> — RTH is too slow; descend in place before storm hits.
                </span>
              )}
              {stormRecommendation === "evade" && (
                <span className="block mt-2 text-sm bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-destructive font-medium">
                  ✦ System Recommendation: <strong>Evade &amp; Land</strong> — storm intercepts all landing options. UAV will accelerate to 100 km/h away from storm, then land.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setStormAlertOpen(false)}
              className="flex-1 border-border bg-secondary text-foreground hover:bg-secondary/70"
            >
              Dismiss (Fly Manually)
            </Button>
            {stormRecommendation === "rth" && (
              <Button
                onClick={() => {
                  setStatusSingle(activeUav.id, "idle");
                  setStormAlertOpen(false);
                  toast(`${activeUav.id} — Storm RTH initiated`, { description: "Returning to base before storm arrives.", icon: <Home className="h-4 w-4" /> });
                }}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                <Home className="h-4 w-4 mr-2" /> Return to Base
              </Button>
            )}
            {stormRecommendation === "land" && (
              <Button
                onClick={() => {
                  emergencyLandSingle(activeUav.id, frozenPosRef.current.lat, frozenPosRef.current.lng);
                  setStormAlertOpen(false);
                  toast.error(`${activeUav.id} — Emergency landing in place`, { description: "Descending before storm reaches UAV." });
                }}
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
              >
                <Siren className="h-4 w-4 mr-2" /> Land Immediately
              </Button>
            )}
            {stormRecommendation === "evade" && (
              <Button
                onClick={() => {
                  // Compute evade direction (away from storm, normalised in lat/lng space)
                  const R = 111000;
                  const cosLat = Math.cos(baseLat * Math.PI / 180);
                  const sLat = baseLat + 0.0121 - tick * 0.00014;
                  const sLng = baseLng - 0.0134 + tick * 0.00016;
                  const dLat = (uavLat - sLat) * R;
                  const dLng = (uavLng - sLng) * R * cosLat;
                  const dist = Math.sqrt(dLat * dLat + dLng * dLng) || 1;
                  evadeStartPosRef.current = { lat: uavLat, lng: uavLng };
                  evadeDirRef.current = { dlat: dLat / dist, dlng: (dLng / dist) / cosLat };
                  evadeStartTickRef.current = tick;
                  setIsEvading(true);
                  setStormAlertOpen(false);
                  toast.warning(`${activeUav.id} — Storm evasion maneuver started`, { description: "Accelerating to 100 km/h away from storm." });
                }}
                className="flex-1 bg-amber-500 text-black hover:bg-amber-400 font-bold"
              >
                <CloudLightning className="h-4 w-4 mr-2" /> Evade &amp; Land
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Emergency Land Confirmation Dialog ───────────────────────────── */}
      <Dialog open={confirmEmergency} onOpenChange={setConfirmEmergency}>

        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-full bg-destructive/20 flex items-center justify-center mb-3">
              <Siren className="h-7 w-7 text-destructive animate-pulse" />
            </div>
            <DialogTitle className="text-center text-foreground text-lg">
              Confirm Emergency Landing
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground mt-2">
              <span className="block font-semibold text-foreground mb-1">{activeUav.id} — {activeUav.city}</span>
              This will immediately cut mission and descend at current position. This action <span className="text-destructive font-bold">cannot be undone</span>. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmEmergency(false)}
              className="flex-1 border-border bg-secondary text-foreground hover:bg-secondary/70"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                emergencyLandSingle(activeUav.id, frozenPosRef.current.lat, frozenPosRef.current.lng);
                setConfirmEmergency(false);
                toast.error(`${activeUav.id} — Emergency landing initiated`, {
                  description: `${activeUav.city} drone descending in place.`,
                });
              }}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              <Siren className="h-4 w-4 mr-2" /> Confirm Landing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Return to Base Confirmation Dialog ───────────────────────────── */}
      <Dialog open={confirmRTH} onOpenChange={setConfirmRTH}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Home className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center text-foreground text-lg">
              Confirm Return to Base
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground mt-2">
              <span className="block font-semibold text-foreground mb-1">{activeUav.id} — {activeUav.city}</span>
              The drone will abort its current mission and autonomously navigate back to the home waypoint. Confirm?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmRTH(false)}
              className="flex-1 border-border bg-secondary text-foreground hover:bg-secondary/70"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setStatusSingle(activeUav.id, "idle");
                setConfirmRTH(false);
                toast(`${activeUav.id} — Returning to base`, {
                  description: "Autonomous navigation to home waypoint initiated.",
                  icon: <Home className="h-4 w-4" />,
                });
              }}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              <Home className="h-4 w-4 mr-2" /> Confirm RTH
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Battery Critical Interception Modal ──────────────────────────── */}
      <Dialog open={batteryAlertOpen} onOpenChange={setBatteryAlertOpen}>
        <DialogContent className="bg-card border-destructive/50 max-w-md" style={{ boxShadow: "0 0 60px -10px oklch(0.62 0.24 25 / 0.5)" }}>
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-full bg-destructive/20 flex items-center justify-center mb-3 animate-pulse">
              <Battery className="h-7 w-7 text-destructive" />
            </div>
            <DialogTitle className="text-center text-destructive text-lg font-extrabold uppercase tracking-wider">
              ⚠ Critical Battery Warning
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              <span className="block font-semibold text-foreground mb-1">{activeUav.id} — {activeUav.city}</span>
              <span className="text-destructive font-bold text-base">{battery}% remaining.</span>{" "}
              <span className="text-muted-foreground">Battery is below safe operating threshold. Initiate Return to Base now?</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setBatteryAlertOpen(false);
                toast.warning("Override acknowledged — monitor battery closely.", { duration: 5000 });
              }}
              className="flex-1 border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              Override — Keep Flying
            </Button>
            <Button
              onClick={() => {
                setStatusSingle(activeUav.id, "idle");
                setBatteryAlertOpen(false);
                toast(`${activeUav.id} — Returning to base`, {
                  description: "Low battery RTH initiated.",
                  icon: <Home className="h-4 w-4" />,
                });
              }}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              <Home className="h-4 w-4 mr-2" /> Yes, Return to Base
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RecenterButton({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  return (
    <button
      onClick={() => map.flyTo(center, zoom, { animate: true, duration: 1.5 })}
      className="absolute bottom-16 right-3 z-10 bg-background/90 backdrop-blur border border-border rounded-md p-2 shadow-sm text-foreground hover:bg-secondary transition-colors"
      title="Recenter Map"
    >
      <LocateFixed className="h-4 w-4" />
    </button>
  );
}