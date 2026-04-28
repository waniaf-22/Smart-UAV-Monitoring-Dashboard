import { useState } from "react";
import {
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  ChevronDown,
  MoreHorizontal,
  ListMusic,
  Share2,
  Home,
  Search,
  Library,
} from "lucide-react";
import albumCover from "@/assets/album-cover.jpg";

export function MusicPlayer() {
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(42);

  return (
    <div
      className="flex flex-col h-full w-full text-card-foreground"
      style={{ background: "var(--gradient-player)" }}
    >
      {/* Status bar spacer */}
      <div className="h-12 shrink-0" />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 pt-2">
        <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronDown className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Playing from album
          </p>
          <p className="text-xs font-medium mt-0.5">Midnight Echoes</p>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Album art */}
      <div className="px-8 mt-8">
        <div
          className="relative aspect-square rounded-3xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <img
            src={albumCover}
            alt="Album cover for Midnight Echoes by Lunar Drift"
            className="w-full h-full object-cover"
            width={768}
            height={768}
          />
        </div>
      </div>

      {/* Track info */}
      <div className="px-8 mt-8 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">
            Velvet Skyline
          </h1>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            Lunar Drift · Midnight Echoes
          </p>
        </div>
        <button
          onClick={() => setLiked((v) => !v)}
          className="shrink-0 p-2 -mt-1"
          aria-label="Like song"
        >
          <Heart
            className={`w-7 h-7 transition-all ${
              liked
                ? "fill-primary text-primary scale-110"
                : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Progress */}
      <div className="px-8 mt-6">
        <div
          className="relative h-1 rounded-full bg-white/10 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress}%`,
              background: "var(--gradient-primary)",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-muted-foreground tabular-nums">
          <span>{formatTime(progress)}</span>
          <span>-{formatTime(100 - progress)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 mt-6 flex items-center justify-between">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Shuffle className="w-5 h-5" />
        </button>
        <button className="p-2 hover:scale-110 transition-transform">
          <SkipBack className="w-8 h-8 fill-current" />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-16 h-16 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <Pause className="w-7 h-7 fill-primary-foreground text-primary-foreground" />
          ) : (
            <Play className="w-7 h-7 fill-primary-foreground text-primary-foreground ml-1" />
          )}
        </button>
        <button className="p-2 hover:scale-110 transition-transform">
          <SkipForward className="w-8 h-8 fill-current" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Repeat className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom row */}
      <div className="px-8 mt-6 flex items-center justify-between text-muted-foreground">
        <button className="p-2 hover:text-foreground transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 text-xs hover:text-foreground transition-colors">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          AirPods Pro
        </button>
        <button className="p-2 hover:text-foreground transition-colors">
          <ListMusic className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1" />

      {/* Tab bar */}
      <nav className="border-t border-border/50 bg-black/20 backdrop-blur-xl px-6 py-3 pb-6 flex items-center justify-around">
        <TabButton icon={<Home className="w-5 h-5" />} label="Home" active />
        <TabButton icon={<Search className="w-5 h-5" />} label="Search" />
        <TabButton icon={<Library className="w-5 h-5" />} label="Library" />
      </nav>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function formatTime(percent: number) {
  const total = 215; // 3:35 song
  const seconds = Math.floor((percent / 100) * total);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
