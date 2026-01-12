'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function ChargesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-muted small">
        No charges recorded for this month
      </div>
    )
  }

  const chartData = data.map(d => ({
    date: d.date,
    total: d.total / 100, // cents → rands
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(v) => `R ${v.toFixed(2)}`} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#ff7700"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}