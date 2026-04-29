import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface SettingsState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  speedUnit: string;
  setSpeedUnit: (u: string) => void;
  distUnit: string;
  setDistUnit: (u: string) => void;
  tempUnit: string;
  setTempUnit: (u: string) => void;
  altUnit: string;
  setAltUnit: (u: string) => void;
  mapStyle: string;
  setMapStyle: (s: string) => void;
  telemetryRate: string;
  setTelemetryRate: (r: string) => void;
  emergencyProtocol: string;
  setEmergencyProtocol: (p: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;
  dashboardLayout: string;
  setDashboardLayout: (l: string) => void;
}

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("aero_theme") as Theme) || "dark";
  });
  const [speedUnit, setSpeedUnit] = useState(() => {
    if (typeof window === "undefined") return "km/h";
    return localStorage.getItem("aero_speed") || "km/h";
  });
  const [distUnit, setDistUnit] = useState(() => {
    if (typeof window === "undefined") return "meters";
    return localStorage.getItem("aero_dist") || "meters";
  });
  const [tempUnit, setTempUnit] = useState(() => {
    if (typeof window === "undefined") return "°C";
    return localStorage.getItem("aero_temp") || "°C";
  });
  const [altUnit, setAltUnit] = useState(() => {
    if (typeof window === "undefined") return "meters";
    return localStorage.getItem("aero_alt") || "meters";
  });
  const [mapStyle, setMapStyle] = useState(() => {
    if (typeof window === "undefined") return "Satellite";
    return localStorage.getItem("aero_map") || "Satellite";
  });
  const [telemetryRate, setTelemetryRate] = useState(() => {
    if (typeof window === "undefined") return "5 Hz";
    return localStorage.getItem("aero_telemetry") || "5 Hz";
  });
  const [emergencyProtocol, setEmergencyProtocol] = useState(() => {
    if (typeof window === "undefined") return "rth";
    return localStorage.getItem("aero_emergency") || "rth";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("aero_sidebar") === "true";
  });
  const [dashboardLayout, setDashboardLayout] = useState(() => {
    if (typeof window === "undefined") return "List";
    return localStorage.getItem("aero_layout") || "List";
  });

  useEffect(() => {
    localStorage.setItem("aero_theme", theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => { localStorage.setItem("aero_speed", speedUnit); }, [speedUnit]);
  useEffect(() => { localStorage.setItem("aero_dist", distUnit); }, [distUnit]);
  useEffect(() => { localStorage.setItem("aero_temp", tempUnit); }, [tempUnit]);
  useEffect(() => { localStorage.setItem("aero_alt", altUnit); }, [altUnit]);
  useEffect(() => { localStorage.setItem("aero_map", mapStyle); }, [mapStyle]);
  useEffect(() => { localStorage.setItem("aero_telemetry", telemetryRate); }, [telemetryRate]);
  useEffect(() => { localStorage.setItem("aero_emergency", emergencyProtocol); }, [emergencyProtocol]);
  useEffect(() => { localStorage.setItem("aero_sidebar", sidebarCollapsed.toString()); }, [sidebarCollapsed]);
  useEffect(() => { localStorage.setItem("aero_layout", dashboardLayout); }, [dashboardLayout]);

  const value = {
    theme, setTheme,
    speedUnit, setSpeedUnit,
    distUnit, setDistUnit,
    tempUnit, setTempUnit,
    altUnit, setAltUnit,
    mapStyle, setMapStyle,
    telemetryRate, setTelemetryRate,
    emergencyProtocol, setEmergencyProtocol,
    sidebarCollapsed, setSidebarCollapsed,
    dashboardLayout, setDashboardLayout,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
