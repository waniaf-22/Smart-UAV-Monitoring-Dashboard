import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/uav/LoginScreen";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AeroCommand — UAV Operator Login" },
      { name: "description", content: "Secure login for the AeroCommand UAV monitoring and control platform." },
    ],
  }),
});

function Index() {
  return <LoginScreen />;
}
