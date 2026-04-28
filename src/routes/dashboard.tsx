import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/uav/AppLayout";
import { Dashboard } from "@/components/uav/Dashboard";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ),
  head: () => ({
    meta: [
      { title: "Mission Dashboard — AeroCommand" },
      { name: "description", content: "Live UAV telemetry: battery, altitude, speed and map view." },
    ],
  }),
});