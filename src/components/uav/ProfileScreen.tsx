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

type Tab = "account";

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

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("account");

  // Account
  const [form, setForm] = useState({
    fullName: "Operator Alpha",
    username: "alpha_cmd",
    email: "alpha@aerocommand.mil",
    operatorId: "OPS-7782",
    phone: "+92-300-1234567",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Account details saved successfully.");
  };

  const handleSaveSettings = () => {
    toast.success("Preferences saved successfully.");
  };

  const tabs = [
    { id: "account" as Tab, label: "Account", icon: Shield },
  ];

  return (
    <div className="min-h-full p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* ── Hero Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-border" style={{ background: "linear-gradient(135deg, oklch(0.25 0.06 250) 0%, oklch(0.18 0.04 250) 100%)" }}>
        {/* Decorative rings */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, oklch(0.7 0.22 38), transparent 70%)" }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-5" style={{ background: "radial-gradient(circle, oklch(0.7 0.22 38), transparent 70%)" }} />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 p-6 md:p-10">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-24 w-24 md:h-28 md:w-28 rounded-2xl flex items-center justify-center text-4xl font-black text-primary-foreground border-2"
              style={{ background: "linear-gradient(135deg, oklch(0.7 0.22 38), oklch(0.55 0.2 30))", borderColor: "oklch(0.7 0.22 38)", boxShadow: "0 0 30px oklch(0.7 0.22 38 / 0.5)" }}>
              A
            </div>
            <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Fleet Operator · Level 3</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{form.fullName}</h1>
            <p className="text-muted-foreground text-sm mt-1">@{form.username} &nbsp;·&nbsp; {form.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 border border-primary/30 text-primary">{form.operatorId}</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary border border-border text-muted-foreground">14 UAVs Managed</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary border border-border text-muted-foreground">127 Missions</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary/50 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="border-t border-border px-6 md:px-10 flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── ACCOUNT TAB ── */}
      {activeTab === "account" && (
        <form onSubmit={handleSaveAccount} className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <User className="h-4 w-4 text-primary" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: "fullName", label: "Full Name", icon: User, value: form.fullName, key: "fullName" },
                { id: "operatorId", label: "Operator ID", icon: Shield, value: form.operatorId, key: "operatorId", disabled: true },
                { id: "username", label: "Username", icon: AtSign, value: form.username, key: "username" },
                { id: "email", label: "Email Address", icon: Mail, value: form.email, key: "email", type: "email" },
              ].map(({ id, label, icon: Icon, value, key, disabled, type }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id} className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{label}</Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={id}
                      type={type || "text"}
                      value={value}
                      disabled={disabled}
                      onChange={(e) => !disabled && setForm({ ...form, [key]: e.target.value })}
                      className={`pl-10 h-11 border-border ${disabled ? "bg-secondary/20 opacity-60 cursor-not-allowed" : "bg-secondary/50 focus:border-primary"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <Lock className="h-4 w-4 text-primary" /> Security & Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "currentPassword", label: "Current Password", key: "currentPassword" },
                { id: "newPassword", label: "New Password", key: "newPassword" },
                { id: "confirmPassword", label: "Confirm Password", key: "confirmPassword" },
              ].map(({ id, label, key }) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id} className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{label}</Label>
                  <Input
                    id={id}
                    type="password"
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="h-11 bg-secondary/50 border-border focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="h-11 px-10 font-bold bg-primary text-primary-foreground hover:bg-primary/90" style={{ boxShadow: "0 0 20px oklch(0.7 0.22 38 / 0.35)" }}>
              <Save className="h-4 w-4 mr-2" /> Save Account
            </Button>
          </div>
        </form>
      )}

    </div>
  );
}
