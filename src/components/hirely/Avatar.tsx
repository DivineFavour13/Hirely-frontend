const PALETTE = [
  "bg-indigo-100 text-indigo-700", "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700", "bg-violet-100 text-violet-700",
];

function hashIndex(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % PALETTE.length;
}

export function Avatar({
  name,
  className,
  shape = "circle",
}: {
  name: string;
  className?: string;
  shape?: "circle" | "square";
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden
      className={`flex shrink-0 items-center justify-center font-semibold uppercase tracking-wide ${
        PALETTE[hashIndex(name)]
      } ${shape === "circle" ? "rounded-full" : "rounded-xl"} ${className ?? "h-10 w-10 text-sm"}`}
    >
      {initials}
    </div>
  );
}