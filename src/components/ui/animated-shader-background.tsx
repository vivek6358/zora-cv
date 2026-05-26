"use client";

type AnimatedShaderBackgroundProps = {
  className?: string;
};

export default function AnimatedShaderBackground({
  className = "",
}: AnimatedShaderBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* GPU-composited CSS aurora — replaces Three.js WebGL shader */}
      <div className="aurora-layer aurora-1" />
      <div className="aurora-layer aurora-2" />
      <div className="aurora-layer aurora-3" />
    </div>
  );
}
