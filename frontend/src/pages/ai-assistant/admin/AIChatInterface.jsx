import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useRole } from "../../../context/RoleContext";
import { generateContent } from "../../../services/gemini/client";
import {
  Plus,
  Search,
  Pin,
  Trash2,
  Send,
  Paperclip,
  Mic,
  Bot,
  User,
  Clock,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 6);

// 🌾 DYNAMIC HIGH-FIDELITY LOCAL AGRONOMIST FALLBACK ENGINE
function getDynamicFallback(query, role) {
  const q = query.toLowerCase().trim();
  const roleUpper = role.toUpperCase();
  
  if (role === "farmer") {
    if (q.includes("blast") || q.includes("disease") || q.includes("leaf") || q.includes("spot") || q.includes("fungus") || q.includes("pest")) {
      return `### Rice Blast Diagnosis & Treatment Protocol (धान ब्लास्ट रोग निवारण)
• **Diagnostic Assessment**: Lesions on leaf nodes exhibit diamond-shaped necrotic centers with reddish-brown borders. Highly indicative of **Rice Blast (Magnaporthe oryzae)** vector activity.
• **Agronomic Treatment (कृषि समाधान)**: Apply systemic fungicide **Tricyclazole 75% WP** at **300g per acre** in 200 liters of water. 
• **Organic Care (जैविक उपचार)**: Spray **Neem Oil (1500 ppm)** at **3ml/liter** of water at 15-day intervals during high humidity.
• **Safe Direction**: Monitor crops daily. Avoid excessive nitrogen applications as it aggravates blast spread. Keep standard water level at 2-5 cm.

*(Note: Live Gemini inference is currently offline. Running local cached agronomist diagnostics)*`;
    }
    if (q.includes("urea") || q.includes("fertilizer") || q.includes("npk") || q.includes("nitrogen") || q.includes("dap") || q.includes("potassium") || q.includes("khad")) {
      return `### Fertilizer Planner & NPK Balancing Report (खाद और पोषण संतुलन)
• **Telemetry Assessment**: Soil parameters indicate slightly low **Nitrogen (180 kg/ha)** and moderate **Phosphorus (45 kg/ha)**.
• **NPK Target Recipe**: The standard dosage is **120:60:40 kg/hectare** for active cereal production.
• **Split Application Schedule (खाद अनुप्रयोग चक्र)**:
  - **Basal Dressing**: Apply 30% Nitrogen + 100% Phosphorus at sowing time.
  - **Tillering Phase**: Apply 40% Nitrogen (Urea) at 21-25 days intervals.
  - **Flowering Phase**: Apply remaining 30% Nitrogen + 100% Potassium (MOP) to optimize grain fill.
• **Organic Carbon Adjustment**: Since soil organic carbon is moderate, reduce standard urea splits by 10% to prevent luxury vegetative growth.

*(Note: Live Gemini inference is currently offline. Running local agronomist chemical diagnostics)*`;
    }
    if (q.includes("irrigation") || q.includes("water") || q.includes("rain") || q.includes("moisture") || q.includes("watering")) {
      return `### Smart Irrigation & Soil Moisture Advisories (सिंचाई एवं जल प्रबंधन)
• **Soil Telemetry**: Average moisture level reads **62%** (moderate deficit threshold).
• **Actionable Advice (सिंचाई निर्देश)**:
  - **Wheat (गेहूं)**: Sown crops require immediate watering at the **Crown Root Initiation (CRI)** stage (21 days post-sowing).
  - **Rice (धान)**: Maintain constant standing water of **2-5 cm** during the active tillering window.
• **Water Saving Practice**: Use drip irrigation systems where possible. This saves up to **40% water** compared to traditional flood irrigation.
• **Weather Alert**: Check the regional forecast before scheduled irrigations to avoid field waterlogging.

*(Note: Live Gemini inference is currently offline. Running local agronomist moisture diagnostics)*`;
    }
    return `### Custom Farmer Agronomist Consultation (किसान सलाहकार रिपोर्ट)
• **Active Operations**: Analyzing your agronomical question: "${query}".
• **Soil Suitability**: Your clay-loam soil structure with pH **7.2** is ideal for rotation crops.
• **Primary Recommendation**: Focus on balancing nitrogen inputs and planning crop rotations with legumes (Moong/Chana) to naturally restore organic nitrogen.
• **Next Steps**: Monitor local mandi price trends before harvest to maximize commercial returns.

*(Note: Live Gemini inference is currently offline. Running local agronomist consultation engine)*`;
  }

  if (role === "fpo" || role === "fpo_manager") {
    if (q.includes("logistics") || q.includes("transport") || q.includes("delivery") || q.includes("vehicle") || q.includes("truck")) {
      return `### FPO Cluster Logistics & Dispatch Optimization (लॉजिस्टिक्स एवं परिवहन)
• **Fleet Assessment**: Consolidated requirements for **Cluster B** require **120 Tons** of haulage capacity.
• **Dispatch Routing**: Plan a hub-and-spoke dispatch using 3 regional assembly points to cut empty-mile carriage by **18%**.
• **Consolidated Order**: Aggregate transportation manifests into a single master gate-pass to expedite mandi checkpost clearing.
• **Action Point**: Coordinate driver schedules using live transit trackers to maintain the moisture boundary limit.

*(Note: Live Gemini inference is currently offline. Running local FPO logistics manager)*`;
    }
    if (q.includes("seed") || q.includes("input") || q.includes("pool") || q.includes("purchase") || q.includes("order")) {
      return `### Group Procurement & Bulk Input Aggregation (सामूहिक खरीद योजना)
• **Aggregated Demand**: Active grower pools have submitted requests for **45 Tons of DAP** and **80 Tons of Urea**.
• **Negotiated Discount**: Placing a unified purchase order with distributors yields a **12.5% volume discount** compared to individual retail buying.
• **Quality Parameters**: Ensure all pooled seeds carry a certified germination rate above **95%** and are treated with **Trichoderma**.
• **Execution Phase**: Allocate pick-up slots at FPO warehouses based on member contribution shares.

*(Note: Live Gemini inference is currently offline. Running local FPO procurement engine)*`;
    }
    return `### FPO Operations & Institutional Console (FPO प्रबंधन रिपोर्ट)
• **Console Input**: Processing request: "${query}" under institutional guidelines.
• **FPO Metric Summary**: Monitored growers: **450+ members** | Current pooled asset value: **₹18.5 Lakhs**.
• **Strategic Insight**: Partner with direct processors for buyback contracts to insulate smallholder members from open-market price drops.

*(Note: Live Gemini inference is currently offline. Running local FPO institutional console)*`;
  }

  if (role === "trader") {
    if (q.includes("mandi") || q.includes("price") || q.includes("market") || q.includes("apmc")) {
      return `### APMC Mandi Price Indices & Volumetric Analysis (मंडी भाव और विश्लेषण)
• **Market Telemetry**: Standard mandi spot price for **Wheat** averages **₹2,275 per quintal**, showing stable resistance.
• **Mandi Price Spreads**:
  - **Indore APMC**: ₹2,310/qtl (Upward volume momentum)
  - **Palwal Mandi**: ₹2,250/qtl (Stable arrivals)
  - **Akola Market**: ₹2,280/qtl (Declining resistance)
• **Market Signal**: Arrival rates are aligned with the 5-year seasonal moving average. Monitor Indore market spikes for arbitrage.

*(Note: Live Gemini inference is currently offline. Running local mandi pricing scanner)*`;
    }
    if (q.includes("arbitrage") || q.includes("spread") || q.includes("margin") || q.includes("spreads")) {
      return `### Multi-Mandi Arbitrage Spread Scanner (मध्य-मंडी मूल्य अंतर विश्लेषण)
• **Arbitrage Signal**: Net pricing spread between **Akola** and **Pune** APMCs for Soybeans has hit **₹140/quintal** (exceeding priority trigger of ₹100).
• **Logistics Deduction**: Deducting transportation, unloading, and mandi taxes leaves a net arbitrage profit of **₹82 per quintal**.
• **Recommendation**: Hedge 40% of physical positions via off-mandi forward trades. Execute transfer logs within 36 hours.
• **Risk Disclaimer**: Price fluctuations can occur rapidly. Ensure dry transport to avoid moisture variance penalties.

*(Note: Live Gemini inference is currently offline. Running local arbitrage scanner)*`;
    }
    return `### Trader Market Intelligence Ledger (व्यापारी बाजार रिपोर्ट)
• **Command Processed**: Analyzing trading vector query: "${query}".
• **Position Summary**: Net portfolio allocation represents **4 active commodity desks** with high volume focus.
• **Market Direction**: Spot prices are consolidating. Recommend holding short positions on paddy while accumulated stocks clear.

*(Note: Live Gemini inference is currently offline. Running local trader intelligence engine)*`;
  }

  if (role === "procurement") {
    if (q.includes("moisture") || q.includes("humidity") || q.includes("quality") || q.includes("reject")) {
      return `### Moisture Variance & Quality Control Gates (नमी और गुणवत्ता जांच)
• **QC Telemetry**: Average moisture level of incoming grain trucks stands at **14.8%** (critical border).
• **Quality Standard**: Maximum allowable moisture for silo storage is **14.0%**. Any lot above **15.2%** must be flagged for immediate drying.
• **Direction**: Route wet lots to drying bays. Apply a price deduction of ₹15/quintal for every 0.5% moisture above the standard.
• **Safe Storage**: Ensure proper aeration in Silo A-3 to prevent storage mold and aflatoxin spikes.

*(Note: Live Gemini inference is currently offline. Running local procurement QC scanner)*`;
    }
    return `### Bulk Procurement Gate Pass & Silo Ledger (थोक खरीद एवं साइलो प्रबंधन)
• **Command Processed**: Processing gate query: "${query}".
• **Silo Capacity Utilization**:
  - **Silo A (Wheat)**: 84% Capacity (Restricted intake)
  - **Silo B (Rice)**: 45% Capacity (Active allocation)
• **Warehouse Log**: All gate passes require double biometric signatures and moisture receipts.

*(Note: Live Gemini inference is currently offline. Running local procurement manager)*`;
  }

  if (role === "researcher") {
    return `### Scientific Plot Analytics & Phenotypic Trial Log (वैज्ञानिक अनुसंधान अनुभाग)
• **Research Telemetry**: ANOVA cross-variable analysis maps a statistically significant delta ($p < 0.01$) in crop performance.
• **Plot Nitrogen Assimilation**: Plot variant-B shows a **14% higher nitrogen conversion index** under organic carbon soil amendments.
• **Scientific Recommendation**: Continue weekly chlorophyll index mapping using NDVI satellite bands. Document trial milestones.
• **Query Processed**: "${query}" resolved under academic research standard parameters.

*(Note: Live Gemini inference is currently offline. Running local scientific trial engine)*`;
  }

  if (role === "government") {
    return `### Regional Subsidy Disbursement & Geospatial Hud (सरकारी सब्सिडी एवं ग्रामीण विकास)
• **Subsidy Telemetry**: **PM-KISAN DBT** payouts for District Block 4 have reached **92% verification clearance**.
• **Geospatial Water Stress**: Groundwater table surveys show a **1.2m decline** below the baseline safety threshold.
• **Policy Advice**: Promote micro-irrigation subsidies (up to 85% cost coverage) in blocks showing high groundwater stress.
• **Query Resolved**: "${query}" logged under regional policy planning parameters.

*(Note: Live Gemini inference is currently offline. Running local policy planner)*`;
  }

  if (role === "admin") {
    return `### Admin Console - Global System Infrastructure parameters (प्रशासक नियंत्रण)
• **Active Security Policies**: IAM credentials verified. System SLA compliance stands at **99.98%**.
• **Cluster Performance**: API gateway latency averages **42ms**. Database connections pool: 18/50 active nodes.
• **Telemetry Query**: "${query}" audited under system control access parameters.

*(Note: Live Gemini inference is currently offline. Running local admin console)*`;
  }

  if (role === "company") {
    return `### Enterprise B2B Performance & Revenue Dashboard (कॉर्पोरेट व्यवसाय कंसोल)
• **Contract Compliance**: Dynamic SLA audit confirms **98.2% on-time logistics delivery** across all procurement zones.
• **Revenue Projections**: Q3 enterprise runway indicates a **14.5% year-on-year growth** in digitized mandi trades.
• **Business Command**: Processing query "${query}" under corporate business strategy parameters.

*(Note: Live Gemini inference is currently offline. Running local corporate revenue planner)*`;
  }

  return `### AgroIndia Operations Ledger (कृषि एआई सलाहकार)
• **Active Role Perspective**: Custom role perspective **${roleUpper}** verified.
• **Operational Recommendation**: Focus on monitoring soil health indices, crop water demands, and APMC market arrivals.
• **Bilingual Detail**: Keep records aligned with regional standards.

*(Note: Live Gemini inference is currently offline. Reviewing local parameters)*`;
}


// ROLE-SPECIFIC INITIAL HISTORICAL CHATS PROFILE DICTIONARY
const roleHistoricalChatsMatrix = {
  farmer: [
    {
      id: "chat_1",
      title: "Rice Blast Diagnosis",
      pinned: true,
      model: "AgroAI v4.2",
      location: "Field Block A",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "Based on the visual data you provided from Field Block A, the lesions on the leaves exhibit classic diamond-shaped, necrotic centers with reddish-brown borders. This is highly indicative of **Rice Blast (Magnaporthe oryzae)**.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "msg_2",
          sender: "user",
          text: "What is the recommended treatment protocol, and what would be the estimated cost for covering 50 hectares?",
          timestamp: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
        },
        {
          id: "msg_3",
          sender: "ai",
          text: "I recommend applying a systemic fungicide like **Tricyclazole 75% WP**.",
          timestamp: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
          quickActions: [
            {
              label: "Check alternative fungicides",
              action: "alternative_fungicides",
            },
            { label: "Best time of day to apply?", action: "best_time" },
          ],
        },
      ],
    },
    {
      id: "chat_2",
      title: "Q3 Yield Projections",
      pinned: true,
      model: "AgroAI v4.2",
      location: "Dashboard",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "Projections show a **12% increase** compared to last year.",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ],
  fpo: [
    {
      id: "chat_1",
      title: "Bulk Fertilizer Pool Logistics",
      pinned: true,
      model: "AgroAI v4.2",
      location: "Procurement Desk",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "Urea order requirements for **Cluster B** have been aggregated to 120 Tons. Ready for forward clearance allocations.",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ],
  fpo_manager: [
    {
      id: "chat_1",
      title: "Bulk Fertilizer Pool Logistics",
      pinned: true,
      model: "AgroAI v4.2",
      location: "Procurement Desk",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "Urea order requirements for **Cluster B** have been aggregated to 120 Tons. Ready for forward clearance allocations.",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ],
  trader: [
    {
      id: "chat_1",
      title: "Jeera Volumetric Spikes",
      pinned: true,
      model: "AgroAI v4.2",
      location: "Unjha Mandi Desk",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "Arrival rates for Jeera at Unjha APMC have spiked **22% above the 5-year seasonal moving average** this morning, driving local resistance spreads downward.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: "msg_2",
          sender: "user",
          text: "Should I hold my current long positions or execute off-mandi sales?",
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        },
        {
          id: "msg_3",
          sender: "ai",
          text: "Historical trend analysis implies that a volume surge of this size caps margins within 48 hours. I recommend hedging via partial off-mandi forward trades.",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          quickActions: [
            { label: "View Price Spreads", action: "spreads" },
            { label: "Check Indore Rates", action: "indore" },
          ],
        },
      ],
    },
    {
      id: "chat_2",
      title: "Arbitrage Margin Optimization",
      pinned: true,
      model: "AgroAI v4.2",
      location: "Arbitrage Scanner",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "Net pricing spread between Akola and Pune for Soybeans has hit **₹140/quintal**, crossing your priority trigger bounds.",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ],
  procurement: [
    {
      id: "chat_1",
      title: "Moisture Variance Boundaries",
      pinned: true,
      model: "AgroAI v4.2",
      location: "Gate Analyzer Node 2",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "Incoming lots from Zone 3 show average humidity values near **14.8%**. Tighten sampling gates to maintain quality bounds.",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ],
  researcher: [
    {
      id: "chat_1",
      title: "Phenotypic Variance Matrix",
      pinned: true,
      model: "AgroAI v4.2",
      location: "Plot Variant-B Log",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "ANOVA cross-variable analysis maps a statistically significant delta ($p < 0.01$) in nitrogen assimilation profiles.",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ],
  government: [
    {
      id: "chat_1",
      title: "Drought Mitigation Budgets",
      pinned: true,
      model: "AgroAI v4.2",
      location: "District 4 Allocation",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: "msg_1",
          sender: "ai",
          text: "Disbursement metrics flag groundwater table dips below baseline safety minimums across four structural blocks.",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ],
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  const diffHours = Math.floor((now - date) / 3600000);
  const diffDays = Math.floor((now - date) / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const renderMarkdown = (text, isUser = false) => {
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h3
          key={idx}
          className="text-xs font-black mt-3 mb-1.5 text-gray-900 uppercase tracking-wider"
        >
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("• ")) {
      return (
        <li
          key={idx}
          className={`text-xs ml-4 font-semibold my-0.5 ${isUser ? "text-gray-800" : "text-gray-700"}`}
        >
          {line.slice(2)}
        </li>
      );
    }
    if (line.trim()) {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const rendered = parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-gray-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
      return (
        <p
          key={idx}
          className="text-xs leading-relaxed my-0.5 text-gray-700 font-semibold"
        >
          {rendered}
        </p>
      );
    }
    return <br key={idx} />;
  });
};

export default function AIChatInterface() {
  const { activeRole } = useRole();
  const currentRoleKey = activeRole
    ? activeRole.toLowerCase().trim()
    : "farmer";
  const storageKey = `agroanalytics_chats_${currentRoleKey}`;

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const prevActiveChatIdRef = useRef(activeChatId);
  const locationState = useLocation().state;
  const hasProcessedRef = useRef(false);

  const createDefaultConversationObj = useCallback(() => {
    const roleLabels = {
      farmer: "Crop Optimization & Disease Diagnostics Workspace",
      fpo: "FPO Aggregation & Logistics Orchestration Console",
      fpo_manager: "FPO Aggregation & Logistics Orchestration Console",
      trader: "Mandi Arbitrage & Price Forecasting Ledger",
      procurement: "Bulk Sourcing & Supply Chain Gate Pass Matrix",
      researcher: "Scientific Literature Summarization & Plot Analytics Engine",
      government: "Regional Subsidy Tracking & Geospatial Estimation Dashboard",
      admin: "Global Infrastructure Access & System Parameter Workspace",
      company: "Enterprise B2B Performance & Revenue Runway Engine",
    };

    return {
      id: `${currentRoleKey}_default_${generateId()}`,
      title: "Initial Chat Workspace",
      pinned: false,
      model: "AgroAI v4.2 Core",
      location: "System Provisioning",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${generateId()}`,
          sender: "ai",
          text: `Welcome to your dedicated operational space. System parameters have loaded successfully.\n\n### Active Hub\n• Workspace: ${roleLabels[currentRoleKey] || "General Operations Layer"}\n• Secure Channel Access Token: Verified\n\nQuery conversational vectors below to run diagnostics or pull reports.`,
          timestamp: new Date().toISOString(),
          quickActions: [
            { label: "Initialize System Audit", action: "audit" },
            { label: "Review Parameter Constraints", action: "constraints" },
          ],
        },
      ],
    };
  }, [currentRoleKey]);

  const handleNewChat = useCallback(() => {
    const freshChatNode = {
      id: `${currentRoleKey}_chat_${generateId()}`,
      title: "New Conversation",
      pinned: false,
      model: "AgroAI v4.2",
      location: "Active Thread",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${generateId()}`,
          sender: "ai",
          text: `Custom assistant interface initialized for role: **${currentRoleKey.toUpperCase()}**. Submit statements or attach logs below.`,
          timestamp: new Date().toISOString(),
          quickActions: [
            { label: "Run Data Sync", action: "sync" },
            { label: "Check Structural Spreads", action: "spreads" },
          ],
        },
      ],
    };
    setChats((prev) => [freshChatNode, ...prev]);
    setActiveChatId(freshChatNode.id);
  }, [currentRoleKey]);

  // Synchronous Data Rehydration and Target Mapping Layer
  useEffect(() => {
    hasProcessedRef.current = false;
    let localKeyData = localStorage.getItem(storageKey);
    let workspaceSet = [];

    if (localKeyData) {
      workspaceSet = JSON.parse(localKeyData);
    } else {
      // Pull history matching the active chosen operational perspective route profile arrays
      const explicitRoleHistory =
        roleHistoricalChatsMatrix[currentRoleKey] || [];

      if (explicitRoleHistory.length > 0) {
        workspaceSet = explicitRoleHistory.map((chat) => ({
          ...chat,
          id: `${currentRoleKey}_${chat.id}`, // Append dynamic segment tracking parameters
        }));
      } else {
        workspaceSet = [createDefaultConversationObj()];
      }

      localStorage.setItem(storageKey, JSON.stringify(workspaceSet));
    }

    setChats(workspaceSet);
    if (workspaceSet.length > 0) {
      if (
        locationState &&
        locationState.chatId &&
        !String(locationState.chatId).startsWith("chat_history_")
      ) {
        const targetedMatch = workspaceSet.find(
          (c) => c.id === locationState.chatId,
        );
        setActiveChatId(
          targetedMatch ? locationState.chatId : workspaceSet[0].id,
        );
      } else {
        setActiveChatId(workspaceSet[0].id);
      }
    }

    if (locationState && !hasProcessedRef.current) {
      hasProcessedRef.current = true;
      if (locationState.newChat) {
        setTimeout(() => handleNewChat(), 50);
      } else if (locationState.executePrompt) {
        const newChatId = `${currentRoleKey}_chat_${generateId()}`;
        const userMsg = {
          id: `msg_${generateId()}`,
          sender: "user",
          text: locationState.executePrompt,
          timestamp: new Date().toISOString(),
        };
        const newChatNode = {
          id: newChatId,
          title: locationState.executePrompt.slice(0, 26) + (locationState.executePrompt.length > 26 ? "..." : ""),
          pinned: false,
          model: "AgroAI v4.2",
          location: "Deep Link Trigger",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [userMsg],
        };
        setChats((prev) => [newChatNode, ...prev]);
        setActiveChatId(newChatId);
        setIsTyping(true);

        const systemPrompt = `You are AgroIndia, an advanced, highly specialized AI assistant customized for the active role: "${currentRoleKey.toUpperCase()}".
        Provide expert agricultural, logistical, commercial, or administrative reasoning and advice customized precisely to the active role perspective.
        Structure your response using premium markdown layouts (headings, bold, lists, alerts) to present dense, premium calculations or directions. Return a Hinglish explanation alongside standard English translations.`;

        (async () => {
          try {
            const responseText = await generateContent(locationState.executePrompt, {
              model: "gemini-3.1-flash-lite",
              temperature: 0.45,
              maxOutputTokens: 1000,
              system_instruction: systemPrompt
            });

            const aiMsg = {
              id: `msg_${generateId()}`,
              sender: "ai",
              text: responseText,
              timestamp: new Date().toISOString(),
              quickActions: [
                { label: "Export Workspace Log", action: "export" },
                { label: "Verify Alternative Bounds", action: "alt_paths" },
              ],
            };

            setChats((prev) =>
              prev.map((chat) =>
                chat.id === newChatId
                  ? {
                      ...chat,
                      messages: [...chat.messages, aiMsg],
                      updatedAt: new Date().toISOString(),
                    }
                  : chat,
              ),
            );
          } catch (error) {
            console.error("Gemini API Error, using fallback:", error);
            const fallbackText = getDynamicFallback(locationState.executePrompt, currentRoleKey);
            
            const aiMsg = {
              id: `msg_${generateId()}`,
              sender: "ai",
              text: fallbackText,
              timestamp: new Date().toISOString(),
              quickActions: [
                { label: "Export Workspace Log", action: "export" },
                { label: "Verify Alternative Bounds", action: "alt_paths" },
              ],
            };

            setChats((prev) =>
              prev.map((chat) =>
                chat.id === newChatId
                  ? {
                      ...chat,
                      messages: [...chat.messages, aiMsg],
                      updatedAt: new Date().toISOString(),
                    }
                  : chat,
              ),
            );
          } finally {
            setIsTyping(false);
          }
        })();
      } else if (
        locationState.chatId &&
        String(locationState.chatId).startsWith("chat_history_")
      ) {
        const indexMatch = workspaceSet.find(
          (c) => c.id === locationState.chatId,
        );
        if (indexMatch) {
          setActiveChatId(locationState.chatId);
        } else {
          const historicalRehydratedNode = {
            id: locationState.chatId,
            title: locationState.title || "Restored Conversation Log",
            pinned: false,
            model: "AgroAI v4.2",
            location: locationState.topic || "Archive Sync",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
              {
                id: `msg_${generateId()}`,
                sender: "user",
                text: `Pull contextual logs for node reference point: ${locationState.title || "AgroAnalytics Discussion"}`,
                timestamp: new Date(Date.now() - 30000).toISOString(),
              },
              {
                id: `msg_${generateId()}`,
                sender: "ai",
                text: `Session log index successfully rehydrated down to workspace frames.\n\n• Log Category: ${locationState.topic || "General Operational Analysis"}\n• Messages Cached: ${locationState.messagesCount || 4} elements recorded.`,
                timestamp: new Date().toISOString(),
              },
            ],
          };
          setChats((prev) => [historicalRehydratedNode, ...prev]);
          setActiveChatId(locationState.chatId);
        }
      }
    }
  }, [
    currentRoleKey,
    storageKey,
    locationState,
    handleNewChat,
    createDefaultConversationObj,
  ]);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(chats));
    }
  }, [chats, storageKey]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  useEffect(() => {
    if (messagesContainerRef.current && activeChat) {
      const isSwitch = prevActiveChatIdRef.current !== activeChatId;
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: isSwitch ? "auto" : "smooth",
      });
      prevActiveChatIdRef.current = activeChatId;
    }
  }, [activeChatId, chats, activeChat, isTyping]);

  const updateChatTitle = useCallback((chatId, userMessage) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (
          chat.id === chatId &&
          (chat.title === "New Conversation" ||
            chat.title === "Initial Chat Workspace")
        ) {
          return {
            ...chat,
            title:
              userMessage.length > 26
                ? userMessage.slice(0, 26) + "..."
                : userMessage,
            updatedAt: new Date().toISOString(),
          };
        }
        if (chat.id === chatId) {
          return { ...chat, updatedAt: new Date().toISOString() };
        }
        return chat;
      }),
    );
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeChatId || isTyping) return;

    const userMsg = {
      id: `msg_${generateId()}`,
      sender: "user",
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMsg],
              updatedAt: new Date().toISOString(),
            }
          : chat,
      ),
    );

    const backupMsgStr = inputMessage.trim();
    setInputMessage("");
    setIsTyping(true);
    updateChatTitle(activeChatId, backupMsgStr);

    const systemPrompt = `You are AgroIndia, an advanced, highly specialized AI assistant customized for the active role: "${currentRoleKey.toUpperCase()}".
    Provide expert agricultural, logistical, commercial, or administrative reasoning and advice customized precisely to the active role perspective:
    - FARMER: Agronomic advice, crop disease diagnostics, soil telemetry.
    - FPO: Aggregate yield logistics, member directories, bulk seed/input purchase pooling.
    - TRADER: Mandi bidding, arbitrage spreads between APMC markets, arrival volume predictions.
    - PROCUREMENT: moisture analysis pass validation, gate pass log tickets, silo capacities.
    - RESEARCHER: Scientific trial observe metrics, PDF report analysis, citation building.
    - GOVERNMENT: Subsidy payouts, satellite estimation, drought risk compliance checks.
    - ADMIN: IAM role access profiles, cluster pool metrics, system constraints limits.
    - COMPANY: B2B partner revenue metrics, node SLA audits, enterprise strategy.
    
    Structure your response using premium markdown layouts (headings, bold, lists, alerts) to present dense, premium calculations or directions. Return a Hinglish explanation alongside standard English translations. Keep a professional and supportive tone.`;

    try {
      const responseText = await generateContent(backupMsgStr, {
        model: "gemini-3.1-flash-lite",
        temperature: 0.45,
        maxOutputTokens: 1000,
        system_instruction: systemPrompt,
      });

      const aiResponseMsgObj = {
        id: `msg_${generateId()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toISOString(),
        quickActions: [
          { label: "Export Workspace Log", action: "export" },
          { label: "Verify Alternative Bounds", action: "alt_paths" },
        ],
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiResponseMsgObj],
                updatedAt: new Date().toISOString(),
              }
            : chat,
        ),
      );
    } catch (err) {
      console.warn("Gemini API Request failed, using client-side Hinglish fallback:", err);
      const fallbackText = getDynamicFallback(backupMsgStr, currentRoleKey);

      const aiResponseMsgObj = {
        id: `msg_${generateId()}`,
        sender: "ai",
        text: fallbackText,
        timestamp: new Date().toISOString(),
        quickActions: [
          { label: "Export Workspace Log", action: "export" },
          { label: "Verify Alternative Bounds", action: "alt_paths" },
        ],
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiResponseMsgObj],
                updatedAt: new Date().toISOString(),
              }
            : chat,
        ),
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action, label) => {
    setInputMessage(label);
    inputRef.current?.focus();
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    const cleanRemaining = chats.filter((chat) => chat.id !== chatId);
    if (cleanRemaining.length === 0) {
      setChats([createDefaultConversationObj()]);
    } else {
      setChats(cleanRemaining);
      if (activeChatId === chatId) {
        setActiveChatId(cleanRemaining[0].id);
      }
    }
  };

  const handleTogglePin = (chatId, e) => {
    e.stopPropagation();
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat,
      ),
    );
  };

  const getGroupedChats = () => {
    // Enforce role separation inside sidebar list rendering
    const roleSpecificChats = chats.filter(
      (chat) =>
        chat.id.startsWith(`${currentRoleKey}_`) ||
        chat.id.startsWith("chat_history_"),
    );

    const pinned = roleSpecificChats.filter((chat) => chat.pinned);
    const unpinned = roleSpecificChats.filter((chat) => !chat.pinned);
    const today = [],
      yesterday = [],
      last7Days = [],
      older = [];

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    unpinned.forEach((chat) => {
      const dateVal = new Date(chat.updatedAt);
      if (dateVal >= todayStart) today.push(chat);
      else if (dateVal >= yesterdayStart) yesterday.push(chat);
      else if (dateVal >= weekStart) last7Days.push(chat);
      else older.push(chat);
    });

    return { pinned, today, yesterday, last7Days, older };
  };

  const currentGroupedSet = getGroupedChats();
  const executeFilterMatch = (arr) =>
    arr.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white border border-gray-200/60 shadow-xs overflow-hidden rounded-2xl font-sans">
      {/* Sidebar History Panel */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-4 flex flex-col gap-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-[#31572c] hover:bg-gray-50/50 text-gray-700 font-bold text-xs py-2.5 px-4 rounded-xl transition duration-150 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-gray-500" />
            <span>New Chat</span>
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search history stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-8 pr-3 font-semibold focus:outline-none focus:border-brand-medium/40"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-4 custom-scroll">
          {["Pinned", "Today", "Yesterday", "Last 7 Days", "Older"].map(
            (name) => {
              const dictionaryKey =
                name === "Last 7 Days" ? "last7Days" : name.toLowerCase();
              const matchedArrayData = executeFilterMatch(
                currentGroupedSet[dictionaryKey] || [],
              );
              if (matchedArrayData.length === 0) return null;

              return (
                <div key={name}>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-1.5">
                    {name}
                  </div>
                  {matchedArrayData.map((c) => (
                    <HistoryItem
                      key={c.id}
                      chat={c}
                      isActive={c.id === activeChatId}
                      onClick={() => setActiveChatId(c.id)}
                      onPin={(e) => handleTogglePin(c.id, e)}
                      onDelete={(e) => handleDeleteChat(c.id, e)}
                    />
                  ))}
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Main Workspace Frame Stream */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activeChat && (
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                {activeChat.title}
                {activeChat.pinned && (
                  <Pin className="w-3.5 h-3.5 text-brand-medium fill-current" />
                )}
              </h1>
              <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider flex items-center gap-1.5">
                <span>Model: {activeChat.model}</span>
                <span className="text-gray-200 font-normal">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  Context: {activeChat.location}
                </span>
              </p>
            </div>
          </div>
        )}

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fa]/30 custom-scroll"
        >
          {activeChat?.messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-messageIn`}
            >
              <div
                className={`flex items-start gap-3.5 max-w-2xl ${m.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${m.sender === "user" ? "bg-gray-100 border border-gray-200/50 text-gray-600" : "bg-brand-dark text-white"}`}
                >
                  {m.sender === "user" ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="space-y-1">
                  <div
                    className={`flex items-center gap-2 ${m.sender === "user" ? "justify-end" : ""}`}
                  >
                    <span className="text-[11px] font-black text-gray-900">
                      {m.sender === "user"
                        ? "Operator Node"
                        : "AgroAnalytics Copilot"}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(m.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`rounded-2xl p-4 shadow-2xs border ${m.sender === "user" ? "bg-[#eef3eb] text-gray-900 border-[#31572c]/10 rounded-tr-none" : "bg-white text-gray-700 border-gray-100 rounded-tl-none"}`}
                  >
                    {renderMarkdown(m.text, m.sender === "user")}
                  </div>
                  {m.quickActions && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {m.quickActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() =>
                            handleQuickAction(act.action, act.label)
                          }
                          className="text-[11px] font-bold bg-brand-dark/5 hover:bg-brand-dark/10 text-[#31572c] border border-[#31572c]/10 px-3.5 py-1.5 rounded-full transition duration-150 cursor-pointer flex items-center gap-0.5"
                        >
                          {act.label}
                          <ArrowUpRight className="w-3 h-3 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-center gap-2 text-gray-400 text-xs font-bold animate-pulse pl-12">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span>Compiling workspace metrics...</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Query data models under execution layer [${currentRoleKey.toUpperCase()}]...`}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-4 pr-20 font-semibold focus:outline-none focus:border-[#31572c]"
              />
              <div className="absolute right-3 flex items-center gap-2 text-gray-400">
                <button className="hover:text-gray-600 cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="hover:text-gray-600 cursor-pointer">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-[#132a13] hover:bg-brand-dark disabled:opacity-40 text-white w-12 h-11 rounded-xl flex items-center justify-center transition flex-shrink-0 shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const HistoryItem = ({ chat, isActive, onClick, onPin, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between mx-1 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-xs font-semibold ${isActive ? "bg-[#ecf39e]/40 text-gray-900 border-l-4 border-[#31572c]" : "text-gray-600 hover:bg-gray-50"}`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {chat.pinned && (
          <Pin className="w-3 h-3 text-brand-medium flex-shrink-0 fill-current" />
        )}
        <span className="truncate pr-1">{chat.title}</span>
      </div>
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={onPin}
          className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <Pin className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
