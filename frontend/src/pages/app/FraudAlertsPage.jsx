import React, { useMemo } from "react";
import toast from "react-hot-toast";

const ALERTS = [
  {
    severity: "CRITICAL",
    merchant: "Zomato",
    domain: "zomato.com",
    type: "Velocity Spike",
    description: "8 transactions in 5 min",
    amount: 420000,
    gateway: "UPI",
    confidence: 96,
    time: "8 min ago",
  },
  {
    severity: "HIGH",
    merchant: "Uber",
    domain: "uber.com",
    type: "Amount Anomaly",
    description: "340x higher than average",
    amount: 98000,
    gateway: "Stripe",
    confidence: 87,
    time: "12 min ago",
  },
  {
    severity: "HIGH",
    merchant: "Swiggy",
    domain: "swiggy.com",
    type: "Duplicate Transaction",
    description: "Same amount+merchant in 90 seconds",
    amount: 2400,
    gateway: "PhonePe",
    confidence: 82,
    time: "18 min ago",
  },
  {
    severity: "MEDIUM",
    merchant: "Amazon",
    domain: "amazon.com",
    type: "Odd Hours High Value",
    description: "Transaction at 3:24 AM",
    amount: 140000,
    gateway: "Paytm",
    confidence: 71,
    time: "45 min ago",
  },
  {
    severity: "LOW",
    merchant: "Netflix",
    domain: "netflix.com",
    type: "Failed Attempts",
    description: "4 failed attempts before success",
    amount: 649,
    gateway: "PayPal",
    confidence: 58,
    time: "1 hr ago",
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function colorForValue(v) {
  if (v >= 8) return "bg-red-500";
  if (v >= 5) return "bg-orange-400";
  if (v >= 2) return "bg-yellow-300";
  return "bg-neutral-700";
}

function formatINR(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function FraudAlertsPage() {
  // generate heatmap data 7 x 24
  const heatmap = useMemo(() => {
    const grid = Array.from({ length: 7 }).map(() => Array.from({ length: 24 }).map(() => 0));
    // increase weekend nights (Fri index 4, Sat index 5) hours 22-23 and 0-2
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        let base = Math.random() < 0.03 ? Math.floor(Math.random() * 3) : 0;
        if ((d === 4 || d === 5) && (h >= 22 || h <= 2)) base += Math.floor(Math.random() * 6) + 2;
        grid[d][h] = base;
      }
    }
    return grid;
  }, []);

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fraud & Anomaly Detection</h1>
          <p className="text-sm text-neutral-400">Active fraud alerts and model health</p>
        </div>
      </header>

      {/* Top stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded bg-white/5">
          <div className="text-xs text-neutral-400">Total Alerts Today</div>
          <div className="font-dmMono text-2xl text-red-400">7</div>
        </div>
        <div className="p-4 rounded bg-white/5">
          <div className="text-xs text-neutral-400">Critical</div>
          <div className="font-dmMono text-2xl text-red-500">1</div>
        </div>
        <div className="p-4 rounded bg-white/5">
          <div className="text-xs text-neutral-400">High</div>
          <div className="font-dmMono text-2xl text-orange-400">2</div>
        </div>
        <div className="p-4 rounded bg-white/5">
          <div className="text-xs text-neutral-400">False Positives</div>
          <div className="font-dmMono text-2xl text-neutral-300">3</div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: Live Feed 60% */}
        <div className="w-3/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-medium">Active Fraud Alerts</h2>
              <span className="flex items-center text-sm text-green-400"><span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"/> Live</span>
            </div>
          </div>

          <div className="space-y-3">
            {ALERTS.map((a, i) => (
              <div key={i} className="p-4 rounded border border-white/6 flex items-center justify-between hover:bg-white/3 transition-colors">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${a.severity === "CRITICAL" ? "bg-red-600 text-white" : a.severity === "HIGH" ? "bg-orange-400 text-black" : a.severity === "MEDIUM" ? "bg-yellow-300 text-black" : "bg-neutral-500 text-white"}`}>{a.severity}</div>
                  </div>

                  <img src={`https://logo.clearbit.com/${a.domain}`} alt="m" className="w-10 h-10 rounded" />

                  <div>
                    <div className="text-sm text-white font-medium">{a.merchant}</div>
                    <div className="text-xs text-neutral-400">{a.type} — {a.description}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-dmMono text-lg text-white">{formatINR(a.amount)}</div>
                    <div className="text-xs text-neutral-400 flex items-center"><img src={`https://logo.clearbit.com/${a.gateway.toLowerCase()}.com`} alt="gw" className="w-4 h-4 rounded mr-2" onError={(e)=>{e.currentTarget.style.display='none'}} /> <span className="text-neutral-400">{a.gateway}</span></div>
                  </div>

                  <div style={{ width: 220 }}>
                    <div className="w-full bg-white/6 h-3 rounded overflow-hidden">
                      <div style={{ width: `${a.confidence}%`, background: a.confidence > 90 ? "#ef4444" : a.confidence > 75 ? "#f59e0b" : "#9ca3af" }} className="h-3" />
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">Confidence: {a.confidence}%</div>
                  </div>

                  <div className="text-sm text-neutral-400">{a.time}</div>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => toast.success('Marked false positive (mock)')} className="px-3 py-1 rounded border border-white/6">Mark False Positive</button>
                    <button onClick={() => toast('Escalated (mock)')} className="px-3 py-1 rounded bg-red-600 text-white">Escalate</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Heatmap + model info 40% */}
        <div className="w-2/5 space-y-4">
          <div className="p-4 rounded bg-white/4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-neutral-300">Fraud by Hour × Day</div>
                <div className="text-xs text-neutral-400">Heatmap of alerts (mock)</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="grid grid-rows-7 gap-1">
                {heatmap.map((row, dIdx) => (
                  <div key={dIdx} className="flex items-center space-x-2">
                    <div className="w-10 text-xs text-neutral-400">{days[dIdx]}</div>
                    <div className="flex space-x-1">
                      {row.map((v, h) => (
                        <div key={h} title={`${days[dIdx]} ${h}:00 — ${v} alerts`} className={`w-6 h-6 ${colorForValue(v)} rounded-sm`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-neutral-300">AI Model Status</div>
                <div className="text-xs text-neutral-400">IsolationForest</div>
              </div>
              <div className="text-sm text-neutral-400">Last trained: 2 hours ago</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/6 rounded">
                <div className="text-xs text-neutral-400">Accuracy</div>
                <div className="font-dmMono text-lg text-white">94.2%</div>
              </div>
              <div className="p-3 bg-white/6 rounded">
                <div className="text-xs text-neutral-400">Training samples</div>
                <div className="font-dmMono text-lg text-white">48,291</div>
              </div>
            </div>

            <div className="mt-3 text-right">
              <button onClick={() => toast.success('Retraining started (mock)')} className="px-3 py-2 bg-indigo-600 text-black rounded">Retrain Model</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
