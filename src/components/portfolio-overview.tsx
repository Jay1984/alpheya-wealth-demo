"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

const allocationData = [
  { name: "Equities", value: 42, amount: "$12.6M" },
  { name: "Fixed Income", value: 28, amount: "$8.4M" },
  { name: "Alternatives", value: 20, amount: "$6.0M" },
  { name: "Cash", value: 10, amount: "$3.0M" },
];

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#475569"];

const assetBreakdown = [
  { asset: "US Large Cap", class: "Equities", current: 18.2, target: 20.0, drift: -1.8 },
  { asset: "Intl Developed", class: "Equities", current: 14.5, target: 12.0, drift: 2.5 },
  { asset: "EM Equities", class: "Equities", current: 9.3, target: 10.0, drift: -0.7 },
  { asset: "IG Corporate", class: "Fixed Income", current: 15.1, target: 15.0, drift: 0.1 },
  { asset: "US Treasuries", class: "Fixed Income", current: 12.9, target: 13.0, drift: -0.1 },
  { asset: "Private Equity", class: "Alternatives", current: 10.2, target: 10.0, drift: 0.2 },
  { asset: "Hedge Funds", class: "Alternatives", current: 9.8, target: 10.0, drift: -0.2 },
  { asset: "Money Market", class: "Cash", current: 10.0, target: 10.0, drift: 0.0 },
];

const performanceData = [
  { month: "Jan", portfolio: 2.1, benchmark: 1.8 },
  { month: "Feb", portfolio: -0.5, benchmark: -1.2 },
  { month: "Mar", portfolio: 3.4, benchmark: 2.9 },
  { month: "Apr", portfolio: 1.2, benchmark: 0.8 },
  { month: "May", portfolio: -1.8, benchmark: -2.1 },
  { month: "Jun", portfolio: 4.2, benchmark: 3.5 },
];

export default function PortfolioOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary cards */}
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-muted-foreground text-sm">Total AUM</p>
          <p className="text-3xl font-semibold mt-1">$30.0M</p>
          <div className="flex items-center gap-1 mt-2 text-success text-sm">
            <TrendingUp size={14} />
            <span>+8.6% YTD</span>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-muted-foreground text-sm">Sharpe Ratio</p>
          <p className="text-3xl font-semibold mt-1">1.42</p>
          <p className="text-muted-foreground text-sm mt-2">vs. Benchmark 1.15</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-muted-foreground text-sm">Active Positions</p>
          <p className="text-3xl font-semibold mt-1">847</p>
          <div className="flex items-center gap-1 mt-2 text-warning text-sm">
            <TrendingDown size={14} />
            <span>12 breaching limits</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-lg mb-4">Asset Allocation</h3>
          <div className="flex flex-col items-center">
            <PieChart width={320} height={240}>
              <Pie
                data={allocationData}
                cx={160}
                cy={110}
                innerRadius={55}
                outerRadius={95}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
              >
                {allocationData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
                formatter={(value, name) => [`${value}%`, name]}
              />
            </PieChart>
            <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
              {allocationData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance bar chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-lg mb-4">Monthly Performance (%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={performanceData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#e2e8f0" }}>{value}</span>
                )}
              />
              <Bar dataKey="portfolio" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="benchmark" fill="#475569" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drift alert */}
      <div className="bg-card rounded-xl border border-warning/40 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-warning" />
          <h3 className="font-semibold text-lg text-warning">AI Portfolio Drift Alert</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-2">
          The AI engine detected a <strong className="text-foreground">+2.5% overweight</strong> in
          International Developed equities relative to the IPS target.
          Recommended action: rebalance $750K from Intl Developed to US Large Cap to restore target allocation.
        </p>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors">
            Execute Rebalance
          </button>
          <button className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
            Dismiss
          </button>
        </div>
      </div>

      {/* Asset breakdown table */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-lg mb-4">Asset Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Asset</th>
                <th className="text-left py-3 px-2 font-medium">Class</th>
                <th className="text-right py-3 px-2 font-medium">Current %</th>
                <th className="text-right py-3 px-2 font-medium">Target %</th>
                <th className="text-right py-3 px-2 font-medium">Drift</th>
              </tr>
            </thead>
            <tbody>
              {assetBreakdown.map((row) => (
                <tr key={row.asset} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-medium">{row.asset}</td>
                  <td className="py-3 px-2 text-muted-foreground">{row.class}</td>
                  <td className="py-3 px-2 text-right">{row.current.toFixed(1)}%</td>
                  <td className="py-3 px-2 text-right">{row.target.toFixed(1)}%</td>
                  <td className={`py-3 px-2 text-right font-medium ${
                    Math.abs(row.drift) > 1 ? "text-warning" : row.drift > 0 ? "text-success" : "text-muted-foreground"
                  }`}>
                    {row.drift > 0 ? "+" : ""}{row.drift.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
