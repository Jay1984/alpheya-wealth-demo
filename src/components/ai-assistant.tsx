"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Welcome to the Alpheya AI Wealth Assistant. I can help you with portfolio analysis, rebalancing recommendations, yield optimization, and risk assessment for your HNW client portfolios. How can I assist you today?",
    timestamp: "09:00",
  },
];

const CANNED_RESPONSES: Record<string, string> = {
  rebalance:
    "Based on the current drift analysis, I recommend the following rebalancing trades for the Henderson Family Trust:\n\n" +
    "- **SELL** $750K Intl Developed (VXUS) — overweight by 2.5%\n" +
    "- **BUY** $500K US Large Cap (VOO) — underweight by 1.8%\n" +
    "- **BUY** $250K EM Equities (VWO) — underweight by 0.7%\n\n" +
    "Estimated tax impact: ~$12K in realized gains. Shall I generate the FIX orders for execution?",
  yield:
    "I've analyzed the fixed income sleeve across 12 HNW portfolios. Key findings:\n\n" +
    "- Current weighted yield: **4.82%** (vs. benchmark 4.45%)\n" +
    "- Duration mismatch: portfolios are **0.3yr shorter** than IPS targets\n" +
    "- **Opportunity**: rotating $2.1M from short-term IG to BBB-rated 5yr corporates could add ~35bps of yield with minimal credit risk increase\n\n" +
    "The AI model estimates a 92% probability this outperforms the current allocation over 12 months.",
  risk:
    "Portfolio risk summary across all managed accounts:\n\n" +
    "- **VaR (95%, 1-day)**: $142K — within acceptable range\n" +
    "- **Max Drawdown (12m)**: -6.2% — below the -8% threshold\n" +
    "- **Concentration risk**: Top 5 positions = 18% of AUM — compliant\n" +
    "- **Liquidity score**: 94/100 — no concerns\n\n" +
    "**Alert**: Correlation between equity sleeves has risen from 0.62 to 0.78 this quarter. Consider adding uncorrelated alternatives to reduce systemic exposure.",
  compliance:
    "Compliance check complete for Q3 reporting:\n\n" +
    "- **MiFID II suitability**: All 847 positions pass ✓\n" +
    "- **Concentration limits**: 2 accounts approaching 10% single-stock threshold\n" +
    "- **ESG scoring**: Portfolio average 72/100 (above 65 minimum) ✓\n" +
    "- **Cross-border tax**: 3 positions flagged for withholding review\n\n" +
    "I've prepared a detailed compliance report in the document vault. Would you like me to schedule a review with the compliance team?",
};

function matchResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("rebalanc") || lower.includes("drift") || lower.includes("allocat"))
    return CANNED_RESPONSES.rebalance;
  if (lower.includes("yield") || lower.includes("income") || lower.includes("bond") || lower.includes("fixed"))
    return CANNED_RESPONSES.yield;
  if (lower.includes("risk") || lower.includes("var") || lower.includes("drawdown") || lower.includes("volatil"))
    return CANNED_RESPONSES.risk;
  if (lower.includes("compliance") || lower.includes("regulat") || lower.includes("mifid") || lower.includes("esg"))
    return CANNED_RESPONSES.compliance;
  return (
    "I can help with that. Here are the areas I can analyze:\n\n" +
    "- **Portfolio Rebalancing** — drift analysis and trade recommendations\n" +
    "- **Yield Optimization** — fixed income analysis and rotation strategies\n" +
    "- **Risk Assessment** — VaR, drawdown, concentration, and liquidity\n" +
    "- **Compliance** — MiFID II, ESG scoring, and regulatory checks\n\n" +
    "Try asking about any of these topics for detailed insights."
  );
}

const SUGGESTIONS = [
  "Show rebalancing recommendations",
  "Analyze yield optimization opportunities",
  "Run a portfolio risk assessment",
  "Check compliance status for Q3",
];

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const now = new Date();
    const ts = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const userMsg: Message = { id: Date.now(), role: "user", content: text.trim(), timestamp: ts };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = matchResponse(text);
      const replyTs = new Date();
      const rts = `${replyTs.getHours().toString().padStart(2, "0")}:${replyTs.getMinutes().toString().padStart(2, "0")}`;
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: response, timestamp: rts },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            className="px-3 py-1.5 bg-card border border-border rounded-full text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <Sparkles size={12} className="inline mr-1.5 text-accent" />
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-3xl",
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "assistant" ? "bg-accent/20 text-accent" : "bg-muted text-foreground"
              )}
            >
              {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div
              className={cn(
                "rounded-xl p-4 text-sm leading-relaxed",
                msg.role === "assistant"
                  ? "bg-card border border-border"
                  : "bg-accent text-white"
              )}
            >
              <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br/>')
              }} />
              <p className={cn(
                "text-xs mt-2",
                msg.role === "assistant" ? "text-muted-foreground" : "text-white/60"
              )}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-accent/20 text-accent shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder="Ask about portfolio insights, rebalancing, yield optimization..."
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="px-4 py-3 bg-accent text-white rounded-xl hover:bg-accent/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
