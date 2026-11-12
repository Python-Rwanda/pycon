import Image from "@/components/Img";

/** "PyCon Rwanda '27" next to the PyCon Rwanda mark (dark-background variant, see pycon_logo/logo/README.md). */
export default function Wordmark({ name, year, size = 22 }: { name: string; year: number; size?: number }) {
  const [first, ...rest] = name.split(" ");
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, color: "var(--ink)", fontWeight: 800, fontSize: size, letterSpacing: "-.03em", lineHeight: 1, whiteSpace: "nowrap" }}>
      <Image src="/media/pycon-logo/pycon-rwanda-mark-dark-bg.svg" alt="" width={135} height={135} unoptimized style={{ width: size * 1.6, height: size * 1.6 }} />
      <span>
        {first}
        {rest.length > 0 && <span style={{ color: "var(--blue)" }}> {rest.join(" ")}</span>}
        <span className="mono" style={{ color: "var(--yellow)", fontWeight: 500, marginLeft: size * 0.3, fontSize: size * 0.8 }}>&apos;{String(year).slice(2)}</span>
      </span>
    </span>
  );
}
