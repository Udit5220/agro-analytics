import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../../context/RoleContext";
import {
  Compass,
  AlertTriangle,
  TrendingUp,
  Award,
  Sliders,
  Search,
  X,
  Archive,
  ShieldAlert,
  ChevronDown,
  Zap,
  ChevronRight,
  FileText,
  Terminal,
  Activity,
  MessageSquare,
} from "lucide-react";

const getSelectedTabClasses = (id) => {
  switch (id) {
    case "all":
      return "bg-[#31572c] text-white border-[#31572c] shadow-sm";
    case "high":
      return "bg-red-600 text-white border-red-600 shadow-sm";
    case "market":
      return "bg-emerald-600 text-white border-emerald-600 shadow-sm";
    case "schemes":
      return "bg-amber-500 text-white border-amber-500 shadow-sm";
    case "operational":
      return "bg-blue-600 text-white border-blue-600 shadow-sm";
    default:
      return "bg-[#31572c] text-white border-[#31572c] shadow-sm";
  }
};

export default function AIRecommendations({ role = "farmer" }) {
  const { activeRole } = useRole();
  const navigate = useNavigate();

  const currentRole = activeRole || role;

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [checklistStates, setChecklistStates] = useState({});
  const [consoleQuery, setConsoleQuery] = useState("");

  const handleConsoleSubmit = (e) => {
    e.preventDefault();
    if (!consoleQuery.trim()) return;
    navigate(
      `/module/ai-assistant-1/chat-workspace?prompt=${encodeURIComponent(consoleQuery)}`,
    );
  };

  if (activeRole === "admin" || activeRole === "company") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white border border-gray-200/60 shadow-sm rounded-2xl max-w-2xl mx-auto my-8 animate-fadeIn font-sans">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
          Access Restricted
        </h2>
        <p className="text-xs font-semibold text-gray-500 mt-2 max-w-sm leading-relaxed">
          The AI Assistant & Copilot workspace is optimized for active field
          operators, traders, and agronomists. It is not available for Admin or
          Company profiles.
        </p>
      </div>
    );
  }

  // Unified Brand Platform Colors
  const brandColors = {
    darkest: "#132a13",
    dark: "#31572c",
    medium: "#4f772d",
    light: "#90a955",
    accent: "#ecf39e",
  };

  // Role configuration mapping aligned with platform colors
  const roleConfig = {
    farmer: {
      title: "Farmer AI Advisory Hub",
      subtitle: "Personalized agronomic insights for your farm",
      greetingName: "Ramesh Kumar",
      location: "Pune, Maharashtra",
      color: brandColors.dark,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18M3 12h18M5 5l14 14M5 19L14 10"
          />
        </svg>
      ),
    },
    fpo: {
      title: "FPO Intelligence Command",
      subtitle: "Collective insights for your farmer producer organization",
      greetingName: "FPO Collective",
      location: "Pune Region",
      color: brandColors.dark,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    agri_expert: {
      title: "Expert Advisor Dashboard",
      subtitle: "Professional insights for client advisory and region analysis",
      greetingName: "Agri Expert",
      location: "Pune District",
      color: brandColors.dark,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    govt_official: {
      title: "District Agri Intelligence Panel",
      subtitle: "Regional insights, policy adoption & emergency alerts",
      greetingName: "District Officer",
      location: "Pune, Maharashtra",
      color: brandColors.dark,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    government: {
      title: "District Agri Intelligence Panel",
      subtitle: "Regional insights, policy adoption & emergency alerts",
      greetingName: "District Officer",
      location: "Pune, Maharashtra",
      color: brandColors.dark,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    trader: {
      title: "Market Intelligence Terminal",
      subtitle: "Arbitrage alerts, price trends & procurement signals",
      greetingName: "Trader Desk",
      location: "Pune APMC",
      color: brandColors.dark,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    procurement: {
      title: "Supply Chain & Silo Operations",
      subtitle: "Sourcing optimization, quality tracking & capacity levels",
      greetingName: "Procurement Desk",
      location: "Silo Terminal 4",
      color: brandColors.dark,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    researcher: {
      title: "Agronomy Literature Research",
      subtitle: "Scientific summaries, plot trials & grant opportunities",
      greetingName: "Dr. A. K. Swaminathan",
      location: "Agronomy Research Lab",
      color: brandColors.dark,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
    },
  };

  // Unified theme classes referencing the brand green configurations
  const theme = {
    primaryText: "text-[#31572c]",
    primaryBg: "bg-[#31572c]/8 border-[#31572c]/15",
    accentBg: "bg-[#31572c]",
    btn: "bg-[#31572c] hover:bg-[#132a13] text-white focus:ring-0 active:scale-[0.98]",
    border: "border-gray-200/80 hover:border-[#31572c]/30",
    bgLight: "bg-[#31572c]/5",
    shadow: "shadow-sm",
  };

  const getRecommendationsForRole = (userRole) => {
    const baseRecommendations = {
      farmer: [
        {
          id: "alert_1",
          type: "urgent_disease",
          crop: "Rice",
          title: "Rice Blast Pathology Alert",
          description:
            "Weather conditions in Pune over the next 48 hours show 90%+ humidity levels, which are highly conducive to Rice Blast spore release. Immediate protective action required.",
          actionText: "Request Spray Schedule",
          actionLink: "/chat?prompt=Rice%20Blast%20Treatment",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Pathogen Warning",
          confidence: 94,
          yieldImpact: "Prevents 30% Crop Loss",
          actionable: true,
          checklist: [
            "Inspect lower leaf sheaths for grayish/brown diamond lesions",
            "Apply Tricyclazole 75% WP @ 0.6g/liter of clean water",
            "Maintain standing water depth at exactly 5cm to buffer leaf temperature",
            "Avoid top-dressing Nitrogen fertilizers until disease clears",
          ],
        },
        {
          id: "alert_2",
          type: "pest_alert",
          crop: "Maize",
          title: "Fall Armyworm Aggregation Alert",
          description:
            "Local agriculture scouts report confirmed Fall Armyworm (FAW) egg masses in maize fields within a 5km radius of your coordinates.",
          actionText: "Request Treatment Advice",
          actionLink: "/guides/fall-armyworm",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Pest Outbreak",
          confidence: 89,
          yieldImpact: "Prevents 25% Crop Loss",
          actionable: true,
          checklist: [
            "Conduct scouting along a 'W' shape pattern of 50 plants",
            "Identify leaf scraping (papery windows) and fecal matter in whorls",
            "Spray Emamectin Benzoate 5% SG @ 0.4g/liter during late afternoon (dusk)",
            "Install pheromone monitoring traps @ 5 traps/acre",
          ],
        },
        {
          id: "opportunity_1",
          type: "market_opportunity",
          crop: "Soybean",
          title: "Soybean Market Price Breakout",
          description:
            "Local mandi spot pricing has breached ₹5,300/quintal, trading at a 12% premium over Government MSP due to international export contracts.",
          actionText: "View Local Mandi Prices",
          actionLink: "/market/prices?crop=Soybean",
          severity: "info",
          bgColor: "bg-emerald-50/40",
          borderColor: "border-emerald-100/80",
          accentColor: "bg-[#31572c]",
          badge: "Price Premium",
          confidence: 91,
          yieldImpact: "+12% Profit Margin",
          actionable: true,
          checklist: [
            "Verify soybean moisture levels using a digital meter (aim for 10-12%)",
            "Grade harvested crop to remove chaff, broken grains, and trash",
            "Contact your local FPO coordinator for combined logistical transport",
            "Compare APMC spot prices on the Market Intelligence panel",
          ],
        },
        {
          id: "scheme_1",
          type: "government_scheme",
          crop: "All Crops",
          title: "PMFBY Kharif Enrollment Deadline",
          description:
            "Enrolment for the Pradhan Mantri Fasal Bima Yojana (PMFBY) insurance program for the upcoming Kharif cycle closes in 5 days.",
          actionText: "Enroll Digitally",
          actionLink: "/schemes/pmfby",
          severity: "warning",
          bgColor: "bg-amber-50/40",
          borderColor: "border-amber-100/80",
          accentColor: "bg-amber-500",
          badge: "Deadline Approaching",
          confidence: 98,
          yieldImpact: "100% Risk Cover",
          actionable: true,
          checklist: [
            "Download updated digitized land record registry (7/12 Extract)",
            "Request crop sowing certificate from the village Gram Sevak officer",
            "Visit the nearest Common Service Center or open the PMFBY portal",
            "Pay the nominal insurance premium of 2.0% of the sum insured",
          ],
        },
        {
          id: "irrigation_1",
          type: "irrigation_advisory",
          crop: "Sugarcane",
          title: "Sugarcane Evapotranspiration Alert",
          description:
            "Extreme heat warning for Pune district. Temperatures are forecasted to climb to 41°C. Crop water stress index is rising fast.",
          actionText: "Open Irrigation Planner",
          actionLink: "/module/irrigation",
          severity: "warning",
          bgColor: "bg-blue-50/40",
          borderColor: "border-blue-100/80",
          accentColor: "bg-blue-500",
          badge: "Water Stress Alert",
          confidence: 96,
          yieldImpact: "Protects Brix Content",
          actionable: true,
          checklist: [
            "Increase drip irrigation frequency (split watering into twice daily)",
            "Apply Sugarcane trash mulch in inter-rows to conserve soil moisture",
            "Spray 1% Soluble Potash (MOP) to boost crop drought tolerance",
            "Inspect main drip line filters for sand/mud blockage",
          ],
        },
      ],
      fpo: [
        {
          id: "fpo_alert_1",
          type: "collective_action",
          crop: "Fertilizers",
          title: "Bulk NPK Procurement Window",
          description:
            "Wholesale fertilizer imports are expected to climb by 8% next week due to global supply chain updates. Group orders must be dispatched within 72 hours.",
          actionText: "Verify Bulk Rates",
          actionLink: "/fpo/bulk-pricing",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Bulk Procurement",
          confidence: 92,
          yieldImpact: "Saves ₹45k in Input Costs",
          actionable: true,
          checklist: [
            "Send broadcast SMS notifications to all 142 member profiles",
            "Consolidate individual farmer Nitrogen, Phosphorus, and Potash requirements",
            "Draft wholesale order request and submit to IFFCO local cooperative",
            "Arrange central warehouse storage clearance for unloading",
          ],
        },
        {
          id: "fpo_alert_2",
          type: "market",
          crop: "Pigeon Pea",
          title: "Direct Corporate Buy Contract",
          description:
            "An institutional agribusiness group has submitted a purchase request for 500 MT of graded Pigeon Pea (Arhar) at Pune APMC with waived mandi fees.",
          actionText: "Register FPO Interest",
          actionLink: "/fpo/mandi-linkage",
          severity: "info",
          bgColor: "bg-emerald-50/40",
          borderColor: "border-emerald-100/80",
          accentColor: "bg-[#31572c]",
          badge: "B2B Arbitrage",
          confidence: 88,
          yieldImpact: "+15% Net Return Rate",
          actionable: true,
          checklist: [
            "Filter the member database for farmers with active Pigeon Pea fields",
            "Set up mechanical grain sorting grids at local collection hubs",
            "Perform random moisture analysis (target under 11.5% moisture)",
            "Sign logistics carrier transport contract for central terminal dispatch",
          ],
        },
        {
          id: "fpo_alert_3",
          type: "training_campaign",
          crop: "All Crops",
          title: "APEDA PGS-Organic Certification Workshop",
          description:
            "APEDA sponsored field audit preparation training for PGS-Organic certification standards is scheduled at the district office next Tuesday.",
          actionText: "Schedule Event",
          actionLink: "/fpo/organic-training",
          severity: "warning",
          bgColor: "bg-amber-50/40",
          borderColor: "border-amber-100/80",
          accentColor: "bg-amber-500",
          badge: "Capacity Building",
          confidence: 90,
          yieldImpact: "Enables Organic Premium",
          actionable: true,
          checklist: [
            "Book community hall space and coordinate audiovisual setup",
            "Send WhatsApp invite reminders to FPO block representatives",
            "Print standard PGS-Organic registration and land history forms",
            "Invite regional agriculture commissioner as chief trainer",
          ],
        },
        {
          id: "fpo_alert_4",
          type: "inventory_alert",
          crop: "Wheat Seeds",
          title: "Wheat Seed Inventory Deficit",
          description:
            "Pre-sowing warehouse audit shows certified HD-2967 seed inventories are 40% below projected member demand for Rabi cycle.",
          actionText: "Request NSC Stock",
          actionLink: "/fpo/seed-logistics",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Stock Deficit",
          confidence: 95,
          yieldImpact: "Prevents Sowing Delays",
          actionable: true,
          checklist: [
            "Verify physical seed bags in stock at FPO retail branches",
            "Log online request with National Seeds Corporation (NSC) for emergency supply",
            "Identify alternative high-yielding varieties (e.g. HD-3086) as backup allocation",
            "Notify block leaders regarding seed allocation changes",
          ],
        },
      ],
      agri_expert: [
        {
          id: "expert_alert_1",
          type: "advisory",
          crop: "Grapes",
          title: "Grape Downy Mildew Epidemic Threat",
          description:
            "Microclimate monitoring indicates an extended dew period and temperatures of 20-25°C. High probability of Grape Downy Mildew outbreak in Narayangaon block.",
          actionText: "Broadcast Advisory Card",
          actionLink: "/expert/risk-map",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Disease Warning",
          confidence: 93,
          yieldImpact: "Prevents Total Defoliation",
          actionable: true,
          checklist: [
            "Inspect grapes fields for translucent, oil-spot leaf lesions",
            "Advise farmers to apply Metalaxyl + Mancozeb @ 2g/liter of water",
            "Suggest removal of lower leaves to reduce microclimate humidity",
            "Host an online Q&A session on disease symptoms for local grape growers",
          ],
        },
        {
          id: "expert_alert_2",
          type: "advisory",
          crop: "Pomegranate",
          title: "Pomegranate Bacterial Blight Outbreak Risk",
          description:
            "Overlapping monsoon wind shifts are increasing risk scores for bacterial blight in drought-recovering pomegranate blocks.",
          actionText: "Dispatch Field Guide",
          actionLink: "/expert/blight-guide",
          severity: "warning",
          bgColor: "bg-amber-50/40",
          borderColor: "border-amber-100/80",
          accentColor: "bg-amber-500",
          badge: "Bacterial Blight",
          confidence: 89,
          yieldImpact: "Protects Skin Quality",
          actionable: true,
          checklist: [
            "Recommend immediate pruning of diseased stems and sealing with Bordeaux paste",
            "Suggest spraying Streptocycline @ 0.5g/liter combined with Copper Oxychloride",
            "Collect and destroy all fallen infected leaves to clean up soil spores",
            "Log field status photos in the crop advisory tracking dashboard",
          ],
        },
        {
          id: "expert_alert_3",
          type: "advisory",
          crop: "Cotton",
          title: "Integrated Sucking Pest Management (IPM)",
          description:
            "District bio-trials demonstrate that cold-pressed Neem Oil sprays (1500 ppm) show 78% mortality rates on early-stage jassids.",
          actionText: "View Trial Results",
          actionLink: "/expert/trials",
          severity: "info",
          bgColor: "bg-emerald-50/40",
          borderColor: "border-emerald-100/80",
          accentColor: "bg-[#31572c]",
          badge: "IPM Strategy",
          confidence: 90,
          yieldImpact: "Saves 30% Chemical Costs",
          actionable: true,
          checklist: [
            "Publish digital advisory details outlining chemical vs organic tradeoffs",
            "Distribute yellow sticky cards to farmers for monitoring aphid/thrip arrivals",
            "Conduct video call reviews with regional organic cotton groups",
            "Record IPM feedback data in the district advisory database",
          ],
        },
      ],
      government: [
        {
          id: "govt_alert_1",
          type: "pest_outbreak",
          crop: "Maize",
          title: "Fall Armyworm Outbreak Alert - Pune East",
          description:
            "Field surveillance confirm FAW incidence levels have crossed the 10% Economic Threshold Level (ETL) in five villages of Pune East block.",
          actionText: "Deploy Extension Officers",
          actionLink: "/govt/pest-tracker",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Emergency Intervention",
          confidence: 95,
          yieldImpact: "Saves District Yield",
          actionable: true,
          checklist: [
            "Assign agricultural extension workers to set up community control kiosks",
            "Distribute subsidized organic bio-pesticides to marginal farmers",
            "Conduct community meetings (Kisan Chaupals) on early pest management",
            "Draft outbreak control progress report for State Board review",
          ],
        },
        {
          id: "govt_alert_2",
          type: "scheme_adoption",
          crop: "All Crops",
          title: "PM-KUSUM Solar Pump Subsidy Tracking",
          description:
            "Pune district has distributed only 52% of its allocated Solar Irrigation Pump subsidies for the current fiscal quarter. Subsidies must be deployed.",
          actionText: "Review Subsidy Pipeline",
          actionLink: "/govt/subsidy-pipeline",
          severity: "warning",
          bgColor: "bg-amber-50/40",
          borderColor: "border-amber-100/80",
          accentColor: "bg-amber-500",
          badge: "Subsidy Under-budget",
          confidence: 91,
          yieldImpact: "Boosts Rural Infrastructure",
          actionable: true,
          checklist: [
            "Filter pending solar pump applications in the state service portal",
            "Expedite land ownership checks and banking documentation",
            "Approve deployment orders to selected panel manufacturers",
            "Review solar panel system geotags in completed fields",
          ],
        },
        {
          id: "govt_alert_3",
          type: "crop_estimation",
          crop: "Rice",
          title: "Kharif Paddy Acreage Analysis",
          description:
            "Satellite SAR crop scans indicate a 6.2% year-on-year expansion in paddy transplanting acreage across Pune district. Reserve stock targets must adapt.",
          actionText: "Open Acreage Mapping",
          actionLink: "/govt/crop-map",
          severity: "info",
          bgColor: "bg-emerald-50/40",
          borderColor: "border-emerald-100/80",
          accentColor: "bg-[#31572c]",
          badge: "Satellite Insights",
          confidence: 94,
          yieldImpact: "Informs District Food Security",
          actionable: true,
          checklist: [
            "Compare satellite classification estimates with physical reports from field offices",
            "Update district urea distribution buffers to match new paddy acreage coordinates",
            "Adjust seasonal procurement targets for food grain corporation stores",
            "Review reservoir release timelines with irrigation department managers",
          ],
        },
        {
          id: "govt_alert_4",
          type: "weather_hazard",
          crop: "All Crops",
          title: "Excessive Monsoon Rainfall Warning",
          description:
            "Meteorological models forecast a tropical depression bringing over 120mm of rainfall within 36 hours. Extreme threat of soil erosion and waterlogging.",
          actionText: "Broadcast Emergency Advisory",
          actionLink: "/govt/emergency-alerts",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Meteorological Alert",
          confidence: 97,
          yieldImpact: "Reduces Sowing Losses",
          actionable: true,
          checklist: [
            "Send immediate rain advisories via regional SMS and local channels",
            "Instruct farmers to open drainage ditches and halt fertilizer spray runs",
            "Close low-lying APMC open grain storage platforms to prevent spoilage",
            "Assemble block emergency support and compensation review desks",
          ],
        },
      ],
      trader: [
        {
          id: "trader_alert_1",
          type: "price",
          crop: "Soybean",
          title: "Soybean Price Breakout Analysis",
          description:
            "Daily Soybean spot prices have broken out past the resistance level of ₹5,200/quintal due to low arrivals in Central India mandis. Bullish trend likely.",
          actionText: "Open Trading Chart",
          actionLink: "/trader/analytics",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Price Breakout",
          confidence: 92,
          yieldImpact: "+8% Trading Margin",
          actionable: true,
          checklist: [
            "Perform warehouse stock count for immediate delivery commitments",
            "Monitor incoming trade arrivals across neighboring states",
            "Use futures hedges on NCDEX to lock in current margins",
            "Secure agreements with supply partners before spot rates rise further",
          ],
        },
        {
          id: "trader_alert_2",
          type: "price",
          crop: "Onions",
          title: "Onion Market Supply Correction",
          description:
            "A dry harvest window has led to a 25% surge in market arrivals in Pune APMC, triggering down pressure on wholesale spot pricing.",
          actionText: "Adjust Buying Rates",
          actionLink: "/trader/onions",
          severity: "warning",
          bgColor: "bg-amber-50/40",
          borderColor: "border-amber-100/80",
          accentColor: "bg-amber-500",
          badge: "Supply Glut",
          confidence: 94,
          yieldImpact: "Minimizes Sourcing Risk",
          actionable: true,
          checklist: [
            "Adjust target purchasing price lower to match APMC spot rates",
            "Accelerate shipment of stored onions to high-demand northern metro markets",
            "Check temperature and fan exhaust systems in storage silos",
            "Coordinate with shipping contractors to match incoming volumes",
          ],
        },
        {
          id: "trader_alert_3",
          type: "trade_opportunity",
          crop: "Chickpea",
          title: "Chickpea Grade-A Procurement Offer",
          description:
            "A major food manufacturer in Mumbai is offering a 10% premium for Chickpea (Kabuli Chana) batches tested under 10% moisture content.",
          actionText: "Open Sourcing Sheet",
          actionLink: "/trader/chickpea",
          severity: "info",
          bgColor: "bg-emerald-50/40",
          borderColor: "border-emerald-100/80",
          accentColor: "bg-[#31572c]",
          badge: "B2B Arbitrage",
          confidence: 90,
          yieldImpact: "+10% Price Premium",
          actionable: true,
          checklist: [
            "Contact local FPO procurement terminals with high-grade stocks",
            "Test incoming lots using digital moisture analyzers",
            "Pre-book bulk cargo train space for direct shipment to Mumbai",
            "Draft supply contract with buyer representatives",
          ],
        },
      ],
      procurement: [
        {
          id: "proc_1",
          type: "logistics",
          crop: "Wheat",
          title: "Wheat Silo Capacity Alert - Terminal 4",
          description:
            "Silo unit 4 has reached 91% capacity. Inbound logistics show truck queues causing unloading delays of 3+ hours.",
          actionText: "View Silo Capacities",
          actionLink: "/procurement/silo-status",
          severity: "warning",
          bgColor: "bg-amber-50/40",
          borderColor: "border-amber-100/80",
          accentColor: "bg-amber-500",
          badge: "Silo Capacity",
          confidence: 95,
          yieldImpact: "Reduces Truck Wait Fees",
          actionable: true,
          checklist: [
            "Redirect incoming supply trucks to storage Silo 2 (65% capacity)",
            "Send automated SMS alerts to dispatchers to suspend shipments for 12 hours",
            "Inspect physical grain discharge belts to maximize outflow speed",
            "Update daily processing line allocations to draw from Silo 4 first",
          ],
        },
        {
          id: "proc_2",
          type: "quality_control",
          crop: "Rice",
          title: "Moisture Out-of-Spec - Batch 42",
          description:
            "Random sample checks of Rice batch 42 from Pune South co-operative shows 16.5% moisture, exceeding the standard safety limit of 14.0%.",
          actionText: "Issue Price Correction",
          actionLink: "/procurement/qc",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Quality Breach",
          confidence: 93,
          yieldImpact: "Prevents Warehouse Spoilage",
          actionable: true,
          checklist: [
            "Isolate Rice Batch 42 in the holding yard for duplicate moisture tests",
            "Apply the contractual 2.0% pricing discount rate for wet grain",
            "Queue the batch for priority passage through the mechanical grain dryers",
            "Issue digital QC inspection ticket to the supplying FPO coordinator",
          ],
        },
        {
          id: "proc_3",
          type: "supply_forecast",
          crop: "Maize",
          title: "Maize Procurement Target Completion",
          description:
            "Aggregated procurement results show Maize stocks have reached 94% of our seasonal quota of 10,000 MT.",
          actionText: "Procurement Dashboard",
          actionLink: "/procurement/targets",
          severity: "info",
          bgColor: "bg-emerald-50/40",
          borderColor: "border-emerald-100/80",
          accentColor: "bg-[#31572c]",
          badge: "Quota Progress",
          confidence: 96,
          yieldImpact: "Limits Storage Overhead",
          actionable: true,
          checklist: [
            "Review pending supply commitments and active purchase agreements",
            "Plan the seasonal closing of the corporate procurement window",
            "Send performance rating updates to our supplying FPO network",
            "Release final vendor payments for approved maize intakes",
          ],
        },
      ],
      researcher: [
        {
          id: "res_1",
          type: "analysis",
          crop: "Rice",
          title: "Neem-Coated Urea Split Fertilizer Trial",
          description:
            "Agronomy plot trials of Rice cultivar Pusa-44 show a 15% increase in nitrogen uptake efficiency using split-fertilizer schedules.",
          actionText: "Examine Trial Results",
          actionLink: "/research/library",
          severity: "info",
          bgColor: "bg-emerald-50/40",
          borderColor: "border-emerald-100/80",
          accentColor: "bg-[#31572c]",
          badge: "Agronomy Trial",
          confidence: 94,
          yieldImpact: "Saves 20% Urea Input",
          actionable: true,
          checklist: [
            "Tabulate leaf nitrogen index readings and soil residual nitrate measurements",
            "Run statistical significance checks using the ANOVA software suite",
            "Draft the material and methods section for the agronomy manuscript",
            "Present findings at the next district agriculture meeting",
          ],
        },
        {
          id: "res_2",
          type: "research_paper",
          crop: "All Crops",
          title: "Seaweed Extract Stress Tolerance Study",
          description:
            "Recently published literature in Science Direct indicates seaweed biostimulant formulations mitigate crop drought stress by 35% in semi-arid zones.",
          actionText: "Request Paper Summary",
          actionLink: "/research/summarize",
          severity: "warning",
          bgColor: "bg-amber-50/40",
          borderColor: "border-amber-100/80",
          accentColor: "bg-amber-500",
          badge: "Scientific Paper",
          confidence: 90,
          yieldImpact: "Reduces Abiotic Loss",
          actionable: true,
          checklist: [
            "Extract optimal application volumes and timing parameters using AI summary tools",
            "Verify seaweed product compatibility with common bio-insecticides",
            "Plan a replicated plot experiment for the next sowing cycle",
            "Incorporate research details in the crop advisory knowledge base",
          ],
        },
        {
          id: "res_3",
          type: "funding",
          crop: "All Crops",
          title: "ICAR Climate-Resilient Grant Opportunity",
          description:
            "The Indian Council of Agricultural Research (ICAR) is accepting applications for climate-resilient farming research grants. Funding available up to ₹25 Lakhs.",
          actionText: "Draft Grant Proposal",
          actionLink: "/research/grants",
          severity: "high",
          bgColor: "bg-red-50/40",
          borderColor: "border-red-100/85",
          accentColor: "bg-red-500",
          badge: "Funding Call",
          confidence: 97,
          yieldImpact: "Secures Research Funding",
          actionable: true,
          checklist: [
            "Write the research abstract targeting drought-tolerant legume crops",
            "Collate partner profiles, publication histories, and CV files",
            "Draft the itemized budget spreadsheet (lab equipment, field staff)",
            "Submit proposal package for institutional review board clearance",
          ],
        },
      ],
    };

    return baseRecommendations[userRole] || baseRecommendations.farmer;
  };

  const getRecommendedShortcuts = (roleId) => {
    switch (roleId) {
      case "farmer":
        return [
          "Rice Blast Treatment schedule",
          "Mandi prices for Soybean",
          "PMFBY Insurance eligibility",
          "Cotton pest control spray dose",
        ];
      case "fpo":
        return [
          "NPK wholesale rates",
          "Pigeon Pea crop acreage",
          "PGS-Organic registration steps",
          "FPO seed distribution list",
        ];
      case "agri_expert":
        return [
          "Grape Downy Mildew alert details",
          "Streptocycline dosage for blights",
          "Cotton IPM brochure details",
          "Pomegranate crop status report",
        ];
      case "government":
      case "govt_official":
        return [
          "Pune East FAW control centers",
          "PM-KUSUM subsidy target details",
          "District monsoon alerts advisory",
          "Rabi crop seed availability",
        ];
      case "trader":
        return [
          "Soybean APMC mandi arrivals",
          "Onion supply prediction",
          "Chickpea spot arbitrage contract",
          "Lokwan wheat quality standard",
        ];
      case "procurement":
        return [
          "Silo 4 truck queue updates",
          "Rice Batch 42 moisture profile",
          "Maize seasonal procurement target",
          "Silo capacity allocations",
        ];
      case "researcher":
        return [
          "Pusa-44 Nitrogen trial dataset",
          "Seaweed extract drought summary",
          "ICAR Climate grant timeline",
          "Legume research proposal draft",
        ];
      default:
        return [
          "Soil fertilizer calculator guide",
          "Crop disease diagnostics help",
          "Weather forecast for Pune",
          "APMC spot market rates list",
        ];
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRecommendations(getRecommendationsForRole(currentRole));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentRole]);

  const handleDismiss = (id) => setDismissedAlerts([...dismissedAlerts, id]);

  const handleAction = (rec) => {
    if (
      rec.actionLink &&
      (rec.actionLink.includes("chat") ||
        rec.actionText.includes("AI") ||
        rec.actionText.includes("Request") ||
        rec.actionText.includes("Draft"))
    ) {
      const promptText = `Analyze recommendation advisory for ${rec.crop || "crops"} (${rec.title}): ${rec.description}. Explain details and provide next steps.`;
      navigate("/module/ai-assistant-1/chat-workspace", {
        state: { executePrompt: promptText },
      });
    } else {
      navigate("/module/ai-assistant-1/chat-workspace", {
        state: {
          executePrompt: `Give me detailed guidance on: "${rec.title}" for ${rec.crop} crop. ${rec.description}`,
        },
      });
    }
  };

  const toggleChecklistItem = (recId, itemIndex) => {
    setChecklistStates((prev) => {
      const cardState = prev[recId] || {};
      return {
        ...prev,
        [recId]: {
          ...cardState,
          [itemIndex]: !cardState[itemIndex],
        },
      };
    });
  };

  const getChecklistProgress = (rec) => {
    if (!rec.checklist || rec.checklist.length === 0) return 0;
    const cardState = checklistStates[rec.id] || {};
    const completedCount = rec.checklist.filter(
      (_, idx) => !!cardState[idx],
    ).length;
    return Math.round((completedCount / rec.checklist.length) * 100);
  };

  const activeConfig = roleConfig[currentRole] || roleConfig.farmer;

  const visibleRecommendations = recommendations.filter(
    (rec) => !dismissedAlerts.includes(rec.id),
  );

  const filteredRecommendations = visibleRecommendations.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.crop && rec.crop.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === "all") return true;
    if (selectedCategory === "high") return rec.severity === "high";
    if (selectedCategory === "market") {
      return (
        rec.type === "market_opportunity" ||
        rec.type === "opportunity" ||
        rec.type === "price" ||
        rec.type === "trade_opportunity" ||
        rec.type === "market"
      );
    }
    if (selectedCategory === "schemes") {
      return (
        rec.type === "government_scheme" ||
        rec.type === "scheme" ||
        rec.type === "funding" ||
        rec.type === "scheme_adoption"
      );
    }
    if (selectedCategory === "operational") {
      return (
        rec.severity !== "high" &&
        rec.type !== "market_opportunity" &&
        rec.type !== "opportunity" &&
        rec.type !== "price" &&
        rec.type !== "trade_opportunity" &&
        rec.type !== "market" &&
        rec.type !== "government_scheme" &&
        rec.type !== "scheme" &&
        rec.type !== "funding" &&
        rec.type !== "scheme_adoption"
      );
    }
    return true;
  });

  const renderInsightsWidget = (roleId) => {
    switch (roleId) {
      case "farmer":
        return (
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-4 font-['Plus_Jakarta_Sans',_sans-serif]">
            <h3 className="text-sm font-bold text-[#132a13] border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#31572c]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              Farm Health Index
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  Soil Nitrogen
                </span>
                <span className="text-xs font-bold text-gray-800">
                  Low (78 ppm)
                </span>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  Moisture Index
                </span>
                <span className="text-xs font-bold text-gray-800">
                  Optimal (42%)
                </span>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  Crop Stage
                </span>
                <span className="text-xs font-bold text-gray-800">
                  Vegetative
                </span>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  Yield Forecast
                </span>
                <span className="text-xs font-bold text-[#31572c]">
                  +14% Expected
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
              *Calculated using meteorological telemetry models and satellite
              indexes.
            </p>
          </div>
        );
      case "fpo":
        return (
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-4 font-['Plus_Jakarta_Sans',_sans-serif]">
            <h3 className="text-sm font-bold text-[#132a13] border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#31572c]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              FPO Member Analytics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  Active Members
                </span>
                <span className="text-xs font-bold text-gray-800">
                  142 Farmers
                </span>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  Alert Adherence
                </span>
                <span className="text-xs font-bold text-gray-800">
                  89.4% Rate
                </span>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  Total Acreage
                </span>
                <span className="text-xs font-bold text-gray-800">
                  760 Acres
                </span>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  Est. Sowing Area
                </span>
                <span className="text-xs font-bold text-[#31572c]">
                  Wheat: 320 Ac
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
              *Collective FPO metrics aggregated from registered field records.
            </p>
          </div>
        );
      case "government":
      case "govt_official":
        return (
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-4 font-['Plus_Jakarta_Sans',_sans-serif]">
            <h3 className="text-sm font-bold text-[#132a13] border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-red-650"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Regional Outbreak Heatmap
            </h3>
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-600 text-[11px]">
                    Fall Armyworm (East block)
                  </span>
                  <span className="text-red-600 bg-red-50 px-1 py-0.5 rounded text-[8px] font-bold uppercase">
                    High
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-600 text-[11px]">
                    Rice Blast (South block)
                  </span>
                  <span className="text-amber-600 bg-amber-50 px-1 py-0.5 rounded text-[8px] font-bold uppercase">
                    Mod
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-600 text-[11px]">
                    Whitefly (North block)
                  </span>
                  <span className="text-[#31572c] bg-[#31572c]/8 px-1 py-0.5 rounded text-[8px] font-bold uppercase">
                    Low
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-[#31572c] h-full rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold mt-1">
              *District surveillance mapping based on field telemetry.
            </p>
          </div>
        );
      case "trader":
        return (
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-4 font-['Plus_Jakarta_Sans',_sans-serif]">
            <h3 className="text-sm font-bold text-[#132a13] border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#31572c]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              APMC Price Heatmap
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold border-b border-gray-50 pb-1">
                <span className="text-gray-600">Soybean</span>
                <span className="text-[#31572c]">₹5,420/q (+12%)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold border-b border-gray-50 pb-1">
                <span className="text-gray-600">Wheat (Lokwan)</span>
                <span className="text-[#31572c]">₹2,840/q (+4%)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold border-b border-gray-50 pb-1">
                <span className="text-gray-600">Onion (Red)</span>
                <span className="text-red-500">₹1,620/q (-8%)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-600">Chickpea (Desi)</span>
                <span className="text-gray-500">₹4,950/q (0%)</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
              *Live spot market rates inside APMC Pune yard.
            </p>
          </div>
        );
      case "procurement":
        return (
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-4 font-['Plus_Jakarta_Sans',_sans-serif]">
            <h3 className="text-sm font-bold text-[#132a13] border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#31572c]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Procurement Targets
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                  <span className="text-gray-600">Maize Target</span>
                  <span className="text-[#31572c]">9.4k / 10k MT (94%)</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#31572c] h-full rounded-full"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                  <span className="text-gray-600">Wheat Target</span>
                  <span className="text-[#31572c]">3.4k / 8k MT (43%)</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#31572c] h-full rounded-full"
                    style={{ width: "43%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-[#31572c]/8 p-2 rounded-lg border border-[#31572c]/15 text-[10px] font-bold text-[#31572c]">
              Avg moisture parameter: 13.8%
            </div>
          </div>
        );
      case "researcher":
        return (
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm space-y-4 font-['Plus_Jakarta_Sans',_sans-serif]">
            <h3 className="text-sm font-bold text-[#132a13] border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#31572c]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              Lab Research Metrics
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#31572c]/5 p-2.5 rounded-lg border border-[#31572c]/10">
                <span className="text-base font-black text-[#31572c] block">
                  4
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Active Trials
                </span>
              </div>
              <div className="bg-[#31572c]/5 p-2.5 rounded-lg border border-[#31572c]/10">
                <span className="text-base font-black text-[#31572c] block">
                  18
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Summaries
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-[10px] font-semibold text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Seaweed Study</span>
                <span className="text-[#31572c] font-bold">Reviewing</span>
              </div>
              <div className="flex justify-between">
                <span>N2-Pusa trial</span>
                <span className="text-[#31572c] font-bold">Verified</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-sans">
        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: `${brandColors.dark} transparent transparent transparent`,
            }}
          ></div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Aggregating Diagnostic Insights...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 py-8 font-sans antialiased text-left text-xs">
      {/* Premium Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs border border-white"
            style={{
              backgroundColor: `${brandColors.dark}12`,
              color: brandColors.dark,
            }}
          >
            {activeConfig.icon}
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#132a13] leading-tight">
              {activeConfig.title}
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              {activeConfig.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200/80 shadow-xs self-start md:self-auto text-[10px] font-bold text-gray-500">
          <div className="px-1">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider">
              Account Profile
            </p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">
              {activeConfig.greetingName}
            </p>
          </div>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="px-1">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider">
              Assigned Block
            </p>
            <p className="text-xs font-bold text-gray-600 mt-0.5">
              {activeConfig.location}
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Feed) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Category Filter Card */}
          <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search advisories by crop, title, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-xs bg-gray-50/50 hover:bg-gray-100/75 border border-gray-200 rounded-xl focus:border-[#31572c] focus:bg-white outline-none transition-all placeholder-gray-400 font-semibold text-gray-700"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-2.5 text-gray-450 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                {
                  id: "all",
                  label: "All Advisories",
                  count: visibleRecommendations.length,
                  icon: <Compass className="w-3.5 h-3.5" />,
                },
                {
                  id: "high",
                  label: "High Severity",
                  count: visibleRecommendations.filter(
                    (r) => r.severity === "high",
                  ).length,
                  icon: <AlertTriangle className="w-3.5 h-3.5" />,
                },
                {
                  id: "market",
                  label: "Market & Pricing",
                  count: visibleRecommendations.filter(
                    (r) =>
                      r.type.includes("market") ||
                      r.type.includes("price") ||
                      r.type.includes("opportunity"),
                  ).length,
                  icon: <TrendingUp className="w-3.5 h-3.5" />,
                },
                {
                  id: "schemes",
                  label: "Policy & Funding",
                  count: visibleRecommendations.filter(
                    (r) =>
                      r.type.includes("scheme") || r.type.includes("funding"),
                  ).length,
                  icon: <Award className="w-3.5 h-3.5" />,
                },
                {
                  id: "operational",
                  label: "Operational Insights",
                  count: visibleRecommendations.filter(
                    (r) =>
                      r.severity !== "high" &&
                      !r.type.includes("market") &&
                      !r.type.includes("price") &&
                      !r.type.includes("opportunity") &&
                      !r.type.includes("scheme") &&
                      !r.type.includes("funding"),
                  ).length,
                  icon: <Sliders className="w-3.5 h-3.5" />,
                },
              ].map((tab) => {
                const isSelected = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? getSelectedTabClasses(tab.id)
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-100/70 hover:border-gray-300/80"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.25 rounded font-black ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Feed */}
          <div className="space-y-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((rec) => {
                const isExpanded = expandedCardId === rec.id;
                const progress = getChecklistProgress(rec);
                const isHigh = rec.severity === "high";
                const isWarning = rec.severity === "warning";

                const severityConfig = isHigh
                  ? {
                      border:
                        "border-red-200 hover:border-red-300 hover:shadow-md hover:shadow-red-50/30",
                      borderLeft: "border-l-4 border-l-red-500",
                      accent: "bg-red-500",
                      text: "text-red-700",
                      bg: "bg-red-50/10",
                      pill: "bg-red-50 text-red-700 border border-red-100/60",
                    }
                  : isWarning
                    ? {
                        border:
                          "border-amber-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-50/30",
                        borderLeft: "border-l-4 border-l-amber-500",
                        accent: "bg-amber-500",
                        text: "text-amber-700",
                        bg: "bg-amber-50/10",
                        pill: "bg-amber-50 text-amber-700 border border-amber-100/60",
                      }
                    : {
                        border:
                          "border-gray-200 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-50/30",
                        borderLeft: "border-l-4 border-l-[#31572c]",
                        accent: "bg-[#31572c]",
                        text: "text-[#31572c]",
                        bg: "bg-emerald-50/10",
                        pill: "bg-emerald-50 text-emerald-800 border border-emerald-100/60",
                      };

                return (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? "ring-1 ring-[#31572c]/15 shadow-sm"
                        : "shadow-xs"
                    } ${severityConfig.border} ${severityConfig.borderLeft}`}
                  >
                    <div className="p-5 flex gap-4">
                      {/* Card Content Area */}
                      <div className="flex-1 min-w-0">
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 bg-gray-150/70 border border-gray-200/50 px-2 py-0.5 rounded-md">
                              Crop: {rec.crop || "General"}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${severityConfig.pill}`}
                            >
                              {rec.badge || rec.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                              AI Confidence:{" "}
                              <strong className="text-gray-700 font-extrabold">
                                {rec.confidence}%
                              </strong>
                            </span>
                            <button
                              onClick={() => handleDismiss(rec.id)}
                              className="text-gray-300 hover:text-red-500 p-1 rounded-md transition-colors hover:bg-red-50"
                              title="Archive Recommendation"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h2 className="text-sm font-bold text-gray-900 tracking-tight mt-2.5 flex items-center gap-1.5">
                          {isHigh && (
                            <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                          )}
                          {rec.title}
                        </h2>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1.5">
                          {rec.description}
                        </p>

                        {/* Action Panel and Details Trigger */}
                        <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-100/70 pt-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setExpandedCardId(isExpanded ? null : rec.id)
                              }
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-[#31572c] transition-colors"
                            >
                              {isExpanded
                                ? "Hide Action Plan"
                                : "View Action Plan"}
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>

                            <span className="text-[10px] font-bold text-[#31572c] bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              {rec.yieldImpact}
                            </span>
                          </div>

                          {rec.actionable && (
                            <button
                              onClick={() => handleAction(rec)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-xs ${theme.btn}`}
                            >
                              {rec.actionText}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Collapsible Action Checklist Panel */}
                        {isExpanded && rec.checklist && (
                          <div className="mt-4 border-t border-gray-100/70 pt-4 bg-gray-50/50 -mx-5 px-5 pb-4 space-y-3 animate-slideDown">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-gray-400" />
                                AI Tactical Checklist
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#31572c] transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-500">
                                  {progress}% Done
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-250/30">
                              {rec.checklist.map((item, idx) => {
                                const cardState = checklistStates[rec.id] || {};
                                const isChecked = !!cardState[idx];
                                return (
                                  <label
                                    key={idx}
                                    className="flex items-start gap-2.5 cursor-pointer group select-none text-[11px] py-0.5"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() =>
                                        toggleChecklistItem(rec.id, idx)
                                      }
                                      className="mt-0.5 rounded border-gray-300 text-[#31572c] focus:ring-0 cursor-pointer"
                                    />
                                    <span
                                      className={`font-medium leading-relaxed transition-all ${
                                        isChecked
                                          ? "line-through text-gray-400"
                                          : "text-gray-700 group-hover:text-gray-900"
                                      }`}
                                    >
                                      {item}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200/80 shadow-sm">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mx-auto mb-3 border border-gray-100">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <h4 className="text-sm font-bold text-gray-950 tracking-tight">
                  No Matching Advisories
                </h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed font-medium">
                  We couldn't find any recommendations matching your search
                  query or selected category filter. Clear filters to start
                  fresh.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Widgets & Actions) */}
        <div className="space-y-6">
          {/* AI Core Diagnostics & Health */}
          <div className="bg-slate-900 rounded-2xl p-5 shadow-lg relative overflow-hidden border border-slate-800 text-white">
            <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-[#31572c]/20 blur-xl"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Core Diagnostic
              </h3>
              <span className="text-[9px] font-black text-[#ecf39e] bg-[#ecf39e]/10 px-2.5 py-0.5 rounded-md border border-[#ecf39e]/20">
                Online
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  Decision Engine
                </span>
                <span className="text-slate-200">Agri-LLM v4.2-Pro</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Pathology Precision
                </span>
                <span className="text-emerald-400">98.4% Confidence</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#ecf39e]" />
                  Telemetry Sources
                </span>
                <span className="text-slate-200">Soil, Satellite, IMD</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  Last Synced Feed
                </span>
                <span className="text-slate-200">Just Now</span>
              </div>
            </div>
          </div>

          {/* Dynamic Role Metrics Insights Card */}
          {renderInsightsWidget(currentRole)}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 450px;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
