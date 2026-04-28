import { AlertTriangle, Wind, ArrowDownToLine, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function WindAlert() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-2xl border-2 overflow-hidden"
          style={{
            borderColor: "oklch(0.62 0.24 25)",
            background:
              "linear-gradient(180deg, oklch(0.32 0.12 30) 0%, oklch(0.22 0.06 25) 100%)",
          }}
        >
          <div className="px-8 py-10 text-center">
            <div
              className="inline-flex h-20 w-20 items-center justify-center rounded-full mb-6"
              style={{
                background: "oklch(0.62 0.24 25)",
                boxShadow: "0 0 50px oklch(0.62 0.24 25 / 0.6)",
              }}
            >
              <AlertTriangle className="h-10 w-10 text-foreground animate-pulse" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[oklch(var(--warning))] mb-2">
              Critical Weather Alert
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
              HIGH WIND WARNING
            </h1>
            <p className="text-lg text-foreground/90 max-w-xl mx-auto">
              Sustained winds of <span className="font-bold text-[oklch(var(--warning))]">38 km/h</span>{" "}
              with gusts up to <span className="font-bold text-destructive">52 km/h</span> detected in
              your operational sector.
            </p>
          </div>

          <div className="bg-card/60 backdrop-blur px-8 py-6 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wind className="h-4 w-4 text-primary" /> Recommended Actions
            </h2>
            <ul className="space-y-2 text-sm text-foreground/90 mb-6">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Reduce flight altitude to below 50 meters immediately.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Return UAV to home base if battery falls below 50%.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                Avoid hovering near tall structures or open ridgelines.
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="h-11 px-5 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/control">
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Initiate Return-to-Home
                </Link>
              </Button>
              <Button variant="outline" className="h-11 px-5 border-border bg-secondary text-foreground hover:bg-secondary/80">
                <RotateCcw className="h-4 w-4 mr-2" />
                Acknowledge & Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}