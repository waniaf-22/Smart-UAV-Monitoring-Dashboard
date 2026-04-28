import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Phone-shaped frame for showcasing the mobile UI on desktop.
 * On small screens it disappears and the content goes full-bleed.
 */
export function MobilePhoneFrame({ children }: Props) {
  return (
    <>
      {/* Mobile: full screen */}
      <div className="md:hidden min-h-screen bg-card text-card-foreground">
        {children}
      </div>

      {/* Desktop: phone mockup */}
      <div className="hidden md:flex min-h-screen items-center justify-center p-8">
        <div
          className="relative rounded-[3rem] p-3 bg-neutral-900"
          style={{ boxShadow: "var(--shadow-phone)" }}
        >
          <div
            className="relative w-[390px] h-[800px] rounded-[2.5rem] overflow-hidden bg-card text-card-foreground"
          >
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-7 rounded-full bg-black z-50" />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
