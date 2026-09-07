import React, { useState } from "react"
import type { ReplacementOptions, ResourceItem } from "../../types/analysis"

interface ReplacementOptionsSectionProps {
  options: ReplacementOptions
}

export const ReplacementOptionsSection: React.FC<
  ReplacementOptionsSectionProps
> = ({ options }) => {
  const [activeTab, setActiveTab] = useState<
    "donate" | "refurbish" | "recycle"
  >("donate")

  const donateList = options.donate || []
  const refurbishList = options.refurbish || []
  const recycleList = options.recycle || []

  const currentList: ResourceItem[] =
    activeTab === "donate"
      ? donateList
      : activeTab === "refurbish"
        ? refurbishList
        : recycleList

  return (
    <div className="rounded-2xl border border-[#2B2118]/12 bg-[#FAF5EE] p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2B2118]/8 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 aspect-square min-w-[1.75rem] min-h-[1.75rem] items-center justify-center rounded-lg bg-[#E07A5F]/15 text-[#9E3E26]">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m8 17 4 4 4-4" />
            </svg>
          </span>
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2B2118]">
              End-of-Life & Sustainable Replacement
            </h4>
            <p className="text-xs text-[#523D2B]/80">
              Responsible disposal, donation, and trade-in avenues
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#EAD8BE]/50 p-1 border border-[#2B2118]/8 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("donate")}
            className={`rounded-lg px-3 py-1 transition-all ${
              activeTab === "donate"
                ? "bg-[#2B2118] text-[#F4EBDD] shadow-sm"
                : "text-[#523D2B] hover:text-[#2B2118]"
            }`}
          >
            🎁 Donate ({donateList.length})
          </button>
          <button
            onClick={() => setActiveTab("refurbish")}
            className={`rounded-lg px-3 py-1 transition-all ${
              activeTab === "refurbish"
                ? "bg-[#2B2118] text-[#F4EBDD] shadow-sm"
                : "text-[#523D2B] hover:text-[#2B2118]"
            }`}
          >
            🔄 Trade-in ({refurbishList.length})
          </button>
          <button
            onClick={() => setActiveTab("recycle")}
            className={`rounded-lg px-3 py-1 transition-all ${
              activeTab === "recycle"
                ? "bg-[#2B2118] text-[#F4EBDD] shadow-sm"
                : "text-[#523D2B] hover:text-[#2B2118]"
            }`}
          >
            ♻️ Recycle ({recycleList.length})
          </button>
        </div>
      </div>

      {/* Resource Cards */}
      {currentList.length === 0 ? (
        <p className="text-xs text-[#523D2B]/70 italic py-3 text-center">
          No external listings for this category at the moment. Check your local
          municipal e-waste center.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentList.map((item, index) => (
            <a
              key={`repl-${activeTab}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-[#2B2118]/8 bg-white/70 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6C79C0] hover:shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5360A6]">
                    {item.source || "Partner"}
                  </span>
                  <svg
                    className="h-3 w-3 text-[#523D2B]/40 group-hover:text-[#6C79C0]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <h5 className="font-serif text-xs font-bold text-[#2B2118] group-hover:text-[#5360A6] line-clamp-1">
                  {item.title}
                </h5>
                {item.description && (
                  <p className="text-[11px] text-[#523D2B]/75 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="mt-2.5 pt-1.5 border-t border-[#2B2118]/6 text-[10px] font-semibold text-[#5360A6] group-hover:underline">
                Visit Platform &rarr;
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReplacementOptionsSection
