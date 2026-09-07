import React, { useState, useEffect, useRef, useCallback } from "react"
import PageLayout from "../components/PageLayout"
import ChatMessage from "../components/chat/ChatMessage"
import ChatInput, { type ChatInputHandle } from "../components/chat/ChatInput"
import TypingIndicator from "../components/chat/TypingIndicator"
import MetricsSidebar from "../components/analysis/MetricsSidebar"
import ConfirmResetModal from "../components/chat/ConfirmResetModal"
import ApiNoticeModal from "../components/chat/ApiNoticeModal"
import {
  analyzeProblem,
  startRepairReplace,
  getSessionAnalysis,
  deleteSession,
} from "../services/api"
import type {
  ChatMessage as ChatMessageType,
  IInputAnalysis,
  Stage2ResponseData,
} from "../types/analysis"
import {
  IconWrench,
  IconRotateCcw,
  IconSliders,
  IconAlertTriangle,
  IconInfo,
  IconClock,
} from "../components/Icons"

const LOCAL_STORAGE_SESSION_KEY = "repair_session_id"

const QUICK_STARTERS = [
  {
    title: "Cracked Smartphone Screen",
    desc: "Touch not working on lower half of iPhone 13",
    query: "My iPhone 13 screen is cracked and unresponsive to touch on the bottom half after dropping it.",
  },
  {
    title: "Washing Machine Not Draining",
    desc: "Water stays in drum after cycle finishes",
    query: "Front-load washing machine stops mid-cycle and won't drain water from drum.",
  },
  {
    title: "Laptop Overheating & Fan Noise",
    desc: "Loud grinding noise and thermal throttling",
    query: "Gaming laptop fan makes a loud grinding noise and throttles CPU within 10 minutes.",
  },
  {
    title: "Ceiling Fan Clicking Noise",
    desc: "Wobbling and clicking at high speeds",
    query: "Ceiling fan makes a repetitive clicking noise and wobbles whenever it runs at medium or high speed.",
  },
]

export default function RepairPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [inputAnalysis, setInputAnalysis] = useState<IInputAnalysis | null>(null)
  const [stage2Result, setStage2Result] = useState<Stage2ResponseData | null>(
    null,
  )

  const [isStage1Loading, setIsStage1Loading] = useState(false)
  const [isStage2Loading, setIsStage2Loading] = useState(false)
  const [errorBanner, setErrorBanner] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showApiNoticeModal, setShowApiNoticeModal] = useState(false)
  const [isRestoredSession, setIsRestoredSession] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [failedAction, setFailedAction] = useState<
    | {
        type: "message"
        payload: {
          description?: string
          image?: File
          imagePreviewUrl?: string
        }
      }
    | { type: "stage2" }
    | null
  >(null)

  const chatInputRef = useRef<ChatInputHandle>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom smoothly when messages or typing indicators update
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isStage1Loading, isStage2Loading, scrollToBottom])

  // Rehydrate session from localStorage on initial mount
  useEffect(() => {
    const savedId = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY)
    if (!savedId) return

    const rehydrate = async () => {
      try {
        const response = await getSessionAnalysis(savedId)
        if (response.success && response.data) {
          const session = response.data
          setSessionId(session.sessionId)
          setIsRestoredSession(true)

          if (session.inputAnalysis) {
            setInputAnalysis(session.inputAnalysis)
          }

          // Reconstruct chat messages from session inputs
          const reconstructed: ChatMessageType[] = []

          session.inputs?.forEach((inp, idx) => {
            if (inp.type === "description" && inp.content) {
              reconstructed.push({
                id: `hist-input-${idx}`,
                sender: "user",
                text: inp.content,
                timestamp: inp.createdAt
                  ? new Date(inp.createdAt).getTime()
                  : Date.now(),
              })
            } else if (inp.type === "image" && inp.imageUrl) {
              reconstructed.push({
                id: `hist-img-${idx}`,
                sender: "user",
                imagePreviewUrl: inp.imageUrl,
                timestamp: inp.createdAt
                  ? new Date(inp.createdAt).getTime()
                  : Date.now(),
              })

              if (inp.imageAnalysis) {
                reconstructed.push({
                  id: `hist-img-analysis-${idx}`,
                  sender: "assistant",
                  text: "Visual inspection completed for your uploaded image.",
                  imageAnalysis: inp.imageAnalysis,
                  timestamp: Date.now(),
                })
              }
            }
          })

          // If Stage 2 analysis was completed
          if (
            session.repairReplaceAnalysis &&
            session.repairReplaceCalculation
          ) {
            const stage2Data: Stage2ResponseData = {
              sessionId: session.sessionId,
              repairReplaceAnalysis: session.repairReplaceAnalysis,
              calculation: session.repairReplaceCalculation,
              resources: session.resources || {
                repairGuides: [],
                videos: [],
              },
            }
            setStage2Result(stage2Data)
            reconstructed.push({
              id: `hist-stage2`,
              sender: "assistant",
              stage2Result: stage2Data,
              timestamp: Date.now(),
            })
          } else if (session.inputAnalysis) {
            // Stage 1 assistant summary
            const conf = session.inputAnalysis.confidence
            if (conf >= 85) {
              reconstructed.push({
                id: `hist-stage1-card`,
                sender: "assistant",
                isActionCard: true,
                inputAnalysis: session.inputAnalysis,
                timestamp: Date.now(),
              })
            } else {
              reconstructed.push({
                id: `hist-stage1-msg`,
                sender: "assistant",
                text:
                  session.inputAnalysis.reason ||
                  "I've noted the initial details. Please provide more context to proceed with a precise repair assessment.",
                inputAnalysis: session.inputAnalysis,
                timestamp: Date.now(),
              })
            }
          }

          if (reconstructed.length > 0) {
            setMessages(reconstructed)
          }
        }
      } catch {
        // Stale or invalid session, clear it
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY)
      }
    }

    rehydrate()
  }, [])

  // Handle submitting a new problem or follow-up
  const handleSendMessage = async (payload: {
    description?: string
    image?: File
    imagePreviewUrl?: string
  }) => {
    setErrorBanner(null)

    // Append User Message to thread
    const userMsgId = `user-${Date.now()}`
    const userMsg: ChatMessageType = {
      id: userMsgId,
      sender: "user",
      text: payload.description,
      imagePreviewUrl: payload.imagePreviewUrl,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsStage1Loading(true)

    try {
      const response = await analyzeProblem({
        description: payload.description,
        image: payload.image,
        sessionId: sessionId || undefined,
      })

      if (response.success && response.data) {
        setFailedAction(null)
        const {
          sessionId: newSessionId,
          inputAnalysis: newInputAnalysis,
        } = response.data

        setSessionId(newSessionId)
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, newSessionId)
        setInputAnalysis(newInputAnalysis)

        // Generate Assistant Message
        const assistantMsgId = `assistant-${Date.now()}`
        const confidence = newInputAnalysis.confidence || 0

        // Filter out any previous action cards if new input received
        setMessages((prev) => {
          const filtered = prev.filter((m) => !m.isActionCard)

          if (confidence >= 85) {
            return [
              ...filtered,
              {
                id: assistantMsgId,
                sender: "assistant",
                isActionCard: true,
                inputAnalysis: newInputAnalysis,
                timestamp: Date.now(),
              },
            ]
          } else {
            return [
              ...filtered,
              {
                id: assistantMsgId,
                sender: "assistant",
                text:
                  newInputAnalysis.reason ||
                  (newInputAnalysis.questions?.length
                    ? "To give you the most accurate repair vs. replace comparison, could you clarify a few more points?"
                    : "I need a bit more details regarding the issue."),
                inputAnalysis: newInputAnalysis,
                timestamp: Date.now(),
              },
            ]
          }
        })
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to the repair diagnosis service."
      setErrorBanner(message)
      setFailedAction({ type: "message", payload })
    } finally {
      setIsStage1Loading(false)
    }
  }

  // Handle triggering Stage 2 Repair vs Replace Analysis
  const handleStartStage2 = async () => {
    if (!sessionId) return
    setErrorBanner(null)
    setIsStage2Loading(true)

    try {
      const response = await startRepairReplace(sessionId)
      if (response.success && response.data) {
        setFailedAction(null)
        setStage2Result(response.data)

        // Remove the action card and add rich Stage 2 message
        setMessages((prev) => {
          const filtered = prev.filter((m) => !m.isActionCard)
          return [
            ...filtered,
            {
              id: `stage2-${Date.now()}`,
              sender: "assistant",
              stage2Result: response.data,
              timestamp: Date.now(),
            },
          ]
        })
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate repair vs replace comparison."
      setErrorBanner(message)
      setFailedAction({ type: "stage2" })
    } finally {
      setIsStage2Loading(false)
    }
  }

  // Retry handler for failed action
  const handleRetry = () => {
    if (!failedAction) return
    const action = failedAction
    setErrorBanner(null)
    setFailedAction(null)
    if (action.type === "message") {
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].sender === "user") {
          return prev.slice(0, -1)
        }
        return prev
      })
      handleSendMessage(action.payload)
    } else if (action.type === "stage2") {
      handleStartStage2()
    }
  }

  // Open confirmation modal
  const handleOpenResetModal = () => {
    setShowResetModal(true)
  }

  // Execute reset when confirmed in custom modal
  const handleConfirmReset = async () => {
    setIsResetting(true)
    if (sessionId) {
      try {
        await deleteSession(sessionId)
      } catch {
        // Ignore deletion errors on reset
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY)
    setSessionId(null)
    setMessages([])
    setInputAnalysis(null)
    setStage2Result(null)
    setErrorBanner(null)
    setFailedAction(null)
    setIsRestoredSession(false)
    setIsResetting(false)
    setShowResetModal(false)
  }

  // Quick starter prompt handler
  const handleSelectStarter = (query: string) => {
    handleSendMessage({ description: query })
  }

  const confidenceScore = inputAnalysis?.confidence || 0
  const isQuotaError = Boolean(
    errorBanner && /quota|resource_exhausted|429|rate limit/i.test(errorBanner),
  )

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-64px)] flex flex-col bg-[#F4EBDD]">
        {/* Sticky Live Confidence Header */}
        <header className="sticky top-0 z-20 border-b border-[#2B2118]/10 bg-[#FAF5EE]/95 backdrop-blur-md px-3.5 sm:px-6 py-2.5 sm:py-3.5 shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            {/* Title & Live Status */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 aspect-square min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] items-center justify-center rounded-xl bg-[#2B2118] text-[#F4EBDD] shadow-sm">
                <IconWrench size={17} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-sm sm:text-base font-bold text-[#2B2118] truncate">
                    Repair Diagnostic Workbench
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-300 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    AI Active
                  </span>
                  {isRestoredSession && messages.length > 0 && (
                    <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-[#EAD8BE]/70 px-2 py-0.5 text-[10px] font-semibold text-[#523D2B] border border-[#2B2118]/15 shrink-0" title="Previous session automatically restored from local storage">
                      Restored Session
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-[#523D2B]/80 mt-0.5 truncate">
                  {inputAnalysis?.itemName
                    ? `Diagnosing: ${inputAnalysis.itemName}`
                    : "Describe the fault, upload photos & get instant cost vs replacement decisions"}
                </p>
              </div>
            </div>

            {/* Live Confidence Bar & Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {inputAnalysis && (
                <div className="hidden md:flex items-center gap-2.5 rounded-xl border border-[#2B2118]/10 bg-white/80 px-3.5 py-2 shadow-xs">
                  <span className="text-xs font-semibold text-[#523D2B]/80">
                    Diagnostic Confidence:
                  </span>
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-[#2B2118]/10">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        confidenceScore >= 85
                          ? "bg-emerald-600"
                          : confidenceScore >= 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.max(5, confidenceScore)}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-black ${
                      confidenceScore >= 85
                        ? "text-emerald-800"
                        : confidenceScore >= 50
                          ? "text-amber-800"
                          : "text-red-700"
                    }`}
                  >
                    {confidenceScore}%
                  </span>
                </div>
              )}

              {/* Free API Quota & System Info Button */}
              <button
                onClick={() => setShowApiNoticeModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#2B2118]/15 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-[#523D2B] hover:bg-[#EAD8BE] hover:text-[#2B2118] transition-colors cursor-pointer"
                title="Free API Quota & Diagnostic Notice"
              >
                <IconInfo size={15} />
                <span className="hidden sm:inline">API Info</span>
              </button>

              {/* Sidebar drawer toggle on mobile/tablet */}
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="lg:hidden flex items-center gap-1.5 rounded-xl border border-[#2B2118]/15 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-[#2B2118] hover:bg-[#EAD8BE] transition-colors cursor-pointer"
                title="Toggle Metrics"
              >
                <IconSliders size={16} />
                <span className="hidden sm:inline">Metrics</span>
                {inputAnalysis && (
                  <span className="inline-flex md:hidden text-[10px] font-black text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-300">
                    {confidenceScore}%
                  </span>
                )}
              </button>

              {/* Reset Session button */}
              {(messages.length > 0 || sessionId) && (
                <button
                  onClick={handleOpenResetModal}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2B2118]/15 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-[#523D2B] transition-all hover:border-[#E07A5F] hover:text-[#9E3E26] hover:bg-red-50/50 cursor-pointer"
                  title="Start fresh session"
                >
                  <IconRotateCcw size={14} />
                  <span className="hidden sm:inline">New Session</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Error Alert Banner */}
        {errorBanner && (
          <div className="mx-auto mt-4 w-full max-w-4xl px-3 sm:px-4">
            {isQuotaError ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-400 bg-amber-50/95 p-3.5 sm:p-4 text-xs text-amber-950 shadow-sm animate-fade-in">
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 aspect-square min-w-[28px] min-h-[28px] items-center justify-center rounded-xl bg-amber-200 text-amber-900 font-bold text-xs shadow-xs">
                    <IconClock size={16} />
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-amber-950 block sm:inline mr-1">
                      Gemini Free-Tier Quota Limit (HTTP 429):
                    </span>
                    <span className="text-amber-900 break-words">
                      The free-tier rate limit was reached. Please wait ~30–60 seconds for the window to reset, then retry.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => setShowApiNoticeModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-200/90 hover:bg-amber-300 text-amber-950 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    <IconInfo size={13} />
                    <span>Info</span>
                  </button>
                  {failedAction && (
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2B2118] hover:bg-[#6C79C0] text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer active:scale-95"
                    >
                      <IconRotateCcw size={13} className="shrink-0" />
                      <span>Retry</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setErrorBanner(null)
                      setFailedAction(null)
                    }}
                    className="text-amber-800 font-bold hover:text-amber-950 p-1.5 rounded-lg hover:bg-amber-200/60 text-xs transition-colors cursor-pointer"
                    title="Dismiss error"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-red-300 bg-red-100/95 p-3.5 sm:p-4 text-xs text-red-900 shadow-sm animate-fade-in">
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 aspect-square min-w-[24px] min-h-[24px] items-center justify-center rounded-full bg-red-200 text-red-800 font-bold text-xs">
                    !
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-red-950 block sm:inline mr-1">Diagnostic Error:</span>
                    <span className="text-red-900 break-words">{errorBanner}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {failedAction && (
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer active:scale-95"
                    >
                      <IconRotateCcw size={13} className="shrink-0" />
                      <span>Retry</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setErrorBanner(null)
                      setFailedAction(null)
                    }}
                    className="text-red-700 font-bold hover:text-red-950 p-1.5 rounded-lg hover:bg-red-200/60 text-xs transition-colors cursor-pointer"
                    title="Dismiss error"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2-Column Responsive Workspace */}
        <div className="mx-auto flex flex-col lg:flex-row w-full max-w-7xl flex-1 gap-4 sm:gap-6 p-3 sm:p-6 md:p-8 min-w-0">
          {/* Main Chat Stream Area */}
          <main className="flex flex-1 flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#2B2118]/10 bg-[#FAF5EE]/70 p-3.5 sm:p-6 md:p-7 shadow-sm min-h-[500px] w-full min-w-0 max-w-full overflow-hidden">
            {/* Thread Container */}
            <div className="flex-1 space-y-5 overflow-y-auto pr-1 min-w-0 max-w-full">
              {/* Empty State / Starter Suggestions */}
              {messages.length === 0 && (
                <div className="my-auto flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 aspect-square min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px] items-center justify-center rounded-2xl sm:rounded-3xl bg-[#6C79C0]/15 text-[#5360A6] shadow-sm mb-4">
                    <IconWrench size={30} />
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#2B2118] tracking-tight">
                    What device needs attention today?
                  </h2>
                  <p className="mt-2 max-w-md text-xs sm:text-sm text-[#523D2B]/80 leading-relaxed px-2">
                    Type a description of your problem, attach a photo of the
                    damage, or click one of our common diagnostic starters
                    below.
                  </p>

                  {/* Quick Starters Grid */}
                  <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
                    {QUICK_STARTERS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectStarter(item.query)}
                        disabled={isStage1Loading}
                        className="group flex flex-col justify-between rounded-2xl border border-[#2B2118]/10 bg-white/80 p-3.5 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6C79C0] hover:shadow-md active:scale-98 cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-serif text-sm font-bold text-[#2B2118] group-hover:text-[#5360A6]">
                              {item.title}
                            </span>
                            <span className="text-[#5360A6] opacity-0 transition-opacity group-hover:opacity-100 font-bold">
                              &rarr;
                            </span>
                          </div>
                          <p className="text-xs text-[#523D2B]/75 line-clamp-2">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message History */}
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onAddImageFile={(file) =>
                    handleSendMessage({
                      image: file,
                      imagePreviewUrl: URL.createObjectURL(file),
                    })
                  }
                  onAddExtraInfo={() => chatInputRef.current?.focusInput()}
                  onStartStage2={handleStartStage2}
                  isStage2Loading={isStage2Loading}
                />
              ))}

              {/* Stage 1 Thinking Indicator */}
              {isStage1Loading && (
                <TypingIndicator
                  stage="stage1"
                  customMessage="Analyzing device fault, parsing component symptoms..."
                />
              )}

              {/* Stage 2 Calculating Indicator */}
              {isStage2Loading && (
                <TypingIndicator
                  stage="stage2"
                  customMessage="Calculating parts & labor, querying iFixit manuals, comparing replacement cost ratios..."
                />
              )}

              {/* Failed Request Retry Prompt */}
              {failedAction && !isStage1Loading && !isStage2Loading && (
                <div
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 sm:p-4 text-xs shadow-xs animate-fade-in ${
                    isQuotaError
                      ? "border-amber-300 bg-amber-50/90 text-amber-950"
                      : "border-red-200/80 bg-red-50/85 text-red-900"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 aspect-square min-w-[28px] min-h-[28px] items-center justify-center rounded-xl font-bold ${
                      isQuotaError
                        ? "bg-amber-200 text-amber-900"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {isQuotaError ? <IconClock size={16} /> : <IconRotateCcw size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm">
                      {isQuotaError
                        ? "Gemini Free-Tier Rate Limit Reached"
                        : "AI Diagnostic was interrupted"}
                    </h4>
                    <p className="mt-0.5 text-xs opacity-90 leading-relaxed">
                      {isQuotaError
                        ? "The free Google Gemini API rate limit was temporarily reached. Please wait ~30–60 seconds for the window to reset and tap Retry."
                        : errorBanner ||
                          "The request could not be completed. You can retry without re-entering your message."}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleRetry}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 ${
                          isQuotaError
                            ? "bg-[#2B2118] hover:bg-[#6C79C0] text-white"
                            : "bg-red-700 hover:bg-red-800 text-white"
                        }`}
                      >
                        <IconRotateCcw size={13} />
                        <span>
                          Retry{" "}
                          {failedAction.type === "stage2"
                            ? "Comparison"
                            : "Message"}
                        </span>
                      </button>
                      {isQuotaError && (
                        <button
                          onClick={() => setShowApiNoticeModal(true)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amber-200/90 hover:bg-amber-300 text-amber-950 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                        >
                          <IconInfo size={13} />
                          <span>Quota Info</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setFailedAction(null)
                          setErrorBanner(null)
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold hover:underline cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Section: Hide input after stage 2 completed, show New Conversation Action */}
            {stage2Result ? (
              <div className="mt-6 pt-5 border-t border-[#2B2118]/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#EAD8BE]/35 p-4 sm:p-5 rounded-2xl border border-[#2B2118]/8 shadow-xs">
                <div className="flex items-center gap-3 text-xs text-[#523D2B]">
                  <span className="flex h-7 w-7 shrink-0 aspect-square min-w-[28px] min-h-[28px] items-center justify-center rounded-full bg-emerald-600/15 text-emerald-800">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">
                    Diagnostic assessment complete. Review the repair steps,
                    financial estimates, and external guide resources above.
                  </span>
                </div>

                <button
                  onClick={handleOpenResetModal}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-[#2B2118] px-5 py-3 text-xs font-bold text-[#F4EBDD] shadow-sm transition-all hover:bg-[#6C79C0] hover:text-white active:scale-98 cursor-pointer"
                >
                  <IconRotateCcw size={15} />
                  <span>Start New Diagnostic Session</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-[#2B2118]/8">
                <ChatInput
                  ref={chatInputRef}
                  onSend={handleSendMessage}
                  disabled={isStage1Loading || isStage2Loading}
                  placeholder={
                    messages.length === 0
                      ? "Describe what is broken or malfunctioning..."
                      : "Add more details, answer questions, or ask for guidance..."
                  }
                />
              </div>
            )}
          </main>

          {/* Right Metrics & Safety Sidebar (Desktop fixed in-flow) */}
          <div className="hidden lg:block lg:w-80 lg:shrink-0">
            <MetricsSidebar
              inputAnalysis={inputAnalysis}
              repairReplaceAnalysis={stage2Result?.repairReplaceAnalysis || null}
              calculation={stage2Result?.calculation || null}
              onStartStage2={handleStartStage2}
              isAnalyzingStage2={isStage2Loading}
              isOpen={true}
            />
          </div>
        </div>

        {/* Mobile Slide-in Metrics Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md h-full bg-[#FAF5EE] shadow-2xl overflow-y-auto p-4 sm:p-6 border-l border-[#2B2118]/15 animate-slide-left">
              <MetricsSidebar
                inputAnalysis={inputAnalysis}
                repairReplaceAnalysis={stage2Result?.repairReplaceAnalysis || null}
                calculation={stage2Result?.calculation || null}
                onStartStage2={() => {
                  setSidebarOpen(false)
                  handleStartStage2()
                }}
                isAnalyzingStage2={isStage2Loading}
                isOpen={true}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        <ConfirmResetModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleConfirmReset}
          isDeleting={isResetting}
        />

        {/* Free-Tier API Quota & System Notice Modal */}
        <ApiNoticeModal
          isOpen={showApiNoticeModal}
          onClose={() => setShowApiNoticeModal(false)}
        />
      </div>
    </PageLayout>
  )
}
