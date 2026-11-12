"use client";

import { useEffect, useState } from "react";

function useCountdown(iso?: string) {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    if (!iso) return;
    const tick = () => setMs(Math.max(0, new Date(iso).getTime() - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [iso]);
  return ms;
}

export default function Countdown({ iso }: { iso?: string }) {
  const ms = useCountdown(iso);
  if (!ms) return null;
  const parts = [
    ["days", Math.floor(ms / 864e5)],
    ["hrs", Math.floor(ms / 36e5) % 24],
    ["min", Math.floor(ms / 6e4) % 60],
    ["sec", Math.floor(ms / 1e3) % 60],
  ] as const;
  return (
    <div className="mono" role="timer" aria-label="Time until the conference" style={{ display: "flex", gap: "clamp(14px,3vw,28px)", marginTop: 28 }}>
      {parts.map(([k, v]) => (
        <div key={k}>
          <div style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 500, lineHeight: 1, color: k === "days" ? "var(--blue)" : "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{String(v).padStart(2, "0")}</div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6, textTransform: "uppercase", letterSpacing: ".1em" }}>{k}</div>
        </div>
      ))}
    </div>
  );
}
