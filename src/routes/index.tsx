import { createFileRoute } from "@tanstack/react-router";
import { MobilePhoneFrame } from "@/components/MobilePhoneFrame";
import { MusicPlayer } from "@/components/MusicPlayer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lunar — Mobile Music Player UI" },
      {
        name: "description",
        content:
          "A beautifully designed mobile music player UI concept with a now-playing screen, controls, and tab bar.",
      },
    ],
  }),
});

function Index() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--gradient-canvas)" }}
    >
      <h1 className="sr-only">Lunar Mobile Music Player</h1>
      <MobilePhoneFrame>
        <MusicPlayer />
      </MobilePhoneFrame>
    </main>
  );
}
