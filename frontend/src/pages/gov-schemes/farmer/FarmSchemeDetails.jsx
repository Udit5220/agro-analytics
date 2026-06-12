// src/pages/farmer/FarmSchemeDetails.jsx
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Target,
  IndianRupee,
  Building2,
  CalendarDays,
  Info,
  HelpCircle,
  Sprout,
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

const FarmSchemeDetails = () => {
  const [selectedScheme, setSelectedScheme] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const { schemes, schemeDetails } = govtSchemeData;

  const currentScheme =
    schemes.find((s) => s.id === selectedScheme) || schemes[0];

  // Dynamically load details based on scheme ID. Fallback to scheme 1 details if not defined.
  const details = schemeDetails[selectedScheme] || schemeDetails["1"];

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "missing":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (statusType) => {
    switch (statusType) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending";
      case "missing":
        return "Missing";
      default:
        return statusType;
    }
  };

  const getTimelineIcon = (status) => {
    switch (status) {
      case "done":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn space-y-6">
      {/* Header with Scheme Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#132a13]/10 rounded-xl">
            <Sprout className="h-6 w-6 text-brand-medium" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">Scheme Details Center</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Comprehensive guidelines, eligibility criteria, and application tracker
            </p>
          </div>
        </div>

        {/* Scheme Selector Dropdown */}
        <div className="relative w-full sm:w-72 shrink-0">
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(parseInt(e.target.value))}
            className="w-full pl-3 pr-8 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-700 bg-white shadow-sm focus:outline-none focus:border-brand-medium focus:ring-1 focus:ring-[#4f772d] transition-all cursor-pointer appearance-none"
          >
            {schemes.map((scheme) => (
              <option key={scheme.id} value={scheme.id}>
                {scheme.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Scheme Header Hero Card */}
      <div
        className="rounded-2xl p-6 text-white shadow-md relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #132a13 0%, #31572c 100%)" }}
      >
        <div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none">
          <Sprout className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold bg-[#132a13]/60 text-[#ecf39e] border border-brand-medium/30 px-3 py-1 rounded-full uppercase tracking-wider">
              {details.ministry}
            </span>
            <h2 className="text-2xl font-black tracking-tight leading-tight">{currentScheme.name}</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-semibold bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-lg text-white">
                Launch Year: {details.launchYear}
              </span>
              <span className="text-[10px] font-semibold bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-lg text-white">
                Status: {details.status}
              </span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 md:text-right space-y-1.5 text-xs w-full md:w-auto shrink-0">
            <p className="text-white/70">Target Audience:</p>
            <p className="font-bold text-sm text-[#ecf39e]">{details.target}</p>
            <p className="text-white/70 pt-1">Budget Allocation:</p>
            <p className="font-bold text-white font-mono">{details.budget}</p>
          </div>
        </div>
      </div>

      {/* 4 Premium Benefit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-150 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Maximum Benefit
            </span>
            <IndianRupee className="w-5 h-5 text-brand-medium" />
          </div>
          <p className="text-xl font-black text-gray-800 leading-none mt-2">
            {details.benefits.maximumBenefit}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-150 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Per Installment
            </span>
            <CalendarDays className="w-5 h-5 text-brand-medium" />
          </div>
          <p className="text-xl font-black text-gray-800 leading-none mt-2">
            {details.benefits.perInstallment}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-150 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Subsidy Type
            </span>
            <Building2 className="w-5 h-5 text-brand-medium" />
          </div>
          <p className="text-xl font-black text-gray-800 leading-none mt-2">
            {details.benefits.subsidyType}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-150 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between min-h-[110px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Coverage
            </span>
            <User className="w-5 h-5 text-brand-medium" />
          </div>
          <p className="text-xl font-black text-gray-800 leading-none mt-2">
            {details.benefits.coverage}
          </p>
        </div>
      </div>

      {/* Eligibility Matrix Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[#132a13] text-sm">Eligibility Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7f4]/60">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Criterion
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Requirement
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Your Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {details.eligibilityMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/55 transition-all">
                  <td className="px-6 py-3 text-xs font-bold text-[#132a13]">
                    {item.criterion}
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-600">
                    {item.requirement}
                  </td>
                  <td className="px-6 py-3 text-xs font-semibold">
                    {item.status ? (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-max border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Eligible
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-max border border-red-100">
                        <XCircle className="w-3.5 h-3.5" /> {item.value}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Checklist & Application Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Document Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-[#132a13] text-sm">Required Documents</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {details.documents.map((doc, idx) => (
              <div
                key={idx}
                className="px-6 py-3.5 flex justify-between items-center hover:bg-gray-50/20"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-800">{doc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {doc.uploadedDate && (
                    <span className="text-xs text-gray-400 font-mono">
                      {doc.uploadedDate}
                    </span>
                  )}
                  <span
                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      doc.statusType === "verified"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                        : doc.statusType === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-150"
                          : "bg-red-50 text-red-700 border-red-150"
                    }`}
                  >
                    {getStatusIcon(doc.statusType)}
                    {getStatusText(doc.statusType)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-[#132a13] text-sm">
              Application Timeline & Milestones
            </h3>
          </div>
          <div className="p-6">
            <div className="relative">
              {details.timeline.steps.map((step, idx) => (
                <div key={idx} className="flex mb-6 last:mb-0">
                  <div className="flex flex-col items-center mr-4">
                    <div className="relative">
                      {getTimelineIcon(step.status)}
                      {idx < details.timeline.steps.length - 1 && (
                        <div className="absolute top-5 left-2.5 w-0.5 h-10 bg-gray-250"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-800">
                        {step.name}
                      </span>
                      {step.date && (
                        <span className="text-[10px] bg-gray-100 font-mono text-gray-500 px-1.5 py-0.5 rounded">
                          {step.date}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Blocker Callout */}
            {details.timeline.blocker && (
              <div className="mt-4 p-3 bg-red-50/50 border border-red-200/50 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium text-red-800">
                    {details.timeline.blocker}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[#132a13] text-sm flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-medium" />
            Frequently Asked Questions
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {details.faq.map((item, idx) => (
            <div key={idx}>
              <button
                onClick={() =>
                  setOpenFaqIndex(openFaqIndex === idx ? null : idx)
                }
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-[#f4f7f4]/30 transition text-left"
              >
                <span className="text-xs font-bold text-gray-700 leading-snug">
                  {item.question}
                </span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-6 pb-4 animate-fadeIn">
                  <p className="text-xs text-gray-650 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmSchemeDetails;
