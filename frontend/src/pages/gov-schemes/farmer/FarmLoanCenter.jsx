// src/pages/farmer/FarmLoanCenter.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  CreditCard,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Building2,
  PiggyBank,
  Tractor,
  Sun,
  Warehouse,
  PawPrint,
  FileText,
  Download,
  Eye,
  X,
  Check,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import StatsCard from "../../../components/partials/StatsCard";

const FarmLoanCenter = () => {
  const { loanCenterData } = govtSchemeData;
  const {
    creditDashboard,
    creditUtilization,
    creditScore,
    loanPrograms,
    repaymentSchedule,
  } = loanCenterData;

  const [programs, setPrograms] = useState(loanPrograms);
  const [applyingProgram, setApplyingProgram] = useState(null);
  const [loanPurpose, setLoanPurpose] = useState("Crop Production");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [applyingSuccess, setApplyingSuccess] = useState(false);

  const [payingInstallment, setPayingInstallment] = useState(null);
  const [paySuccess, setPaySuccess] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [upiReference, setUpiReference] = useState("");

  const getStatusBadge = (status, color) => {
    const colorClasses = {
      green: "bg-emerald-50 text-emerald-700 border-emerald-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      gray: "bg-gray-50 text-gray-600 border-gray-200",
      red: "bg-red-50 text-red-700 border-red-200",
    };
    const icons = {
      Active: <CheckCircle className="w-3 h-3" />,
      Eligible: <TrendingUp className="w-3 h-3" />,
      "Not Applied": <Clock className="w-3 h-3" />,
      Ineligible: <X className="w-3 h-3" />,
      "Under Review": <Clock className="w-3 h-3" />,
    };
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full border inline-flex items-center gap-1.5 font-semibold ${colorClasses[color] || colorClasses.gray}`}
      >
        {icons[status] || icons["Not Applied"]}
        {status}
      </span>
    );
  };

  const utilizationData = [
    { name: "Used Limit", value: creditUtilization, fill: "#132a13" },
    { name: "Available Limit", value: 100 - creditUtilization, fill: "#90a955" },
  ];

  const scoreData = [
    {
      name: "Loan Readiness",
      score: creditScore.govtLoanReadiness,
      fill: "#132a13",
    },
    {
      name: "Repay Performance",
      score: creditScore.repaymentPerformance,
      fill: "#31572c",
    },
    {
      name: "Credit Utilization",
      score: creditScore.creditUtilization,
      fill: "#4f772d",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color }} className="mb-0.5">
              {p.name}: {p.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getRepaymentStatusIcon = (status) => {
    if (status === "paid") {
      return <CheckCircle className="w-4 h-4 text-emerald-505 shrink-0" />;
    } else if (status === "overdue") {
      return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
    } else {
      return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
    }
  };

  const getLoanIcon = (program) => {
    if (program.includes("KCC")) return <CreditCard className="w-4 h-4 text-brand-medium" />;
    if (program.includes("Tractor")) return <Tractor className="w-4 h-4 text-brand-medium" />;
    if (program.includes("Solar")) return <Sun className="w-4 h-4 text-brand-medium" />;
    if (program.includes("Livestock")) return <PawPrint className="w-4 h-4 text-brand-medium" />;
    if (program.includes("Warehouse")) return <Warehouse className="w-4 h-4 text-brand-medium" />;
    return <Building2 className="w-4 h-4 text-brand-medium" />;
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!upiReference.trim()) {
      alert("Please enter UPI reference transaction number.");
      return;
    }
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setPayingInstallment(null);
      setUpiReference("");
      alert("Payment processing completed successfully! Installment status will update shortly.");
    }, 1500);
  };

  const downloadScheduleCSV = () => {
    const headers = ["Month", "Installment Amount", "Status", "Due Date"];
    const rows = repaymentSchedule.map((r) => [
      r.month,
      r.amount,
      r.status,
      r.dueDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kcc_repayment_schedule.csv");
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
            <CreditCard className="h-5 w-5 text-brand-medium" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">Kisan Credit Card & Loan Center</h1>
            <p className="text-xs text-gray-500">Manage your active credit limit, interest subventions, and explore customized agricultural loans</p>
          </div>
        </div>
      </div>

      {/* Credit Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Eligible Limit"
          value={creditDashboard.eligibleLimit}
          icon={<CreditCard className="text-brand-medium" />}
          subtext="Approved credit ceiling"
        />
        <StatsCard
          title="Used Limit"
          value={creditDashboard.used}
          icon={<IndianRupee className="text-amber-600" />}
          subtext="Current outstanding balance"
        />
        <StatsCard
          title="Available Limit"
          value={creditDashboard.available}
          icon={<PiggyBank className="text-emerald-600" />}
          subtext="Remaining drawable balance"
        />
        <StatsCard
          title="Subventions Saved"
          value={creditDashboard.interestSubsidySaved}
          icon={<TrendingUp className="text-brand-medium" />}
          subtext="3% prompt interest relief"
        />
      </div>

      {/* Credit Utilization Gauge & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-5">
          <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
            <h3 className="font-bold text-[#132a13] text-sm">Credit Utilization Index</h3>
            <span className="text-xs font-bold text-[#132a13]">
              {creditUtilization}% Limit Utilized
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  <Cell fill="#132a13" />
                  <Cell fill="#90a955" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credit Score Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-5">
          <h3 className="font-bold text-[#132a13] text-sm mb-4 border-b border-gray-50 pb-2">Credit Readiness Metrics</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreData}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontWeight: "bold" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill="#31572c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Loan Programs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20">
          <h3 className="font-bold text-[#132a13] text-sm">Customized Lending Schemes</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Explore and apply for low-interest development loans
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7f4]/40 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Program Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Approved Limit
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Base rate (P.A.)
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Subsidy Rebate
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programs.map((program, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {getLoanIcon(program.program)}
                      <span className="text-xs font-bold text-gray-805">
                        {program.program}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#132a13]">
                    {program.limit}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">
                    {program.interestRate}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-medium">
                    {program.subsidy}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(program.status, program.statusColor)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                        program.status === "Active" || program.status === "Under Review"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150"
                          : "bg-brand-medium text-white hover:bg-brand-dark"
                      }`}
                      disabled={program.status === "Active" || program.status === "Under Review"}
                      onClick={() => {
                        if (program.status === "Eligible") {
                          setApplyingProgram(program);
                          setRequestedAmount(program.limit);
                        } else {
                          alert(`${program.program}: Interest subventions and terms are governed by standard guidelines.`);
                        }
                      }}
                    >
                      {program.status === "Active"
                        ? "Active"
                        : program.status === "Under Review"
                          ? "Under Review"
                          : program.status === "Eligible"
                            ? "Apply Now"
                            : "View Details"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Repayment Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm">
              Repayment Schedule
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Active KCC Loan installment forecast schedule
            </p>
          </div>
          <button
            onClick={downloadScheduleCSV}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-brand-medium/10 transition bg-white"
          >
            <Download className="w-3.5 h-3.5" />
            Export Schedule
          </button>
        </div>
        <div className="p-6">
          <div className="mb-5 p-4 bg-[#f4f7f4]/55 border border-brand-medium/15 rounded-xl">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  KCC Installment
                </p>
                <p className="text-lg font-black text-[#132a13]">
                  ₹14,167/month
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overdue Balances</p>
                <p className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full mt-0.5">None</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Next Due Date</p>
                <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full mt-0.5">
                  June 15, 2026
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {repaymentSchedule.map((payment, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      {payment.month}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      Due: {payment.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs font-bold text-gray-800">
                    ₹{payment.amount.toLocaleString()}
                  </p>
                  {getRepaymentStatusIcon(payment.status)}
                  {payment.status === "upcoming" && (
                    <button
                      onClick={() => setPayingInstallment(payment)}
                      className="text-xs font-bold px-3.5 py-1.5 rounded-xl border border-brand-medium/25 text-brand-medium hover:bg-brand-medium/5 transition"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <p className="text-xs font-semibold text-gray-550">
                Outstanding Principal: ₹85,000
              </p>
              <button
                onClick={() => setShowStatement(!showStatement)}
                className="text-xs font-bold flex items-center gap-1 text-brand-medium hover:text-[#31572c]"
              >
                {showStatement ? "Hide Ledger Statement" : "View Statement History"}
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Expandable Past Statement Ledger */}
          {showStatement && (
            <div className="mt-4 border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-2.5 animate-fadeIn">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1.5">Statement Transaction History</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-700">
                  <span>Jan 20, 2026 — Interest Credit Rebate</span>
                  <span className="font-bold text-emerald-600">+₹1,700</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Dec 15, 2025 — KCC Installment Repayment</span>
                  <span className="font-bold text-gray-800">-₹14,167</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Nov 15, 2025 — KCC Installment Repayment</span>
                  <span className="font-bold text-gray-800">-₹14,167</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interest Subvention Info */}
      <div
        className="mt-6 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        style={{ background: "linear-gradient(135deg, #132a13, #31572c)" }}
      >
        <div>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Interest Rebate Benefit</p>
          <h3 className="text-base font-bold mt-1">
            National KCC Interest Subvention Scheme
          </h3>
          <p className="text-white/70 text-xs mt-1 leading-normal font-semibold">
            Prompt repayment incentives yield an effective rate of 4% annually.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Subventions Credited</p>
          <p className="text-2xl font-black text-[#ecf39e]">₹1,700</p>
          <p className="text-white/70 text-[9px] font-bold uppercase tracking-wider mt-0.5">This financial year</p>
        </div>
      </div>

      {/* Pay Now Simulation Modal */}
      {payingInstallment && createPortal(
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-xl relative animate-scaleUp">
              <button
                onClick={() => setPayingInstallment(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {paySuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <Check className="w-8 h-8 text-emerald-600 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Payment Recorded!
                </h3>
                <p className="text-xs text-gray-500">
                  Your transaction has been submitted for bank clearance.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-[#132a13] mb-1">
                  KCC Installment Payment
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Simulate digital payment for your upcoming monthly installment.
                </p>

                <div className="bg-[#f4f7f4] border border-brand-medium/10 rounded-xl p-3.5 mb-4 text-xs space-y-1">
                  <p className="text-gray-655 font-semibold">Installment Month: <span className="font-bold text-gray-800">{payingInstallment.month}</span></p>
                  <p className="text-gray-655 font-semibold">Amount Due: <span className="font-bold text-[#132a13]">₹{payingInstallment.amount.toLocaleString()}</span></p>
                </div>

                <form onSubmit={handlePaySubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      UPI Reference Number (12 digit Txn ID)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 617281920392"
                      value={upiReference}
                      onChange={(e) => setUpiReference(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={12}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-medium"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPayingInstallment(null)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-semibold transition"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </form>
              </div>
            )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Apply Loan Modal */}
      {applyingProgram && createPortal(
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-xl relative animate-scaleUp">
              <button
                type="button"
                onClick={() => setApplyingProgram(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {applyingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <Check className="w-8 h-8 text-emerald-600 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Application Logged!
                </h3>
                <p className="text-xs text-gray-500">
                  Your lending request for <span className="font-bold">{applyingProgram.program}</span> has been submitted for verification.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-[#132a13] mb-1">
                  Apply for {applyingProgram.program}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Please specify the loan details to initiate your application.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setApplyingSuccess(true);
                    setTimeout(() => {
                      setPrograms((prev) =>
                        prev.map((p) =>
                          p.program === applyingProgram.program
                            ? { ...p, status: "Under Review", statusColor: "blue" }
                            : p
                        )
                      );
                      setApplyingSuccess(false);
                      setApplyingProgram(null);
                    }, 1500);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Max Approved Limit
                    </label>
                    <input
                      type="text"
                      disabled
                      value={applyingProgram.limit}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Requested Loan Amount (₹)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 150000"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Loan Purpose
                    </label>
                    <select
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-medium"
                    >
                      <option value="Crop Production">Crop Production (Sowing/Inputs)</option>
                      <option value="Farm Equipment">Farm Machinery/Equipment</option>
                      <option value="Solar/Micro Irrigation">Solar/Micro Irrigation</option>
                      <option value="Livestock development">Livestock Development</option>
                    </select>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-105 rounded-xl">
                    <p className="text-[10px] text-amber-850 leading-normal font-semibold">
                      By submitting, you authorize the nodal bank to verify your land records and credit scores.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyingProgram(null)}
                      className="flex-1 px-4 py-2.5 text-xs font-bold border border-gray-200 rounded-xl text-gray-650 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 text-xs font-bold bg-brand-medium hover:bg-brand-dark text-white rounded-xl transition"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FarmLoanCenter;
