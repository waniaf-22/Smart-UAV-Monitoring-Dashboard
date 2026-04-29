import { useState } from "react";
import {
  User, Settings, Shield, Bell, Moon, Sun, Ruler, Save, Lock, Mail,
  AtSign, Activity, Thermometer, Wifi, Map, Eye, Volume2, Monitor,
  Globe, Palette, RefreshCw, AlertOctagon, Clock, Camera, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Tab = "account" | "settings";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-12 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primary shadow-inner" />
    </label>
  );
}

function SettingRow({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors">
      <div className="flex-1">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SelectGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
            value === opt
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function SettingsScreen() {
  // Settings state
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [speedUnit, setSpeedUnit] = useState("km/h");
  const [distUnit, setDistUnit] = useState("meters");
  const [tempUnit, setTempUnit] = useState("°C");
  const [altUnit, setAltUnit] = useState("meters");
  const [mapStyle, setMapStyle] = useState("Satellite");
  const [telemetryRate, setTelemetryRate] = useState("5 Hz");
  const [emergencyProtocol, setEmergencyProtocol] = useState("rth");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState("List");

  const [notifications, setNotifications] = useState({
    audio: true,
    push: true,
    email: false,
    windAlerts: true,
    batteryAlerts: true,
    missionComplete: true,
  });

  const handleSaveSettings = () => {
    toast.success("Preferences saved successfully.");
  };

  return (
    <div className="min-h-full p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" /> Application Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Configure system preferences, telemetry rates, and visual presentation.</p>
      </header>

      <div className="space-y-6">

          {/* Appearance */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Palette className="h-4 w-4 text-primary" /> Appearance
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Interface Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {(["dark", "light", "system"] as const).map((t) => (
                    <button key={t} onClick={() => setTheme(t)}
                      className={`flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 transition-all ${
                        theme === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/20 text-muted-foreground hover:border-muted-foreground/40 hover:bg-secondary/40"
                      }`}>
                      {t === "dark" && <Moon className="h-6 w-6" />}
                      {t === "light" && <Sun className="h-6 w-6" />}
                      {t === "system" && <Monitor className="h-6 w-6" />}
                      <span className="text-xs font-bold uppercase tracking-wider">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <SettingRow title="Sidebar Collapsed by Default" desc="Start the app with the navigation sidebar minimized.">
                <Toggle checked={sidebarCollapsed} onChange={() => setSidebarCollapsed(p => !p)} />
              </SettingRow>

              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Default UAV List Layout</p>
                <SelectGroup options={["List", "Grid"]} value={dashboardLayout} onChange={setDashboardLayout} />
              </div>
            </div>
          </div>

          {/* Units */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Ruler className="h-4 w-4 text-primary" /> Measurement Units
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Wifi className="h-4 w-4 text-muted-foreground" /> Speed</p>
                <SelectGroup options={["km/h", "mph", "m/s", "knots"]} value={speedUnit} onChange={setSpeedUnit} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> Distance</p>
                <SelectGroup options={["meters", "feet", "kilometers", "miles"]} value={distUnit} onChange={setDistUnit} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Thermometer className="h-4 w-4 text-muted-foreground" /> Temperature</p>
                <SelectGroup options={["°C", "°F", "K"]} value={tempUnit} onChange={setTempUnit} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /> Altitude</p>
                <SelectGroup options={["meters", "feet"]} value={altUnit} onChange={setAltUnit} />
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Map className="h-4 w-4 text-primary" /> Map & Display
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Map Style</p>
                <SelectGroup options={["Satellite", "Terrain", "Street", "Dark"]} value={mapStyle} onChange={setMapStyle} />
              </div>
              <SettingRow title="Show City Labels on Map" desc="Display city name labels over the operational map.">
                <Toggle checked={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow title="Show UAV Trails" desc="Render flight path history trails for active UAVs on the map.">
                <Toggle checked={true} onChange={() => {}} />
              </SettingRow>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Bell className="h-4 w-4 text-primary" /> Notifications
            </h2>
            <div className="space-y-3">
              <SettingRow title="Critical Audio Alerts" desc="Play warning sounds for emergency landings and wind alerts.">
                <Toggle checked={notifications.audio} onChange={() => setNotifications(p => ({ ...p, audio: !p.audio }))} />
              </SettingRow>
              <SettingRow title="Push Notifications" desc="System-level UAV status and mission notifications.">
                <Toggle checked={notifications.push} onChange={() => setNotifications(p => ({ ...p, push: !p.push }))} />
              </SettingRow>
              <SettingRow title="Email Summaries" desc="Receive daily mission reports directly in your inbox.">
                <Toggle checked={notifications.email} onChange={() => setNotifications(p => ({ ...p, email: !p.email }))} />
              </SettingRow>
              <SettingRow title="Wind & Weather Alerts" desc="Get notified when weather conditions exceed safe flight thresholds.">
                <Toggle checked={notifications.windAlerts} onChange={() => setNotifications(p => ({ ...p, windAlerts: !p.windAlerts }))} />
              </SettingRow>
              <SettingRow title="Low Battery Warnings" desc="Alert when any UAV battery drops below 30%.">
                <Toggle checked={notifications.batteryAlerts} onChange={() => setNotifications(p => ({ ...p, batteryAlerts: !p.batteryAlerts }))} />
              </SettingRow>
              <SettingRow title="Mission Completion Alerts" desc="Notify when a UAV mission is successfully completed.">
                <Toggle checked={notifications.missionComplete} onChange={() => setNotifications(p => ({ ...p, missionComplete: !p.missionComplete }))} />
              </SettingRow>
            </div>
          </div>

          {/* Advanced Operations */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Activity className="h-4 w-4 text-primary" /> Advanced Operations
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2"><RefreshCw className="h-4 w-4 text-muted-foreground" /> Telemetry Update Rate</p>
                <p className="text-xs text-muted-foreground mb-3">Higher rates give smoother data but consume more bandwidth.</p>
                <SelectGroup options={["1 Hz", "5 Hz", "10 Hz", "20 Hz"]} value={telemetryRate} onChange={setTelemetryRate} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2"><AlertOctagon className="h-4 w-4 text-muted-foreground" /> Default Emergency Protocol</p>
                <p className="text-xs text-muted-foreground mb-3">Action triggered automatically when a UAV loses signal for over 30s.</p>
                <select
                  value={emergencyProtocol}
                  onChange={(e) => setEmergencyProtocol(e.target.value)}
                  className="w-full px-4 h-11 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="rth">Return to Home (RTH)</option>
                  <option value="land">Land in Place</option>
                  <option value="hover">Hover & Wait for Reconnection</option>
                </select>
              </div>
              <SettingRow title="Auto-Lock After Inactivity" desc="Lock the dashboard after 10 minutes of inactivity.">
                <Toggle checked={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow title="Confirm Bulk Operations" desc="Show a confirmation dialog before applying Start/Stop to multiple UAVs.">
                <Toggle checked={true} onChange={() => {}} />
              </SettingRow>
            </div>
          </div>

          <div className="flex justify-end pb-4">
            <Button onClick={handleSaveSettings} className="h-11 px-10 font-bold bg-primary text-primary-foreground hover:bg-primary/90" style={{ boxShadow: "0 0 20px oklch(0.7 0.22 38 / 0.35)" }}>
              <Save className="h-4 w-4 mr-2" /> Save All Preferences
            </Button>
          </div>
        </div>
    </div>
  );
}
