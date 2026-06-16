export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return "Kharif";
  if (month >= 11 || month <= 3) return "Rabi";
  return "Zaid";
};

export const getQuickActions = (role) => {
  const actionsByRole = {
    farmer: [
      {
        title: "Diagnose Crop Disease",
        description: "Upload photos for instant analysis",
        key: "crop",
      },
      {
        title: "Check Mandi Prices",
        description: "Live rates for Pune APMC",
        key: "market",
      },
      {
        title: "Irrigation Planning",
        description: "Schedule based on soil moisture",
        key: "weather",
      },
      {
        title: "Government Schemes",
        description: "Explore eligible subsidies",
        key: "scheme",
      },
    ],
    fpo: [
      {
        title: "Member Directory",
        description: "Manage aggregated farmers data",
        key: "fpo",
      },
      {
        title: "Bulk Purchase Pools",
        description: "Review input orders tracking",
        key: "procurement",
      },
      {
        title: "Inventory Pipeline",
        description: "Check current warehouse stock",
        key: "market",
      },
      {
        title: "Credit Score Modeler",
        description: "Assess member risk profiles",
        key: "scheme",
      },
    ],
    trader: [
      {
        title: "Live Market Bidding",
        description: "Access open spot auction lines",
        key: "market",
      },
      {
        title: "Arbitrage Scanner",
        description: "Compare multi-region pricing spreads",
        key: "market",
      },
      {
        title: "Arrival Projections",
        description: "Forecast volume spikes",
        key: "weather",
      },
      {
        title: "Counterparty Audits",
        description: "Verify transaction scorecards",
        key: "crop",
      },
    ],
    procurement: [
      {
        title: "Moisture Content Check",
        description: "Log gate arrival analysis parameters",
        key: "crop",
      },
      {
        title: "Silo Capacity Matrix",
        description: "Monitor structural load status",
        key: "weather",
      },
      {
        title: "Gate Pass Desk",
        description: "Generate transport entry keys",
        key: "scheme",
      },
      {
        title: "Supplier Performance",
        description: "Review lot validation histories",
        key: "fpo",
      },
    ],
    researcher: [
      {
        title: "PDF Summary Engine",
        description: "Extract data from agronomy trials",
        key: "default",
      },
      {
        title: "Cross-Paper Analytics",
        description: "Compare biological test groups",
        key: "default",
      },
      {
        title: "Phenotypic Parameter Logs",
        description: "Record plot test observation values",
        key: "crop",
      },
      {
        title: "Citation Builder",
        description: "Compile technical references",
        key: "scheme",
      },
    ],
    government: [
      {
        title: "Geospatial Estimation",
        description: "Satellite crop yield models",
        key: "weather",
      },
      {
        title: "Subsidy Tranche Tracker",
        description: "Monitor regional disbursement runs",
        key: "scheme",
      },
      {
        title: "Disaster Risk Maps",
        description: "Evaluate weather impact values",
        key: "weather",
      },
      {
        title: "Price Cap Controls",
        description: "Audit market baseline bounds",
        key: "market",
      },
    ],
    admin: [
      {
        title: "User IAM Profiles",
        description: "Manage framework permission tokens",
        key: "default",
      },
      {
        title: "Telemetry Logs",
        description: "Track prompt evaluation engine performance",
        key: "default",
      },
      {
        title: "Config Allocations",
        description: "Calibrate micro-system limits",
        key: "scheme",
      },
      {
        title: "System Maintenance",
        description: "Check cluster pool operational status",
        key: "weather",
      },
    ],
    company: [
      {
        title: "Revenue Runway Logs",
        description: "Track B2B enterprise performance metrics",
        key: "market",
      },
      {
        title: "Node SLA Infractions",
        description: "Monitor cluster distribution logs",
        key: "default",
      },
      {
        title: "Client Contracts Desk",
        description: "Review strategic partner parameters",
        key: "scheme",
      },
      {
        title: "Macro Market Shifts",
        description: "Evaluate agricultural trend indexes",
        key: "market",
      },
    ],
  };

  return actionsByRole[role] || actionsByRole.farmer;
};

export const getDashboardStats = (role) => {
  const statsByRole = {
    farmer: [
      { title: "Crop Health Score", value: "92%" },
      { title: "Active Alerts", value: "2" },
      { title: "Soil Moisture", value: "42%" },
      { title: "Est. Harvest Days", value: "24" },
    ],
    fpo: [
      { title: "Enrolled Farmers", value: "1,240" },
      { title: "Aggregate Stock", value: "450 Tons" },
      { title: "Pending Procurement", value: "14" },
      { title: "Disbursed Payouts", value: "₹4.2M" },
    ],
    trader: [
      { title: "Active Bids Placed", value: "8" },
      { title: "Daily Trade Volume", value: "85 Tons" },
      { title: "Market Trend Index", value: "+4.2%" },
      { title: "Fulfilled Orders", value: "142" },
    ],
    procurement: [
      { title: "Mandi Gate Status", value: "Active" },
      { title: "Weighbridge Queue", value: "12 Trucks" },
      { title: "Moisture Pass Rate", value: "94.5%" },
      { title: "Daily Target Met", value: "78%" },
    ],
    researcher: [
      { title: "Active Trial Plots", value: "6" },
      { title: "Efficacy Index Score", value: "0.88" },
      { title: "Sample Batches", value: "34" },
      { title: "Publications Pending", value: "1" },
    ],
    government: [
      { title: "Subsidy Disbursed", value: "82%" },
      { title: "Mandi Verification", value: "99.1%" },
      { title: "Registered Yield", value: "14.2K T" },
      { title: "Drought/Risk Level", value: "Low" },
    ],
    admin: [
      { title: "System Uptime", value: "99.98%" },
      { title: "API Sessions Rate", value: "3.4k/m" },
      { title: "Open Desk Tickets", value: "5" },
      { title: "Database Load", value: "14%" },
    ],
    company: [
      { title: "Enterprise Revenue", value: "₹12.4M" },
      { title: "Client B2B Nodes", value: "48" },
      { title: "Fulfillment Rate", value: "96.4%" },
      { title: "SLA Violations", value: "0" },
    ],
  };

  return statsByRole[role] || statsByRole.farmer;
};

export const getRecentChats = (role) => {
  const chatsByRole = {
    farmer: [
      {
        id: "c1",
        title: "Rice Blast Prevention",
        subtitle:
          "What are the early signs of blast disease in Indrayani rice?",
        time: "2 hrs ago",
        type: "crop",
      },
      {
        id: "c2",
        title: "Wheat Price Forecast",
        subtitle: "Is it a good time to sell Lokwan wheat in Pune market?",
        time: "Yesterday",
        type: "market",
      },
      {
        id: "c3",
        title: "PM Kisan Installment Status",
        subtitle: "How do I check if my 14th installment is credited?",
        time: "Oct 24",
        type: "scheme",
      },
      {
        id: "c4",
        title: "Unseasonal Rain Prep",
        subtitle: "Precautions for harvested soybeans if it rains tomorrow?",
        time: "Oct 20",
        type: "weather",
      },
    ],
    fpo: [
      {
        id: "c1",
        title: "Bulk Fertilizer Pool Logistics",
        subtitle: "How do we aggregate orders for Cluster B urea distribution?",
        time: "1 hr ago",
        type: "procurement",
      },
      {
        id: "c2",
        title: "Mandi Registration Onboarding",
        subtitle: "What documentation parameters apply to e-mandi creation?",
        time: "3 hrs ago",
        type: "market",
      },
      {
        id: "c3",
        title: "Drone Subsidy Allocations",
        subtitle: "Can our FPO secure a structural financial coverage grant?",
        time: "Yesterday",
        type: "scheme",
      },
    ],
    trader: [
      {
        id: "c1",
        title: "Jeera Volumetric Spikes",
        subtitle:
          "Are arrival rates in Unjha exceeding standard seasonal averages?",
        time: "15 mins ago",
        type: "market",
      },
      {
        id: "c2",
        title: "Arbitrage Margin Optimization",
        subtitle:
          "What is the net spread variance metrics between target mandis?",
        time: "4 hrs ago",
        type: "market",
      },
    ],
    procurement: [
      {
        id: "c1",
        title: "Moisture Variance Boundaries",
        subtitle:
          "Are baseline moisture criteria relaxed for delayed rabi crops?",
        time: "10 mins ago",
        type: "crop",
      },
      {
        id: "c2",
        title: "Weighbridge Tolerance Exception",
        subtitle: "Log rules for handling systemic truck weight data logs.",
        time: "2 hrs ago",
        type: "weather",
      },
    ],
    researcher: [
      {
        id: "c1",
        title: "Phenotypic Variance Matrix",
        subtitle:
          "Run multi-variable ANOVA structures across localized trial plots.",
        time: "1 day ago",
        type: "crop",
      },
      {
        id: "c2",
        title: "Blight Genomic Isolations",
        subtitle:
          "Compare structural DNA traits matching infected leaf strains.",
        time: "3 days ago",
        type: "default",
      },
    ],
    government: [
      {
        id: "c1",
        title: "Drought Mitigation Budgets",
        subtitle:
          "Review active emergency fund liquidity limits for District 4.",
        time: "2 hrs ago",
        type: "scheme",
      },
      {
        id: "c2",
        title: "Mandi Compliance Ledger",
        subtitle:
          "Flag configurations triggers tracking ceiling rate overrides.",
        time: "1 day ago",
        type: "market",
      },
    ],
    admin: [
      {
        id: "c1",
        title: "IAM Policy Upgrades",
        subtitle:
          "Modify security role assignments for local sector verification desks.",
        time: "5 mins ago",
        type: "default",
      },
      {
        id: "c2",
        title: "Database Re-Indexing",
        subtitle:
          "Monitor latency parameters across read replicas during sync frames.",
        time: "1 hr ago",
        type: "weather",
      },
    ],
    company: [
      {
        id: "c1",
        title: "Quarterly Target Runway",
        subtitle: "B2B performance projections vs annual planning data charts.",
        time: "4 hrs ago",
        type: "market",
      },
      {
        id: "c2",
        title: "SLA Validation Audit",
        subtitle:
          "Export log parameters identifying pipeline network latency spikes.",
        time: "1 day ago",
        type: "default",
      },
    ],
  };

  return chatsByRole[role] || chatsByRole.farmer;
};

export const getAiRecommendations = (role) => {
  const recommendationsByRole = {
    farmer: [
      {
        id: "r1",
        title: "High Blast Risk Detected",
        desc: "Weather conditions in Pune district are highly favorable for Rice Blast over the next 72 hours.",
        linkText: "View Preventive Measures",
        variant: "danger",
      },
      {
        id: "r2",
        title: "Irrigation Due Tomorrow",
        desc: "Soil moisture levels in Plot A (Sugarcane) are projected to drop below optimal threshold.",
        linkText: "Schedule Pump",
        variant: "warning",
      },
      {
        id: "r3",
        title: "Soybean Prices Peaking",
        desc: "Current APMC rates for Soybean are 5% above the weekly average. Good time to clear stock.",
        linkText: "View Market Trends",
        variant: "success",
      },
    ],
    fpo: [
      {
        id: "r1",
        title: "Consolidation Window Open",
        desc: "Cluster-A wheat harvest matches open B2B buyer specifications perfectly. Group lots now.",
        linkText: "Open Order Pool",
        variant: "success",
      },
      {
        id: "r2",
        title: "Credit Default Risk Warning",
        desc: "3 regional sub-members report high leverage flags on cross-loans. Hold input credit lines.",
        linkText: "Review Scorecards",
        variant: "danger",
      },
    ],
    trader: [
      {
        id: "r1",
        title: "Arbitrage Gap Identified",
        desc: "Maize prices in neighboring markets dropped 4%. Spreads leave room for a clear 2% margin.",
        linkText: "Secure Route Bids",
        variant: "success",
      },
      {
        id: "r2",
        title: "Logistics Block Ahead",
        desc: "Protests near state checkpoint NH-48 will impact incoming arrivals for the next 24 hours.",
        linkText: "View Alt Routes",
        variant: "danger",
      },
    ],
    procurement: [
      {
        id: "r1",
        title: "Silo Capacity Saturation",
        desc: "Storage Unit 2 will hit maximum load constraints within 6 truck drop-offs at current pass-rates.",
        linkText: "Reroute Incoming Trucks",
        variant: "danger",
      },
      {
        id: "r2",
        title: "Moisture Spikes Logged",
        desc: "Incoming lots from Zone 3 show average humidity values near 14.8%. Strict sampling recommended.",
        linkText: "Adjust Analyzer Gates",
        variant: "warning",
      },
    ],
    researcher: [
      {
        id: "r1",
        title: "Data Variance Anomaly",
        desc: "Plot Variant-B sample parameters show an unexpected standard deviation outlier in nitrogen assimilation.",
        linkText: "Recalibrate Sensors",
        variant: "warning",
      },
      {
        id: "r2",
        title: "New Publication Matched",
        desc: "An international study on similar blight variants was indexed today. Core genome overlaps found.",
        linkText: "Cross-Reference PDF",
        variant: "success",
      },
    ],
    government: [
      {
        id: "r1",
        title: "Water Scarcity Threshold",
        desc: "Groundwater data tracking layers indicate critical zone dips across 4 blocks in the Northern sector.",
        linkText: "Issue Safety Advisory",
        variant: "danger",
      },
      {
        id: "r2",
        title: "Mandi Target Met",
        desc: "District 2 registration goals have crossed the 95% metric milestone early for winter storage setup.",
        linkText: "View Compliance Summary",
        variant: "success",
      },
    ],
    admin: [
      {
        id: "r1",
        title: "Security Hotfix Required",
        desc: "System kernel identified socket handshake memory leak edge cases inside websocket layers.",
        linkText: "Deploy Patch v4.2.1",
        variant: "danger",
      },
      {
        id: "r2",
        title: "Cold Storage Sync",
        desc: "Data history logging tables are preparing for cloud storage partition archival.",
        linkText: "Confirm Archival Strategy",
        variant: "warning",
      },
    ],
    company: [
      {
        id: "r1",
        title: "Contract Renewal Critical",
        desc: "2 major distribution client service contract bounds expire within the upcoming fiscal tracking loop.",
        linkText: "Initiate Renewal Draft",
        variant: "warning",
      },
      {
        id: "r2",
        title: "SLA Compliance Clear",
        desc: "All system regional endpoints report optimal transactional pipeline parameters across the past month.",
        linkText: "Generate Client SLA Report",
        variant: "success",
      },
    ],
  };

  return recommendationsByRole[role] || recommendationsByRole.farmer;
};
