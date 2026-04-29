import { useEffect } from "react";

interface ShortcutHandlers {
  onSelectAll?: () => void;    // Ctrl+A
  onStart?: () => void;        // Ctrl+S
  onStop?: () => void;         // Ctrl+X
  onEmergency?: () => void;    // Ctrl+E
  onExport?: () => void;       // Ctrl+P
}

/**
 * Registers keyboard shortcuts for UAV fleet operations.
 * Only activates when focus is NOT inside a text input/textarea.
 */
export function useFleetShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;
      if (!e.ctrlKey && !e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case "a":
          if (handlers.onSelectAll) {
            e.preventDefault();
            handlers.onSelectAll();
          }
          break;
        case "s":
          if (handlers.onStart) {
            e.preventDefault();
            handlers.onStart();
          }
          break;
        case "x":
          if (handlers.onStop) {
            e.preventDefault();
            handlers.onStop();
          }
          break;
        case "e":
          if (handlers.onEmergency) {
            e.preventDefault();
            handlers.onEmergency();
          }
          break;
        case "p":
          if (handlers.onExport) {
            e.preventDefault();
            handlers.onExport();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
