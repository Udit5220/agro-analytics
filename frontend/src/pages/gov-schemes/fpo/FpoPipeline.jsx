// src/pages/gov-schemes/fpo/FpoPipeline.jsx
import React, { useState, useMemo } from "react";
import { FolderKanban, Plus, X, AlertCircle, Search } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { FpoUtilizationHeader } from "./FpoHelper";
import StatsCard from "../../../components/partials/StatsCard"; // Adjust path as per your project structure

const FpoPipeline = () => {
  const fpoData = govtSchemeData.fpoOpportunityData;
  const { pipeline, pipelineStages, pipelineForecast, pipelineSummary } =
    fpoData;

  const [boardCards, setBoardCards] = useState(pipeline);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  // Form states
  const [appName, setAppName] = useState("");
  const [appAmount, setAppAmount] = useState("");
  const [appStage, setAppStage] = useState("Identified");
  const [appOfficer, setAppOfficer] = useState("Ramesh Singh");
  const [appRisk, setAppRisk] = useState("Low");

  const filteredCards = useMemo(() => {
    return boardCards.filter((card) => {
      const matchesSearch = card.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRisk = !riskFilter || card.risk === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [boardCards, searchTerm, riskFilter]);

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!appName || !appAmount) return;

    const newCard = {
      id: `card-${Date.now()}`,
      name: appName,
      amount: `₹${appAmount} Lakh`,
      stage: appStage,
      officer: appOfficer,
      lastUpdate: "Just now",
      daysInStage: 1,
      risk: appRisk,
      decisionDate: "TBD",
      matchScore: 80,
      complexity: "Medium",
      deadline: null,
      type: "Subsidy",
      progress: 30,
    };

    setBoardCards((prev) => [...prev, newCard]);
    setAppName("");
    setAppAmount("");
    setShowCreateModal(false);
  };

  const moveToStage = (cardId, newStage) => {
    setBoardCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, stage: newStage, lastUpdate: "Just now" }
          : card,
      ),
    );
    setSelectedCard(null);
  };

  return (
    <div className="space-y-6">
      {/* Main Page Heading */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-[#4f772d]" />
          Funding Pipeline
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Track and manage all active FPO grant applications, subsidies, and
          infrastructure projects
        </p>
      </div>

      <FpoUtilizationHeader subtitle="FPO Opportunity Pipeline" />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="TOTAL PIPELINE"
          value={`₹${pipelineSummary.totalPipelineValue} Cr`}
          trend="+12% this quarter"
          trendType="success"
          subtext="Active Applications"
          icon={<FolderKanban className="text-[#4f772d]" />}
        />
        <StatsCard
          title="AVG DAYS IN STAGE"
          value={pipelineSummary.avgDaysInStage}
          trend="↓ 3 days"
          trendType="success"
          subtext="Improved from last month"
        />
        <StatsCard
          title="CONVERSION RATE"
          value={`${pipelineSummary.conversionRate}%`}
          trend="+8%"
          trendType="success"
          subtext="Pipeline to Disbursed"
        />
        <StatsCard
          title="HIGH RISK ITEMS"
          value={pipelineSummary.highRiskCount}
          trend="Needs attention"
          trendType="danger"
          subtext="Action required"
          icon={<AlertCircle className="text-red-600" />}
        />
      </div>

      {/* Forecast Chart */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h3 className="font-bold text-[#132a13] text-sm mb-3">
          Funding Inflow Forecast (₹ Lakhs)
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pipelineForecast}>
              <defs>
                <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f772d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f772d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#132a13" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#132a13" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis
                tickFormatter={(val) => `₹${val}L`}
                tick={{ fontSize: 10 }}
              />
              <Tooltip formatter={(value) => `₹${value} Lakhs`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="#4f772d"
                fillOpacity={1}
                fill="url(#projectedGrad)"
                name="Target Inflow"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#132a13"
                fillOpacity={1}
                fill="url(#actualGrad)"
                name="Secured Inflow"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
        >
          <option value="">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
        </select>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#132a13] hover:bg-[#31572c] text-white px-5 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      {/* Kanban Board */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm overflow-x-auto">
        <h3 className="font-bold text-[#132a13] text-sm mb-4">
          Pipeline Kanban Board
        </h3>
        <div className="flex gap-4 min-w-[1400px] pb-6">
          {pipelineStages.map((stage) => {
            const stageCards = filteredCards.filter((c) => c.stage === stage);
            const stageValue = stageCards.reduce((sum, c) => {
              const val = parseFloat(c.amount.replace(/[^0-9.]/g, "")) || 0;
              return sum + val;
            }, 0);

            return (
              <div
                key={stage}
                className="bg-gray-50 p-4 rounded-xl w-80 shrink-0 flex flex-col min-h-[420px]"
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <span className="font-bold text-[#132a13]">{stage}</span>
                  <div className="text-right">
                    <span className="text-xs bg-[#132a13]/10 text-[#132a13] px-2.5 py-1 rounded-full font-mono">
                      {stageCards.length}
                    </span>
                    <div className="text-[10px] text-gray-500 mt-1">
                      ₹{stageValue} Cr
                    </div>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {stageCards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="bg-white p-4 rounded-xl border border-gray-200 hover:border-[#4f772d] cursor-pointer transition-all hover:shadow group"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-[#132a13] pr-2 leading-tight">
                          {card.name}
                        </h4>
                        <span className="text-[#4f772d] font-bold text-sm whitespace-nowrap">
                          {card.amount}
                        </span>
                      </div>

                      <div className="mt-3 text-xs text-gray-500 flex justify-between">
                        <span>Officer: {card.officer}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            card.risk === "Low"
                              ? "bg-emerald-100 text-emerald-700"
                              : card.risk === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {card.risk}
                        </span>
                      </div>

                      {card.progress !== undefined && (
                        <div className="mt-3 h-1.5 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="h-1.5 bg-[#4f772d] rounded transition-all"
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {stageCards.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-12">
                      No applications in this stage
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-[#132a13]">
                {selectedCard.name}
              </h2>
              <button
                onClick={() => setSelectedCard(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm mb-8">
              <div>
                <strong>Amount:</strong> {selectedCard.amount}
              </div>
              <div>
                <strong>Risk:</strong> {selectedCard.risk}
              </div>
              <div>
                <strong>Progress:</strong> {selectedCard.progress}%
              </div>
              <div>
                <strong>Officer:</strong> {selectedCard.officer}
              </div>
              <div>
                <strong>Deadline:</strong>{" "}
                {selectedCard.deadline || selectedCard.decisionDate || "TBD"}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-3">
                Move to Stage
              </label>
              <div className="flex flex-wrap gap-2">
                {pipelineStages.map((st) => (
                  <button
                    key={st}
                    onClick={() => moveToStage(selectedCard.id, st)}
                    className="px-5 py-2 text-xs border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[#4f772d] transition"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Entry Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold text-[#132a13] flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                Create Pipeline Entry
              </h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
                  Application Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. Cold Storage Expansion"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
                    Amount (₹ Lakh)
                  </label>
                  <input
                    type="number"
                    value={appAmount}
                    onChange={(e) => setAppAmount(e.target.value)}
                    placeholder="150"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
                    Officer
                  </label>
                  <select
                    value={appOfficer}
                    onChange={(e) => setAppOfficer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                  >
                    <option>Ramesh Singh</option>
                    <option>Anil Dev</option>
                    <option>Preeti Sen</option>
                    <option>Vipul Verma</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
                    Stage
                  </label>
                  <select
                    value={appStage}
                    onChange={(e) => setAppStage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                  >
                    {pipelineStages.map((st) => (
                      <option key={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
                    Risk
                  </label>
                  <select
                    value={appRisk}
                    onChange={(e) => setAppRisk(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#4f772d] hover:bg-[#31572c] text-white rounded-xl text-sm font-bold"
                >
                  Add to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FpoPipeline;
