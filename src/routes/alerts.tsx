import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/uav/AppLayout";
import { WindAlert } from "@/components/uav/WindAlert";

export const Route = createFileRoute("/alerts")({
  component: () => (
    <AppLayout>
      <WindAlert />
    </AppLayout>
  ),
  head: () => ({
    meta: [
      { title: "Wind Alert — AeroCommand" },
      { name: "description", content: "High wind warning and recommended pilot actions." },
    ],
  }),
});
