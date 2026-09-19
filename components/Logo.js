import Image from "next/image";

// The glowing hexagon mark used in the nav and hero. The image itself is a
// transparent PNG cutout of the club's logo; the glow/border is CSS so it
// re-colors automatically with the active theme.
export default function Logo({ size = 44 }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2"
      style={{ width: size, height: size, boxShadow: "0 0 24px -6px var(--accent)" }}
    >
      <Image
        src="/images/brand/logo-transparent.png"
        alt="AgentBlazer Club emblem"
        width={size - 8}
        height={size - 8}
        className="object-contain"
        priority
      />
    </span>
  );
}
