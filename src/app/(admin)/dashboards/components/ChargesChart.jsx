'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// ApexCharts must be dynamically loaded (no SSR)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function ChargesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-muted small">
        No charges recorded for this month
      </div>
    )
  }

  const series = [
    {
      name: 'Charges',
      data: data.map(d => Math.round(d.total / 100)), // cents → rands
    },
  ]

  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: '#9ca3af',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.4,
        gradientToColors: ['#ff7700'],
        inverseColors: false,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    colors: ['#ff7700'],
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
    },
    xaxis: {
      categories: data.map(d => d.date),
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        formatter: v => `R ${v}`,
      },
    },
    tooltip: {
      y: {
        formatter: v => `R ${v.toFixed(2)}`,
      },
    },
  }

  return (
    <div className="card dashboard-card">
      <div className="card-body" style={{ padding: 16 }}>
        <div style={{ width: '100%', height: 260 }}>
          <Chart options={options} series={series} type="area" height={260} />
        </div>
      </div>
    </div>
  )
}