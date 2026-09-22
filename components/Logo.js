import Image from "next/image";

export default function Logo({ size = 44 }) {
  return (
    <span
      className="group relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Outer rotating energy ring */}
      <span
        className="absolute inset-[-5px] rounded-[15px] border border-violet-400/30"
        style={{
          animation: "agentblazer-spin 8s linear infinite",
          boxShadow:
            "0 0 12px rgba(139,92,246,0.25), inset 0 0 12px rgba(34,211,238,0.08)",
        }}
      />

      {/* Cyan energy ring */}
      <span
        className="absolute inset-[-2px] rounded-[13px] border border-cyan-400/20"
        style={{
          animation: "agentblazer-spin-reverse 5s linear infinite",
        }}
      />

      {/* Main glow */}
      <span
        className="absolute inset-0 rounded-xl opacity-80 transition-all duration-300 group-hover:opacity-100"
        style={{
          animation: "agentblazer-pulse 3s ease-in-out infinite",
          boxShadow:
            "0 0 24px -5px var(--accent), 0 0 45px -15px rgba(34,211,238,0.8)",
        }}
      />

      {/* Logo container */}
      <span
        className="relative z-10 inline-flex items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-2 transition-transform duration-300 group-hover:scale-105"
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Moving light sweep */}
        <span
          className="pointer-events-none absolute inset-0 z-20 opacity-40"
          style={{
            background:
              "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.35) 45%, transparent 65%)",
            backgroundSize: "200% 100%",
            animation: "agentblazer-sweep 4s ease-in-out infinite",
          }}
        />

        <Image
          src="/images/brand/logo-transparent.png"
          alt="AgentBlazer Club emblem"
          width={Math.max(size - 8, 24)}
          height={Math.max(size - 8, 24)}
          className="relative z-10 object-contain"
          priority
        />
      </span>
    </span>
  );
}