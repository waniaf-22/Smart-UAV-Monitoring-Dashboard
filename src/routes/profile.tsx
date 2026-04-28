import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/uav/AppLayout";
import { ProfileScreen } from "@/components/uav/ProfileScreen";

export const Route = createFileRoute("/profile")({
  component: () => (
    <AppLayout>
      <ProfileScreen />
    </AppLayout>
  ),
  head: () => ({
    meta: [
      { title: "AeroCommand — Operator Profile & Settings" },
      { name: "description", content: "Manage your AeroCommand operator profile and configure application settings." },
    ],
  }),
});
