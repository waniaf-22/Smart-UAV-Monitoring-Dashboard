import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Plane, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const VALID_USERNAME = "wania_fatima";
const VALID_PASSWORD = "1231223";

export function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("wania_fatima");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    
    if (!username) {
      setUsernameError("Username is required");
      hasError = true;
    } else if (username !== VALID_USERNAME) {
      setUsernameError("Username not recognised");
      hasError = true;
    } else {
      setUsernameError("");
    }
    
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password !== VALID_PASSWORD) {
      setPasswordError("Incorrect password");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    toast.success("Authenticated. Welcome, Wania Fatima.");
    navigate({ to: "/dashboard" });
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--gradient-canvas)" }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Plane className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">AeroCommand</h1>
            <p className="text-xs text-muted-foreground">UAV Operations Console</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-card-foreground mb-1">Operator Sign In</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Authorized personnel only.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className={usernameError ? "text-destructive" : ""}>Username</Label>
              <div className="relative">
                <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", usernameError ? "text-destructive" : "text-muted-foreground")} />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError("");
                  }}
                  className={cn(
                    "pl-10 h-11 bg-secondary text-foreground",
                    usernameError ? "border-destructive focus-visible:ring-destructive" : "border-border"
                  )}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>
              {usernameError && <p className="text-xs text-destructive font-medium">{usernameError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={passwordError ? "text-destructive" : ""}>Password</Label>
              <div className="relative">
                <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", passwordError ? "text-destructive" : "text-muted-foreground")} />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className={cn(
                    "pl-10 h-11 bg-secondary text-foreground",
                    passwordError ? "border-destructive focus-visible:ring-destructive" : "border-border"
                  )}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {passwordError && <p className="text-xs text-destructive font-medium">{passwordError}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                Remember me
              </label>
              <a className="text-sm text-primary hover:underline cursor-pointer">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </div>

        {/* Credentials hint */}
        <div
          className="mt-5 rounded-xl border px-5 py-4 text-sm"
          style={{
            borderColor: "oklch(0.7 0.22 38 / 0.4)",
            background: "oklch(0.32 0.12 30 / 0.25)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 24px oklch(0.7 0.22 38 / 0.15)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Demo Credentials
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Username</span>
              <code
                className="text-xs font-mono text-foreground bg-secondary/60 px-2 py-0.5 rounded cursor-pointer select-all border border-border"
                onClick={() => setUsername(VALID_USERNAME)}
                title="Click to auto-fill"
              >
                {VALID_USERNAME}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Password</span>
              <code
                className="text-xs font-mono text-foreground bg-secondary/60 px-2 py-0.5 rounded cursor-pointer select-all border border-border"
                onClick={() => setPassword(VALID_PASSWORD)}
                title="Click to auto-fill"
              >
                {VALID_PASSWORD}
              </code>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-1 text-right">Click a value to auto-fill the field</p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          v2.4.1 • Secure connection established
        </p>
      </div>
    </main>
  );
}