// src/pages/farmer/FarmBenefitsWallet.jsx
import React, { useState } from "react";
import {
  Wallet,
  IndianRupee,
  Clock,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import StatsCard from "../../../components/partials/StatsCard";

const FarmBenefitsWallet = () => {
  const [filterScheme, setFilterScheme] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { benefitsWalletData } = govtSchemeData;
  const {
    summaryCards,
    transactionLedger,
    monthlyBenefits,
    yearlyBenefitsByScheme,
    forecastData,
    totalForecast,
  } = benefitsWalletData;

  const getStatusBadge = (status) => {
    if (status === "success") {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle className="w-3 h-3" />
          Success
        </span>
      );
    } else if (status === "pending") {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
  };

  const filteredTransactions = transactionLedger.filter((transaction) => {
    if (filterScheme !== "all" && transaction.scheme !== filterScheme) {
      return false;
    }
    if (filterYear !== "all" && !transaction.date.includes(filterYear)) {
      return false;
    }
    if (
      searchQuery &&
      !transaction.scheme.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const uniqueSchemes = [...new Set(transactionLedger.map((t) => t.scheme))];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color }} className="mb-0.5">
              {p.name}: ₹{p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const exportToCSV = () => {
    const headers = ["Date", "Scheme", "Installment/Description", "Amount", "Status", "Reference No", "Mode"];
    const rows = filteredTransactions.map((t) => [
      t.date,
      `"${t.scheme.replace(/"/g, '""')}"`,
      `"${t.installment.replace(/"/g, '""')}"`,
      `"${t.amount.replace(/"/g, '""')}"`,
      t.status,
      t.referenceNo,
      t.mode
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "benefits_wallet_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <Wallet className="h-5 w-5 text-brand-medium" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">Benefits Wallet</h1>
            <p className="text-xs text-gray-500">Track all cash transfers, insurance claims, and pending payouts in one secure ledger</p>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Lifetime Benefits"
          value={summaryCards.lifetimeBenefits}
          icon={<Wallet className="text-brand-medium" />}
          subtext="Total direct benefits received"
        />
        <StatsCard
          title="Current Year"
          value={summaryCards.currentYear}
          icon={<IndianRupee className="text-brand-medium" />}
          subtext="Disbursed in present financial year"
        />
        <StatsCard
          title="Pending"
          value={summaryCards.pending}
          icon={<Clock className="text-amber-500" />}
          trendType="warning"
          subtext="Awaiting bank verification"
        />
        <StatsCard
          title="Upcoming (90 days)"
          value={summaryCards.upcoming90Days}
          icon={<TrendingUp className="text-brand-medium" />}
          subtext="Projected next payouts"
        />
      </div>

      {/* 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Benefits Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4">
          <h3 className="font-bold text-[#132a13] text-sm mb-1">
            Monthly Payout Distribution
          </h3>
          <p className="text-xs text-gray-400 mb-4">Visual ledger across the crop seasons</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBenefits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: "bold" }} />
                <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#31572c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Benefits Stacked Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4">
          <h3 className="font-bold text-[#132a13] text-sm mb-1">
            Yearly Benefits by Program
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Comparison of direct cash benefits over the last 4 years
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyBenefitsByScheme}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fontWeight: "bold" }} />
                <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend tick={{ fontSize: 10 }} />
                <Bar dataKey="PM Kisan" stackId="a" fill="#132a13" />
                <Bar dataKey="PMFBY" stackId="a" fill="#31572c" />
                <Bar dataKey="SC Scheme" stackId="a" fill="#4f772d" />
                <Bar dataKey="KCC" stackId="a" fill="#90a955" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Benefit Forecast Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4 mb-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-55">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-medium" />
              Expected Future Benefit Schedule
            </h3>
            <p className="text-[10px] text-gray-400">
              Projected disbursements based on verification completion
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-450 uppercase tracking-wider">Estimated Total</p>
            <p className="text-xl font-black text-[#132a13]">
              {totalForecast}
            </p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: "bold" }} />
              <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="baseline"
                fill="#ecf39e"
                stroke="#90a955"
                strokeWidth={1.5}
                name="Baseline (Kisan Direct)"
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#132a13"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Projected with Subsidies"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm">Disbursement History</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Audit log of DBT transfers to seeded bank accounts</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-450" />
              <input
                type="text"
                placeholder="Search scheme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none w-40 bg-white"
              />
            </div>
            <select
              value={filterScheme}
              onChange={(e) => setFilterScheme(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white focus:outline-none"
            >
              <option value="all">All Schemes</option>
              {uniqueSchemes.map((scheme) => (
                <option key={scheme} value={scheme}>
                  {scheme}
                </option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white focus:outline-none"
            >
              <option value="all">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-[#f4f7f4] hover:bg-brand-medium/10 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7f4]/40 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Scheme
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Installment/Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Reference No
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#132a13]">
                    {transaction.scheme}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {transaction.installment}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#132a13]">
                    {transaction.amount}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-gray-500 font-mono">
                    {transaction.referenceNo}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {transaction.mode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmBenefitsWallet;
