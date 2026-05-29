// =====================
// Number Formatters
// =====================
export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount.toFixed(0)}`
}

export const formatNumber = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export const formatPercent = (n: number): string => `${n.toFixed(1)}%`

// =====================
// ROI Calculations
// =====================
export const calcROI = (revenue: number, spend: number): number => {
  if (spend === 0) return 0
  return ((revenue - spend) / spend) * 100
}

export const calcCPE = (payment: number, likes: number, comments: number, shares: number): number => {
  const engagement = likes + comments + shares
  if (engagement === 0) return 0
  return payment / engagement
}

export const calcCPR = (payment: number, reach: number): number => {
  if (reach === 0) return 0
  return payment / reach
}

// =====================
// Campaign Health Score
// =====================
export interface HealthInput {
  totalEngagement: number
  targetEngagement: number
  totalReach: number
  targetReach: number
  roi: number
  spend: number
  budget: number
}

export const calcHealthScore = (input: HealthInput): { score: number; label: string; color: string } => {
  const engScore = input.targetEngagement > 0
    ? Math.min(100, (input.totalEngagement / input.targetEngagement) * 100) * 0.30
    : 0
  const reachScore = input.targetReach > 0
    ? Math.min(100, (input.totalReach / input.targetReach) * 100) * 0.25
    : 0
  const roiScore = Math.min(100, Math.max(0, input.roi)) * 0.30
  const budgetUtil = input.budget > 0
    ? Math.min(100, (input.spend / input.budget) * 100)
    : 0
  const budgetScore = budgetUtil > 80 ? 100 * 0.15 : (budgetUtil / 80) * 100 * 0.15

  const score = Math.round(engScore + reachScore + roiScore + budgetScore)

  if (score >= 80) return { score, label: 'Excellent', color: '#10b981' }
  if (score >= 60) return { score, label: 'Good', color: '#6366f1' }
  if (score >= 40) return { score, label: 'Average', color: '#f59e0b' }
  return { score, label: 'Poor', color: '#ef4444' }
}

// =====================
// Simulated Metrics Generator
// =====================
export const generateSimulatedMetrics = (platform: string, followers: number) => {
  const base = followers || 10000
  const platformMultipliers: Record<string, number> = {
    Instagram: 1.0,
    YouTube: 0.8,
    Facebook: 0.6,
    X: 0.5,
    LinkedIn: 0.4,
  }
  const m = platformMultipliers[platform] || 1.0
  const reach = Math.floor(base * m * (0.15 + Math.random() * 0.25))
  const impressions = Math.floor(reach * (1.2 + Math.random() * 0.8))
  const likes = Math.floor(reach * (0.03 + Math.random() * 0.07))
  const comments = Math.floor(likes * (0.05 + Math.random() * 0.1))
  const shares = Math.floor(likes * (0.02 + Math.random() * 0.05))
  const clicks = Math.floor(reach * (0.01 + Math.random() * 0.04))
  const revenue = Math.floor(clicks * (10 + Math.random() * 40))
  return { reach, impressions, likes, comments, shares, clicks, revenue_generated: revenue }
}

// =====================
// Date Utilities
// =====================
export const isOverdue = (dueDate: string | null, status: string): boolean => {
  if (!dueDate || status === 'Paid') return false
  return new Date(dueDate) < new Date()
}

export const daysUntilDue = (dueDate: string | null): number => {
  if (!dueDate) return Infinity
  const diff = new Date(dueDate).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const formatDate = (date: string | null): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
