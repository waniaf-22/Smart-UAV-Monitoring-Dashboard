import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/uav/AppLayout";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});