"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";

const endpoints = [
  { path: "/api/v2/portfolios", method: "GET", latency: 42, status: "healthy", calls24h: 12840 },
  { path: "/api/v2/orders", method: "POST", latency: 78, status: "healthy", calls24h: 4320 },
  { path: "/api/v2/rebalance", method: "POST", latency: 156, status: "degraded", calls24h: 890 },
  { path: "/api/v2/compliance", method: "GET", latency: 34, status: "healthy", calls24h: 9210 },
  { path: "/api/v2/analytics", method: "GET", latency: 210, status: "degraded", calls24h: 2150 },
  { path: "/api/v2/positions", method: "GET", latency: 28, status: "healthy", calls24h: 18400 },
];

const fixOrders = [
  { orderId: "FIX-90281", symbol: "AAPL", side: "BUY", qty: 5000, status: "FILLED", venue: "NYSE", latency: 12 },
  { orderId: "FIX-90282", symbol: "MSFT", side: "SELL", qty: 3200, status: "PARTIAL", venue: "NASDAQ", latency: 8 },
  { orderId: "FIX-90283", symbol: "TSLA", side: "BUY", qty: 1500, status: "PENDING", venue: "ARCA", latency: 45 },
  { orderId: "FIX-90284", symbol: "JPM", side: "BUY", qty: 8000, status: "FILLED", venue: "NYSE", latency: 6 },
  { orderId: "FIX-90285", symbol: "AMZN", side: "SELL", qty: 2100, status: "REJECTED", venue: "BATS", latency: 3 },
];

const partnerBanks = [
  { bank: "UBS Wealth Mgmt", errorRate: 0.12, requests: 45200, validation: 99.8 },
  { bank: "Credit Suisse DPM", errorRate: 0.34, requests: 32100, validation: 99.4 },
  { bank: "Julius Baer", errorRate: 0.08, requests: 28700, validation: 99.9 },
  { bank: "Lombard Odier", errorRate: 1.20, requests: 15400, validation: 98.2 },
  { bank: "Pictet Group", errorRate: 0.21, requests: 21300, validation: 99.6 },
];

const latencyTimeline = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  rest: Math.floor(30 + Math.random() * 80),
  fix: Math.floor(5 + Math.random() * 30),
}));

const errorTimeline = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  errors: Math.floor(Math.random() * 15),
}));

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    healthy: { bg: "bg-success/15 text-success", text: "Healthy" },
    degraded: { bg: "bg-warning/15 text-warning", text: "Degraded" },
    down: { bg: "bg-danger/15 text-danger", text: "Down" },
    FILLED: { bg: "bg-success/15 text-success", text: "Filled" },
    PARTIAL: { bg: "bg-warning/15 text-warning", text: "Partial" },
    PENDING: { bg: "bg-accent/15 text-accent", text: "Pending" },
    REJECTED: { bg: "bg-danger/15 text-danger", text: "Rejected" },
  };
  const s = map[status] ?? { bg: "bg-muted", text: status };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", s.bg)}>
      {s.text}
    </span>
  );
}

export default function ApiTelemetry() {
  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: "Active Endpoints", value: "6", color: "text-accent" },
          { icon: Clock, label: "Avg Latency", value: "91ms", color: "text-accent" },
          { icon: Zap, label: "FIX Throughput", value: "1,240/s", color: "text-success" },
          { icon: Server, label: "Uptime (30d)", value: "99.97%", color: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-muted-foreground text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency timeline */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-lg mb-4">Latency (24h)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={latencyTimeline}>
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} interval={5} />
              <YAxis stroke="#94a3b8" fontSize={10} unit="ms" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
              />
              <Area type="monotone" dataKey="rest" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} name="REST" isAnimationActive={false} />
              <Area type="monotone" dataKey="fix" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} name="FIX" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Error rate timeline */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-lg mb-4">Error Rate (24h)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={errorTimeline}>
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} interval={5} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
              />
              <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REST endpoints */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-lg mb-4">REST API Endpoints</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Endpoint</th>
                <th className="text-left py-3 px-2 font-medium">Method</th>
                <th className="text-right py-3 px-2 font-medium">Latency</th>
                <th className="text-right py-3 px-2 font-medium">24h Calls</th>
                <th className="text-center py-3 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep) => (
                <tr key={ep.path} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-mono text-sm">{ep.path}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 bg-accent/15 text-accent rounded text-xs font-medium">
                      {ep.method}
                    </span>
                  </td>
                  <td className={cn("py-3 px-2 text-right font-mono", ep.latency > 100 ? "text-warning" : "text-foreground")}>
                    {ep.latency}ms
                  </td>
                  <td className="py-3 px-2 text-right font-mono">{ep.calls24h.toLocaleString()}</td>
                  <td className="py-3 px-2 text-center"><StatusBadge status={ep.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FIX protocol */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-lg mb-4">FIX Protocol Order Routing</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Order ID</th>
                <th className="text-left py-3 px-2 font-medium">Symbol</th>
                <th className="text-left py-3 px-2 font-medium">Side</th>
                <th className="text-right py-3 px-2 font-medium">Qty</th>
                <th className="text-left py-3 px-2 font-medium">Venue</th>
                <th className="text-right py-3 px-2 font-medium">Latency</th>
                <th className="text-center py-3 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {fixOrders.map((o) => (
                <tr key={o.orderId} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-mono">{o.orderId}</td>
                  <td className="py-3 px-2 font-medium">{o.symbol}</td>
                  <td className={cn("py-3 px-2", o.side === "BUY" ? "text-success" : "text-danger")}>{o.side}</td>
                  <td className="py-3 px-2 text-right font-mono">{o.qty.toLocaleString()}</td>
                  <td className="py-3 px-2 text-muted-foreground">{o.venue}</td>
                  <td className="py-3 px-2 text-right font-mono">{o.latency}ms</td>
                  <td className="py-3 px-2 text-center"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partner bank integrations */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-lg mb-4">Partner Bank Integrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Bank</th>
                <th className="text-right py-3 px-2 font-medium">Requests (30d)</th>
                <th className="text-right py-3 px-2 font-medium">Payload Validation</th>
                <th className="text-right py-3 px-2 font-medium">Error Rate</th>
                <th className="text-center py-3 px-2 font-medium">Health</th>
              </tr>
            </thead>
            <tbody>
              {partnerBanks.map((b) => (
                <tr key={b.bank} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-medium">{b.bank}</td>
                  <td className="py-3 px-2 text-right font-mono">{b.requests.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={cn("font-mono", b.validation >= 99.5 ? "text-success" : "text-warning")}>
                      {b.validation}%
                    </span>
                  </td>
                  <td className={cn("py-3 px-2 text-right font-mono", b.errorRate > 0.5 ? "text-danger" : "text-foreground")}>
                    {b.errorRate}%
                  </td>
                  <td className="py-3 px-2 text-center">
                    {b.errorRate > 0.5 ? (
                      <XCircle size={16} className="text-danger inline" />
                    ) : (
                      <CheckCircle2 size={16} className="text-success inline" />
                    )}
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
