"use client";

import { useEffect, useState } from "react";

// Play the supplied club intro before revealing the home page.
// Only plays once per browser session — subsequent visits skip straight
// to the content.
export default function IntroSequence() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Skip intro if already seen in this browser session
    try {
      if (sessionStorage.getItem("agentblazer_intro_seen")) return;
    } catch {
      // sessionStorage unavailable (e.g. private browsing on some browsers)
      return;
    }
    setVisible(true);
  }, []);

  function leave() {
    if (leaving) return;
    setLeaving(true);
    try {
      sessionStorage.setItem("agentblazer_intro_seen", "1");
    } catch {
      // ignore
    }
    window.setTimeout(() => setVisible(false), 650);
  }

  if (!visible) return null;

  return (
    <div className={`intro-sequence ${leaving ? "intro-sequence--leaving" : ""}`}>
      <video
        className="intro-sequence__video"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={leave}
        aria-label="AgentBlazer introduction"
      >
        <source src="/images/brand/agentblazer-intro.mp4" type="video/mp4" />
        Your browser does not support the introduction video.
      </video>
      <button
        type="button"
        className="intro-sequence__skip"
        onClick={leave}
        autoFocus
        aria-label="Skip introduction"
      />
    </div>
  );
}
