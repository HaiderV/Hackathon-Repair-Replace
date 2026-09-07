import React from "react"
import type { ResourceResult } from "../../types/analysis"
import RepairGuideCard from "./RepairGuideCard"
import VideoRow from "./VideoRow"
import ReplacementOptionsSection from "./ReplacementOptionsSection"

interface ResourceSectionProps {
  resources: ResourceResult
}

export const ResourceSection: React.FC<ResourceSectionProps> = ({
  resources,
}) => {
  const guides = resources.repairGuides || []
  const videos = resources.videos || []
  const replacementOptions = resources.replacementOptions

  return (
    <div className="space-y-6">
      {/* Repair Guides Grid */}
      {guides.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-6 w-6 shrink-0 aspect-square min-w-[1.5rem] min-h-[1.5rem] items-center justify-center rounded-md bg-[#6C79C0]/15 text-[#5360A6]">
              <svg
                className="h-3.5 w-3.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </span>
            <h4 className="font-serif text-base font-bold text-[#2B2118]">
              Recommended Repair Guides & Manuals ({guides.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {guides.map((guide, idx) => (
              <RepairGuideCard key={`guide-${idx}-${guide.url}`} guide={guide} />
            ))}
          </div>
        </div>
      )}

      {/* Video Tutorials */}
      {videos.length > 0 && <VideoRow videos={videos} />}

      {/* Sustainable Replacement & End-of-life */}
      {replacementOptions && (
        <ReplacementOptionsSection options={replacementOptions} />
      )}
    </div>
  )
}

export default ResourceSection
