import { createFileRoute } from "@tanstack/react-router";
import { RegisterScreen } from "@/components/uav/RegisterScreen";

export const Route = createFileRoute("/register")({
  component: Register,
  head: () => ({
    meta: [
      { title: "AeroCommand — Create Operator Account" },
      { name: "description", content: "Request a new operator account for the AeroCommand UAV monitoring and control platform." },
    ],
  }),
});

function Register() {
  return <RegisterScreen />;
}
