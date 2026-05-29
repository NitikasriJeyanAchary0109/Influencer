import React from 'react'
import { calcHealthScore, type HealthInput } from '../../lib/utils'

const HealthScore: React.FC<{ input: HealthInput }> = ({ input }) => {
  const { score, label, color } = calcHealthScore(input)
  const r = 42, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  // Calculate Breakdown metrics percentages
  const engPercent = input.targetEngagement > 0
    ? Math.min(100, Math.round((input.totalEngagement / input.targetEngagement) * 100))
    : 0
  const reachPercent = input.targetReach > 0
    ? Math.min(100, Math.round((input.totalReach / input.targetReach) * 100))
    : 0
  const roiPercent = Math.min(100, Math.max(0, Math.round(input.roi)))
  const budgetUtil = input.budget > 0
    ? Math.min(100, Math.round((input.spend / input.budget) * 100))
    : 0

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>AI Health Index</h3>
        <span className="health-score-badge" style={{ background: color + '15', color, border: `1px solid ${color}30` }}>
          {label}
        </span>
      </div>

      {/* Circle dial */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 0 20px', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        <div style={{ width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r={r} fill="none" stroke="var(--border)" strokeWidth="7"/>
            <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="7"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}/>
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Score</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 14, maxWidth: '240px', lineHeight: 1.4, margin: '14px auto 0' }}>
          {score >= 80 ? 'Campaign is performing exceptionally with strong conversions and reach metrics.' :
           score >= 60 ? 'Campaign is performing well. Minor optimizations can maximize conversion ROI.' :
           score >= 40 ? 'Performance is average. Consider adding high engagement creators to boost stats.' :
           'Critical attention required. Negative ROI or excessive budget utilization detected.'}
        </p>
      </div>

      {/* Breakdowns */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { name: 'Engagement Target', val: `${engPercent}%`, percent: engPercent, activeColor: 'var(--primary)' },
          { name: 'Reach Achievement', val: `${reachPercent}%`, percent: reachPercent, activeColor: '#06b6d4' },
          { name: 'ROI Performance', val: `${roiPercent}%`, percent: roiPercent, activeColor: 'var(--success)' },
          { name: 'Budget Utilization', val: `${budgetUtil}%`, percent: budgetUtil, activeColor: '#f59e0b' }
        ].map(m => (
          <div key={m.name} style={{ fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: 'var(--text-muted)' }}>{m.name}</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{m.val}</span>
            </div>
            <div className="health-bar-bg" style={{ margin: 0, height: 6, background: 'var(--bg)' }}>
              <div className="health-bar-fill" style={{ width: `${m.percent}%`, background: m.activeColor }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HealthScore
export type { HealthInput }
