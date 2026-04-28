import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/uav/AppLayout";
import { ControlPanel } from "@/components/uav/ControlPanel";

export const Route = createFileRoute("/control")({
  component: () => (
    <AppLayout>
      <ControlPanel />
    </AppLayout>
  ),
  head: () => ({
    meta: [
      { title: "Control Panel — AeroCommand" },
      { name: "description", content: "Start, stop and emergency-land UAVs." },
    ],
  }),
});
