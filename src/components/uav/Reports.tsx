import { useState, useMemo } from "react";
import { CheckCircle2, AlertTriangle, Clock, Download, Filter, Calendar, MapPin, BarChart3, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FlightLog {
  id: string;
  city: string;
  date: string;
  time: string;
  duration: string;
  distance: number;
  efficiency: number;
  status: "ok" | "warn";
}

const MOCK_FLIGHTS: FlightLog[] = [
  { id: "FL-2310", city: "Islamabad", date: "2026-04-27", time: "08:15", duration: "00:42:18", distance: 12.4, efficiency: 88, status: "ok" },
  { id: "FL-2309", city: "Karachi", date: "2026-04-27", time: "14:30", duration: "01:05:02", distance: 18.7, efficiency: 92, status: "ok" },
  { id: "FL-2308", city: "Lahore", date: "2026-04-26", time: "09:00", duration: "00:18:44", distance: 4.2, efficiency: 65, status: "warn" },
  { id: "FL-2307", city: "Islamabad", date: "2026-04-26", time: "16:45", duration: "00:55:30", distance: 15.1, efficiency: 85, status: "ok" },
  { id: "FL-2306", city: "Hyderabad", date: "2026-04-25", time: "11:20", duration: "00:09:12", distance: 1.8, efficiency: 58, status: "warn" },
  { id: "FL-2305", city: "Larkana", date: "2026-04-25", time: "15:10", duration: "00:30:00", distance: 8.5, efficiency: 75, status: "ok" },
  { id: "FL-2304", city: "Peshawar", date: "2026-04-24", time: "07:30", duration: "01:10:00", distance: 20.0, efficiency: 95, status: "ok" },
  { id: "FL-2303", city: "Karachi", date: "2026-04-24", time: "19:00", duration: "00:45:00", distance: 14.0, efficiency: 82, status: "ok" },
  { id: "FL-2302", city: "Quetta", date: "2026-04-23", time: "10:05", duration: "00:25:00", distance: 6.5, efficiency: 70, status: "ok" },
  { id: "FL-2301", city: "Islamabad", date: "2026-04-23", time: "13:40", duration: "00:50:00", distance: 16.2, efficiency: 89, status: "ok" },
  { id: "FL-2300", city: "Multan", date: "2026-04-22", time: "11:00", duration: "01:20:00", distance: 22.1, efficiency: 98, status: "ok" },
  { id: "FL-2299", city: "Faisalabad", date: "2026-04-22", time: "14:15", duration: "00:15:30", distance: 3.5, efficiency: 62, status: "warn" },
];

const CITIES = ["All Cities", "Islamabad", "Karachi", "Hyderabad", "Larkana", "Lahore", "Peshawar", "Quetta", "Multan", "Faisalabad", "Rawalpindi", "Gujranwala", "Sialkot", "Bahawalpur", "Sukkur"];
const TIME_RANGES = ["All Times", "Morning (06:00-11:59)", "Afternoon (12:00-17:59)", "Evening (18:00-23:59)", "Night (00:00-05:59)"];

export function Reports() {
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("All Times");
  const [filterCity, setFilterCity] = useState("All Cities");

  const filteredFlights = useMemo(() => {
    return MOCK_FLIGHTS.filter((f) => {
      let match = true;
      if (filterDate && f.date !== filterDate) match = false;
      if (filterCity !== "All Cities" && f.city !== filterCity) match = false;
      
      if (filterTime !== "All Times") {
        const hour = parseInt(f.time.split(":")[0], 10);
        if (filterTime.includes("Morning") && (hour < 6 || hour >= 12)) match = false;
        if (filterTime.includes("Afternoon") && (hour < 12 || hour >= 18)) match = false;
        if (filterTime.includes("Evening") && (hour < 18 || hour > 23)) match = false;
        if (filterTime.includes("Night") && (hour >= 6)) match = false;
      }
      return match;
    }).reverse(); // Reverse so chronologically chart flows left to right
  }, [filterDate, filterTime, filterCity]);

  // Chart data formatting
  const chartData = filteredFlights.map((f, i) => ({
    name: `M${i+1}`,
    id: f.id,
    efficiency: f.efficiency,
    distance: f.distance,
    city: f.city
  }));

  // Summary stats
  const totalFlights = filteredFlights.length;
  const totalDistance = filteredFlights.reduce((acc, f) => acc + f.distance, 0).toFixed(1);
  const avgEfficiency = totalFlights > 0 ? (filteredFlights.reduce((acc, f) => acc + f.efficiency, 0) / totalFlights).toFixed(0) : "0";
  const incidents = filteredFlights.filter((f) => f.status === "warn").length;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" /> Advanced Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Multi-dimensional fleet reporting and performance tracking.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
          <Download className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </header>

      {/* FILTER BAR */}
      <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-lg sticky top-6 z-20">
        <div className="flex items-center gap-2 text-primary font-semibold mr-2 border-r border-border pr-4 hidden md:flex">
          <Filter className="h-5 w-5" /> Filters
        </div>
        
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
            />
          </div>
          
          <div className="flex-1 relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select 
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              {TIME_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
            </select>
          </div>

          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select 
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          
          {/* Clear Filters Button */}
          {(filterDate || filterTime !== "All Times" || filterCity !== "All Cities") && (
            <Button 
              variant="ghost" 
              onClick={() => { setFilterDate(""); setFilterTime("All Times"); setFilterCity("All Cities"); }}
              className="h-10 text-muted-foreground hover:text-foreground shrink-0"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D GRAPH SECTION */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Fleet Performance Matrix
              </h2>
              <span className="text-xs text-muted-foreground">Volumetric Efficiency Tracking ({filteredFlights.length} records)</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full relative z-10">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.7 0.22 38)" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="oklch(0.7 0.22 38)" stopOpacity={0}/>
                    </linearGradient>
                    <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="oklch(0.7 0.22 38)" floodOpacity="0.4" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.35 0.04 250)" vertical={false} />
                  <XAxis dataKey="name" stroke="oklch(0.75 0.02 250)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.75 0.02 250)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'oklch(0.26 0.04 250)', borderColor: 'oklch(0.35 0.04 250)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: 'oklch(0.98 0.005 250)' }}
                    labelStyle={{ color: 'oklch(0.7 0.22 38)', fontWeight: 'bold' }}
                    formatter={(value: any, name: any) => [`${value}${name === 'efficiency' ? '%' : 'km'}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="oklch(0.7 0.22 38)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorEfficiency)" 
                    style={{ filter: "url(#shadow3d)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
                <p>No flights match the selected criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-6">Metrics Summary</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Filtered Flights</p>
                <p className="text-4xl font-black text-foreground">{totalFlights}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Distance Covered</p>
                <p className="text-3xl font-bold text-primary">{totalDistance} <span className="text-lg font-normal text-muted-foreground">km</span></p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Efficiency</p>
                <p className="text-3xl font-bold text-[oklch(var(--success))]">{avgEfficiency}%</p>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aborted / Warn</span>
                  <span className={`text-lg font-bold ${incidents > 0 ? 'text-[oklch(var(--warning))]' : 'text-[oklch(var(--success))]'}`}>
                    {incidents}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED LOGS TABLE */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Filtered Flight Logs</h2>
          <span className="text-xs text-muted-foreground font-mono">{filteredFlights.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/20">
                <th className="px-6 py-4 font-medium">Flight ID</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Distance</th>
                <th className="px-6 py-4 font-medium">Efficiency</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.length > 0 ? (
                filteredFlights.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-secondary/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{f.id}</td>
                    <td className="px-6 py-4 text-foreground flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-primary" /> {f.city}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {f.date} <span className="ml-2 px-1.5 py-0.5 rounded bg-secondary text-xs">{f.time}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground tabular-nums">
                      <Clock className="inline h-3 w-3 mr-1.5" />
                      {f.duration}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground tabular-nums font-medium">{f.distance} km</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${f.efficiency}%` }}></div>
                        </div>
                        <span className="text-xs font-mono">{f.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {f.status === "ok" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[oklch(var(--success))]/10 border border-[oklch(var(--success))]/20 text-xs font-bold text-[oklch(var(--success))] uppercase tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Nominal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[oklch(var(--warning))]/10 border border-[oklch(var(--warning))]/20 text-xs font-bold text-[oklch(var(--warning))] uppercase tracking-wider">
                          <AlertTriangle className="h-3.5 w-3.5" /> Aborted
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No flight records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}