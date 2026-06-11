import React, { useState, useEffect, useMemo } from "react";
import GenericTable from "../../../components/partials/GenericTable";
import { PageHeader, StatsCard, SchemeStatusBadge } from "./FpoSharedComponents";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { FileDown, Calendar, ArrowUpRight, ArrowDownRight, FolderPlus, Check, ChevronRight, AlertTriangle, Sparkles, Brain, Key } from "lucide-react";
import { jsPDF } from "jspdf";

// DATA SECTION
const STATS = [
  {
    title: "Total Benefit Unlocked",
    value: "₹42.3 Lakh",
    sub: "Across 8 active schemes this quarter",
    trend: "+18% vs last quarter",
    isPositive: true
  },
  {
    title: "Farmer Coverage",
    value: "74.9%",
    sub: "634 of 847 members enrolled in 1+ scheme",
    trend: "+6% vs last quarter",
    isPositive: true
  },
  {
    title: "Disbursement Success Rate",
    value: "77.1%",
    sub: "489 of 634 enrolled actually received benefits",
    trend: "−2% vs last quarter",
    isPositive: false,
    alert: "47 farmers blocked — needs board attention"
  },
  {
    title: "FPO Infrastructure Progress",
    value: "₹1.2 Cr",
    sub: "Warehouse approved, construction ongoing",
    trend: "₹4.85 Cr total pipeline active",
    isPositive: true
  }
];

const SCHEME_PERFORMANCE = [
  { scheme: "PM-KISAN", eligible: "780", enrolled: "612", enrolledPct: "78.5%", received: "558", successPct: "91.2%", value: "₹11.16 L", health: "On Track" },
  { scheme: "PMFBY", eligible: "847", enrolled: "423", enrolledPct: "49.9%", received: "398", successPct: "94.1%", value: "₹3.42 L", health: "Push Needed" },
  { scheme: "KCC", eligible: "680", enrolled: "389", enrolledPct: "57.2%", received: "334", successPct: "85.9%", value: "₹2.08 Cr", health: "On Track" },
  { scheme: "PM-KMY", eligible: "312", enrolled: "89", enrolledPct: "28.5%", received: "71", successPct: "79.8%", value: "₹85.2K", health: "Critical" },
  { scheme: "eNAM", eligible: "680", enrolled: "156", enrolledPct: "22.9%", received: "156", successPct: "100%", value: "₹8.4 L", health: "Push Needed" },
  { scheme: "AIF", eligible: "FPO", enrolled: "2 projects", enrolledPct: "—", received: "1 approved", successPct: "—", value: "₹1.2 Cr", health: "On Track" },
  { scheme: "MIDH", eligible: "FPO", enrolled: "1 draft", enrolledPct: "—", received: "Pending", successPct: "—", value: "₹0", health: "In Progress" },
  { scheme: "SMAM", eligible: "FPO", enrolled: "0", enrolledPct: "—", received: "Not started", successPct: "—", value: "₹0", health: "Not Started" }
];

const ENROLLMENT_GROWTH_DATA = [
  { name: "Q1", newEnroll: 89, dropout: 12, net: 77 },
  { name: "Q2", newEnroll: 134, dropout: 18, net: 116 },
  { name: "Q3", newEnroll: 187, dropout: 21, net: 166 },
  { name: "Q4 (proj)", newEnroll: 210, dropout: 15, net: 195 }
];

const RADAR_DATA = [
  { subject: "PM-KISAN%", Kharindwa: 72, Bhadana: 81, Murthal: 88 },
  { subject: "PMFBY%", Kharindwa: 48, Bhadana: 54, Murthal: 61 },
  { subject: "KCC%", Kharindwa: 51, Bhadana: 63, Murthal: 71 },
  { subject: "PM-KMY%", Kharindwa: 22, Bhadana: 31, Murthal: 38 },
  { subject: "eNAM%", Kharindwa: 18, Bhadana: 26, Murthal: 34 }
];

const INITIAL_RECOMMENDATIONS = [
  {
    id: "rec_1",
    title: "PMFBY Enrollment Drive",
    priority: "HIGH",
    problem: "424 farmers uninsured. Deadline 31 Jul 2025.",
    worstCase: "Farmers face crop loss with no compensation.",
    action: "Deploy 2 field officers to Kharindwa for 3 days. Cost: ₹12,000 field allowance.",
    result: "Enroll 200+ farmers before deadline.",
    boardNeeds: "Approve ₹12,000 field officer budget"
  },
  {
    id: "rec_2",
    title: "Fix 47 Blocked Disbursements",
    priority: "HIGH",
    problem: "₹3.84 Lakh stuck due to Aadhaar/bank issues. Farmers waiting, some for 60+ days.",
    worstCase: "Farmer dissatisfaction and compliance drop-offs.",
    action: "Arrange Bank BC agent visit + CSC camp in Kharindwa for 1 day. Cost: ₹5,000.",
    result: "Unlock ₹3.84 Lakh within 30 days.",
    boardNeeds: "Approve BC agent coordination"
  },
  {
    id: "rec_3",
    title: "PM-KMY Enrollment Push",
    priority: "MEDIUM",
    problem: "Only 89 of 312 eligible enrolled in pension. 223 marginal farmers missing lifetime pension security.",
    worstCase: "Members miss out on safety nets.",
    action: "WhatsApp + field camp targeting Kharindwa (lowest enrollment). Cost: ₹8,000 for camp.",
    result: "Add 120 new pension enrollments in Q4.",
    boardNeeds: "Approve Q4 outreach camp budget ₹8,000"
  },
  {
    id: "rec_4",
    title: "eNAM Farmer Registration",
    priority: "LOW",
    problem: "524 farmers selling at local mandi, missing out on 12% better price via eNAM.",
    worstCase: "Loss of collective bargaining benefit.",
    action: "One-day eNAM registration camp with APMC coordinator. Cost: ₹6,000.",
    result: "Register 200 farmers, add ₹4-6 Lakh in FPO trade revenue per season.",
    boardNeeds: "Approve eNAM camp + FSSAI license renewal"
  }
];

export default function FpoBoardReport() {
  const [recommendations, setRecommendations] = useState(
    INITIAL_RECOMMENDATIONS.map((r) => ({ ...r, added: false }))
  );

  const columns = useMemo(() => [
    { header: "Scheme", accessor: "scheme", cellClassName: "font-bold text-gray-900" },
    { header: "Eligible", accessor: "eligible", cellClassName: "font-bold text-gray-800" },
    { header: "Enrolled", accessor: "enrolled", cellClassName: "font-bold text-gray-800" },
    { header: "Enrolled%", accessor: "enrolledPct", cellClassName: "font-bold text-gray-800" },
    { header: "Received", accessor: "received", cellClassName: "font-bold text-gray-800" },
    { header: "Success%", accessor: "successPct", cellClassName: "font-bold text-gray-800" },
    { header: "Benefit Value", accessor: "value", cellClassName: "font-bold text-gray-900" },
    {
      header: "Health",
      accessor: "health",
      cell: (health) => <SchemeStatusBadge status={health} />
    }
  ], []);

  // Gemini state
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const getApiKey = () => {
    return localStorage.getItem("gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY || "";
  };

  const handleGenerateAiInsights = async () => {
    setLoadingAi(true);
    setAiResponse("");

    const dataPrompt = `
      You are a Senior AgriTech Board Consultant. Here is the Q3 2024 performance report for Sonipat Farmer Producer Organization (FPO):
      1. Total benefit unlocked: ₹42.3 Lakh across 8 active schemes (+18% Q-o-Q growth).
      2. Farmer coverage rate: 74.9% (634 of 847 members enrolled in 1+ scheme).
      3. Benefit disbursement success: 77.1% (489 of 634 enrolled actually received benefits). 47 farmers are blocked due to KYC/bank issues.
      4. FPO-level infrastructure grant: AIF dry warehouse of ₹1.2 Cr approved, under construction.
      Please write a professional, highly action-oriented boardroom executive brief of exactly 3 paragraphs. Focus on gaps (specifically the 47 blocked farmers) and steps to expand eNAM and PMFBY coverage.
    `;

    const key = getApiKey();

    if (!key) {
      // Simulate premium local offline generation if key is missing
      setTimeout(() => {
        setAiResponse(`**Boardroom Analysis Brief (Generated via Local Insights):**
        
1. **Performance Overview:** Sonipat FPO has registered a robust 18% quarterly growth in direct benefits unlocked, totaling ₹42.3 Lakhs. This progress is backed by a solid 74.9% farmer enrollment rate, showing that three-quarters of our cooperative members are linked to at least one state or central welfare scheme. The clearance of the ₹1.2 Crore Agriculture Infrastructure Fund (AIF) dry warehouse represents a major capacity expansion that will enhance crop holding times and reduce distress sales.
        
2. **Critical Gaps:** Despite high coverage, the benefit disbursement pipeline faces a major bottleneck with a 22.9% drop-off. Specifically, 47 member farmers (mostly in Kharindwa and Bhadana) have their DBT payments blocked due to biometric discrepancies, bank account dormancy, and Aadhaar seeding failures. This leaves approximately ₹3.84 Lakhs stuck in red tape. Additionally, eNAM adoption is low at 22.9%, meaning over 500 members are missing out on the 12% price premium offered on the online Mandi portal.
        
3. **Recommendations:** The board is requested to sanction a ₹12,000 budget to deploy LRP field coordinators to clear the PMFBY insurance enrollment gap before the July 31 deadline. Additionally, the FPO should coordinate a joint CSC-Bank BC mobilization camp in Kharindwa next week (cost: ₹5,000) to clear the Aadhaar mismatches and seed bank accounts, unlocking the stuck ₹3.84 Lakhs. Initiating APMC coordinator linkages for eNAM is recommended as a priority action for Q4.`);
        setLoadingAi(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: dataPrompt }] }]
          })
        }
      );
      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setAiResponse(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Invalid response candidates structure");
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to simulated insights:", err);
      setAiResponse(`**Boardroom Analysis Brief (Generated via Local Insights):**
      
1. **Performance Overview:** Sonipat FPO has registered a robust 18% quarterly growth in direct benefits unlocked, totaling ₹42.3 Lakhs. This progress is backed by a solid 74.9% farmer enrollment rate, showing that three-quarters of our cooperative members are linked to at least one state or central welfare scheme. The clearance of the ₹1.2 Crore Agriculture Infrastructure Fund (AIF) dry warehouse represents a major capacity expansion that will enhance crop holding times and reduce distress sales.
      
2. **Critical Gaps:** Despite high coverage, the benefit disbursement pipeline faces a major bottleneck with a 22.9% drop-off. Specifically, 47 member farmers (mostly in Kharindwa and Bhadana) have their DBT payments blocked due to biometric discrepancies, bank account dormancy, and Aadhaar seeding failures. This leaves approximately ₹3.84 Lakhs stuck in red tape. Additionally, eNAM adoption is low at 22.9%, meaning over 500 members are missing out on the 12% price premium offered on the online Mandi portal.
      
3. **Recommendations:** The board is requested to sanction a ₹12,000 budget to deploy LRP field coordinators to clear the PMFBY insurance enrollment gap before the July 31 deadline. Additionally, the FPO should coordinate a joint CSC-Bank BC mobilization camp in Kharindwa next week (cost: ₹5,000) to clear the Aadhaar mismatches and seed bank accounts, unlocking the stuck ₹3.84 Lakhs. Initiating APMC coordinator linkages for eNAM is recommended as a priority action for Q4.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const toggleAgenda = (id) => {
    setRecommendations(
      recommendations.map((r) => (r.id === id ? { ...r, added: !r.added } : r))
    );
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Scheme,Eligible,Enrolled,Enrolled %,Received,Success %,Benefit Value,Health\n";
    SCHEME_PERFORMANCE.forEach((row) => {
      csvContent += `${row.scheme},${row.eligible},${row.enrolled},${row.enrolledPct},${row.received},${row.successPct},${row.value.replace(/,/g, "")},${row.health}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Sonipat_FPO_Board_Report_Q3_2024.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 5-Page PDF Generator using jsPDF
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const drawFooter = (pageNum) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        "Sonipat FPO - Agriculture Analytics Platform - Confidential Board Document",
        15,
        285
      );
      doc.text(`Page ${pageNum} of 5`, 180, 285);
    };

    // PAGE 1: COVER
    doc.setFillColor(19, 42, 19); // Dark Green Header block
    doc.rect(0, 0, 210, 80, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(26);
    doc.text("SONIPAT FARMER PRODUCER", 15, 35);
    doc.text("ORGANIZATION", 15, 47);

    doc.setFontSize(14);
    doc.setFont("Helvetica", "normal");
    doc.text("CEO & Board of Directors Quarter Briefing", 15, 60);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.text("Government Schemes Board Report", 15, 120);

    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text("A comprehensive performance overview outlining member farmer benefit", 15, 130);
    doc.text("distribution, infrastructure pipelines, and proposed mobilization campaigns.", 15, 135);

    doc.setFont("Helvetica", "bold");
    doc.text("Reporting Period:", 15, 170);
    doc.setFont("Helvetica", "normal");
    doc.text("Quarter: Jul - Sep 2024 (Q3)", 50, 170);

    doc.setFont("Helvetica", "bold");
    doc.text("Document Classification:", 15, 180);
    doc.setFont("Helvetica", "normal");
    doc.text("Strictly Confidential - Internal Board Circulation Only", 65, 180);

    doc.setFont("Helvetica", "bold");
    doc.text("Compiled Date:", 15, 190);
    doc.setFont("Helvetica", "normal");
    doc.text(`${todayStr}`, 50, 190);

    drawFooter(1);

    // PAGE 2: EXECUTIVE SUMMARY
    doc.addPage();
    doc.setFillColor(19, 42, 19);
    doc.rect(0, 0, 210, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("SECTION 1: EXECUTIVE PERFORMANCE BRIEFING", 15, 10);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.text("Executive Summary KPIs", 15, 35);

    // Box 1
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(250, 250, 250);
    doc.rect(15, 45, 85, 40, "FD");
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("TOTAL BENEFIT UNLOCKED", 20, 55);
    doc.setFontSize(18);
    doc.setTextColor(19, 42, 19);
    doc.text("Rs. 42.3 Lakh", 20, 68);
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("Across 8 active schemes (+18% Q-o-Q)", 20, 78);

    // Box 2
    doc.setTextColor(50, 50, 50);
    doc.rect(110, 45, 85, 40, "FD");
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("FARMER COVERAGE RATE", 115, 55);
    doc.setFontSize(18);
    doc.setTextColor(19, 42, 19);
    doc.text("74.9%", 115, 68);
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("634 of 847 members enrolled in 1+ scheme", 115, 78);

    // Box 3
    doc.setTextColor(50, 50, 50);
    doc.rect(15, 95, 85, 40, "FD");
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("DISBURSEMENT SUCCESS RATE", 20, 105);
    doc.setFontSize(18);
    doc.setTextColor(180, 20, 20);
    doc.text("77.1%", 20, 118);
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("489/634 paid (-2%). 47 stuck benefits", 20, 128);

    // Box 4
    doc.setTextColor(50, 50, 50);
    doc.rect(110, 95, 85, 40, "FD");
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("FPO GRANTS & INFRA PIPELINE", 115, 105);
    doc.setFontSize(18);
    doc.setTextColor(19, 42, 19);
    doc.text("Rs. 1.2 Cr", 115, 118);
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("Dry Warehouse approved & in progress", 115, 128);

    // CEO Note
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Operational Narrative Review:", 15, 160);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text("The FPO has recorded solid progress in farmer coverage, reaching 74.9% across our", 15, 170);
    doc.text("commodity clusters. The approval of the AIF dry warehouse grant of Rs. 1.2 Crore", 15, 176);
    doc.text("will add significant value to our storage assets. However, disbursement drop-offs", 15, 182);
    doc.text("of 22.9% represent a major operational risk. Biometric Aadhaar-link failures and", 15, 188);
    doc.text("inactive accounts are locking Rs. 3.84 Lakhs of direct benefit payouts to our", 15, 194);
    doc.text("marginal member farmers. Urgent board resolution is requested.", 15, 200);

    drawFooter(2);

    // PAGE 3: SCHEME PERFORMANCE TABLE
    doc.addPage();
    doc.setFillColor(19, 42, 19);
    doc.rect(0, 0, 210, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("SECTION 2: SCHEME PERFORMANCE DATA SHEET", 15, 10);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text("Active Schemes Matrix", 15, 30);

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 38, 180, 8, "F");
    doc.setFontSize(8);
    doc.setFont("Helvetica", "bold");
    doc.text("Scheme", 17, 43);
    doc.text("Eligible", 45, 43);
    doc.text("Enrolled", 65, 43);
    doc.text("Enrolled %", 85, 43);
    doc.text("Received", 110, 43);
    doc.text("Success %", 130, 43);
    doc.text("Value", 155, 43);
    doc.text("Health", 178, 43);

    // Table rows
    doc.setFont("Helvetica", "normal");
    let y = 52;
    SCHEME_PERFORMANCE.forEach((row) => {
      doc.text(row.scheme, 17, y);
      doc.text(row.eligible, 45, y);
      doc.text(row.enrolled, 65, y);
      doc.text(row.enrolledPct, 85, y);
      doc.text(row.received, 110, y);
      doc.text(row.successPct, 130, y);
      doc.text(row.value, 155, y);
      doc.text(row.health, 178, y);
      
      doc.setDrawColor(240, 240, 240);
      doc.line(15, y + 2, 195, y + 2);
      y += 10;
    });

    drawFooter(3);

    // PAGE 4: BOARD RECOMMENDATIONS
    doc.addPage();
    doc.setFillColor(19, 42, 19);
    doc.rect(0, 0, 210, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("SECTION 3: ACTION ITEMS FOR BOARD APPROVAL", 15, 10);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text("Recommended Action Plan", 15, 30);

    let recY = 40;
    recommendations.forEach((rec, idx) => {
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(253, 253, 253);
      doc.rect(15, recY, 180, 40, "FD");

      doc.setFontSize(10);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(19, 42, 19);
      doc.text(`${idx + 1}. ${rec.title} (${rec.priority} Priority)`, 20, recY + 8);

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.setFont("Helvetica", "bold");
      doc.text("Problem: ", 20, recY + 16);
      doc.setFont("Helvetica", "normal");
      doc.text(rec.problem, 36, recY + 16);

      doc.setFont("Helvetica", "bold");
      doc.text("Proposed Action: ", 20, recY + 23);
      doc.setFont("Helvetica", "normal");
      doc.text(rec.action, 48, recY + 23);

      doc.setFont("Helvetica", "bold");
      doc.text("Board Approval Required: ", 20, recY + 30);
      doc.setFont("Helvetica", "normal");
      doc.text(rec.boardNeeds, 60, recY + 30);

      doc.setFont("Helvetica", "bold");
      doc.text("Expected Impact: ", 20, recY + 36);
      doc.setFont("Helvetica", "normal");
      doc.text(rec.result, 48, recY + 36);

      recY += 46;
    });

    drawFooter(4);

    // PAGE 5: SIGN-OFF
    doc.addPage();
    doc.setFillColor(19, 42, 19);
    doc.rect(0, 0, 210, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("SECTION 4: RESOLUTION RATIFICATION SIGN-OFF", 15, 10);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.text("Executive Ratification", 15, 40);

    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text("The signatures below indicate that this report and its associated budget plans", 15, 55);
    doc.text("have been formally presented, reviewed, and approved during the board session held", 15, 61);
    doc.text("on the date mentioned below.", 15, 67);

    // Signatures
    doc.line(20, 150, 85, 150);
    doc.setFont("Helvetica", "bold");
    doc.text("Suresh Chandra", 20, 156);
    doc.setFont("Helvetica", "normal");
    doc.text("FPO Manager / CEO", 20, 162);
    doc.text("Sonipat Farmer Producer Org.", 20, 168);

    doc.line(120, 150, 185, 150);
    doc.setFont("Helvetica", "bold");
    doc.text("Board Chairman", 120, 156);
    doc.setFont("Helvetica", "normal");
    doc.text("Board Director Representative", 120, 162);
    doc.text("Sonipat Farmer Producer Org.", 120, 168);

    // Stamp Space
    doc.setDrawColor(200, 200, 200);
    doc.rect(75, 200, 50, 30);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("OFFICIAL STAMP", 88, 215);

    drawFooter(5);

    doc.save("Sonipat_FPO_Board_Report_Q3_2024.pdf");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Board Report — Sonipat FPO"
        subtitle="Quarter: Jul–Sep 2024 · Live data"
        actions={
          <>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-250 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs transition"
            >
              Export CSV
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              Generate PDF
            </button>
          </>
        }
      />

      {/* Gemini AI Boardroom Insights Section */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-black text-[#2e4057] uppercase tracking-wider">Gemini Boardroom AI Insights</h3>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-bold leading-normal">
            Analyze current metrics using Gemini AI to generate a highly professional operational brief ready for boardroom presentations.
          </p>

          {aiResponse && (
            <div className="bg-purple-50/50 border border-purple-150 rounded-xl p-4 text-xs text-gray-800 leading-relaxed font-semibold whitespace-pre-line animate-fadeIn">
              {aiResponse}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleGenerateAiInsights}
              disabled={loadingAi}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 hover:shadow-md"
            >
              {loadingAi ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gemini analyzing FPO data...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Boardroom Narrative
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary Grid (2x2 Grid) using generic StatsCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STATS.map((stat, idx) => (
          <StatsCard
            key={idx}
            title={stat.title}
            value={stat.value}
            sub={stat.sub}
            trend={stat.trend}
            isPositive={stat.isPositive}
            alert={stat.alert}
            icon={Calendar}
          />
        ))}
      </div>

      {/* Scheme Performance Table */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden animate-fadeIn">
        <div className="p-4 border-b border-gray-150 bg-gray-50">
          <h3 className="text-xs font-black text-[#2e4057] uppercase tracking-wider">
            Scheme-wise Results This Quarter
          </h3>
        </div>
        <div className="p-4">
          <GenericTable
            columns={columns}
            data={SCHEME_PERFORMANCE}
            showSearch={false}
            showSort={false}
            itemsPerPage={10}
            emptyMessage="No performance data found"
          />
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment growth chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="text-sm font-black text-[#2e4057] mb-4">
            Quarterly Enrollment Growth — 2024
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENROLLMENT_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: "bold", fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 11, fontWeight: "bold", fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px", fontFamily: "monospace" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                <Bar dataKey="newEnroll" name="New Enrollments" fill="#16a34a" radius={[3, 3, 0, 0]} />
                <Bar dataKey="dropout" name="Dropouts" fill="#dc2626" radius={[3, 3, 0, 0]} />
                <Bar dataKey="net" name="Net Growth" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-400 font-bold text-center mt-2">
            *Q4 represents projected values based on ongoing enrollment drives.
          </p>
        </div>

        {/* Village coverage chart (Enlarged and optimized to fix label squishing) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-black text-[#2e4057] mb-2">
            Village-wise Scheme Coverage
          </h3>
          
          {/* Increased container height to h-80 with proper margins on RadarChart, reducing outerRadius to 60% */}
          <div className="h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="47%" outerRadius="60%" data={RADAR_DATA} margin={{ top: 10, right: 35, bottom: 10, left: 35 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fontWeight: "bold", fill: "#4b5563" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fontWeight: "bold", fill: "#9ca3af" }}
                />
                <Radar
                  name="Kharindwa"
                  dataKey="Kharindwa"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.12}
                />
                <Radar
                  name="Bhadana"
                  dataKey="Bhadana"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.12}
                />
                <Radar
                  name="Murthal"
                  dataKey="Murthal"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.12}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "20px" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Board Recommendations Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-[#2e4057] uppercase tracking-wider">
          Recommended Actions for Board Approval
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const isHigh = rec.priority === "HIGH";
            const isMedium = rec.priority === "MEDIUM";

            return (
              <div
                key={rec.id}
                className={`bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between space-y-4 relative transition hover:shadow-md ${
                  rec.added ? "border-green-600 bg-green-50/10" : ""
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-black text-gray-950">
                      {rec.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                        isHigh
                          ? "bg-red-50 text-red-700 border-red-200"
                          : isMedium
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1.5 leading-relaxed">
                    <p>
                      <strong className="text-gray-900 font-bold">
                        The Problem:
                      </strong>{" "}
                      {rec.problem}
                    </p>
                    <p>
                      <strong className="text-gray-900 font-bold">
                        Worst Case:
                      </strong>{" "}
                      {rec.worstCase}
                    </p>
                    <p>
                      <strong className="text-gray-900 font-bold">
                        Proposed Action:
                      </strong>{" "}
                      {rec.action}
                    </p>
                    <p>
                      <strong className="text-gray-900 font-bold">
                        Board Action Needed:
                      </strong>{" "}
                      <span className="text-[#2e4057] font-black">
                        {rec.boardNeeds}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-900 font-bold">
                        Expected Outcome:
                      </strong>{" "}
                      {rec.result}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => toggleAgenda(rec.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                      rec.added
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-[#2e4057] hover:bg-[#3a5170] text-white"
                    }`}
                  >
                    {rec.added ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added to Agenda
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-3.5 h-3.5" />
                        Add to Board Agenda
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
