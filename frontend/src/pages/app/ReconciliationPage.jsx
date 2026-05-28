import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import { Check, X, Play } from "lucide-react";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDateShort(d) {
  const dt = new Date(d);
  return dt.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function makeBatches() {
  const names = ["Batch #2026-047", "Batch #2026-048", "Batch #2026-049", "Batch #2026-050", "Batch #2026-051", "Batch #2026-052"];
  const statuses = ["completed", "running", "failed", "completed", "completed", "running"];
  return names.map((n, i) => ({
    id: `BATCH-${2026}-${randInt(100, 999)}`,
    name: n,
    status: statuses[i % statuses.length],
    date: new Date(Date.now() - randInt(0, 10) * 24 * 3600 * 1000).toISOString(),
    matchRate: (99 + Math.random() * 0.99).toFixed(2),
    matched: 4820 + randInt(-20, 20),
    exceptions: 18 + randInt(-5, 5),
    failed: randInt(0, 5),
  }));
}

function makeResults(count = 12) {
  const types = ["exact", "fuzzy", "ai"];
  const rows = [];
  for (let i = 0; i < count; i++) {
    const confidence = randInt(60, 100);
    rows.push({
      id: `TXN-2026-${randInt(10000, 99999)}`,
      type: types[Math.floor(Math.random() * types.length)],
      confidence,
      status: confidence > 85 ? "Matched" : confidence > 70 ? "Pending" : "Failed",
    });
  }
  return rows;
}

const stageDefs = [
  { key: "fetch", label: "Fetch Data" },
  { key: "exact", label: "Exact Match" },
  { key: "ai", label: "AI Match" },
  { key: "complete", label: "Complete" },
];

export default function ReconciliationPage() {
  const [batches] = useState(() => makeBatches());
  const [selectedId, setSelectedId] = useState(batches[0].id);
  const selected = useMemo(() => batches.find((b) => b.id === selectedId) || batches[0], [batches, selectedId]);

  const [results] = useState(() => makeResults(20));
  const [showModal, setShowModal] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [running, setRunning] = useState(false);

  function startRun({ gateway, from, to, strategy }) {
    setShowModal(true);
    setRunProgress(0);
    setRunning(true);
    const duration = 3000; // 3s
    const start = Date.now();
    const iv = setInterval(() => {
      const t = Date.now() - start;
      const pct = Math.min(100, Math.round((t / duration) * 100));
      setRunProgress(pct);
      if (pct >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          setRunning(false);
          setShowModal(false);
          toast.success("Reconciliation started — batch queued (mock)");
        }, 300);
      }
    }, 100);
  }

  const pieData = useMemo(() => {
    const matched = selected.matched;
    const ai = Math.round(selected.matched * 0.03) || 142;
    const exceptions = selected.exceptions;
    const failed = selected.failed;
    const total = matched + ai + exceptions + failed || 1;
    return [
      { name: "Matched", value: matched, color: "#10b981" },
      { name: "AI Matched", value: ai, color: "#6366F1" },
      { name: "Exceptions", value: exceptions, color: "#F59E0B" },
      { name: "Failed", value: failed, color: "#EF4444" },
    ];
  }, [selected]);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Reconciliation</h1>
          <p className="text-sm text-neutral-400">Batches and reconciliation results</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: batch list 35% */}
        <div className="w-[35%]">
          <div className="mb-3">
            <button onClick={() => setShowModal(true)} className="w-full bg-indigo-600 text-white py-2 rounded">Run New Batch</button>
          </div>

          <div className="space-y-3">
            {batches.map((b) => (
              <div key={b.id} onClick={() => setSelectedId(b.id)} className={`p-3 rounded border ${selectedId === b.id ? "border-indigo-500 bg-white/3" : "border-white/6"} cursor-pointer` }>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{b.name}</div>
                  <div>
                    {b.status === "completed" && <span className="px-2 py-1 rounded bg-green-500 text-black text-xs">Completed</span>}
                    {b.status === "running" && <span className="px-2 py-1 rounded bg-blue-500 text-black text-xs animate-pulse">Running</span>}
                    {b.status === "failed" && <span className="px-2 py-1 rounded bg-red-500 text-white text-xs">Failed</span>}
                  </div>
                </div>
                <div className="text-xs text-neutral-400 mt-2">{formatDateShort(b.date)}</div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <div className="text-neutral-300">Match rate: <span className="font-dmMono text-white">{b.matchRate}%</span></div>
                  <div className="text-neutral-300">Records: <span className="font-dmMono text-white">{b.matched} / {b.exceptions}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: details 65% */}
        <div className="w-[65%] bg-transparent space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-lg font-medium">{selected.name}</div>
              {selected.status === "completed" && <span className="px-2 py-1 rounded bg-green-500 text-black text-sm">Completed</span>}
              {selected.status === "running" && <span className="px-2 py-1 rounded bg-blue-500 text-black text-sm animate-pulse">Running</span>}
              {selected.status === "failed" && <span className="px-2 py-1 rounded bg-red-500 text-white text-sm">Failed</span>}
            </div>
            <div>
              <button className="px-3 py-1 bg-white/6 rounded mr-2">Export Results</button>
            </div>
          </div>

          {/* Progress stages */}
          <div className="flex items-center space-x-6">
            {stageDefs.map((s, idx) => {
              const stageState = (() => {
                // simple mapping: first two completed if selected.completed
                if (selected.status === "completed") return idx <= 3 ? "done" : "pending";
                if (selected.status === "running") return idx < 2 ? "done" : idx === 2 ? "running" : "pending";
                if (selected.status === "failed") return idx < 3 ? "done" : "failed";
                return "pending";
              })();

              return (
                <div key={s.key} className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stageState === "done" ? "bg-indigo-600" : stageState === "running" ? "bg-blue-500 animate-pulse" : "bg-white/6"}`}>
                    {stageState === "done" ? <Check className="w-4 h-4" /> : stageState === "running" ? <Play className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/30" />}
                  </div>
                  <div>
                    <div className="text-sm text-neutral-300">{s.label}</div>
                    <div className="text-xs text-white">{stageState === "done" ? "1m 12s" : stageState === "running" ? "30s" : "--"}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="p-4 rounded bg-white/5">
              <div className="text-xs text-neutral-400">Matched</div>
              <div className="font-dmMono text-lg text-white">{selected.matched}</div>
            </div>
            <div className="p-4 rounded bg-white/5">
              <div className="text-xs text-neutral-400">AI Matched</div>
              <div className="font-dmMono text-lg text-white">{Math.round(selected.matched * 0.03)}</div>
            </div>
            <div className="p-4 rounded bg-white/5">
              <div className="text-xs text-neutral-400">Exceptions</div>
              <div className="font-dmMono text-lg text-white">{selected.exceptions}</div>
            </div>
            <div className="p-4 rounded bg-white/5">
              <div className="text-xs text-neutral-400">Failed</div>
              <div className="font-dmMono text-lg text-white">{selected.failed}</div>
            </div>
          </div>

          {/* Donut + results */}
          <div className="flex gap-6 mt-4">
            <div className="w-1/3 p-4 rounded bg-white/3 flex items-center justify-center">
              <div style={{ width: 220, height: 220 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={100} startAngle={90} endAngle={-270}>
                      {pieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="-mt-36 text-center">
                  <div className="text-sm text-neutral-400">Match Rate</div>
                  <div className="font-dmMono text-2xl text-white">{selected.matchRate}%</div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="rounded bg-white/4 p-4">
                <div className="text-sm text-neutral-300 mb-2">Results</div>
                <table className="w-full text-sm">
                  <thead className="text-neutral-400 text-xs">
                    <tr>
                      <th className="py-2 text-left">TXN ID</th>
                      <th className="py-2 text-left">Match Type</th>
                      <th className="py-2 text-left">Confidence</th>
                      <th className="py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} className="border-t border-white/6">
                        <td className="py-2 font-dmMono text-white">{r.id}</td>
                        <td className="py-2 text-neutral-300">{r.type}</td>
                        <td className="py-2">
                          <div className="w-full bg-white/6 h-3 rounded overflow-hidden">
                            <div style={{ width: `${r.confidence}%`, background: r.confidence > 90 ? "#10b981" : r.confidence > 75 ? "#F59E0B" : "#EF4444" }} className="h-3" />
                          </div>
                        </td>
                        <td className="py-2"><span className={`px-2 py-1 rounded text-xs ${r.status === "Matched" ? "bg-green-500 text-black" : r.status === "Pending" ? "bg-amber-400 text-black" : "bg-red-500 text-white"}`}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Run Batch Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#071018] p-6 rounded w-2/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">Run New Batch</h3>
                  <div className="text-sm text-neutral-400">Select gateway, date range and strategy</div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2"><X /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-400">Gateway</label>
                  <select className="w-full p-2 bg-white/5 rounded">
                    <option>Stripe</option>
                    <option>Razorpay</option>
                    <option>PayPal</option>
                    <option>UPI</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="text-xs text-neutral-400">From</label>
                    <input type="date" className="w-full p-2 bg-white/5 rounded" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-neutral-400">To</label>
                    <input type="date" className="w-full p-2 bg-white/5 rounded" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Match Strategy</label>
                  <select className="w-full p-2 bg-white/5 rounded">
                    <option>Exact</option>
                    <option>Fuzzy</option>
                    <option>AI</option>
                  </select>
                </div>

                <div className="pt-4">
                  <div className="w-full bg-white/6 h-3 rounded overflow-hidden">
                    <div style={{ width: `${runProgress}%` }} className="h-3 bg-indigo-600 transition-all" />
                  </div>
                  <div className="text-sm text-neutral-400 mt-2">{running ? "Running reconciliation..." : runProgress >= 100 ? "Completed" : "Ready"}</div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button onClick={() => setShowModal(false)} className="px-3 py-2 bg-white/5 rounded">Cancel</button>
                  <button onClick={() => startRun({})} className="px-3 py-2 bg-indigo-600 text-black rounded">Start Reconciliation</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
