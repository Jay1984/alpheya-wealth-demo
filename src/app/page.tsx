"use client";

import { useState } from "react";
import { BarChart3, Radio, MessageSquare, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortfolioOverview, ApiTelemetry } from "@/components/ui/dynamic-charts";
import AiAssistant from "@/components/ai-assistant";

const TABS = [
  { id: "portfolio", label: "DPM & Portfolio Overview", icon: BarChart3 },
  { id: "telemetry", label: "B2B API & FIX Telemetry", icon: Radio },
  { id: "assistant", label: "AI Wealth Assistant", icon: MessageSquare },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("portfolio");

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Alpheya</h1>
                <p className="text-xs text-muted-foreground -mt-0.5">B2B Wealth Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-muted-foreground">All systems operational</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="shrink-0 border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === "portfolio" && <PortfolioOverview />}
          {activeTab === "telemetry" && <ApiTelemetry />}
          {activeTab === "assistant" && <AiAssistant />}
        </div>
      </main>
    </div>
  );
}
