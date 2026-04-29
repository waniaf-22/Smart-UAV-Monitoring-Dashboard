import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/uav/AppLayout";
import { WeatherAlert } from "@/components/uav/WeatherAlert";

export const Route = createFileRoute("/alerts")({
  component: () => (
    <AppLayout>
      <WeatherAlert />
    </AppLayout>
  ),
  head: () => ({
    meta: [
      { title: "Weather Alert — AeroCommand" },
      { name: "description", content: "Severe weather warning and recommended pilot actions." },
    ],
  }),
});
