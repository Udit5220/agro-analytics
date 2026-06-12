import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  Users,
  Search,
  MapPin,
  Calendar,
  Radio,
  Clock,
  Bell,
  Download,
  Filter,
  Eye,
  ArrowUpRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

// ------------------------------------------------------------------
// MOCK DATA (Disease Surveillance Network - India)
// ------------------------------------------------------------------

const KPI_DATA = [
  { id: "daily", label: "Daily Reports Received", value: "340", sub: "+24 today", trend: "danger", icon: Radio },
  { id: "verified", label: "Verified Outbreaks", value: "218", sub: "64% verify rate", trend: "success", icon: CheckCircle },
  { id: "pending", label: "Pending Verification", value: "87", sub: "Avg age 4.2 hrs", trend: "warning", icon: Clock },
  { id: "inspections", label: "Field Inspections", value: "54", sub: "28 squads active", trend: "success", icon: Users }
];

const REPORTS_BY_STATE = [
  { state: "UP", count: 84 },
  { state: "MP", count: 62 },
  { state: "Punjab", count: 48 },
  { state: "Bihar", count: 41 },
  { state: "Rajasthan", count: 36 },
  { state: "Others", count: 69 }
];

const REPORTS_BY_DISTRICT = [
  { rank: 1, district: "Ludhiana", state: "Punjab", count: 42 },
  { rank: 2, district: "Gorakhpur", state: "UP", count: 38 },
  { rank: 3, district: "Cuttack", state: "Odisha", count: 31 },
  { rank: 4, district: "Patna", state: "Bihar", count: 29 },
  { rank: 5, district: "Nagpur", state: "Maharashtra", count: 26 },
  { rank: 6, district: "Indore", state: "MP", count: 24 },
  { rank: 7, district: "Mandya", state: "Karnataka", count: 22 },
  { rank: 8, district: "Agra", state: "UP", count: 19 },
  { rank: 9, district: "Bhopal", state: "MP", count: 17 },
  { rank: 10, district: "Hooghly", state: "WB", count: 15 }
];

const REPORTS_BY_CROP = [
  { name: "Rice", value: 38 },
  { name: "Wheat", value: 22 },
  { name: "Cotton", value: 16 },
  { name: "Maize", value: 12 },
  { name: "Others", value: 12 }
];

const CHART_COLORS = ["#4f772d", "#90a955", "#ecf39e", "#f39c12", "#132a13"];

const VERIFICATION_WORKFLOW = [
  { id: 1, label: "Reported", count: 340, active: true },
  { id: 2, label: "Under Review", count: 122, active: true },
  { id: 3, label: "Verified", count: 218, active: true },
  { id: 4, label: "Escalated", count: 31, active: false }
];

const INSPECTION_TRACKER = {
  scheduled: [
    { id: 1, inspector: "Dr. A. Prasad", district: "Amritsar", crop: "Rice", date: "06 Jun 2026", severity: "High" },
    { id: 2, inspector: "Sh. R. Maurya", district: "Basti", crop: "Sugarcane", date: "06 Jun 2026", severity: "Medium" },
    { id: 3, inspector: "Smt. K. Patel", district: "Dewas", crop: "Soybean", date: "07 Jun 2026", severity: "Low" },
    { id: 4, inspector: "Dr. M. Swamy", district: "Mysuru", crop: "Rice", date: "07 Jun 2026", severity: "High" }
  ],
  in_progress: [
    { id: 5, inspector: "Dr. V. Kurian", district: "Patna", crop: "Wheat", date: "05 Jun 2026", severity: "Critical" },
    { id: 6, inspector: "Sh. S. Sen", district: "Nadia", crop: "Jute", date: "05 Jun 2026", severity: "Medium" },
    { id: 7, inspector: "Smt. N. Rao", district: "Guntur", crop: "Cotton", date: "05 Jun 2026", severity: "High" },
    { id: 8, inspector: "Dr. B. Yadav", district: "Rohtas", crop: "Maize", date: "05 Jun 2026", severity: "Low" }
  ],
  completed: [
    { id: 9, inspector: "Dr. H. Singh", district: "Ludhiana", crop: "Rice", date: "04 Jun 2026", severity: "Critical" },
    { id: 10, inspector: "Sh. P. Lal", district: "Kanpur", crop: "Potato", date: "04 Jun 2026", severity: "High" },
    { id: 11, inspector: "Smt. M. Deshmukh", district: "Nagpur", crop: "Cotton", date: "04 Jun 2026", severity: "Medium" },
    { id: 12, inspector: "Dr. R. Mishra", district: "Gorakhpur", crop: "Rice", date: "04 Jun 2026", severity: "Critical" }
  ]
};

const LIVE_CASES = [
  { disease: "Rice Blast", loc: "Ludhiana, Punjab", crop: "Rice", status: "Verified", reporter: "Field Squad A", verification: "94% Match" },
  { disease: "Brown Plant Hopper", loc: "Gorakhpur, UP", crop: "Rice", status: "Escalated", reporter: "Satellite Alert", verification: "High Spore" },
  { disease: "Leaf Rust", loc: "Nagpur, Maharashtra", crop: "Wheat", status: "Under Review", reporter: "FPO Officer", verification: "Specimen Sent" },
  { disease: "Yellow Mosaic", loc: "Mandya, Karnataka", crop: "Pulse", status: "Verified", reporter: "Field Squad B", verification: "Lab Confirmed" },
  { disease: "Late Blight", loc: "Hooghly, West Bengal", crop: "Potato", status: "Reported", reporter: "Farmer App", verification: "AI Verified" },
  { disease: "Rice Blast", loc: "Cuttack, Odisha", crop: "Rice", status: "Verified", reporter: "District Admin", verification: "91% Match" },
  { disease: "Yellow Mosaic", loc: "Patna, Bihar", crop: "Maize", status: "Escalated", reporter: "MoA Survey", verification: "Critical Vector" },
  { disease: "Leaf Rust", loc: "Indore, MP", crop: "Wheat", status: "Reported", reporter: "Farmer App", verification: "Pending Visual" },
  { disease: "Black Scurf", loc: "Jalandhar, Punjab", crop: "Potato", status: "Under Review", reporter: "FPO Officer", verification: "Lab Pending" },
  { disease: "Powdery Mildew", loc: "Jaipur, Rajasthan", crop: "Mustard", status: "Verified", reporter: "Field Squad A", verification: "88% Match" },
  { disease: "False Smut", loc: "Karnal, Haryana", crop: "Rice", status: "Reported", reporter: "Satellite Alert", verification: "Visual Index" },
  { disease: "Early Blight", loc: "Gaya, Bihar", crop: "Tomato", status: "Verified", reporter: "District Admin", verification: "90% Match" },
];

const TREND_MOCK_DATA = {
  daily: [
    { day: "01 Jun", total: 280, verified: 190 },
    { day: "02 Jun", total: 310, verified: 200 },
    { day: "03 Jun", total: 290, verified: 180 },
    { day: "04 Jun", total: 340, verified: 218 },
    { day: "05 Jun", total: 360, verified: 230 },
  ],
  weekly: [
    { day: "Wk 1", total: 1800, verified: 1200 },
    { day: "Wk 2", total: 2100, verified: 1400 },
    { day: "Wk 3", total: 1950, verified: 1350 },
    { day: "Wk 4", total: 2380, verified: 1620 },
  ],
  monthly: [
    { day: "Jan", total: 8200, verified: 5400 },
    { day: "Feb", total: 9100, verified: 6100 },
    { day: "Mar", total: 8700, verified: 5900 },
    { day: "Apr", total: 10400, verified: 7200 },
    { day: "May", total: 11200, verified: 7800 },
  ]
};

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight uppercase">
          {title}
        </h1>
        <span className="text-xs font-black text-[#31572c] uppercase font-mono tracking-wider pl-3 ml-3 border-l-2 border-gray-300">
          {subtitle}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Secure Govt Network
        </span>
      </div>
    </div>
  );
};


export default function DiseaseSurveillanceNetwork() {
  const [loading, setLoading] = useState(true);
  const [trendPeriod, setTrendPeriod] = useState("daily");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-14 bg-gray-200 rounded-xl mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const getStatusChip = (status) => {
    const styles = {
      Reported: "bg-blue-50 text-blue-800 border-blue-100",
      "Under Review": "bg-amber-50 text-amber-900 border-amber-200",
      Verified: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Escalated: "bg-red-50 text-red-700 border-red-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || styles.Reported}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      Critical: "bg-red-50 text-red-700 border-red-100",
      High: "bg-amber-50 text-amber-950 border-amber-100",
      Medium: "bg-blue-50 text-blue-800 border-blue-100",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${styles[severity] || styles.Low}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-1 flex flex-col font-sans animate-fadeIn">
      <Header title="Disease Surveillance Network" subtitle="रोग निगरानी नेटवर्क" />

      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPI_DATA.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                <div className="p-1.5 bg-brand-medium/10 rounded-lg text-[#31572c]">
                  <Icon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-950 tracking-tight">{card.value}</span>
                <span className={`text-[10px] font-bold text-gray-500`}>
                  {card.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 — 3 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Reports by State: Recharts horizontal BarChart */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Reports by State</h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REPORTS_BY_STATE} layout="vertical" margin={{ top: 5, right: 15, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" style={{ fontSize: "9px" }} />
                <YAxis dataKey="state" type="category" stroke="#64748b" style={{ fontSize: "9px", fontWeight: "bold" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderRadius: "8px", border: "none", color: "#fff", fontSize: "11px" }} />
                <Bar dataKey="count" fill="#31572c" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports by District: ranked list (10 rows, scrollable) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Reports by District</h2>
          <div className="h-60 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
            {REPORTS_BY_DISTRICT.map((d) => (
              <div key={d.rank} className="flex justify-between items-center border-b border-gray-50 pb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#31572c] bg-[#ecf39e]/50 h-5 w-5 rounded-full flex items-center justify-center">{d.rank}</span>
                  <div>
                    <span className="font-bold text-gray-900">{d.district}</span>
                    <span className="text-[10px] text-gray-400 font-bold ml-1.5 uppercase font-mono">{d.state}</span>
                  </div>
                </div>
                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md font-bold font-mono">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports by Crop: Recharts PieChart */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Reports by Crop</h2>
          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REPORTS_BY_CROP} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={3} dataKey="value">
                  {REPORTS_BY_CROP.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-2">
              <span className="text-xl font-black text-gray-800">340</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-600 border-t pt-2">
            {REPORTS_BY_CROP.map((crop, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                <span className="truncate">{crop.name} {crop.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — Verification Workflow stepper (horizontal) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 mb-6">
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6">Verification Workflow Stepper</h2>
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          <div className="relative z-10 flex justify-between">
            {VERIFICATION_WORKFLOW.map((node) => (
              <div key={node.id} className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-black text-xs transition-all ${
                  node.active
                    ? "bg-brand-dark border-[#31572c] text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}>
                  {node.count}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider mt-2 ${
                  node.active ? "text-[#31572c]" : "text-gray-400"
                }`}>
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4 — Field Inspection Tracker */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 mb-6">
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Field Inspection Tracker</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scheduled */}
          <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Scheduled</span>
            <div className="space-y-3 mt-3">
              {INSPECTION_TRACKER.scheduled.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 p-3 rounded-lg shadow-2xs">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-black text-gray-900">{item.inspector}</p>
                    {getSeverityBadge(item.severity)}
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.district} ({item.crop})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase">In Progress</span>
            <div className="space-y-3 mt-3">
              {INSPECTION_TRACKER.in_progress.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 p-3 rounded-lg shadow-2xs">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-black text-gray-900">{item.inspector}</p>
                    {getSeverityBadge(item.severity)}
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.district} ({item.crop})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed */}
          <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Completed</span>
            <div className="space-y-3 mt-3">
              {INSPECTION_TRACKER.completed.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 p-3 rounded-lg shadow-2xs">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-black text-gray-900">{item.inspector}</p>
                    {getSeverityBadge(item.severity)}
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.district} ({item.crop})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{item.date}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 5 — Live Disease Cases Table (full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Live Disease Cases Table</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pl-6">Disease</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Location</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Crop</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Status</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Reporter</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pr-6">Verification</th>
              </tr>
            </thead>
            <tbody>
              {LIVE_CASES.map((item, idx) => (
                <tr key={idx} className="text-xs font-semibold text-gray-700 hover:bg-brand-medium/5 transition-colors border-b border-gray-100/60">
                  <td className="p-3.5 pl-6 font-bold text-gray-950">{item.disease}</td>
                  <td className="p-3.5">{item.loc}</td>
                  <td className="p-3.5">{item.crop}</td>
                  <td className="p-3.5">{getStatusChip(item.status)}</td>
                  <td className="p-3.5 text-gray-500 font-semibold">{item.reporter}</td>
                  <td className="p-3.5 pr-6 font-mono text-[10px] font-bold text-gray-900">{item.verification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 6 — Reporting Trends */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Reporting Trends Analysis</h2>
          <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-bold text-gray-600">
            {["daily", "weekly", "monthly"].map((p) => (
              <button
                key={p}
                onClick={() => setTrendPeriod(p)}
                className={`px-3 py-1 rounded-md uppercase tracking-wider text-[10px] ${
                  trendPeriod === p
                    ? "bg-brand-dark text-white"
                    : "hover:text-gray-900"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TREND_MOCK_DATA[trendPeriod]} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: "9px", fontWeight: "bold" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "9px" }} />
              <Tooltip contentStyle={{ backgroundColor: "#132a13", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
              <Line type="monotone" dataKey="total" name="Total Reports" stroke="#4f772d" strokeWidth={2} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="verified" name="Verified Reports" stroke="#f39c12" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
