import { useEffect, useRef, useState } from "react";
import { Battery, Gauge, MountainSnow, Wind, Satellite, Signal, Compass, Plane, Layers, CloudRain, CloudLightning, AlertTriangle, Clock, Activity, Radio, Wifi, Video, CheckCircle2, Thermometer, Droplets, Eye, Gauge as GaugeIcon } from "lucide-react";
import { StatCard } from "./StatCard";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const baseLat = 24.8567;
const baseLng = 67.2644;

const uavIconSat = L.divIcon({
  html: `<div style="background-color: #10b981; border: 2.5px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.6);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8.5L8 12l-4 4-2.5-.5-1.5 1.5L4 20l3-4 4-4 3.5 5.5 1.7-1.3z"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const baseIconSat = L.divIcon({
  html: `<div style="background-color: #3b82f6; border: 2.5px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.6);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const uavIconWeather = L.divIcon({
  html: `<div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 6px #10b981) drop-shadow(0 0 12px #10b981);"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 8.5L8 12l-4 4-2.5-.5-1.5 1.5L4 20l3-4 4-4 3.5 5.5 1.7-1.3z"/></svg></div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const baseIconWeather = L.divIcon({
  html: `<div style="display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 6px #3b82f6) drop-shadow(0 0 12px #3b82f6);"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const stormIcon = L.divIcon({
  html: `<div style="background: rgba(239, 68, 68, 0.2); border-radius: 50%; padding: 6px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); border: 1px solid rgba(239, 68, 68, 0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"></path><path d="m13 12-3 5h4l-3 5"></path></svg></div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const MISSION_EVENTS = [
  { time: "-0m",  text: "Entering Sector B",        ok: true  },
  { time: "-4m",  text: "Wind speed normal",         ok: true  },
  { time: "-9m",  text: "Storm detected NW",         ok: false },
  { time: "-14m", text: "GPS lock acquired",          ok: true  },
  { time: "-21m", text: "Takeoff from base",          ok: true  },
];

export function Dashboard() {
  const [tick, setTick] = useState(0);
  const [mapMode, setMapMode] = useState<"satellite" | "weather">("satellite");
  const [timeOffset, setTimeOffset] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState("Temperature");
  const [hoverPoint, setHoverPoint] = useState<{ idx: number; x: number; y: number; value: number } | null>(null);

  // Rolling history: 40 samples × 1.5s = 60s of data
  const HISTORY_LEN = 40;
  const historyRef = useRef<Record<string, number[]>>({
    Temperature: [], Humidity: [], Pressure: [], Visibility: [], "UV Index": [],
  });
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
        // Append ONE real new reading per tick — past readings never change
        const newVals: Record<string, number> = {
          Temperature: 31 + (next % 3),
          Humidity:    62 + (next % 8),
          Pressure:    1011 + (next % 5),
          Visibility:  parseFloat((7.2 - (next % 4) * 0.3).toFixed(1)),
          "UV Index":  6 + (next % 3),
        };
        Object.keys(newVals).forEach((k) => {
          const arr = historyRef.current[k];
          // Add slight natural noise so graph doesn't look mechanical
          const noise = (Math.random() - 0.5) * metricMeta[k].variance * 0.6;
          arr.push(+(newVals[k] + noise).toFixed(2));
          if (arr.length > HISTORY_LEN) arr.shift();
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

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

  const battery = 78 - (tick % 6);
  const altitude = 124 + ((tick * 3) % 18);
  const speed = 42 + ((tick * 2) % 9);
  const wind = 12 + (tick % 4);
  const heading = (tick * 8) % 360;
  const uavLat = baseLat + Math.sin(tick / 8) * 0.003;
  const uavLng = baseLng + Math.cos(tick / 8) * 0.003;

  // Mock Storm Cell: live position drifts with tick, time offset shifts it further along path
  const stormBaseLat = baseLat - 0.02 + (tick * 0.00015);
  const stormBaseLng = baseLng + 0.015 - (tick * 0.00015);
  const stormLat = stormBaseLat + (timeOffset * 0.008);
  const stormLng = stormBaseLng - (timeOffset * 0.008);

  // Labels for time slider ticks
  const now = new Date();
  const getTimeLabel = (offset: number) => {
    const d = new Date(now.getTime() + offset * 3600 * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Storm intensity changes over time
  const stormOpacity = Math.max(0.15, Math.min(0.65, 0.5 + timeOffset * 0.04));
  const stormRadius = Math.max(400, 800 + timeOffset * 80);

  // Environmental conditions — used by metric tiles
  const temperature = 28 + (tick % 3);
  const humidity    = 58 + (tick % 5);
  const pressure    = 995 + (tick % 3);
  const visibility  = parseFloat((5.5 - (tick % 4) * 0.2).toFixed(1));
  const uvIndex     = 8 + (tick % 2);

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mission Dashboard</h1>
          <p className="text-sm text-muted-foreground">UAV-07 • Sector B • Live telemetry</p>
        </div>
        <div className="flex items-center gap-2 text-sm self-start sm:self-auto bg-card/50 px-3 py-1.5 rounded-full border border-border">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(var(--success))] animate-pulse" />
          <span className="text-foreground font-medium">In Flight</span>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Battery} label="Battery" value={battery} unit="%" tone={battery < 20 ? "danger" : "success"} tooltip="Current power reserves. Return to base if below 20%." />
        <StatCard icon={MountainSnow} label="Altitude" value={altitude} unit="m" tooltip="Distance above ground level. Max allowed 150m." />
        <StatCard icon={Gauge} label="Speed" value={speed} unit="km/h" tooltip="Current ground speed." />
        <StatCard icon={Wind} label="Wind" value={wind} unit="km/h" tone={wind > 20 ? "warning" : "default"} tooltip="Local wind speed. >20km/h triggers warnings." />
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
            <MapContainer center={[baseLat, baseLng]} zoom={13} style={{ height: "100%", width: "100%", zIndex: 0 }} zoomControl={false}>
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
                  <Circle center={[stormLat + 0.003, stormLng - 0.003]} pathOptions={{ color: 'transparent', fillColor: '#eab308', fillOpacity: stormOpacity * 0.8 }} radius={stormRadius * 2.2} />
                  <Circle center={[stormLat + 0.006, stormLng - 0.006]} pathOptions={{ color: 'transparent', fillColor: '#22c55e', fillOpacity: stormOpacity * 0.5 }} radius={stormRadius * 4.4} />
                  <Marker position={[stormLat, stormLng]} icon={stormIcon}>
                    <Popup className="text-xs">
                      <strong className="text-destructive">Severe Thunderstorm</strong><br />
                      Moving SE at 35km/h<br />
                      High wind sheer detected.
                    </Popup>
                  </Marker>
                </>
              )}

              <Marker position={[baseLat, baseLng]} icon={mapMode === "satellite" ? baseIconSat : baseIconWeather}>
                <Popup className="text-xs">
                  <strong>FAST NUCES Karachi</strong><br />
                  Base Operations
                </Popup>
              </Marker>
              <Marker position={[uavLat, uavLng]} icon={mapMode === "satellite" ? uavIconSat : uavIconWeather}>
                <Popup className="text-xs">
                  <strong>UAV-07 Live Telemetry</strong><br />
                  Altitude: {altitude}m<br />
                  Speed: {speed}km/h
                </Popup>
              </Marker>
            </MapContainer>
            
            {mapMode === "weather" && (
              <div className="absolute top-3 right-3 z-[500] bg-background/95 backdrop-blur border border-destructive/50 rounded-lg p-3 shadow-sm w-44">
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
            <div className="absolute top-3 left-3 z-[500] bg-background/80 backdrop-blur border border-border rounded-full p-1 shadow-sm pointer-events-none" style={{ width: 56, height: 56 }}>
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

            <div className="absolute bottom-3 left-3 z-[500] bg-background/80 backdrop-blur border border-border rounded-md px-3 py-1.5 text-xs text-muted-foreground shadow-sm pointer-events-none">
              {mapMode === "satellite" ? "Esri Satellite View" : "Tactical Weather Radar"} • Drag to pan
            </div>

            {/* Time Slider — only in Weather Mode */}
            {mapMode === "weather" && (
              <div className="absolute bottom-0 left-0 right-0 z-[500] bg-background/95 backdrop-blur-md border-t border-border/60 px-4 pt-3 pb-3">
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
          <span className="ml-auto text-[10px] text-muted-foreground font-normal">Sector B • FAST NUCES Karachi • Click a metric to inspect</span>
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
    </div>
  );
}