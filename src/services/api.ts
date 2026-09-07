import type {
  AnalysisSession,
  IInputAnalysis,
  Stage2ResponseData,
} from "../types/analysis"

const getApiBaseUrl = (): string => {
  const envUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_API ||
    import.meta.env.BACKEND_API ||
    "https://hackathon-repair-replace.onrender.com"

  return envUrl.replace(/\/+$/, "")
}

const API_BASE = getApiBaseUrl()

export interface Stage1Response {
  success: boolean
  message: string
  data: {
    sessionId: string
    inputAnalysis: IInputAnalysis
    status: "collecting_information" | "ready_for_analysis" | "completed"
  }
}

export interface Stage2Response {
  success: boolean
  message: string
  data: Stage2ResponseData
}

export interface GetSessionResponse {
  success: boolean
  data: AnalysisSession
}

/**
 * Stage 1: Send problem description or image to get understanding & questions
 */
export async function analyzeProblem(params: {
  description?: string
  image?: File | Blob
  sessionId?: string
}): Promise<Stage1Response> {
  const formData = new FormData()

  if (params.description && params.description.trim()) {
    formData.append("description", params.description.trim())
  }

  if (params.image) {
    formData.append("image", params.image)
  }

  if (params.sessionId) {
    formData.append("sessionId", params.sessionId)
  }

  const response = await fetch(`${API_BASE}/api/analysis`, {
    method: "POST",
    body: formData,
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMsg =
      json?.message ||
      `Server returned ${response.status}: Failed to analyze problem.`
    throw new Error(errorMsg)
  }

  return json as Stage1Response
}

/**
 * Stage 2: Calculate repair vs replace assessment and fetch resources
 */
export async function startRepairReplace(
  sessionId: string,
): Promise<Stage2Response> {
  const response = await fetch(`${API_BASE}/api/repair-replace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMsg =
      json?.message ||
      `Server returned ${response.status}: Failed to generate repair/replace assessment.`
    throw new Error(errorMsg)
  }

  return json as Stage2Response
}

/**
 * Rehydrate session data when user refreshes or reopens session
 */
export async function getSessionAnalysis(
  sessionId: string,
): Promise<GetSessionResponse> {
  const response = await fetch(`${API_BASE}/api/analysis/${sessionId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMsg =
      json?.message ||
      `Server returned ${response.status}: Failed to load session.`
    throw new Error(errorMsg)
  }

  return json as GetSessionResponse
}

/**
 * Delete an existing session and associated images
 */
export async function deleteSession(
  sessionId: string,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/api/analysis/${sessionId}`, {
    method: "DELETE",
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMsg =
      json?.message ||
      `Server returned ${response.status}: Failed to delete session.`
    throw new Error(errorMsg)
  }

  return json
}
