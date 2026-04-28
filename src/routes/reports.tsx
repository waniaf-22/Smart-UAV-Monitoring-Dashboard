import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/uav/AppLayout";
import { Reports } from "@/components/uav/Reports";

export const Route = createFileRoute("/reports")({
  component: () => (
    <AppLayout>
      <Reports />
    </AppLayout>
  ),
  head: () => ({
    meta: [
      { title: "Flight Reports — AeroCommand" },
      { name: "description", content: "Past flight logs and performance graph." },
    ],
  }),
});
