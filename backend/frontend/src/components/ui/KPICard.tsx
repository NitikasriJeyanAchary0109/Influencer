import React from 'react'

interface Props {
  label: string
  value: string | number
  sub?: string
  color?: string
  icon?: React.ReactNode
}

const KPICard: React.FC<Props> = ({ label, value, sub, color = '#6366f1', icon }) => (
  <div className="kpi-card">
    <div className="kpi-card-accent" style={{ background: color }}/>
    <div className="kpi-label">{label}</div>
    <div className="kpi-value" style={{ color }}>{value}</div>
    {sub && <div className="kpi-sub">{sub}</div>}
    {icon && <div className="kpi-icon">{icon}</div>}
  </div>
)

export default KPICard
