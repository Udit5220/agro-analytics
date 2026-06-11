// src/pages/gov-schemes/farmer/BenefitsReceived.jsx
import React, { useState } from "react";
import {
  Wallet,
  IndianRupee,
  Calendar,
  Clock,
  Download,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

export default function BenefitsReceived() {
  const { benefitsWalletData } = govtSchemeData;
  const { summaryCards, transactionLedger } = benefitsWalletData;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterScheme, setFilterScheme] = useState("all");

  const getStatusBadge = (status) => {
    if (status === "success") {
      return (
        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
          <CheckCircle className="w-3 h-3" />
          Success
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100 uppercase tracking-wider">
        <XCircle className="w-3 h-3" />
        Failed
      </span>
    );
  };

  const filteredTransactions = transactionLedger.filter((t) => {
    if (filterScheme !== "all" && t.scheme !== filterScheme) {
      return false;
    }
    if (
      searchQuery &&
      !t.scheme.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const uniqueSchemes = [...new Set(transactionLedger.map((t) => t.scheme))];

  const handleExportCSV = () => {
    const headers = ["Date", "Scheme", "Description", "Amount", "Status", "Reference No", "Mode"];
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
    link.setAttribute("download", "benefits_passbook.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-1 sm:p-2 bg-[#f4f7f4]/40 min-h-screen font-sans animate-fadeIn">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-2.5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2e4057]/10 rounded-xl">
              <Wallet className="h-5 w-5 text-[#28a745]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2e4057]">Benefits Received Ledger</h1>
              <p className="text-xs text-gray-500">
                Direct Benefit Transfer (DBT) bank passbook history and payout schedules.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2e4057] hover:bg-[#28a745] text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Passbook (CSV)</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mb-2.5">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">
              Lifetime Received
            </p>
            <p className="text-xl font-black text-gray-900 mt-1 leading-none">
              {summaryCards.lifetimeBenefits}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">
              Next Payout Date
            </p>
            <p className="text-base font-black text-gray-950 mt-1 leading-none">
              June 20, 2026
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">
              Pending Amount
            </p>
            <p className="text-xl font-black text-amber-600 mt-1 leading-none">
              {summaryCards.pending}
            </p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filter controls */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/35 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="w-full sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by scheme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#28a745] bg-white font-medium"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
            <Filter className="w-3.5 h-3.5 text-gray-400 self-center hidden sm:block" />
            <select
              value={filterScheme}
              onChange={(e) => setFilterScheme(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Schemes</option>
              {uniqueSchemes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Passbook style table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-left">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scheme / Program</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Installment Details</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reference ID</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mode</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11px] font-semibold">
              {filteredTransactions.map((t, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{t.date}</td>
                  <td className="px-4 py-3 text-[#2e4057] font-extrabold">{t.scheme}</td>
                  <td className="px-4 py-3 text-gray-600">{t.installment}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono">{t.referenceNo}</td>
                  <td className="px-5 py-3 text-gray-500">{t.mode}</td>
                  <td className="px-4 py-3">{getStatusBadge(t.status)}</td>
                  <td className="px-4 py-3 text-right text-emerald-800 font-black">
                    +{t.amount}
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
