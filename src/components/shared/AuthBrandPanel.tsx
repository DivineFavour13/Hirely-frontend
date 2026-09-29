interface AuthBrandPanelProps {
  headline: string;
  subtext: string;
}

export function AuthBrandPanel({ headline, subtext }: AuthBrandPanelProps) {
  return (
    <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500 text-sm font-semibold text-white">
          H
        </div>
        <span className="text-sm font-medium tracking-wide text-slate-300">
          Hirely
        </span>
      </div>

      <div className="max-w-md">
        <h1
          className="text-[2.75rem] leading-[1.1] text-white"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
        >
          {headline}
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-slate-400">
          {subtext}
        </p>
      </div>

      <div className="flex items-end gap-3">
        {[
          { label: "Applied", tone: "bg-slate-600", count: 24 },
          { label: "Screening", tone: "bg-amber-500", count: 11 },
          { label: "Interview", tone: "bg-indigo-500", count: 6 },
          { label: "Offer", tone: "bg-emerald-500", count: 2 },
        ].map((col, i) => (
          <div key={col.label} className="flex-1">
            <div
              className="mb-2 flex flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2"
              style={{ marginBottom: `${(3 - i) * 6 + 8}px` }}
            >
              {Array.from({ length: Math.min(3, i + 2) }).map((_, j) => (
                <div
                  key={j}
                  className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1.5"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${col.tone}`} />
                  <span className="h-1.5 flex-1 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              {col.label} <span className="text-slate-600">· {col.count}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}