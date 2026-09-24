"use client";

import dynamic from "next/dynamic";

// Lazy-loaded client-only UI that is not needed for the initial paint.
// Keeping them in a "use client" boundary lets the layout remain a Server
// Component while these load in the background after hydration.
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const ClubChatbot = dynamic(() => import("@/components/ClubChatbot"), { ssr: false });

export default function ClientShell() {
  return (
    <>
      <CustomCursor />
      <ClubChatbot />
    </>
  );
}
