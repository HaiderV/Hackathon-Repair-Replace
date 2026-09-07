import React from "react"
import type { ResourceItem } from "../../types/analysis"

interface RepairGuideCardProps {
  guide: ResourceItem
}

export const RepairGuideCard: React.FC<RepairGuideCardProps> = ({ guide }) => {
  const isIFixit =
    guide.source?.toLowerCase().includes("ifixit") ||
    guide.url?.toLowerCase().includes("ifixit.com")

  return (
    <a
      href={guide.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between rounded-xl border border-[#2B2118]/12 bg-[#FAF5EE] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6C79C0] hover:shadow-md"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
              isIFixit
                ? "bg-blue-100 text-blue-900 border border-blue-200"
                : "bg-[#EAD8BE] text-[#523D2B] border border-[#2B2118]/10"
            }`}
          >
            {isIFixit ? "🛠️ iFixit Official" : "📖 Repair Guide"}
          </span>
          <svg
            className="h-3.5 w-3.5 text-[#523D2B]/50 transition-colors group-hover:text-[#6C79C0]"
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

        <h5 className="font-serif text-sm font-bold text-[#2B2118] group-hover:text-[#5360A6] line-clamp-2">
          {guide.title}
        </h5>

        {guide.description && (
          <p className="text-xs text-[#523D2B]/80 line-clamp-2 leading-relaxed">
            {guide.description}
          </p>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-[#2B2118]/8 flex items-center justify-between text-[11px] text-[#523D2B]/70 font-medium">
        <span>{guide.source || "Manual"}</span>
        <span className="text-[#5360A6] font-semibold group-hover:underline flex items-center gap-0.5">
          Open Guide &rarr;
        </span>
      </div>
    </a>
  )
}

export default RepairGuideCard
