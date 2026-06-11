import React, { useState, useMemo } from "react";
import GenericTable from "../../../components/partials/GenericTable";
import { PageHeader, StatsCard, IssueResolutionModal, SchemeStatusBadge } from "./FpoSharedComponents";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, IndianRupee, ShieldCheck, UserX, AlertTriangle, Shield, Clock } from "lucide-react";

// DATA SECTION (Expanded to include many more rows for realistic filtering)
const BLOCKED_FARMERS = [
  { name: "Sunita Devi", village: "Kharindwa", scheme: "PM-KISAN", issue: "Aadhaar–bank mismatch", amountBlocked: "₹2,000", daysStuck: 42, actionLabel: "Fix Now" },
  { name: "Priya Yadav", village: "Kharindwa", scheme: "PM-KISAN", issue: "Bank account inactive", amountBlocked: "₹2,000", daysStuck: 38, actionLabel: "Fix Now" },
  { name: "Kamla Devi", village: "Bhadana", scheme: "KCC", issue: "Auto-debit not set", amountBlocked: "₹0", daysStuck: 15, actionLabel: "Setup Now" },
  { name: "Anita Kumari", village: "Kharindwa", scheme: "PMFBY", issue: "Premium payment failed", amountBlocked: "₹850", daysStuck: 22, actionLabel: "Retry Payment" },
  { name: "Poonam Singh", village: "Bhadana", scheme: "PM-KISAN", issue: "Land record name mismatch", amountBlocked: "₹2,000", daysStuck: 56, actionLabel: "Update Record" },
  { name: "Savitri Devi", village: "Murthal", scheme: "PM-KISAN", issue: "Aadhaar not seeded", amountBlocked: "₹4,000", daysStuck: 67, actionLabel: "Seed Aadhaar" },
  { name: "Balram Yadav", village: "Kharindwa", scheme: "KCC", issue: "Overdue repayment", amountBlocked: "₹12,400", daysStuck: 94, actionLabel: "Contact Farmer" },
  { name: "Geeta Sharma", village: "Bhadana", scheme: "PMFBY", issue: "Claim docs incomplete", amountBlocked: "₹8,500", daysStuck: 31, actionLabel: "Upload Docs" },
  
  // Extra rows for better filtering visibility
  { name: "Harpal Singh", village: "Murthal", scheme: "PM-KISAN", issue: "Aadhaar–bank mismatch", amountBlocked: "₹2,000", daysStuck: 45, actionLabel: "Fix Now" },
  { name: "Rajveer Malik", village: "Murthal", scheme: "KCC", issue: "Overdue repayment", amountBlocked: "₹18,500", daysStuck: 110, actionLabel: "Contact Farmer" },
  { name: "Sukhbir Hooda", village: "Kharindwa", scheme: "PM-KMY", issue: "Auto-debit not set", amountBlocked: "₹600", daysStuck: 18, actionLabel: "Setup Now" },
  { name: "Narendra Pal", village: "Bhadana", scheme: "PM-KMY", issue: "Premium payment failed", amountBlocked: "₹1,200", daysStuck: 25, actionLabel: "Retry Payment" },
  { name: "Devraj Nain", village: "Murthal", scheme: "PMFBY", issue: "Claim docs incomplete", amountBlocked: "₹14,200", daysStuck: 40, actionLabel: "Upload Docs" },
  { name: "Anita Devi", village: "Bhadana", scheme: "PM-KISAN", issue: "Bank account inactive", amountBlocked: "₹2,000", daysStuck: 29, actionLabel: "Fix Now" },
  { name: "Ram Chander", village: "Kharindwa", scheme: "KCC", issue: "Overdue repayment", amountBlocked: "₹9,500", daysStuck: 92, actionLabel: "Contact Farmer" }
];

const FLOW_CHART_DATA = [
  { name: "Jan", amount: 2.1, count: 120 },
  { name: "Feb", amount: 1.8, count: 98 },
  { name: "Mar", amount: 3.4, count: 187 },
  { name: "Apr", amount: 2.9, count: 156 },
  { name: "May", amount: 1.2, count: 67 },
  { name: "Jun", amount: 1.8, count: 89 },
  { name: "Jul", amount: 2.4, count: 134 },
  { name: "Aug", amount: 8.7, count: 421 },
  { name: "Sep", amount: 3.1, count: 178 },
  { name: "Oct", amount: 2.6, count: 143 },
  { name: "Nov", amount: 0, count: 0 },
  { name: "Dec", amount: 0, count: 0 }
];

export default function FpoDisbursementIssues() {
  const [blockedList, setBlockedList] = useState(BLOCKED_FARMERS);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableFilter, setTableFilter] = useState("All");

  const columns = useMemo(() => [
    { header: "Farmer Name", accessor: "name", cellClassName: "font-bold text-gray-900" },
    { header: "Village", accessor: "village", cellClassName: "font-bold text-gray-800" },
    {
      header: "Scheme",
      accessor: "scheme",
      cell: (scheme) => (
        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-black text-gray-700">
          {scheme}
        </span>
      )
    },
    {
      header: "Issue Type",
      accessor: "issue",
      cell: (issue) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getIssueBadgeColor(issue)}`}>
          {issue}
        </span>
      )
    },
    { header: "Amount Blocked", accessor: "amountBlocked", cellClassName: "font-bold text-gray-800" },
    { header: "Days Stuck", accessor: "daysStuck", cellClassName: "font-bold text-gray-800", cell: (days) => `${days} days` },
    {
      header: "Action",
      accessor: "actionLabel",
      sortable: false,
      cellClassName: "text-right",
      cell: (actionLabel, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFixClick(row);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
            actionLabel === "Fix Now"
              ? "bg-[#2e4057] hover:bg-[#3a5170] text-white"
              : actionLabel === "Contact Farmer"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "border border-amber-500 hover:bg-amber-50 text-amber-700"
          }`}
        >
          {actionLabel}
        </button>
      )
    }
  ], []);

  const handleFixClick = (farmer) => {
    setSelectedFarmer(farmer);
    setIsModalOpen(true);
  };

  const getIssueBadgeColor = (issue) => {
    switch (issue) {
      case "Aadhaar–bank mismatch":
      case "Bank account inactive":
      case "Aadhaar not seeded":
        return "bg-red-50 text-red-700 border-red-200";
      case "Land record name mismatch":
      case "Premium payment failed":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Overdue repayment":
        return "bg-rose-950 text-rose-50 border-rose-900";
      case "Auto-debit not set":
      case "Claim docs incomplete":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-750 border-gray-200";
    }
  };

  const filteredBlockedList = blockedList.filter((f) => {
    if (tableFilter === "All") return true;
    return f.scheme === tableFilter;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Disbursement & Issues"
        subtitle="Troubleshoot direct benefit transfers, resolve document mismatch alerts, and monitor payments"
      />

      {/* Top Summary Bar using generic StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Enrolled"
          value="634"
          sub="Farmers active in individual direct benefit schemes"
          icon={Shield}
        />

        <StatsCard
          title="Benefits Received"
          value="489"
          sub="Enrolled members successfully credited by DBT payouts"
          trend="77%"
          isPositive={true}
          icon={ShieldCheck}
        />

        <StatsCard
          title="Payment Pending"
          value="98"
          sub="Transactions processed but awaiting central bank settlement"
          trend="15%"
          isPositive={true}
          icon={Clock}
        />

        <StatsCard
          title="Blocked / Failed"
          value="47"
          sub="Failed transfers due to profile KYC and document issues"
          alert="47 transfers blocked — click View buttons below to inspect"
          icon={UserX}
        />
      </div>

      {/* Scheme Disbursement Funnel Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#2e4057] uppercase tracking-wider">Active Scheme Disbursement Pipelines</h3>
          {tableFilter !== "All" && (
            <button
              onClick={() => setTableFilter("All")}
              className="text-xs font-bold text-green-700 hover:text-green-800 underline"
            >
              Clear filter and view all
            </button>
          )}
        </div>

        {/* Card 1: PM-KISAN */}
        <div className={`bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 transition ${tableFilter === "PM-KISAN" ? "ring-2 ring-green-600" : ""}`}>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-black text-gray-900">PM-KISAN</h4>
              <p className="text-xs font-semibold text-gray-450 mt-0.5">Pradhan Mantri Kisan Samman Nidhi</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-500">Total Disbursed: </span>
              <strong className="text-sm font-black text-[#2e4057]">₹11.16 Lakh</strong>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-xs font-bold text-gray-500">Stuck: </span>
              <strong className="text-sm font-black text-red-600">₹1.08 Lakh</strong>
            </div>
          </div>

          {/* Funnel visualization */}
          <div className="grid grid-cols-4 gap-2 relative">
            {[
              { label: "Enrolled", count: 612 },
              { label: "Verified", count: 589, drop: "23 farmers: Aadhaar–bank link mismatch" },
              { label: "Processed", count: 571, drop: "18 farmers: Land record name mismatch" },
              { label: "Received", count: 558, drop: "13 farmers: Bank account inactive" }
            ].map((step, idx) => (
              <div key={idx} className="bg-gray-50/70 border border-gray-150 rounded-xl p-3 text-center flex flex-col justify-between min-h-[90px] relative">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">{step.label}</span>
                  <span className="text-lg font-black text-gray-800 mt-1 block">{step.count}</span>
                </div>
                {step.drop && (
                  <span className="text-[9px] font-bold text-red-600 leading-tight block border-t border-red-50 pt-1 mt-1">
                    ⚠ {step.drop}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-50">
            <button
              onClick={() => {
                setTableFilter("PM-KISAN");
                document.getElementById("blocked-table-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-1.5 border border-red-200 hover:bg-red-50 text-red-700 font-bold rounded-xl text-xs transition"
            >
              View 54 Stuck Farmers
            </button>
          </div>
        </div>

        {/* Card 2: PMFBY */}
        <div className={`bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 transition ${tableFilter === "PMFBY" ? "ring-2 ring-green-600" : ""}`}>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-black text-gray-900">PMFBY</h4>
              <p className="text-xs font-semibold text-gray-450 mt-0.5">Pradhan Mantri Fasal Bima Yojana</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-500">Claims Settled: </span>
              <strong className="text-sm font-black text-green-700">₹3.42 Lakh</strong>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-xs font-bold text-gray-500">Active Claims Pending: </span>
              <strong className="text-sm font-black text-amber-600">₹1.87 Lakh</strong>
            </div>
          </div>

          {/* Funnel visualization */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Enrolled", count: 423 },
              { label: "Premium Paid", count: 398, drop: "25 farmers: Premium payment failed (bank issue)" },
              { label: "Claim Filed", count: 89, drop: "309 farmers: No crop loss this season (normal — insurance worked as safety net)", isNormal: true },
              { label: "Settled", count: 67, drop: "22 farmers: Claim under investigation" }
            ].map((step, idx) => (
              <div key={idx} className="bg-gray-50/70 border border-gray-150 rounded-xl p-3 text-center flex flex-col justify-between min-h-[90px]">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">{step.label}</span>
                  <span className="text-lg font-black text-gray-800 mt-1 block">{step.count}</span>
                </div>
                {step.drop && (
                  <span
                    className={`text-[9px] font-bold leading-tight block border-t pt-1 mt-1 ${
                      step.isNormal ? "text-gray-400 border-gray-100 font-medium" : "text-red-600 border-red-50"
                    }`}
                  >
                    {step.isNormal ? "✓ " : "⚠ "}
                    {step.drop}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-50">
            <button
              onClick={() => {
                setTableFilter("PMFBY");
                document.getElementById("blocked-table-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-1.5 border border-amber-200 hover:bg-amber-50 text-amber-700 font-bold rounded-xl text-xs transition"
            >
              View 22 Pending Claims
            </button>
          </div>
        </div>

        {/* Card 3: KCC */}
        <div className={`bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 transition ${tableFilter === "KCC" ? "ring-2 ring-red-600" : ""}`}>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-black text-gray-900">KCC</h4>
              <p className="text-xs font-semibold text-gray-450 mt-0.5">Kisan Credit Card (Institutional Credit)</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-500">Avg Credit Used: </span>
              <strong className="text-sm font-black text-gray-800">₹78,000 / Farmer</strong>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-xs font-bold text-gray-500">Total Outstanding: </span>
              <strong className="text-sm font-black text-[#2e4057]">₹2.08 Cr</strong>
            </div>
          </div>

          {/* Funnel visualization */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Sanctioned", count: 389 },
              { label: "Card Activated", count: 334, drop: "55 farmers: Card dispatch pending from branch", isNormal: true },
              { label: "Credit Used", count: 267, drop: "67 farmers: Active cards with zero cash draw", isNormal: true },
              { label: "Repayment On Track", count: 241, drop: "26 farmers: Overdue >90 days - RED FLAG" }
            ].map((step, idx) => (
              <div key={idx} className="bg-gray-50/70 border border-gray-150 rounded-xl p-3 text-center flex flex-col justify-between min-h-[90px]">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">{step.label}</span>
                  <span className="text-lg font-black text-gray-800 mt-1 block">{step.count}</span>
                </div>
                {step.drop && (
                  <span
                    className={`text-[9px] font-bold leading-tight block border-t pt-1 mt-1 ${
                      step.isNormal ? "text-gray-400 border-gray-100 font-medium" : "text-red-600 border-red-50 font-black"
                    }`}
                  >
                    {step.isNormal ? "ℹ " : "⚠ "}
                    {step.drop}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-50">
            <button
              onClick={() => {
                setTableFilter("KCC");
                document.getElementById("blocked-table-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              View 26 Overdue Accounts
            </button>
          </div>
        </div>

        {/* Card 4: PM-KMY */}
        <div className={`bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 transition ${tableFilter === "PM-KMY" ? "ring-2 ring-green-600" : ""}`}>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-black text-gray-900">PM-KMY</h4>
              <p className="text-xs font-semibold text-gray-450 mt-0.5">Pradhan Mantri Kisan Maan Dhan Yojana</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-500">Govt Monthly Contribution: </span>
              <strong className="text-sm font-black text-teal-700">₹7,100 / month</strong>
            </div>
          </div>

          {/* Funnel visualization */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Enrolled", count: 89 },
              { label: "Auto-debit Active", count: 76, drop: "13 farmers: Bank auto-debit mandate not set" },
              { label: "Contributions Current", count: 71, drop: "5 farmers: Insufficient balance, debit failed" }
            ].map((step, idx) => (
              <div key={idx} className="bg-gray-50/70 border border-gray-150 rounded-xl p-3 text-center flex flex-col justify-between min-h-[90px]">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">{step.label}</span>
                  <span className="text-lg font-black text-gray-800 mt-1 block">{step.count}</span>
                </div>
                {step.drop && (
                  <span className="text-[9px] font-bold text-red-600 leading-tight block border-t border-red-50 pt-1 mt-1">
                    ⚠ {step.drop}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-50">
            <button
              onClick={() => {
                setTableFilter("PM-KMY");
                document.getElementById("blocked-table-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-1.5 border border-amber-250 hover:bg-amber-50 text-amber-700 font-bold rounded-xl text-xs transition"
            >
              Fix 18 Auto-debit Issues
            </button>
          </div>
        </div>
      </div>

      {/* Blocked Farmers Table Section */}
      <div id="blocked-table-section" className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden scroll-mt-6">
        {/* Urgent Red Header Bar */}
        <div className="bg-red-600 px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-sm font-black tracking-wide">
              {tableFilter === "All" ? "47" : filteredBlockedList.length} Farmers with Blocked Benefits — Needs Action Today
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-red-200 uppercase tracking-wider">Filter by scheme:</span>
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="bg-red-700 border border-red-500 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Schemes</option>
              <option value="PM-KISAN">PM-KISAN</option>
              <option value="PMFBY">PMFBY</option>
              <option value="KCC">KCC</option>
              <option value="PM-KMY">PM-KMY</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          <GenericTable
            columns={columns}
            data={filteredBlockedList}
            showSearch={false}
            showSort={false}
            itemsPerPage={10}
            emptyMessage="No blocked farmers found matching this scheme"
          />
        </div>
      </div>

      {/* Monthly Benefit Flow Chart */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-[#2e4057]">Monthly Benefits Reaching Farmers — 2024</h3>
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            August Spike: PM-KISAN Kharif Installment
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={FLOW_CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: "bold", fill: "#6b7280" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fontWeight: "bold", fill: "#6b7280" }} label={{ value: "Disbursed (₹ Lakh)", angle: -90, position: "insideLeft", offset: 10, style: { fontWeight: "bold", fill: "#6b7280", fontSize: 10 } }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontWeight: "bold", fill: "#6b7280" }} label={{ value: "Farmers Paid", angle: 90, position: "insideRight", offset: 10, style: { fontWeight: "bold", fill: "#6b7280", fontSize: 10 } }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px", fontFamily: "monospace" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
              <Line yAxisId="left" type="monotone" dataKey="amount" name="Amount Disbursed (₹ Lakh)" stroke="#16a34a" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="count" name="Farmers Who Received" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* How-to Modal */}
      <IssueResolutionModal
        farmer={selectedFarmer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
