import React from "react"
import type { ResourceItem } from "../../types/analysis"

interface VideoRowProps {
  videos: ResourceItem[]
}

export const VideoRow: React.FC<VideoRowProps> = ({ videos }) => {
  if (!videos || videos.length === 0) return null

  return (
    <div className="space-y-3 w-full min-w-0 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-6 w-6 shrink-0 aspect-square min-w-[1.5rem] min-h-[1.5rem] items-center justify-center rounded-md bg-red-600/15 text-red-700">
            <svg
              className="h-3.5 w-3.5 shrink-0 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </span>
          <h4 className="font-serif text-base font-bold text-[#2B2118]">
            Video Tutorials ({videos.length})
          </h4>
        </div>
        <span className="text-xs text-[#523D2B]/70">Scroll horizontally &rarr;</span>
      </div>

      {/* Horizontal Carousel with proper max-w constraint */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-[#2B2118]/20 w-full min-w-0 max-w-full">
        {videos.map((video, idx) => (
          <a
            key={`vid-${idx}-${video.url}`}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-60 sm:w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-[#2B2118]/12 bg-[#FAF5EE] transition-all duration-200 hover:-translate-y-1 hover:border-red-400 hover:shadow-lg"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#2B2118]/10">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#2B2118]/80 text-[#F4EBDD]">
                  <span className="text-xs font-semibold">Watch Tutorial</span>
                </div>
              )}

              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-90 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                  <svg
                    className="h-5 w-5 fill-current ml-0.5"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>

              {/* YouTube badge */}
              <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white">
                YouTube
              </span>
            </div>

            {/* Video Meta */}
            <div className="flex flex-1 flex-col justify-between p-3">
              <h5 className="font-serif text-xs font-bold text-[#2B2118] line-clamp-2 group-hover:text-red-700">
                {video.title}
              </h5>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#523D2B]/70">
                <span>{video.source || "YouTube"}</span>
                <span className="font-medium text-red-700 group-hover:underline">
                  Watch &rarr;
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default VideoRow
