import { CheckCircle2, AlertTriangle, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const flights = [
  { id: "FL-2310", date: "2026-04-27", duration: "00:42:18", distance: "12.4 km", status: "ok" as const },
  { id: "FL-2309", date: "2026-04-26", duration: "01:05:02", distance: "18.7 km", status: "ok" as const },
  { id: "FL-2308", date: "2026-04-25", duration: "00:18:44", distance: "4.2 km", status: "warn" as const },
  { id: "FL-2307", date: "2026-04-24", duration: "00:55:30", distance: "15.1 km", status: "ok" as const },
  { id: "FL-2306", date: "2026-04-23", duration: "00:09:12", distance: "1.8 km", status: "warn" as const },
];

const data = [62, 70, 68, 81, 76, 88, 84];

export function Reports() {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 600, H = 200, padX = 24, padY = 20;
  const stepX = (W - padX * 2) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = padX + i * stepX;
    const y = padY + (H - padY * 2) * (1 - (v - min) / (max - min || 1));
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${path} L ${points[points.length - 1][0]} ${H - padY} L ${points[0][0]} ${H - padY} Z`;

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Flight Reports</h1>
          <p className="text-sm text-muted-foreground">History of past missions and aggregate performance.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 self-start sm:self-auto w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Flight Performance</h2>
            <span className="text-xs text-muted-foreground">Last 7 missions • Efficiency %</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Flight performance line graph">
            <defs>
              <linearGradient id="lg-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.22 38)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.7 0.22 38)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={padX} x2={W - padX} y1={padY + i * ((H - padY * 2) / 3)} y2={padY + i * ((H - padY * 2) / 3)} stroke="oklch(0.35 0.04 250)" strokeDasharray="3 4" />
            ))}
            <path d={areaPath} fill="url(#lg-area)" />
            <path d={path} fill="none" stroke="oklch(0.7 0.22 38)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={4} fill="oklch(0.21 0.04 250)" stroke="oklch(0.7 0.22 38)" strokeWidth={2} />
            ))}
            {data.map((_, i) => (
              <text key={i} x={padX + i * stepX} y={H - 4} textAnchor="middle" fontSize="10" fill="oklch(0.75 0.02 250)">M{i + 1}</text>
            ))}
          </svg>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Summary</h2>
          {[
            { label: "Total Flights", value: "127" },
            { label: "Total Hours", value: "84.5h" },
            { label: "Avg. Efficiency", value: "78%" },
            { label: "Incidents", value: "2" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <span className="text-lg font-bold text-foreground tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Flight Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3 font-medium">Flight ID</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Distance</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{f.id}</td>
                  <td className="px-5 py-3 text-muted-foreground">{f.date}</td>
                  <td className="px-5 py-3 text-muted-foreground tabular-nums">
                    <Clock className="inline h-3.5 w-3.5 mr-1.5" />
                    {f.duration}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground tabular-nums">{f.distance}</td>
                  <td className="px-5 py-3">
                    {f.status === "ok" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[oklch(var(--success))]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Nominal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[oklch(var(--warning))]">
                        <AlertTriangle className="h-3.5 w-3.5" /> Aborted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}