export interface CostRange {
  min: number
  max: number
  average: number
}

export interface Tool {
  name: string
  required: boolean
  estimatedPrice: CostRange
}

export interface Material {
  name: string
  required: boolean
  estimatedPrice: CostRange
}

export interface RepairDifficulty {
  score: number
  level: "easy" | "moderate" | "difficult" | "not_possible"
}

export interface RepairCost {
  materials: CostRange
  tools: CostRange
  professionalLabor: CostRange
}

export interface RepairTime {
  minMinutes: number
  maxMinutes: number
  averageMinutes: number
}

export interface ReplacementTime {
  minDays: number
  maxDays: number
  averageDays: number
}

export interface RepairDetail {
  possible: boolean
  difficulty: RepairDifficulty
  cost: RepairCost
  time: RepairTime
  tools: Tool[]
  materials: Material[]
  steps: string[]
}

export interface ReplacementDetail {
  possible: boolean
  cost: CostRange
  time: ReplacementTime
  reason: string
}

export interface SafetyDetail {
  score: number
  level: "low" | "medium" | "high"
  warning: string | null
}

export interface RepairReplaceAnalysis {
  repair: RepairDetail
  replacement: ReplacementDetail
  safety: SafetyDetail
}

export interface CalculationRepairCost {
  diy: CostRange
  professional: CostRange
}

export interface Savings {
  amount: number
  percentage: number
}

export interface Comparison {
  diyRepairCostRatio: number
  diyRepairCostPercentage: number
  professionalRepairCostRatio: number
  professionalRepairCostPercentage: number
  diySavings: Savings
  professionalSavings: Savings
}

export interface ScoreFactors {
  cost: number
  feasibility: number
  difficulty: number
  safety: number
}

export interface Scores {
  repair: number
  replace: number
  factors: ScoreFactors
}

export interface RepairReplaceCalculation {
  repairCost: CalculationRepairCost
  replacementCost: CostRange
  comparison: Comparison
  scores: Scores
  recommendation: "repair" | "replace" | "both" | "neither"
}

export interface ResourceItem {
  title: string
  url: string
  description: string
  source: string
  thumbnail?: string
}

export interface ReplacementOptions {
  donate: ResourceItem[]
  refurbish: ResourceItem[]
  recycle: ResourceItem[]
}

export interface ResourceResult {
  repairGuides: ResourceItem[]
  videos: ResourceItem[]
  replacementOptions?: ReplacementOptions
}

export interface ImageAnalysis {
  imageRelevant: boolean
  itemVisible: boolean
  visibleDamage: boolean
  damageDescription: string | null
  affectedComponent: string | null
  visibleCondition: string | null
  safetyConcern: boolean
  safetyWarning: string | null
  observations: string[]
  limitations: string[]
}

export interface IInputAnalysis {
  itemIdentified: boolean
  itemName?: string | null
  problemIdentified: boolean
  problemSpecific: boolean
  relevantContextPresent: boolean
  understood: boolean
  confidence: number
  problemSummary: string | null
  missingInformation: string[]
  questions: string[]
  requiresImage: boolean
  reason: string | null
}

export interface SessionInput {
  type: "description" | "image"
  content?: string
  imageUrl?: string
  publicId?: string
  imageAnalysis?: ImageAnalysis
  createdAt?: string
}

export interface AnalysisSession {
  sessionId: string
  inputs: SessionInput[]
  status: "collecting_information" | "ready_for_analysis" | "completed"
  expiresAt?: string
  inputAnalysis: IInputAnalysis | null
  repairReplaceAnalysis: RepairReplaceAnalysis | null
  repairReplaceCalculation: RepairReplaceCalculation | null
  resources?: ResourceResult | null
  createdAt?: string
  updatedAt?: string
}

export interface Stage2ResponseData {
  sessionId: string
  repairReplaceAnalysis: RepairReplaceAnalysis
  calculation: RepairReplaceCalculation
  resources: ResourceResult
}

export interface ChatMessage {
  id: string
  sender: "user" | "assistant"
  text?: string
  imagePreviewUrl?: string
  imageAnalysis?: ImageAnalysis
  inputAnalysis?: IInputAnalysis
  stage2Result?: Stage2ResponseData
  isActionCard?: boolean
  timestamp: number
}
