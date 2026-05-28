import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatINR(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function metricCard(title, value, subtext) {
  return (
    <div className="p-4 rounded bg-white/5 border border-white/6">
      <div className="text-xs text-neutral-400 uppercase tracking-wide">{title}</div>
      <div className="mt-2 text-2xl font-dmMono text-white">{value}</div>
      <div className="mt-1 text-sm text-neutral-300">{subtext}</div>
    </div>
  );
}

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const revenueData = useMemo(() => {
    const base = [12, 14, 16, 18, 21, 24, 28, 31, 35, 39, 44, 48];
    return months.map((m, i) => ({
      month: m,
      volume: base[i] * 100000,
      reconciled: Math.round(base[i] * 0.97 * 100000),
    }));
  }, []);

  const successPie = [
    { name: "Matched", value: 96.4, color: "#10b981" },
    { name: "Pending", value: 2.8, color: "#f59e0b" },
    { name: "Failed", value: 0.8, color: "#ef4444" },
  ];

  const gatewayVolume = [
    { gateway: "Stripe", count: 1480, color: "#6366f1" },
    { gateway: "Razorpay", count: 1310, color: "#10b981" },
    { gateway: "UPI", count: 1210, color: "#06b6d4" },
    { gateway: "PayPal", count: 950, color: "#f59e0b" },
    { gateway: "PhonePe", count: 760, color: "#ec4899" },
  ];

  const settlementData = [
    { gateway: "Stripe", days: 1.2 },
    { gateway: "Razorpay", days: 1.8 },
    { gateway: "UPI", days: 2.1 },
    { gateway: "PayPal", days: 2.9 },
    { gateway: "PhonePe", days: 3.4 },
  ];

  const reports = [
    { name: "Daily reconciliation summary", period: "Today", size: "4.2 MB" },
    { name: "Monthly variance report", period: "May 2026", size: "12.8 MB" },
    { name: "Audit-ready exception log", period: "May 2026", size: "2.1 MB" },
    { name: "Executive KPI snapshot", period: "Q2 2026", size: "8.4 MB" },
  ];

  function handleGenerateReport() {
    toast.success("Generating report...");
  }

  function handleExportPdf() {
    toast.success("Preparing PDF export...");
  }

  function handleDownload(name) {
    toast.success(`Generating ${name}...`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="grid grid-cols-2 gap-3 max-w-2xl">
          <div>
            <label className="text-xs text-neutral-400">From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/5 border border-white/6" />
          </div>
          <div>
            <label className="text-xs text-neutral-400">To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full mt-1 p-2 rounded bg-white/5 border border-white/6" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={handleGenerateReport} className="px-4 py-2 rounded bg-indigo-600 text-white">Generate Report</button>
          <button onClick={handleExportPdf} className="px-4 py-2 rounded border border-white/6 bg-white/5">Export PDF</button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4">
        {metricCard("Total Volume", "₹48.2L", "+18.3% MoM")}
        {metricCard("Success Rate", "97.4%", "+1.2%")}
        {metricCard("Avg Settlement", "1.8 days", "-0.4 days faster")}
        {metricCard("Fraud Blocked", "₹4.2L", "99% catch rate")}
      </div>

      {/* Charts rows */}
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-6 p-4 rounded bg-white/4 border border-white/6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-neutral-300">Revenue Trend</div>
              <div className="text-xs text-neutral-400">Transaction Volume vs Reconciled Amount</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#1f2937" }} />
              <YAxis tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#1f2937" }} tickFormatter={(v) => `₹${Math.round(v / 100000)}L`} />
              <Tooltip
                contentStyle={{ background: "#0f1117", border: "1px solid #1f2937" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value, name) => [formatINR(value), name]}
              />
              <Area type="monotone" dataKey="volume" stroke="#6366f1" fill="url(#volGrad)" name="Transaction Volume" />
              <Area type="monotone" dataKey="reconciled" stroke="#10b981" fill="url(#recGrad)" name="Reconciled Amount" />
              <Line type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} dot={false} name="Transaction Volume" />
              <Line type="monotone" dataKey="reconciled" stroke="#10b981" strokeWidth={2} dot={false} name="Reconciled Amount" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-4 p-4 rounded bg-white/4 border border-white/6 flex flex-col">
          <div className="mb-3">
            <div className="text-sm text-neutral-300">Success vs Failure Ratio</div>
            <div className="text-xs text-neutral-400">Reconciliation outcome distribution</div>
          </div>

          <div className="relative flex-1 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                >
                  {successPie.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f1117", border: "1px solid #1f2937" }} formatter={(value) => [`${value}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xs text-neutral-400">Success Rate</div>
                <div className="font-dmMono text-3xl text-white">96.4%</div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-300">
            {successPie.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded bg-white/4 border border-white/6">
          <div className="mb-3">
            <div className="text-sm text-neutral-300">Gateway Performance</div>
            <div className="text-xs text-neutral-400">Transaction count by gateway</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gatewayVolume} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid stroke="#1f2937" />
              <XAxis type="number" tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#1f2937" }} />
              <YAxis dataKey="gateway" type="category" tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#1f2937" }} />
              <Tooltip contentStyle={{ background: "#0f1117", border: "1px solid #1f2937" }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {gatewayVolume.map((entry) => (
                  <Cell key={entry.gateway} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded bg-white/4 border border-white/6">
          <div className="mb-3">
            <div className="text-sm text-neutral-300">Settlement Time by Gateway</div>
            <div className="text-xs text-neutral-400">Lower is better</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={settlementData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid stroke="#1f2937" />
              <XAxis type="number" tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#1f2937" }} />
              <YAxis dataKey="gateway" type="category" tick={{ fill: "#cbd5e1" }} axisLine={{ stroke: "#1f2937" }} />
              <Tooltip contentStyle={{ background: "#0f1117", border: "1px solid #1f2937" }} formatter={(v) => [`${v} days`, "Avg settlement"]} />
              <Bar dataKey="days" radius={[0, 8, 8, 0]}>
                {settlementData.map((entry) => (
                  <Cell
                    key={entry.gateway}
                    fill={entry.days < 2 ? "#10b981" : entry.days <= 3 ? "#f59e0b" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports table */}
      <div className="p-4 rounded bg-white/4 border border-white/6">
        <div className="mb-4">
          <div className="text-sm text-neutral-300">Available Reports</div>
          <div className="text-xs text-neutral-400">Download report exports in CSV or PDF</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-neutral-400 text-xs">
              <tr>
                <th className="py-2 text-left">Report</th>
                <th className="py-2 text-left">Period</th>
                <th className="py-2 text-left">Size</th>
                <th className="py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.name} className="border-t border-white/6">
                  <td className="py-3 text-white">{report.name}</td>
                  <td className="py-3 text-neutral-300">{report.period}</td>
                  <td className="py-3 text-neutral-300">{report.size}</td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleDownload(report.name)} className="px-3 py-1 rounded bg-white/5 border border-white/6">CSV</button>
                      <button onClick={() => handleDownload(report.name)} className="px-3 py-1 rounded bg-white/5 border border-white/6">PDF</button>
                    </div>
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
