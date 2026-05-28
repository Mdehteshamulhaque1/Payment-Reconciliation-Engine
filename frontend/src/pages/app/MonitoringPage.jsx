import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GRAFANA_URL = import.meta.env.VITE_GRAFANA_URL || "";

const statusDot = (color) => (
  <span
    style={{ background: color }}
    className="inline-block w-3 h-3 rounded-full mr-2 shadow-sm"
  />
);

function useLiveData(initial, mutateFn, intervalMs = 3000) {
  const [data, setData] = useState(initial);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setData((d) => mutateFn(d));
    }, intervalMs);
    return () => clearInterval(timer.current);
  }, [mutateFn, intervalMs]);

  return data;
}

function genSeries(length = 20, min = 0, max = 100, base = 0) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push({ x: i, y: Math.round(base + min + Math.random() * (max - min)) / 1 });
  }
  return arr;
}

const MetricCard = ({ label, value, color = "#10b981" }) => (
  <div className="bg-white/3 backdrop-blur-sm p-4 rounded-lg border border-white/5 flex flex-col">
    <div className="text-xs uppercase text-neutral-400">{label}</div>
    <div className="mt-2 flex items-center">
      <div className="font-dmMono text-2xl text-white mr-3">{value}</div>
      <div className="ml-auto">{statusDot(color)}</div>
    </div>
  </div>
);

const PanelWrapper = ({ title, children }) => (
  <div
    style={{ background: "#0F1117", border: "1px solid #1F2937" }}
    className="p-4 rounded-lg"
  >
    <div className="text-sm text-[#C9D1D9] font-mono mb-2">{title}</div>
    <div style={{ minHeight: 120 }}>{children}</div>
  </div>
);

export default function MonitoringPage() {
  // Top metrics (static-ish)
  const [metrics] = useState([
    { label: "API Uptime", value: "99.98%", color: "#10b981" },
    { label: "Avg Response", value: "142ms", color: "#10b981" },
    { label: "Error Rate", value: "0.02%", color: "#10b981" },
    { label: "Requests/min", value: "1,284", color: "#3B82F6" },
    { label: "Active Users", value: "7", color: "#3B82F6" },
    { label: "DB Query Time", value: "8ms", color: "#10b981" },
  ]);

  // Mock series data
  const initialTx = useMemo(() => genSeries(20, 200, 1200, 200), []);
  const initialMatch = useMemo(() => genSeries(20, 9900, 9999, 9900).map((p) => ({ x: p.x, y: p.y / 100 })), []);
  const initialQueue = useMemo(() => genSeries(20, 0, 60, 0), []);
  const initialError = useMemo(() => genSeries(20, 0, 5, 0).map((p) => ({ x: p.x, y: +(p.y / 100).toFixed(4) })), []);

  const txData = useLiveData(initialTx, (d) => {
    const next = d.slice(1);
    const last = d[d.length - 1]?.y || 500;
    next.push({ x: d[d.length - 1].x + 1, y: Math.max(0, Math.round(last + (Math.random() - 0.5) * 80)) });
    return next;
  });

  const matchData = useLiveData(initialMatch, (d) => {
    const next = d.slice(1);
    const last = d[d.length - 1]?.y || 99.3;
    const jitter = (Math.random() - 0.3) * 0.15;
    next.push({ x: d[d.length - 1].x + 1, y: +(Math.min(100, Math.max(95, last + jitter))).toFixed(2) });
    return next;
  });

  const queueData = useLiveData(initialQueue, (d) => {
    const next = d.slice(1);
    const last = d[d.length - 1]?.y || 6;
    next.push({ x: d[d.length - 1].x + 1, y: Math.max(0, Math.round(last + (Math.random() - 0.4) * 8)) });
    return next;
  });

  const errorData = useLiveData(initialError, (d) => {
    const next = d.slice(1);
    const last = d[d.length - 1]?.y || 0.002;
    const jitter = (Math.random() - 0.6) * 0.01;
    const val = Math.max(0, +(last + jitter).toFixed(4));
    next.push({ x: d[d.length - 1].x + 1, y: val });
    return next;
  });

  const alerts = [
    { level: "OK", color: "#10b981", text: "Reconciliation batch completed", when: "2 min ago" },
    { level: "WARN", color: "#F59E0B", text: "API latency spike on /reconcile endpoint", when: "8 min ago" },
    { level: "OK", color: "#10b981", text: "Fraud detection model retrained", when: "1 hr ago" },
  ];

  const gateways = [
    { domain: "stripe.com", name: "Stripe", uptime: "99.99%", latency: "142ms", status: "green", last: "1m ago" },
    { domain: "razorpay.com", name: "Razorpay", uptime: "99.87%", latency: "198ms", status: "yellow", last: "3m ago" },
    { domain: "paypal.com", name: "PayPal", uptime: "98.94%", latency: "312ms", status: "red", last: "5m ago" },
    { domain: "phonepe.com", name: "PhonePe", uptime: "99.71%", latency: "167ms", status: "green", last: "2m ago" },
    { domain: "paytm.com", name: "Paytm", uptime: "99.43%", latency: "223ms", status: "yellow", last: "4m ago" },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">System Monitoring</h1>
          <p className="text-sm text-neutral-400">Live metrics from Prometheus + Grafana</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-sm text-green-400">
            <span className="w-3 h-3 mr-2 rounded-full bg-green-400 animate-pulse" /> Live
          </span>
          <a
            href={GRAFANA_URL || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-white/6 border border-white/8 text-sm rounded-md text-white"
          >
            Open Grafana ↗
          </a>
        </div>
      </header>

      {/* Top row metrics */}
      <div className="grid grid-cols-6 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} color={m.color} />
        ))}
      </div>

      {/* Grafana embed / mock */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div style={{ background: "#0A0A0A" }} className="p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-[#F46800] font-semibold">GRAFANA</div>
                <div className="text-white font-medium">Reconciliation Dashboard</div>
              </div>
              <div className="text-sm text-neutral-400">Grafana is running at {GRAFANA_URL || "localhost:3001"}</div>
            </div>

            {GRAFANA_URL ? (
              <div style={{ height: 500 }} className="rounded-md overflow-hidden border border-white/6">
                <iframe
                  title="Grafana"
                  src={GRAFANA_URL}
                  style={{ width: "100%", height: "500px", border: "0" }}
                />
              </div>
            ) : (
              <div className="rounded-md overflow-hidden border border-white/6 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <PanelWrapper title="Transactions Processed / min">
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={txData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00E5CC" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#00E5CC" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#1F2937" />
                        <XAxis dataKey="x" tick={false} axisLine={false} />
                        <YAxis tick={false} axisLine={false} />
                        <Tooltip wrapperStyle={{ background: "#0F1117", border: "1px solid #1F2937" }} />
                        <Line type="monotone" dataKey="y" stroke="#00E5CC" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </PanelWrapper>

                  <PanelWrapper title="Match Rate %">
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={matchData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#1F2937" />
                        <XAxis dataKey="x" tick={false} axisLine={false} />
                        <YAxis tick={false} axisLine={false} />
                        <Tooltip wrapperStyle={{ background: "#0F1117", border: "1px solid #1F2937" }} />
                        <Area type="monotone" dataKey="y" stroke="#818cf8" fill="url(#matchGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </PanelWrapper>

                  <PanelWrapper title="Exception Queue Depth">
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={queueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#1F2937" />
                        <XAxis dataKey="x" tick={false} axisLine={false} />
                        <YAxis tick={false} axisLine={false} />
                        <Tooltip wrapperStyle={{ background: "#0F1117", border: "1px solid #1F2937" }} />
                        <Bar dataKey="y" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </PanelWrapper>

                  <PanelWrapper title="API Error Rate">
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={errorData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#1F2937" />
                        <XAxis dataKey="x" tick={false} axisLine={false} />
                        <YAxis tick={false} axisLine={false} />
                        <Tooltip wrapperStyle={{ background: "#0F1117", border: "1px solid #1F2937" }} />
                        <Area type="monotone" dataKey="y" stroke="#10b981" fill="#052E22" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </PanelWrapper>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column side panels: Alerts + Gateways */}
        <aside className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: "#071018", border: "1px solid #16202a" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-white">Active Alerts</div>
            </div>
            <div className="space-y-3">
              {alerts.map((a, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div style={{ background: a.color }} className="px-2 py-0.5 rounded text-xs font-mono text-black">{a.level}</div>
                    <div className="text-sm text-white">{a.text}</div>
                  </div>
                  <div className="text-xs text-neutral-400">{a.when}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: "#071018", border: "1px solid #16202a" }}>
            <div className="text-sm font-medium text-white mb-3">Gateway Health</div>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-400 text-xs">
                  <th className="py-2">Gateway</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Uptime</th>
                  <th className="py-2">Avg Latency</th>
                  <th className="py-2">Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {gateways.map((g) => (
                  <tr key={g.name} className="border-t border-white/6">
                    <td className="py-3 flex items-center space-x-3">
                      <img src={`https://logo.clearbit.com/${g.domain}`} alt="logo" className="w-6 h-6 rounded" />
                      <div className="text-white">{g.name}</div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${g.status === "green" ? "bg-green-400" : g.status === "yellow" ? "bg-amber-400" : "bg-red-500"}`} />
                        <span className="text-neutral-300 text-sm">{g.status.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-3 text-white">{g.uptime}</td>
                    <td className="py-3 text-white">{g.latency}</td>
                    <td className="py-3 text-neutral-400">{g.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </div>
  );
}
