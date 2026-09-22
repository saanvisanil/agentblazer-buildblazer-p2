"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (event) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setVisible(true);

      const target = event.target;

      if (
        target.closest(
          "a, button, [role='button'], input, textarea, select, .cursor-hover"
        )
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    const leave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] hidden md:block"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`relative rounded-full border transition-all duration-200 ${
            hovering
              ? "h-10 w-10"
              : "h-7 w-7"
          }`}
          style={{
            borderColor: hovering ? "var(--accent-2)" : "var(--accent)",
            backgroundColor: "var(--accent-soft)",
            boxShadow: hovering
              ? "0 0 25px var(--accent-2)"
              : "0 0 18px var(--accent)",
          }}
        >
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: "var(--accent-2)", boxShadow: "0 0 10px var(--accent-2)" }} />

          <span className="absolute left-1/2 top-[-5px] h-2 w-px -translate-x-1/2" style={{ backgroundColor: "var(--accent-2)" }} />
          <span className="absolute bottom-[-5px] left-1/2 h-2 w-px -translate-x-1/2" style={{ backgroundColor: "var(--accent)" }} />
          <span className="absolute left-[-5px] top-1/2 h-px w-2 -translate-y-1/2" style={{ backgroundColor: "var(--accent)" }} />
          <span className="absolute right-[-5px] top-1/2 h-px w-2 -translate-y-1/2" style={{ backgroundColor: "var(--accent-2)" }} />
        </div>
      </div>
    </>
  );
}
