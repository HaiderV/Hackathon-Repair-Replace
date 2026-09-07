import React, { useState } from "react"
import type { Material, Tool } from "../../types/analysis"
import { formatRange } from "./CostTable"

interface ToolsMaterialsListProps {
  tools: Tool[]
  materials: Material[]
}

export const ToolsMaterialsList: React.FC<ToolsMaterialsListProps> = ({
  tools,
  materials,
}) => {
  const [checkedTools, setCheckedTools] = useState<Record<string, boolean>>({})
  const [checkedMaterials, setCheckedMaterials] = useState<
    Record<string, boolean>
  >({})

  const toggleTool = (name: string) => {
    setCheckedTools((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const toggleMaterial = (name: string) => {
    setCheckedMaterials((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
      {/* Required Tools */}
      <div className="rounded-2xl border border-[#2B2118]/12 bg-[#FAF5EE] p-4 sm:p-5 shadow-sm space-y-3 min-w-0">
        <div className="flex items-center justify-between border-b border-[#2B2118]/8 pb-2.5">
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
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </span>
            <h4 className="font-serif text-base font-bold text-[#2B2118]">
              Tools Needed ({tools.length})
            </h4>
          </div>
          <span className="text-[11px] text-[#523D2B]/70">Tap to check off</span>
        </div>

        {tools.length === 0 ? (
          <p className="text-xs text-[#523D2B]/70 italic py-2">
            No specialized tools required for this repair.
          </p>
        ) : (
          <ul className="space-y-2">
            {tools.map((tool, idx) => {
              const isChecked = !!checkedTools[tool.name]
              return (
                <li
                  key={`tool-${idx}-${tool.name}`}
                  onClick={() => toggleTool(tool.name)}
                  className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                    isChecked
                      ? "border-emerald-300 bg-emerald-50/60 text-[#2B2118]/60"
                      : "border-[#2B2118]/8 bg-[#EAD8BE]/30 hover:border-[#6C79C0]/40 hover:bg-[#EAD8BE]/50 text-[#2B2118]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Fixed dimension checkbox that never shrinks or distorts */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="h-4.5 w-4.5 min-h-[1.125rem] min-w-[1.125rem] shrink-0 rounded border-[#2B2118]/30 text-[#6C79C0] focus:ring-[#6C79C0] cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-xs font-semibold leading-relaxed break-words ${
                          isChecked ? "line-through text-[#523D2B]/60" : ""
                        }`}
                      >
                        {tool.name}
                      </span>
                      {tool.required && (
                        <span className="ml-2 inline-block rounded bg-[#6C79C0]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#5360A6]">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#523D2B]/85 font-mono text-right pl-2">
                    {formatRange(tool.estimatedPrice)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Materials / Parts */}
      <div className="rounded-2xl border border-[#2B2118]/12 bg-[#FAF5EE] p-4 sm:p-5 shadow-sm space-y-3 min-w-0">
        <div className="flex items-center justify-between border-b border-[#2B2118]/8 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-6 w-6 shrink-0 aspect-square min-w-[1.5rem] min-h-[1.5rem] items-center justify-center rounded-md bg-[#E07A5F]/15 text-[#9E3E26]">
              <svg
                className="h-3.5 w-3.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </span>
            <h4 className="font-serif text-base font-bold text-[#2B2118]">
              Materials & Parts ({materials.length})
            </h4>
          </div>
          <span className="text-[11px] text-[#523D2B]/70">Tap to check off</span>
        </div>

        {materials.length === 0 ? (
          <p className="text-xs text-[#523D2B]/70 italic py-2">
            No replacement components or adhesives needed.
          </p>
        ) : (
          <ul className="space-y-2">
            {materials.map((mat, idx) => {
              const isChecked = !!checkedMaterials[mat.name]
              return (
                <li
                  key={`mat-${idx}-${mat.name}`}
                  onClick={() => toggleMaterial(mat.name)}
                  className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                    isChecked
                      ? "border-emerald-300 bg-emerald-50/60 text-[#2B2118]/60"
                      : "border-[#2B2118]/8 bg-[#EAD8BE]/30 hover:border-[#E07A5F]/40 hover:bg-[#EAD8BE]/50 text-[#2B2118]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Fixed dimension checkbox that never shrinks or distorts */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="h-4.5 w-4.5 min-h-[1.125rem] min-w-[1.125rem] shrink-0 rounded border-[#2B2118]/30 text-[#E07A5F] focus:ring-[#E07A5F] cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-xs font-semibold leading-relaxed break-words ${
                          isChecked ? "line-through text-[#523D2B]/60" : ""
                        }`}
                      >
                        {mat.name}
                      </span>
                      {mat.required && (
                        <span className="ml-2 inline-block rounded bg-[#E07A5F]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#9E3E26]">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#523D2B]/85 font-mono text-right pl-2">
                    {formatRange(mat.estimatedPrice)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ToolsMaterialsList
