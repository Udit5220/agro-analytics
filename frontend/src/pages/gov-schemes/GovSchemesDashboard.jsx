import React from "react";
import {
  FileText,
  Award,
  Landmark,
  CircleDollarSign,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import bannerImg from "../../assets/images/Government Scheme Center.png";

export default function GovSchemesDashboard() {
  const metrics = [
    {
      label: "Active Schemes",
      value: "214",
      sub: "Nationally matched",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Eligible Subsidies",
      value: "8 Schemes",
      sub: "High match score",
      color: "text-[#31572c] bg-[#31572c]/10",
    },
    {
      label: "Pending Claims",
      value: "2",
      sub: "Under verification",
      color: "text-sky-700 bg-sky-50",
    },
    {
      label: "Total Disbursed",
      value: "₹45,000",
      sub: "Platform verified",
      color: "text-amber-700 bg-amber-50",
    },
  ];

  const schemes = [
    {
      name: "PM-KISAN Samman Nidhi",
      match: "100% Eligible",
      payout: "₹6,000 / year",
      status: "Active Disbursal",
    },
    {
      name: "Agricultural Machinery Subsidy",
      match: "95% Eligible",
      payout: "50% Off Tractor/Seeder",
      status: "Apply Now",
    },
    {
      name: "PM Fasal Bima Yojana (PMFBY)",
      match: "92% Eligible",
      payout: "Crop Insurance Guard",
      status: "Active Cover",
    },
    {
      name: "Har Khet Ko Pani (PMKSY)",
      match: "88% Eligible",
      payout: "80% Tube-well Subsidy",
      status: "Verified",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f4f7f4] to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="relative z-10 w-full md:w-2/3">
          <div>
            <div className="flex items-center gap-2.5">
              <FileText className="h-6.5 w-6.5 text-[#31572c]" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
                <span>Government Scheme Center</span>
                <span className="text-gray-300 font-light text-xl">|</span>
                <span className="text-[#31572c] font-bold text-sm md:text-base">
                  सरकारी योजना केंद्र
                </span>
              </h1>
            </div>
            <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
              Match localized eligibility indices with active central and state
              agricultural welfare schemes.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 opacity-20 md:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10 md:hidden" />
          <img
            src={bannerImg}
            alt="Banner"
            className="w-full h-full object-cover object-right"
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow"
          >
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">
              {m.label}
            </span>
            <div>
              <h4 className="text-gray-900 text-xl font-black tracking-tight">
                {m.value}
              </h4>
              <span
                className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 ${m.color}`}
              >
                {m.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Schemes List & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Schemes Matcher Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
          <span className="text-sm font-bold text-gray-800 tracking-wide mb-1 block">
            Eligible Welfare & Subsidy Matrices
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3 pl-1">Scheme Name</th>
                  <th className="p-3">Eligibility Index</th>
                  <th className="p-3">Benefits/Disbursal</th>
                  <th className="p-3 text-right pr-2">Action / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {schemes.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#f4f7f4]/30 transition-colors text-xs font-semibold"
                  >
                    <td className="p-3 pl-1 text-gray-900 font-bold">
                      {item.name}
                    </td>
                    <td className="p-3 text-emerald-700 font-black">
                      {item.match}
                    </td>
                    <td className="p-3 text-gray-550">{item.payout}</td>
                    <td className="p-3 text-right pr-2">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === "Apply Now"
                            ? "bg-[#31572c] text-white cursor-pointer hover:bg-[#132a13]"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Dynamic Timeline Announcements */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Landmark size={13} className="text-[#31572c]" />
            <span>Scheme Reminders</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl flex gap-2.5">
              <AlertCircle
                size={18}
                className="text-amber-700 shrink-0 mt-0.5"
              />
              <div>
                <span className="text-[10px] font-bold text-amber-900 block">
                  e-KYC Mandatory Deadline
                </span>
                <span className="text-[11px] text-gray-600 block mt-0.5 leading-relaxed font-semibold">
                  PM-KISAN online OTP-based KYC must be completed by Sunday to
                  avoid installment delay.
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex gap-2.5">
              <CheckCircle2
                size={18}
                className="text-[#31572c] shrink-0 mt-0.5"
              />
              <div>
                <span className="text-[10px] font-bold text-[#132a13] block">
                  Super-Seeder Subsidy
                </span>
                <span className="text-[11px] text-gray-600 block mt-0.5 leading-relaxed font-medium">
                  Haryana Department of Agriculture opens online portal window.
                  First-come first-served registry active.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
