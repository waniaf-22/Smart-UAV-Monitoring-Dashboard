import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/uav/AppLayout";
import { SettingsScreen } from "@/components/uav/SettingsScreen";

export const Route = createFileRoute("/settings")({
  component: () => (
    <AppLayout>
      <SettingsScreen />
    </AppLayout>
  ),
  head: () => ({
    meta: [
      { title: "Settings — AeroCommand" },
      { name: "description", content: "Configure application settings." },
    ],
  }),
});
