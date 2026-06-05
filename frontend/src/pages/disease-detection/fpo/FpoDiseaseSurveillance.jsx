import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Activity, Users, Map as MapIcon, TrendingUp, Shield, Bell, BarChart3, History, 
  Sprout, AlertTriangle, Thermometer, Droplets, Wind, Plus, Trash, 
  Search, ChevronRight, X, Loader2, Send, Save, CheckCircle, Info, Calendar,
  ArrowUpRight, ArrowDownRight, UserCheck, Play, Award, Check, Layers, Sparkles, Filter, RefreshCw
} from "lucide-react";
import seededData from "../../../seed-json/seededData.json";

export default function FpoDiseaseSurveillance({ subPath }) {
  // Load state from localStorage or seededData.fpoDiseaseDetection
  const [dataState, setDataState] = useState(() => {
    const saved = localStorage.getItem("fpoDiseaseDetectionState");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local FPO state", e);
      }
    }
    // Hardcoded fallback data in case seededData.fpoDiseaseDetection is missing
    const defaultData = seededData.fpoDiseaseDetection || {
      summary: {
        totalFarmers: 1450,
        totalVillages: 18,
        totalCrops: 6,
        totalAcresMonitored: 12400
      },
      kpis: {
        activeOutbreaks: 14,
        affectedFarmers: 340,
        affectedAcreage: 1850,
        highRiskVillages: 5,
        criticalCases: 8,
        predictedYieldLoss: "18.5%",
        alertsIssuedToday: 3,
        campaignsActive: 2
      },
      diseaseDistribution: [
        { disease: "Rice Blast", percentage: 35, farmers: 120, acres: 650 },
        { disease: "Yellow Rust", percentage: 25, farmers: 85, acres: 460 },
        { disease: "Late Blight", percentage: 15, farmers: 50, acres: 280 },
        { disease: "Downy Mildew", percentage: 15, farmers: 50, acres: 270 },
        { disease: "Bacterial Leaf Spot", percentage: 10, farmers: 35, acres: 190 }
      ],
      topThreats: [
        { disease: "Rice Blast", village: "Kharindwa", severity: "Critical", farmers: 48, acres: 260, trend: "Increasing" },
        { disease: "Yellow Rust", village: "Bhucho Mandi", severity: "High", farmers: 35, acres: 190, trend: "Increasing" },
        { disease: "Late Blight", village: "Raman", severity: "Critical", farmers: 28, acres: 150, trend: "Stable" },
        { disease: "Downy Mildew", village: "Shirur", severity: "Moderate", farmers: 22, acres: 120, trend: "Decreasing" },
        { disease: "Bacterial Leaf Spot", village: "Bhucho Mandi", severity: "Moderate", farmers: 18, acres: 95, trend: "Stable" }
      ],
      outbreakTrend30D: [
        { day: "Day 5", newCases: 12, resolvedCases: 8, activeCases: 32 },
        { day: "Day 10", newCases: 18, resolvedCases: 12, activeCases: 38 },
        { day: "Day 15", newCases: 24, resolvedCases: 15, activeCases: 47 },
        { day: "Day 20", newCases: 15, resolvedCases: 22, activeCases: 40 },
        { day: "Day 25", newCases: 8, resolvedCases: 26, activeCases: 22 },
        { day: "Day 30", newCases: 5, resolvedCases: 18, activeCases: 14 }
      ],
      highRiskVillages: [
        { name: "Kharindwa", riskScore: 88, primaryDisease: "Rice Blast", populationAffected: 420 },
        { name: "Bhucho Mandi", riskScore: 79, primaryDisease: "Yellow Rust", populationAffected: 350 },
        { name: "Raman", riskScore: 74, primaryDisease: "Late Blight", populationAffected: 280 },
        { name: "Sangat", riskScore: 62, primaryDisease: "Wheat Rust", populationAffected: 190 },
        { name: "Baramati", riskScore: 55, primaryDisease: "Downy Mildew", populationAffected: 150 }
      ],
      emergencyActions: [
        { id: "action-1", severity: "Critical", outbreak: "Rice Blast Outbreak in Kharindwa", pendingResponses: 12, recommendation: "Coordinate immediate spray campaign with Tricyclazole 75 WP." },
        { id: "action-2", severity: "High", outbreak: "Yellow Rust Warning in Bhucho Mandi", pendingResponses: 8, recommendation: "Distribute rust warning alerts and organize crop checks." }
      ],
      aiRecommendations: [
        "Deploy localized rust prevention campaign for wheat growers in Northern clusters.",
        "Issue high humidity warning alerts to Rice farmers in Sector 4.",
        "Increase field scanner check counts in Sangat village where leaf spot indicators are rising.",
        "Verify chemical storage quantities in Collection Silo A to prepare for Blight containment."
      ],
      outbreaks: [
        { id: "out-1", disease: "Rice Blast", village: "Kharindwa", crop: "Rice", farmers: 48, acres: 260, severity: "Critical", date: "2026-06-01", status: "Containment Started" },
        { id: "out-2", disease: "Yellow Rust", village: "Bhucho Mandi", crop: "Wheat", farmers: 35, acres: 190, severity: "High", date: "2026-05-28", status: "Verified" },
        { id: "out-3", disease: "Late Blight", village: "Raman", crop: "Potato", farmers: 28, acres: 150, severity: "Critical", date: "2026-06-03", status: "Detected" },
        { id: "out-4", disease: "Downy Mildew", village: "Shirur", crop: "Bajra", farmers: 22, acres: 120, severity: "Moderate", date: "2026-05-25", status: "Contained" },
        { id: "out-5", disease: "Bacterial Leaf Spot", village: "Bhucho Mandi", crop: "Cotton", farmers: 18, acres: 95, severity: "Moderate", date: "2026-05-22", status: "Resolved" }
      ],
      cases: [
        { id: "case-101", farmer: "Rajesh Singh", village: "Kharindwa", crop: "Rice", disease: "Rice Blast", severity: "Critical", status: "Open", officer: "Vikram Dev", updated: "2 hours ago", progress: 35, lastFollowUp: "2026-06-03", effectiveness: "High" },
        { id: "case-102", farmer: "Harpreet Singh", village: "Bhucho Mandi", crop: "Wheat", disease: "Yellow Rust", severity: "High", status: "In Progress", officer: "Aman Preet", updated: "5 hours ago", progress: 60, lastFollowUp: "2026-06-02", effectiveness: "Moderate" },
        { id: "case-103", farmer: "Gurpreet Mand", "village": "Raman", crop: "Potato", disease: "Late Blight", severity: "Critical", status: "Open", officer: "Aman Preet", updated: "Just now", progress: 10, lastFollowUp: "2026-06-04", effectiveness: "Pending" },
        { id: "case-104", farmer: "Sanjay Patil", village: "Shirur", crop: "Bajra", disease: "Downy Mildew", severity: "Moderate", status: "Resolved", officer: "Ramesh Deshmukh", updated: "Yesterday", progress: 100, lastFollowUp: "2026-06-01", effectiveness: "High" },
        { id: "case-105", farmer: "Amit Sharma", village: "Bhucho Mandi", crop: "Cotton", disease: "Bacterial Leaf Spot", severity: "Moderate", status: "Resolved", officer: "Aman Preet", updated: "2 days ago", progress: 100, lastFollowUp: "2026-05-30", effectiveness: "High" }
      ],
      predictions: [
        { disease: "Rice Blast", probability: 85, expectedDate: "2026-06-10", affectedArea: "Sector 4", confidence: 92 },
        { disease: "Yellow Rust", probability: 78, expectedDate: "2026-06-12", affectedArea: "Northern Fields", confidence: 88 },
        { disease: "Late Blight", probability: 65, expectedDate: "2026-06-18", affectedArea: "South Cluster", confidence: 80 },
        { disease: "Downy Mildew", probability: 55, expectedDate: "2026-06-22", affectedArea: "Western Tube-wells", confidence: 75 }
      ],
      campaigns: [
        { id: "camp-1", name: "Kharindwa Blast Control", disease: "Rice Blast", village: "Kharindwa", farmers: 60, completed: 45, type: "Emergency Spray", pesticide: "Tricyclazole 75 WP", required: "120 Liters", cost: 15000, status: "Active" },
        { id: "camp-2", name: "Bhucho Rust Preventive", disease: "Yellow Rust", village: "Bhucho Mandi", farmers: 45, completed: 45, type: "Preventive Spray", pesticide: "Propiconazole 0.1%", required: "90 Liters", cost: 12000, status: "Completed" },
        { id: "camp-3", name: "Raman Blight Action", disease: "Late Blight", village: "Raman", farmers: 30, completed: 5, type: "Emergency Spray", pesticide: "Metalaxyl-M", required: "80 Liters", cost: 22000, status: "Active" }
      ],
      alerts: [
        { id: "sms-101", type: "Disease Alert", audience: "Rice Growers", date: "2026-06-04", sent: 450, delivered: 442, read: 380, acknowledged: 290, channel: "SMS & WhatsApp" },
        { id: "sms-102", type: "Weather Alert", audience: "Wheat Growers", date: "2026-06-03", sent: 680, delivered: 665, read: 510, acknowledged: 420, channel: "SMS" },
        { id: "sms-103", type: "Emergency Alert", audience: "Kharindwa Village", date: "2026-06-01", sent: 180, delivered: 178, read: 165, acknowledged: 150, channel: "WhatsApp" }
      ],
      impact: {
        expectedLoss: "280 Tons",
        preventedLoss: "950 Tons",
        recoveredYield: "670 Tons",
        revenueSaved: 4850000,
        lossPrevented: 12500000,
        treatmentCost: 850000,
        netBenefit: 11650000
      },
      history: [
        { disease: "Rice Blast", village: "Kharindwa", crop: "Rice", season: "Kharif 2025", impact: "High Outbreak", yieldLoss: "22%" },
        { disease: "Yellow Rust", village: "Bhucho Mandi", crop: "Wheat", season: "Rabi 2025", impact: "Moderate Outbreak", yieldLoss: "12%" },
        { disease: "Late Blight", village: "Raman", crop: "Potato", season: "Kharif 2024", impact: "Severe Outbreak", yieldLoss: "35%" },
        { disease: "Bacterial Blight", village: "Kharindwa", crop: "Rice", season: "Kharif 2024", impact: "Mild Outbreak", yieldLoss: "8%" }
      ]
    };
    return defaultData;
  });

  // Sync state to local storage on change
  useEffect(() => {
    localStorage.setItem("fpoDiseaseDetectionState", JSON.stringify(dataState));
  }, [dataState]);

  // Leaflet map setup state
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroupRef = useRef(null);

  // General Interactive States
  const [selectedCase, setSelectedCase] = useState(null);
  const [assigneeId, setAssigneeId] = useState("");
  const [progressSlider, setProgressSlider] = useState(0);
  const [caseFilterTab, setCaseFilterTab] = useState("All"); // Priority Queue Categories
  const [selectedOutbreakId, setSelectedOutbreakId] = useState("out-1"); // Selected Outbreak for lifecycle visualizer
  const [forecastDays, setForecastDays] = useState(14); // Prediction Timeline: 7, 14, 30 days
  const [alertFormGroup, setAlertFormGroup] = useState({
    type: "Disease Alert",
    audience: "Rice Growers",
    channel: "SMS & WhatsApp",
    message: ""
  });
  
  // Custom Leaflet layer toggles matching prompt
  const [mapLayers, setMapLayers] = useState({
    disease: true,
    farmer: true,
    government: false,
    weather: false,
    satellite: true,
    historical: false,
    forecast: false
  });

  // Hotspot Spread Simulation States
  const [simDays, setSimDays] = useState(7); // 3, 7, 14 days spread simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [windDirection, setWindDirection] = useState("North-East");
  const simIntervalRef = useRef(null);

  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    disease: "Rice Blast",
    village: "Kharindwa",
    farmers: 30,
    type: "Preventive Spray",
    pesticide: "Tricyclazole 75 WP"
  });

  // Active slice in Donut Chart
  const [activeDonutSlice, setActiveDonutSlice] = useState(0);

  // Notification Feed for Cross-Module Flow Simulator
  const [simLogs, setSimLogs] = useState([
    { time: "16:00", text: "Systems synced: Meteorological & Satellite imagery nodes online.", icon: "info" }
  ]);

  // Dynamic Leaflet Injection
  useEffect(() => {
    if (subPath !== "map") return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const checkLeaflet = () => {
      if (window.L) {
        setMapLoaded(true);
        return true;
      }
      return false;
    };

    if (checkLeaflet()) return;

    let script = document.getElementById("leaflet-js");
    if (!script) {
      script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      if (window.L) setMapLoaded(true);
    };
    script.addEventListener("load", handleLoad);
    const interval = setInterval(() => {
      if (checkLeaflet()) clearInterval(interval);
    }, 100);

    return () => {
      script.removeEventListener("load", handleLoad);
      clearInterval(interval);
    };
  }, [subPath]);

  // Leaflet map initializer
  useEffect(() => {
    if (subPath !== "map" || !mapLoaded || !window.L || !mapRef.current || mapInstance.current) return;

    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([29.0588, 76.0856], 8.5); // Center Haryana Region

    mapInstance.current = map;

    window.L.tileLayer(
      "https://api.maptiler.com/maps/dataviz-light/{z}/{x}/{y}.png?key=Js3t7mr8sd7cdIiAAyVp",
      {
        attribution: '&copy; MapTiler',
        maxZoom: 18,
      }
    ).addTo(map);

    const layerGroup = window.L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapLoaded, subPath]);

  // Dynamic Map Render (Layers, hot-zones, wind vectors)
  useEffect(() => {
    if (subPath !== "map" || !mapInstance.current || !layerGroupRef.current || !window.L) return;

    layerGroupRef.current.clearLayers();

    // Map Hotspots coordinates
    const mapHotspots = [
      { name: "Kharindwa Cluster", coords: [30.1245, 76.8912], disease: "Rice Blast", severity: "Critical", score: 88, category: "Critical Zones" },
      { name: "Bhucho Mandi Cluster", coords: [30.2215, 74.9542], disease: "Yellow Rust", severity: "High", score: 79, category: "Critical Zones" },
      { name: "Raman Farm Cluster", coords: [29.9876, 75.0124], disease: "Late Blight", severity: "Critical", score: 74, category: "Critical Zones" },
      { name: "Sangat Sector", coords: [30.0825, 74.8322], disease: "Wheat Rust", severity: "Moderate", score: 62, category: "Moderate Zones" },
      { name: "Baramati Sector", coords: [18.1560, 74.5768], disease: "Downy Mildew", severity: "Moderate", score: 55, category: "Moderate Zones" },
      { name: "Karnal Sector", coords: [29.6857, 76.9905], disease: "Healthy Sowing", severity: "Low", score: 18, category: "Safe Zones" }
    ];

    mapHotspots.forEach((spot) => {
      let drawMarker = false;

      if (spot.category === "Critical Zones" && mapLayers.disease) drawMarker = true;
      if (spot.category === "Moderate Zones" && mapLayers.farmer) drawMarker = true;
      if (spot.category === "Safe Zones" && mapLayers.government) drawMarker = true;

      if (drawMarker) {
        const color = spot.severity === "Critical" ? "#ef4444" : spot.severity === "High" ? "#f59e0b" : spot.severity === "Moderate" ? "#3b82f6" : "#10b981";
        
        // Draw Outbreak Hotspot rings
        const circle = window.L.circle(spot.coords, {
          color: color,
          fillColor: color,
          fillOpacity: 0.25,
          radius: 12000,
          weight: 1.5
        }).addTo(layerGroupRef.current);

        circle.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; padding: 4px;">
            <h4 style="margin:0 0 4px; font-weight:800; color: #132a13; font-size:12px;">${spot.name}</h4>
            <div style="margin-bottom:3px;"><b>Primary Pathogen:</b> ${spot.disease}</div>
            <div style="margin-bottom:3px;"><b>Vulnerability Index:</b> <span style="color:${color}; font-weight:700;">${spot.score}%</span></div>
            <div><b>Status:</b> ${spot.severity} Threat</div>
          </div>
        `);

        // Wind vectors spore drift vector drawing
        if (isSimulating && spot.severity === "Critical") {
          let latOff = 0;
          let lonOff = 0;
          const drift = simTime * 0.003;
          
          if (windDirection === "North-East") { latOff = drift; lonOff = drift; }
          else if (windDirection === "North-West") { latOff = drift; lonOff = -drift; }
          else if (windDirection === "South-East") { latOff = -drift; lonOff = drift; }
          else if (windDirection === "South-West") { latOff = -drift; lonOff = -drift; }

          const sporeRadius = 10000 + (simTime * simDays * 500);

          // Simulated Spore cloud ring
          window.L.circle([spot.coords[0] + latOff, spot.coords[1] + lonOff], {
            color: "#8b5cf6",
            fillColor: "#8b5cf6",
            fillOpacity: 0.07,
            radius: sporeRadius,
            weight: 1,
            dashArray: "3 3"
          }).addTo(layerGroupRef.current);

          // Arrow direction indicator line
          if (simTime === 4) {
            const startPt = spot.coords;
            const endPt = [spot.coords[0] + (latOff * 1.5), spot.coords[1] + (lonOff * 1.5)];
            window.L.polyline([startPt, endPt], {
              color: "#8b5cf6",
              weight: 2,
              dashArray: "5 5"
            }).addTo(layerGroupRef.current);
          }
        }
      }
    });

  }, [subPath, mapLayers, isSimulating, simTime, windDirection, simDays]);

  // Spore spread simulation trigger
  const runSporeDriftSimulation = (days) => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    setIsSimulating(true);
    setSimTime(0);
    setSimDays(days);
    
    // Choose wind direction based on weather models
    const directions = ["North-East", "North-West", "South-East", "South-West"];
    setWindDirection(directions[Math.floor(Math.random() * directions.length)]);

    let time = 0;
    simIntervalRef.current = setInterval(() => {
      time += 1;
      setSimTime(time);
      if (time >= 6) {
        clearInterval(simIntervalRef.current);
        setIsSimulating(false);
        addSimLog(`GIS vector simulation complete: Pathogen spore spread modeled for ${days} days towards the ${windDirection}.`, "Sparkles");
      }
    }, 500);
  };

  // Cross-Module Simulation Logger Helper
  const addSimLog = (text, icon = "info") => {
    const time = new Date().toTimeString().slice(0, 5);
    setSimLogs(prev => [{ time, text, icon }, ...prev]);
  };

  // CROSS-MODULE DYNAMIC FLOW TRIGGERS
  const triggerLeafScannerScan = () => {
    // 1. Leaf Scanner Result -> Creates Case
    const names = ["Jagdish Prasad", "Kulwant Dhillon", "Dharam Pal", "Subhash Ghai", "Pritam Singh"];
    const crops = ["Rice", "Wheat", "Potato", "Bajra", "Cotton"];
    const diseases = ["Rice Blast", "Yellow Rust", "Late Blight", "Downy Mildew", "Bacterial Leaf Spot"];
    const villages = ["Kharindwa", "Bhucho Mandi", "Raman", "Shirur", "Sangat"];

    const rIdx = Math.floor(Math.random() * names.length);
    const newCaseId = `case-${100 + dataState.cases.length + 1}`;
    
    const newCaseObj = {
      id: newCaseId,
      farmer: names[rIdx],
      village: villages[rIdx],
      crop: crops[rIdx],
      disease: diseases[rIdx],
      severity: "Critical",
      status: "Open",
      officer: "Unassigned",
      updated: "Just now",
      progress: 0,
      lastFollowUp: "2026-06-04",
      effectiveness: "Pending"
    };

    setDataState(prev => ({
      ...prev,
      cases: [newCaseObj, ...prev.cases],
      kpis: {
        ...prev.kpis,
        criticalCases: prev.kpis.criticalCases + 1,
        activeOutbreaks: prev.kpis.activeOutbreaks + 1
      }
    }));

    addSimLog(`[Leaf Scanner] Pathogen scanned for ${names[rIdx]}. Created priority case ${newCaseId}.`, "Sprout");
  };

  const triggerCaseEscalation = (caseId) => {
    // 2. Case -> Creates Outbreak
    const targetCase = dataState.cases.find(c => c.id === caseId);
    if (!targetCase) return;

    setDataState(prev => {
      // Check if village-disease outbreak already listed
      const exists = prev.outbreaks.find(o => o.village === targetCase.village && o.disease === targetCase.disease);
      if (exists) return prev;

      const newOutbreak = {
        id: `out-${prev.outbreaks.length + 1}`,
        disease: targetCase.disease,
        village: targetCase.village,
        crop: targetCase.crop,
        farmers: 15,
        acres: 80,
        severity: "Critical",
        date: new Date().toISOString().split("T")[0],
        status: "Escalated"
      };

      const updatedCases = prev.cases.map(c => c.id === caseId ? { ...c, status: "In Progress" } : c);

      return {
        ...prev,
        cases: updatedCases,
        outbreaks: [newOutbreak, ...prev.outbreaks],
        kpis: {
          ...prev.kpis,
          activeOutbreaks: prev.outbreaks.length + 1
        }
      };
    });

    addSimLog(`[Outbreak Management] Escalated case ${caseId}. Outbreak declared in ${targetCase.village} cluster.`, "AlertTriangle");
  };

  const triggerCampaignLaunch = (outbreakId) => {
    // 3. Outbreak -> Launches Treatment Campaign
    const outbreak = dataState.outbreaks.find(o => o.id === outbreakId);
    if (!outbreak) return;

    setDataState(prev => {
      const campId = `camp-${prev.campaigns.length + 1}`;
      const campaignObj = {
        id: campId,
        name: `${outbreak.village} ${outbreak.disease.split(" ")[0]} Containment`,
        disease: outbreak.disease,
        village: outbreak.village,
        farmers: outbreak.farmers + 10,
        completed: 2,
        type: "Emergency Containment",
        pesticide: "Propiconazole 0.1%",
        required: "80 Liters",
        cost: 18000,
        status: "Active"
      };

      const updatedOutbreaks = prev.outbreaks.map(o => o.id === outbreakId ? { ...o, status: "Containment Started" } : o);

      return {
        ...prev,
        campaigns: [campaignObj, ...prev.campaigns],
        outbreaks: updatedOutbreaks,
        kpis: {
          ...prev.kpis,
          campaignsActive: prev.kpis.campaignsActive + 1
        }
      };
    });

    addSimLog(`[Campaign Coordination] Launched therapeutic spray campaign for ${outbreak.disease} in ${outbreak.village}.`, "Shield");
  };

  const triggerCampaignComplete = (campId) => {
    // 4. Campaign -> Updates Impact Analytics & Logs History
    const camp = dataState.campaigns.find(c => c.id === campId);
    if (!camp || camp.status === "Completed") return;

    setDataState(prev => {
      // Mark campaign completed
      const updatedCampaigns = prev.campaigns.map(c => c.id === campId ? { ...c, completed: c.farmers, status: "Completed" } : c);

      // Resolve cases in that village/disease
      const updatedCases = prev.cases.map(c => c.village === camp.village && c.disease === camp.disease ? { ...c, status: "Resolved", progress: 100 } : c);

      // Resolve outbreak
      const updatedOutbreaks = prev.outbreaks.map(o => o.village === camp.village && o.disease === camp.disease ? { ...o, status: "Resolved" } : o);

      // Log to history
      const newHistoryItem = {
        disease: camp.disease,
        village: camp.village,
        crop: "Rice",
        season: "Kharif 2026",
        impact: "Contained",
        yieldLoss: "6%"
      };

      // Add financial saving delta
      const prevRevenue = prev.impact.revenueSaved;

      return {
        ...prev,
        campaigns: updatedCampaigns,
        cases: updatedCases,
        outbreaks: updatedOutbreaks,
        history: [newHistoryItem, ...prev.history],
        impact: {
          ...prev.impact,
          revenueSaved: prevRevenue + 1200000,
          recoveredYield: `${parseInt(prev.impact.recoveredYield) + 40} Tons`
        },
        kpis: {
          ...prev.kpis,
          campaignsActive: Math.max(0, prev.kpis.campaignsActive - 1),
          activeOutbreaks: Math.max(0, prev.outbreaks.filter(o => o.status !== "Resolved").length - 1)
        }
      };
    });

    addSimLog(`[Impact Analytics] Completed campaign ${campId}. Yield saved +40 Tons. Revenue protection unlocked.`, "Award");
  };

  const triggerBroadcastAlert = (alertType, targetAudience) => {
    // 5. Alert -> Updates alerts log and today's alert counter
    setDataState(prev => {
      const alertId = `sms-${100 + prev.alerts.length + 1}`;
      const alertObj = {
        id: alertId,
        type: alertType,
        audience: targetAudience,
        date: new Date().toISOString().split("T")[0],
        sent: 350,
        delivered: 345,
        read: 310,
        acknowledged: 280,
        channel: "SMS & WhatsApp"
      };

      return {
        ...prev,
        alerts: [alertObj, ...prev.alerts],
        kpis: {
          ...prev.kpis,
          alertsIssuedToday: prev.kpis.alertsIssuedToday + 1
        }
      };
    });

    addSimLog(`[Alert Dispatcher] Dispatched mass ${alertType} warning to ${targetAudience}.`, "Bell");
  };

  // Handlers for standard operations
  const handleAssignOfficer = () => {
    if (!selectedCase || !assigneeId) return;
    setDataState(prev => {
      const updatedCases = prev.cases.map(c => 
        c.id === selectedCase.id ? { ...c, officer: assigneeId, status: "In Progress" } : c
      );
      return { ...prev, cases: updatedCases };
    });
    setSelectedCase(prev => ({ ...prev, officer: assigneeId, status: "In Progress" }));
    addSimLog(`Assigned Field Officer ${assigneeId} to case ${selectedCase.id}.`, "UserCheck");
  };

  const handleUpdateProgress = (val) => {
    setProgressSlider(val);
    if (!selectedCase) return;
    setDataState(prev => {
      const updatedCases = prev.cases.map(c => 
        c.id === selectedCase.id ? { 
          ...c, 
          progress: Number(val), 
          status: Number(val) === 100 ? "Resolved" : "In Progress" 
        } : c
      );
      const openCases = updatedCases.filter(c => c.status !== "Resolved");
      return { 
        ...prev, 
        cases: updatedCases,
        kpis: {
          ...prev.kpis,
          activeOutbreaks: openCases.length > 0 ? openCases.length + 4 : 4,
          criticalCases: updatedCases.filter(c => c.severity === "Critical" && c.status !== "Resolved").length
        }
      };
    });
    setSelectedCase(prev => ({ 
      ...prev, 
      progress: Number(val), 
      status: Number(val) === 100 ? "Resolved" : "In Progress" 
    }));
  };

  const handleOutbreakLifecycleStageChange = (outbreakId, nextStage) => {
    setDataState(prev => {
      const updatedOutbreaks = prev.outbreaks.map(o => 
        o.id === outbreakId ? { ...o, status: nextStage } : o
      );
      return { ...prev, outbreaks: updatedOutbreaks };
    });
    addSimLog(`Outbreak ${outbreakId} lifecycle stage manually updated to: ${nextStage}.`, "Activity");
  };

  const handleCreateCampaignSubmit = (e) => {
    e.preventDefault();
    setDataState(prev => {
      const id = `camp-${prev.campaigns.length + 1}`;
      const campaignObj = {
        id,
        name: `${newCampaign.village} Sowing Protection`,
        disease: newCampaign.disease,
        village: newCampaign.village,
        farmers: Number(newCampaign.farmers),
        completed: 0,
        type: newCampaign.type,
        pesticide: newCampaign.pesticide,
        required: `${Number(newCampaign.farmers) * 2} Liters`,
        cost: Number(newCampaign.farmers) * 350,
        status: "Active"
      };
      return {
        ...prev,
        campaigns: [campaignObj, ...prev.campaigns],
        kpis: {
          ...prev.kpis,
          campaignsActive: prev.kpis.campaignsActive + 1
        }
      };
    });
    addSimLog(`Created response campaign for ${newCampaign.disease} in ${newCampaign.village}.`, "Plus");
  };

  const handleSendAlertSubmit = (e) => {
    e.preventDefault();
    if (!alertFormGroup.message) return;
    triggerBroadcastAlert(alertFormGroup.type, alertFormGroup.audience);
    setAlertFormGroup(prev => ({ ...prev, message: "" }));
  };

  return (
    <div className="space-y-6 antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] bg-slate-50 dark:bg-brand-darkest/90 p-1 sm:p-4 rounded-3xl">
      
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-br from-[#132a13] to-[#31572c] rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border border-[#4f772d]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-400/20 text-[#ecf39e]">
              <Sprout className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                AgroIndia Disease Intelligence Command
              </h1>
              <p className="text-white/80 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
                Aggregated epidemiological forecasting, GIS transmission modeling, alert broadcasts, and chemical response tracking for regional agricultural cooperatives.
              </p>
            </div>
          </div>
        </div>

        {/* Footprint metrics header blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto relative z-10">
          {[
            { label: "Total Farmers", value: dataState.summary.totalFarmers, icon: Users },
            { label: "Total Villages", value: dataState.summary.totalVillages, icon: MapIcon },
            { label: "Total Crops", value: dataState.summary.totalCrops, icon: Sprout },
            { label: "Monitored Acres", value: `${dataState.summary.totalAcresMonitored.toLocaleString()} ac`, icon: Shield }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-2.5 shadow-sm transition hover:bg-white/15">
              <div className="p-1.5 bg-[#ecf39e]/15 rounded-xl text-[#ecf39e]">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-white/60 font-black uppercase tracking-wider block">{item.label}</span>
                <span className="text-sm sm:text-base font-black text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DYNAMIC CROSS-MODULE EVENT SIMULATOR PANEL ── */}
      <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
              Cross-Module Operational Data Flow Simulator
            </h3>
          </div>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 font-extrabold px-2 py-0.5 rounded-full uppercase">
            Platform Testing Node
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Simulator Trigger Buttons */}
          <div className="lg:col-span-3 flex flex-wrap gap-2.5 items-center justify-start">
            <button
              type="button"
              onClick={triggerLeafScannerScan}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/10"
            >
              <Sprout className="w-3.5 h-3.5" />
              1. Simulate Leaf Scan (Create Case)
            </button>

            <button
              type="button"
              onClick={() => {
                const openCases = dataState.cases.filter(c => c.status === "Open");
                if (openCases.length > 0) {
                  triggerCaseEscalation(openCases[0].id);
                } else {
                  alert("No open cases found. Please trigger a new Leaf Scan first.");
                }
              }}
              disabled={dataState.cases.filter(c => c.status === "Open").length === 0}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/10"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              2. Declare Outbreak from Open Case
            </button>

            <button
              type="button"
              onClick={() => {
                const escOutbreaks = dataState.outbreaks.filter(o => o.status === "Escalated" || o.status === "Verified");
                if (escOutbreaks.length > 0) {
                  triggerCampaignLaunch(escOutbreaks[0].id);
                } else {
                  alert("No escalated outbreaks found. Run Step 2.");
                }
              }}
              disabled={dataState.outbreaks.filter(o => o.status === "Escalated" || o.status === "Verified").length === 0}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-500/10"
            >
              <Shield className="w-3.5 h-3.5" />
              3. Launch Therapeutic Spray Campaign
            </button>

            <button
              type="button"
              onClick={() => {
                const activeCamps = dataState.campaigns.filter(c => c.status === "Active");
                if (activeCamps.length > 0) {
                  triggerCampaignComplete(activeCamps[0].id);
                } else {
                  alert("No active campaigns found. Run Step 3.");
                }
              }}
              disabled={dataState.campaigns.filter(c => c.status === "Active").length === 0}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-purple-500/10"
            >
              <Award className="w-3.5 h-3.5" />
              4. Complete Campaign (Update Impact ROI)
            </button>

            <button
              type="button"
              onClick={() => triggerBroadcastAlert("Disease Alert", "All active FPO members")}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/10"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              5. Broadcast Simulated Alert Warning
            </button>
          </div>

          {/* Simulator Log Console Output */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 h-28 overflow-y-auto font-mono text-[10px] text-emerald-400 space-y-2">
            {simLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2 items-start leading-normal">
                <span className="text-slate-500 select-none">[{log.time}]</span>
                <p className="flex-1 text-slate-350">{log.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXECUTIVE KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { label: "Active Outbreaks", value: dataState.kpis.activeOutbreaks, color: "text-red-600 bg-red-500/10 border-red-500/20" },
          { label: "Affected Farmers", value: dataState.kpis.affectedFarmers, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
          { label: "Affected Acreage", value: `${dataState.kpis.affectedAcreage} ac`, color: "text-red-600 bg-red-500/10 border-red-500/20" },
          { label: "High-Risk Villages", value: dataState.kpis.highRiskVillages, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
          { label: "Critical Cases", value: dataState.kpis.criticalCases, color: "text-red-700 bg-red-500/10 border-red-500/20 font-black" },
          { label: "Predicted Loss", value: dataState.kpis.predictedYieldLoss, color: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
          { label: "Alerts Sent Today", value: dataState.kpis.alertsIssuedToday, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
          { label: "Campaigns Active", value: dataState.kpis.campaignsActive, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" }
        ].map((kpi, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between h-24 shadow-sm backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px] ${kpi.color}`}>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{kpi.label}</span>
            <span className="text-xl font-black tracking-tight">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* ── PAGE LAYOUT SWITCHER ── */}

      {/* PAGE 1: EXECUTIVE DASHBOARD */}
      {(!subPath || subPath === "") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top threats table */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  Top Pathogen Threats
                </h3>
                <span className="text-[10px] text-slate-400 font-extrabold">Cooperative Risk Rank</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-2.5 text-left">Disease</th>
                      <th className="py-2.5 text-left">Village</th>
                      <th className="py-2.5 text-center">Severity</th>
                      <th className="py-2.5 text-center">Farmers Impacted</th>
                      <th className="py-2.5 text-center">Acres Impacted</th>
                      <th className="py-2.5 text-center">Risk Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {dataState.topThreats.map((threat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Sprout className="w-3.5 h-3.5 text-[#31572c]" /> {threat.disease}
                        </td>
                        <td className="py-3 text-slate-500">{threat.village}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            threat.severity === "Critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {threat.severity}
                          </span>
                        </td>
                        <td className="py-3 text-center text-slate-700 dark:text-slate-300">{threat.farmers}</td>
                        <td className="py-3 text-center text-slate-700 dark:text-slate-300">{threat.acres} ac</td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            threat.trend === "Increasing" ? "text-red-700 bg-red-100" : threat.trend === "Stable" ? "text-slate-600 bg-slate-100" : "text-emerald-700 bg-emerald-100"
                          }`}>
                            {threat.trend === "Increasing" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {threat.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Outbreak Case Growth Timeline Line/Bar Graph (SVG representation) */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  30-Day Outbreak Case Growth Timeline
                </h3>
                <span className="text-[10px] text-slate-400 font-extrabold">Active vs Resolved</span>
              </div>

              {/* High-Fidelity SVG Chart */}
              <div className="pt-4 h-56 relative w-full">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="70" x2="580" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="170" x2="580" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Horizontal Labels */}
                  <text x="15" y="25" fill="#94a3b8" fontSize="8" fontWeight="bold">50 cases</text>
                  <text x="15" y="75" fill="#94a3b8" fontSize="8" fontWeight="bold">30 cases</text>
                  <text x="15" y="125" fill="#94a3b8" fontSize="8" fontWeight="bold">10 cases</text>
                  <text x="20" y="175" fill="#94a3b8" fontSize="8" fontWeight="bold">0</text>

                  {/* Columns representation */}
                  {dataState.outbreakTrend30D.map((t, idx) => {
                    const x = 70 + (idx * 90);
                    // Scale values where 170 is bottom axis
                    const activeHeight = Math.min(150, t.activeCases * 3);
                    const newHeight = Math.min(150, t.newCases * 3);
                    const resHeight = Math.min(150, t.resolvedCases * 3);

                    return (
                      <g key={idx}>
                        {/* Active Cases (Red bar) */}
                        <rect 
                          x={x} 
                          y={170 - activeHeight} 
                          width="16" 
                          height={activeHeight} 
                          fill="#ef4444" 
                          opacity="0.85" 
                          rx="3" 
                        />
                        {/* New Cases (Purple line points overlay) */}
                        <circle 
                          cx={x + 8} 
                          cy={170 - newHeight} 
                          r="4.5" 
                          fill="#8b5cf6" 
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        {/* Resolved Cases (Green bar) */}
                        <rect 
                          x={x + 18} 
                          y={170 - resHeight} 
                          width="16" 
                          height={resHeight} 
                          fill="#4f772d" 
                          opacity="0.85" 
                          rx="3" 
                        />
                        {/* Label */}
                        <text x={x} y="192" fill="#64748b" fontSize="9" fontWeight="bold">{t.day}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-red-500 block" /> Active Cases</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-[#4f772d] block" /> Resolved Cases</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-purple-600 block" /> New Warnings</span>
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            {/* Disease Distribution Interactive Donut Chart */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800">
                Disease Distribution Analysis
              </h3>

              <div className="flex justify-around items-center gap-4 py-2">
                {/* SVG Donut */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                    
                    {/* Slices calculated from dataState.diseaseDistribution percentages (35, 25, 15, 15, 10) */}
                    {/* StrokeDasharray represents (pct_val, 251.2 - pct_val) on a circle of radius 40 (circumference ~251.2) */}
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#ef4444" strokeWidth={activeDonutSlice === 0 ? "15" : "12"} 
                      strokeDasharray="87.92 251.2" strokeDashoffset="0"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setActiveDonutSlice(0)}
                    />
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#f59e0b" strokeWidth={activeDonutSlice === 1 ? "15" : "12"} 
                      strokeDasharray="62.8 251.2" strokeDashoffset="-87.92"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setActiveDonutSlice(1)}
                    />
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#8b5cf6" strokeWidth={activeDonutSlice === 2 ? "15" : "12"} 
                      strokeDasharray="37.68 251.2" strokeDashoffset="-150.72"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setActiveDonutSlice(2)}
                    />
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#3b82f6" strokeWidth={activeDonutSlice === 3 ? "15" : "12"} 
                      strokeDasharray="37.68 251.2" strokeDashoffset="-188.4"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setActiveDonutSlice(3)}
                    />
                    <circle 
                      cx="50" cy="50" r="40" fill="transparent" 
                      stroke="#10b981" strokeWidth={activeDonutSlice === 4 ? "15" : "12"} 
                      strokeDasharray="25.12 251.2" strokeDashoffset="-226.08"
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setActiveDonutSlice(4)}
                    />
                  </svg>
                  
                  {/* Inside Text */}
                  <div className="absolute text-center">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {dataState.diseaseDistribution[activeDonutSlice].percentage}%
                    </span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                      {dataState.diseaseDistribution[activeDonutSlice].disease.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-350">
                  {dataState.diseaseDistribution.map((item, idx) => {
                    const colors = ["bg-red-500", "bg-amber-500", "bg-purple-500", "bg-blue-500", "bg-emerald-500"];
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setActiveDonutSlice(idx)}
                        className={`flex items-center gap-2 cursor-pointer p-1 rounded-md transition ${activeDonutSlice === idx ? "bg-slate-100 dark:bg-slate-800" : ""}`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${colors[idx]}`} />
                        <span>{item.disease}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Stats for Active slice */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-850 p-3.5 rounded-2xl flex justify-between text-xs font-extrabold">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Impacted Farmers</span>
                  <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {dataState.diseaseDistribution[activeDonutSlice].farmers} growers
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase block">Impacted Acreage</span>
                  <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {dataState.diseaseDistribution[activeDonutSlice].acres} total acres
                  </span>
                </div>
              </div>
            </div>

            {/* High Risk Villages Widget */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800">
                High-Risk Villages Index
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {dataState.highRiskVillages.map((v, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center group">
                    <div>
                      <span className="text-xs font-black text-slate-850 dark:text-white block group-hover:text-[#31572c] transition">
                        {v.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                        Threat: {v.primaryDisease} • {v.populationAffected} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${
                        v.riskScore >= 80 ? "bg-red-100 text-red-700" : v.riskScore >= 60 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {v.riskScore}% Risk
                      </span>
                      <button
                        type="button"
                        onClick={() => triggerBroadcastAlert("Disease Alert", `${v.name} Village`)}
                        className="p-1 hover:bg-[#31572c]/10 text-[#31572c] hover:text-[#132a13] rounded-md transition cursor-pointer"
                        title="Broadcast warning alert"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Action Center & AI Recommendations */}
            <div className="bg-gradient-to-br from-red-500/5 to-amber-500/5 dark:from-red-950/10 dark:to-amber-950/10 border border-amber-500/20 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Emergency Action Center
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                {dataState.emergencyActions.map((action, idx) => (
                  <div key={idx} className="bg-white/80 dark:bg-brand-darkest/80 border border-slate-100 p-3 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-red-700 font-extrabold uppercase">{action.outbreak}</span>
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[8px] font-black uppercase">
                        {action.pendingResponses} Unresolved Cases
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-350 text-[11px] leading-relaxed">{action.recommendation}</p>
                    <button
                      type="button"
                      onClick={() => triggerCampaignLaunch("out-1")}
                      className="px-2.5 py-1 bg-[#31572c] hover:bg-[#132a13] text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition cursor-pointer"
                    >
                      Initiate Spray
                    </button>
                  </div>
                ))}
              </div>

              {/* AI Recommendations Panel */}
              <div className="pt-4 border-t border-amber-500/10 space-y-2.5">
                <h4 className="text-[10px] font-black text-[#31572c] dark:text-[#ecf39e] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  AI Surveillance Advisories
                </h4>
                <div className="space-y-2">
                  {dataState.aiRecommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-slate-700 dark:text-slate-300 text-[11px] font-semibold leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-[#31572c] shrink-0 mt-0.5" />
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PAGE 2: OUTBREAK MONITORING */}
      {subPath === "outbreaks" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Outbreak Registry List */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Epidemiological Outbreak monitoring registry
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    Select a regional pathogen threat below to inspect its containment stages.
                  </p>
                </div>
                
                {/* Outbreak Statistics Panel */}
                <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 dark:bg-slate-850 p-2 rounded-2xl border border-slate-100">
                  <div className="px-2">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Active</span>
                    <span className="text-xs font-black text-red-600">{dataState.outbreaks.filter(o => o.status !== "Resolved").length}</span>
                  </div>
                  <div className="px-2 border-l border-slate-200">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Contained</span>
                    <span className="text-xs font-black text-blue-600">{dataState.outbreaks.filter(o => o.status === "Contained").length}</span>
                  </div>
                  <div className="px-2 border-l border-slate-200">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Escalated</span>
                    <span className="text-xs font-black text-amber-600">{dataState.outbreaks.filter(o => o.status === "Escalated").length}</span>
                  </div>
                  <div className="px-2 border-l border-slate-200">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Resolved</span>
                    <span className="text-xs font-black text-emerald-600">{dataState.outbreaks.filter(o => o.status === "Resolved").length}</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-2.5">Disease</th>
                      <th className="py-2.5">Village</th>
                      <th className="py-2.5">Crop</th>
                      <th className="py-2.5 text-center">Farmers</th>
                      <th className="py-2.5 text-center">Acres</th>
                      <th className="py-2.5 text-center">Severity</th>
                      <th className="py-2.5 text-center">Detected</th>
                      <th className="py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {dataState.outbreaks.map((outbreak, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => setSelectedOutbreakId(outbreak.id)}
                        className={`cursor-pointer hover:bg-slate-50/50 transition-all ${
                          selectedOutbreakId === outbreak.id ? "bg-[#31572c]/5 dark:bg-[#ecf39e]/5" : ""
                        }`}
                      >
                        <td className="py-3 text-slate-900 dark:text-white flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          {outbreak.disease}
                        </td>
                        <td className="py-3 text-slate-700">{outbreak.village}</td>
                        <td className="py-3 text-slate-600">{outbreak.crop}</td>
                        <td className="py-3 text-center text-slate-800">{outbreak.farmers}</td>
                        <td className="py-3 text-center text-slate-800">{outbreak.acres} ac</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            outbreak.severity === "Critical" ? "bg-red-100 text-red-700" : outbreak.severity === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {outbreak.severity}
                          </span>
                        </td>
                        <td className="py-3 text-center text-slate-400">{outbreak.date}</td>
                        <td className="py-3 text-center">
                          <select
                            value={outbreak.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleOutbreakLifecycleStageChange(outbreak.id, e.target.value)}
                            className="text-[10px] font-black rounded-lg border border-slate-200 px-2 py-1 bg-white cursor-pointer"
                          >
                            <option value="Detected">Detected</option>
                            <option value="Verified">Verified</option>
                            <option value="Escalated">Escalated</option>
                            <option value="Containment Started">Containment Started</option>
                            <option value="Contained">Contained</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Outbreak Lifecycle Tracker Steps Visualization */}
            {selectedOutbreakId && (
              <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                  Outbreak Lifecycle Tracker
                </h3>
                {(() => {
                  const activeOutbreakObj = dataState.outbreaks.find(o => o.id === selectedOutbreakId);
                  if (!activeOutbreakObj) return null;

                  const stages = ["Detected", "Verified", "Escalated", "Containment Started", "Contained", "Resolved"];
                  const currentIdx = stages.indexOf(activeOutbreakObj.status);

                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-black text-slate-700">
                        <span>Pathogen: <b>{activeOutbreakObj.disease}</b> ({activeOutbreakObj.village})</span>
                        <span className="text-[#31572c] uppercase">{activeOutbreakObj.status}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        {stages.map((stage, sIdx) => {
                          const isPast = sIdx < currentIdx;
                          const isCurrent = sIdx === currentIdx;
                          return (
                            <div key={sIdx} className="flex-1 flex flex-row sm:flex-col items-center justify-start w-full sm:w-auto relative">
                              {/* Step circle */}
                              <div 
                                onClick={() => handleOutbreakLifecycleStageChange(selectedOutbreakId, stage)}
                                className={`h-8 w-8 rounded-full border flex items-center justify-center font-black text-xs cursor-pointer z-10 transition-all ${
                                  isCurrent ? "bg-[#31572c] text-[#ecf39e] border-[#31572c] scale-110 shadow-md shadow-[#31572c]/20" :
                                  isPast ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-slate-50 text-slate-400 border-slate-200"
                                }`}
                              >
                                {isPast ? <Check className="w-4 h-4" /> : sIdx + 1}
                              </div>
                              
                              <span className={`text-[10px] font-black mt-2 ml-3 sm:ml-0 text-center ${
                                isCurrent ? "text-slate-900 font-extrabold" : "text-slate-450"
                              }`}>
                                {stage}
                              </span>

                              {/* Connectors */}
                              {sIdx < stages.length - 1 && (
                                <div className={`hidden sm:block absolute left-[50%] top-4 right-[-50%] h-0.5 z-0 ${
                                  sIdx < currentIdx ? "bg-emerald-400" : "bg-slate-100"
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 flex justify-between">
                        <button
                          type="button"
                          onClick={() => triggerCampaignLaunch(selectedOutbreakId)}
                          disabled={activeOutbreakObj.status === "Resolved"}
                          className="px-3.5 py-1.5 bg-[#31572c] hover:bg-[#132a13] disabled:opacity-40 text-white rounded-lg text-[10px] font-black uppercase transition cursor-pointer"
                        >
                          Launch Response Campaign
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOutbreakLifecycleStageChange(selectedOutbreakId, "Resolved")}
                          disabled={activeOutbreakObj.status === "Resolved"}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-[10px] font-black uppercase transition cursor-pointer"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

          </div>

          <div className="space-y-6">
            
            {/* Severity Distribution Dashboard Component */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                Severity Distribution
              </h3>

              <div className="h-32 flex items-end justify-around gap-2 pt-2">
                {[
                  { label: "Low", value: 1, color: "bg-blue-400" },
                  { label: "Moderate", value: 2, color: "bg-amber-400" },
                  { label: "High", value: 5, color: "bg-amber-500" },
                  { label: "Critical", value: 8, color: "bg-red-500" }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-[10px] font-black text-slate-700">{item.value}</span>
                    <div className={`w-full ${item.color} rounded-t-md`} style={{ height: `${(item.value / 8) * 100}%` }}></div>
                    <span className="text-[9px] font-black text-slate-450 mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spread Trend Analysis Dashboard Component */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                Spread Trend Analysis
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-[8px] text-slate-450 block uppercase">Daily Cases</span>
                  <span className="text-sm font-black text-red-500 mt-1 block">4 new cases</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-[8px] text-slate-450 block uppercase">Weekly Cases</span>
                  <span className="text-sm font-black text-red-600 mt-1 block">22 total cases</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-[8px] text-slate-450 block uppercase">Growth Rate</span>
                  <span className="text-sm font-black text-amber-500 mt-1 block">+12% WoW</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-[8px] text-slate-450 block uppercase">Containment Rate</span>
                  <span className="text-sm font-black text-emerald-600 mt-1 block">84.5%</span>
                </div>
              </div>
            </div>

            {/* Village Comparison View */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3.5">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                Village Comparison View
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                {[
                  { village: "Kharindwa", outbreaks: 3, riskIndex: "Critical", contained: "40%" },
                  { village: "Bhucho Mandi", outbreaks: 2, riskIndex: "High", contained: "80%" },
                  { village: "Raman", outbreaks: 1, riskIndex: "Critical", contained: "20%" },
                  { village: "Shirur", outbreaks: 1, riskIndex: "Moderate", contained: "100%" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                    <div>
                      <span className="font-extrabold text-slate-800">{item.village}</span>
                      <span className="text-[9px] text-slate-400 block">{item.outbreaks} active pathogen threats</span>
                    </div>
                    <div className="text-right">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] ${
                        item.riskIndex === "Critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>{item.riskIndex}</span>
                      <span className="text-[9px] text-slate-450 block mt-1">Contained: {item.contained}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PAGE 3: DISEASE INTELLIGENCE MAP */}
      {subPath === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Layer Controls */}
          <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-5 h-fit">
            
            {/* Layers Toggle List */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100">
                Surveillance Layers
              </h3>
              <div className="space-y-3 mt-3">
                {[
                  { key: "disease", label: "Disease Reports (Critical)", color: "bg-red-500" },
                  { key: "farmer", label: "Farmer Reports (Moderate)", color: "bg-blue-500" },
                  { key: "government", label: "Government Reports", color: "bg-emerald-500" },
                  { key: "weather", label: "Weather Risk Matrix Overlay", color: "bg-amber-500" },
                  { key: "satellite", label: "Satellite Biomass Indicators", color: "bg-emerald-450" },
                  { key: "historical", label: "Historical Hotspots", color: "bg-slate-400" },
                  { key: "forecast", label: "Pathogen Risk Forecast Overlay", color: "bg-purple-500" }
                ].map((layer) => (
                  <label key={layer.key} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapLayers[layer.key]}
                      onChange={(e) => setMapLayers(prev => ({ ...prev, [layer.key]: e.target.checked }))}
                      className="rounded border-slate-300 text-[#31572c] focus:ring-[#31572c] h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${layer.color}`} />
                      {layer.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hotspot Detection Legend */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest block mb-2">
                Hotspot Detection Legend
              </h4>
              <div className="space-y-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500" />
                  <span>Critical Zones (Vulnerability &gt; 70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500/20 border border-blue-500" />
                  <span>Moderate Zones (Vulnerability 40-70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
                  <span>Safe Zones (Vulnerability &lt; 40%)</span>
                </div>
              </div>
            </div>

            {/* Pathogen Spore Drift Simulator Controls */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">
                Pathogen Spore Drift Simulator
              </h4>
              
              <div className="grid grid-cols-3 gap-1.5">
                {[3, 7, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => runSporeDriftSimulation(d)}
                    disabled={isSimulating}
                    className={`py-1.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                      simDays === d ? "bg-[#31572c] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>

              {isSimulating && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold">
                    <span className="text-slate-400">Drifting vector:</span>
                    <span className="text-purple-600 font-extrabold">{windDirection}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all duration-300" style={{ width: `${simTime * 16.6}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Risk Overlay Selection */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">
                Meteorological Risk Overlay
              </h4>
              <div className="space-y-1.5 text-xs font-bold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="riskOverlay" defaultChecked className="text-[#31572c] h-3 w-3" />
                  <span>Disease Infection Index</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="riskOverlay" className="text-[#31572c] h-3 w-3" />
                  <span>Microclimate humidity risk</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="riskOverlay" className="text-[#31572c] h-3 w-3" />
                  <span>Crop Vulnerability rank</span>
                </label>
              </div>
            </div>

          </div>

          {/* Map Container */}
          <div className="lg:col-span-3 bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between min-h-[520px]">
            <div className="relative flex-1 min-h-[520px]">
              <div ref={mapRef} className="w-full h-full min-h-[520px] z-0" />
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-brand-darkest/80 z-20 text-[#31572c] text-xs font-black">
                  <Loader2 className="h-8 w-8 text-[#31572c] animate-spin mr-2" />
                  Initializing Spatial Vector Map Engine...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: FARMER CASE MANAGEMENT */}
      {subPath === "cases" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Case Registry Ledger */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Farmer Case Management Ledger
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    Manage crop infections, field scanner image checks, and resolution indexes.
                  </p>
                </div>

                {/* Case Overview Metrics Strip */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-2xl">
                  <div>
                    <span className="text-[8px] text-slate-450 block uppercase">Open</span>
                    <span className="font-black text-red-600">{dataState.cases.filter(c => c.status === "Open").length}</span>
                  </div>
                  <div className="border-l border-slate-200 px-1">
                    <span className="text-[8px] text-slate-450 block uppercase">Critical</span>
                    <span className="font-black text-red-700">{dataState.cases.filter(c => c.severity === "Critical").length}</span>
                  </div>
                  <div className="border-l border-slate-200 px-1">
                    <span className="text-[8px] text-slate-450 block uppercase">Review</span>
                    <span className="font-black text-amber-600">1</span>
                  </div>
                  <div className="border-l border-slate-200 px-1">
                    <span className="text-[8px] text-slate-450 block uppercase">Resolved</span>
                    <span className="font-black text-emerald-600">{dataState.cases.filter(c => c.status === "Resolved").length}</span>
                  </div>
                </div>
              </div>

              {/* Priority Queue Category Filter Tabs */}
              <div className="flex gap-2 pb-2">
                {["All", "Critical", "High Priority", "Medium Priority", "Resolved"].map((tab) => {
                  const filterVal = tab === "High Priority" ? "High" : tab === "Medium Priority" ? "Moderate" : tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCaseFilterTab(tab)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                        caseFilterTab === tab ? "bg-[#31572c] text-white" : "bg-slate-100 text-slate-655 hover:bg-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-2.5">Farmer</th>
                      <th className="py-2.5">Village</th>
                      <th className="py-2.5">Crop</th>
                      <th className="py-2.5">Pathogen/Disease</th>
                      <th className="py-2.5 text-center">Severity</th>
                      <th className="py-2.5 text-center">Status</th>
                      <th className="py-2.5 text-center">Assigned Officer</th>
                      <th className="py-2.5 text-right">Last Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {dataState.cases
                      .filter(c => {
                        if (caseFilterTab === "All") return true;
                        if (caseFilterTab === "Critical") return c.severity === "Critical";
                        if (caseFilterTab === "High Priority") return c.severity === "High";
                        if (caseFilterTab === "Medium Priority") return c.severity === "Moderate";
                        if (caseFilterTab === "Resolved") return c.status === "Resolved";
                        return true;
                      })
                      .map((item, idx) => (
                        <tr 
                          key={idx} 
                          onClick={() => {
                            setSelectedCase(item);
                            setAssigneeId(item.officer || "Vikram Dev");
                            setProgressSlider(item.progress || 0);
                          }}
                          className={`hover:bg-slate-50/50 cursor-pointer ${
                            selectedCase?.id === item.id ? "bg-[#31572c]/5 dark:bg-[#ecf39e]/5" : ""
                          }`}
                        >
                          <td className="py-3 text-slate-900 dark:text-white">{item.farmer}</td>
                          <td className="py-3 text-slate-500">{item.village}</td>
                          <td className="py-3 text-slate-600">{item.crop}</td>
                          <td className="py-3 text-slate-700">{item.disease}</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              item.severity === "Critical" ? "bg-red-100 text-red-700" : item.severity === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-755"
                            }`}>
                              {item.severity}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase ${
                              item.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 text-center text-slate-500">{item.officer || "Unassigned"}</td>
                          <td className="py-3 text-right text-slate-400">{item.updated}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Interactive Case File Detail Panel */}
          <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-5 shadow-sm h-fit space-y-5">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
              Interactive Case File Drawer
            </h3>

            {selectedCase ? (
              <div className="space-y-4 text-xs font-semibold">
                
                {/* Farmer identity profile */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Farmer Profile</span>
                  <div className="flex justify-between items-center bg-[#f4f7f4]/40 rounded-xl p-3 border border-slate-100">
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedCase.farmer}</h4>
                      <p className="text-[10px] text-slate-500">{selectedCase.village} Cluster • Sown crop: {selectedCase.crop}</p>
                    </div>
                    <span className="text-[10px] font-black text-purple-600">{selectedCase.id}</span>
                  </div>
                </div>

                {/* Diagnostic leaf scan preview */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Leaf Scan History & Images</span>
                  <div className="bg-slate-900 rounded-2xl h-28 flex items-center justify-center relative overflow-hidden border border-slate-800">
                    {/* Simulated leaf structure graphic via SVG */}
                    <svg className="w-20 h-20 text-emerald-800" viewBox="0 0 100 100">
                      <path d="M 50 10 C 20 40, 20 70, 50 90 C 80 70, 80 40, 50 10 Z" fill="currentColor" />
                      <line x1="50" y1="10" x2="50" y2="90" stroke="#10b981" strokeWidth="2" />
                      <path d="M 50 30 Q 35 40 25 45 M 50 50 Q 35 60 25 68 M 50 70 Q 38 78 30 84" stroke="#10b981" strokeWidth="1.5" />
                      <path d="M 50 30 Q 65 40 75 45 M 50 50 Q 65 60 75 68 M 50 70 Q 62 78 70 84" stroke="#10b981" strokeWidth="1.5" />
                      {/* Spots representing lesions */}
                      <circle cx="45" cy="45" r="4.5" fill="#f59e0b" />
                      <circle cx="35" cy="58" r="5.5" fill="#f59e0b" />
                      <circle cx="58" cy="62" r="3.5" fill="#ef4444" />
                    </svg>
                    <span className="absolute bottom-2 right-2 text-[9px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded">
                      Lesions Detected
                    </span>
                  </div>
                </div>

                {/* Pathology Details */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Pathology diagnosis</span>
                  <div><b>Disease:</b> {selectedCase.disease}</div>
                  <div><b>Observed Symptoms:</b> Concentric spot lesion margins spreading vertically across leaf veins.</div>
                  <div className="bg-slate-50 p-2 rounded-xl text-[10px] text-slate-500">
                    <b>Treatments Applied:</b> Chemical advisory issued (Propiconazole 0.1% or Tricyclazole WP splittings).
                  </div>
                </div>

                {/* Officer assignment */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Assigned Response Officer</label>
                  <div className="flex gap-2">
                    <select
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-bold bg-white"
                    >
                      <option value="Vikram Dev">Vikram Dev (Northern Area)</option>
                      <option value="Aman Preet">Aman Preet (Eastern Area)</option>
                      <option value="Ramesh Deshmukh">Ramesh Deshmukh (Western Area)</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAssignOfficer}
                      className="px-3.5 py-1.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-lg font-black uppercase text-[10px] cursor-pointer"
                    >
                      Assign
                    </button>
                  </div>
                </div>

                {/* Recovery Tracking */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Recovery tracking index</span>
                    <span className="font-black text-[#31572c]">{progressSlider}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={progressSlider}
                    onChange={(e) => handleUpdateProgress(e.target.value)}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                    <span>Infected</span>
                    <span>50% Remission</span>
                    <span>100% Resolved</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1 font-bold">
                    <div><b>Treatment Efficacy:</b> {selectedCase.effectiveness || "High"}</div>
                    <div className="text-right"><b>Last Follow-up:</b> {selectedCase.lastFollowUp}</div>
                  </div>
                </div>

                {/* Escalation triggers */}
                {selectedCase.status === "Open" && (
                  <button
                    type="button"
                    onClick={() => triggerCaseEscalation(selectedCase.id)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-black uppercase tracking-wider transition cursor-pointer"
                  >
                    Escalate Case to Outbreak
                  </button>
                )}

              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-bold text-xs">
                Select a farmer case profile from the ledger table to inspect scanned leaf images, assign response officers, or update recovery indexes.
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAGE 5: RISK FORECASTING */}
      {subPath === "predictions" && (
        <div className="space-y-6">
          
          {/* Forecast Summary Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Predicted Outbreaks", value: dataState.predictions.length, change: "+3 new this week", color: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
              { label: "High Risk Villages", value: 3, change: "Kharindwa, Raman, Sangat", color: "text-red-600 bg-red-500/10 border-red-500/20" },
              { label: "Risk Increase %", value: "+18.2%", change: "Humidity delta threshold crossed", color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
              { label: "Expected Yield Loss", value: "18.5%", change: "If untreated in 14 days", color: "text-purple-700 bg-purple-500/10 border-purple-500/20" }
            ].map((card, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border flex flex-col justify-between h-24 shadow-sm backdrop-blur-md ${card.color} font-bold`}>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">{card.label}</span>
                <span className="text-xl font-black mt-1">{card.value}</span>
                <span className="text-[9px] font-semibold mt-1 opacity-75">{card.change}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Forecast Table */}
              <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Spatially Projected Disease Forecasts
                  </h3>
                  
                  {/* Timeline Horizon selector */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {[7, 14, 30].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => {
                          setForecastDays(days);
                          addSimLog(`Forecast models simulated for a ${days}-day horizon.`, "TrendingUp");
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition cursor-pointer ${
                          forecastDays === days ? "bg-[#31572c] text-white" : "text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-2">Pathogen/Disease</th>
                        <th className="py-2 text-center">Probability</th>
                        <th className="py-2 text-center">Expected Date</th>
                        <th className="py-2 text-center">Affected Area</th>
                        <th className="py-2 text-center">Confidence Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                      {dataState.predictions.map((pred, idx) => {
                        // Dynamically adjust forecast metrics based on timeline toggles
                        const multiplier = forecastDays === 30 ? 1.15 : forecastDays === 7 ? 0.85 : 1.0;
                        const probability = Math.min(99, Math.round(pred.probability * multiplier));
                        
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-3 text-slate-900 dark:text-white flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                              {pred.disease}
                            </td>
                            <td className="py-3 text-center text-red-600 font-black">{probability}% Risk</td>
                            <td className="py-3 text-center text-slate-700">{pred.expectedDate}</td>
                            <td className="py-3 text-center text-slate-500">{pred.affectedArea}</td>
                            <td className="py-3 text-center">
                              <span className="px-2.5 py-0.5 rounded bg-purple-50 text-purple-700 font-black text-[9px]">
                                {pred.confidence}% Confidence
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Village Risk Ranking Dashboard Component */}
              <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                  Village Risk Ranking Table
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                  {[
                    { village: "Kharindwa", score: 88, primaryThreat: "Rice Blast" },
                    { village: "Bhucho Mandi", score: 79, primaryThreat: "Yellow Rust" },
                    { village: "Raman", score: 74, primaryThreat: "Late Blight" }
                  ].map((ranked, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 uppercase">Rank {idx + 1}</span>
                      <span className="text-sm font-black text-slate-800 mt-1 block">{ranked.village}</span>
                      <span className="text-red-655 mt-2 block">{ranked.score}% Risk Score</span>
                      <span className="text-[10px] text-slate-455 block mt-0.5">Threat: {ranked.primaryThreat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="space-y-6">
              
              {/* Weather Correlation Analysis component */}
              <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                  Meteorological Risk Factors
                </h3>

                <div className="space-y-4 font-bold text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-red-500" /> Temperature</span>
                      <span className="text-slate-800">32.4°C (Normal)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> Humidity</span>
                      <span className="text-red-600 font-extrabold">84.2% (High Risk)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-400" /> Rainfall</span>
                      <span className="text-slate-800">14.2 mm (Moderate)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-purple-500" /> Wind Velocity</span>
                      <span className="text-purple-600 font-extrabold">16 km/h (drift alert)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Forecast Explanation Card */}
              <div className="bg-[#f4f7f4] border border-slate-200 dark:bg-brand-darkest/95 dark:border-brand-dark/25 p-5 rounded-3xl space-y-3">
                <h4 className="text-xs font-black text-[#31572c] dark:text-[#ecf39e] uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  AI Forecast Explainer
                </h4>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">
                  Relative moisture indexes have surpassed the 80% threshold for 4 consecutive days in Kharindwa and Raman clusters. This matches the biological requirements for Blast & Blight sporulation. Wind coordinates towards the North-East are active, creating high transmission spore velocities. Immediate preventive warning alerts are advised.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* PAGE 6: TREATMENT CAMPAIGN CENTER */}
      {subPath === "campaigns" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active spray campaigns list */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Active Response Containment Campaigns
                </h3>

                {/* Campaign Overview KPIs */}
                <div className="flex gap-4 text-xs font-bold text-slate-700">
                  <div>
                    <span className="text-[8px] text-slate-450 block uppercase">Active</span>
                    <span className="text-xs font-black text-red-600">{dataState.campaigns.filter(c => c.status === "Active").length}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-[8px] text-slate-450 block uppercase">Completed</span>
                    <span className="text-xs font-black text-emerald-600">{dataState.campaigns.filter(c => c.status === "Completed").length}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-[8px] text-slate-450 block uppercase">Success Rate</span>
                    <span className="text-xs font-black text-purple-600">92.4%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {dataState.campaigns.map((camp, idx) => (
                  <div key={idx} className="border border-slate-100 dark:border-brand-dark/15 rounded-2xl p-4.5 space-y-3.5 font-semibold">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black text-slate-950 dark:text-white">{camp.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Disease: {camp.disease} • Village sector: {camp.village}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          camp.status === "Active" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {camp.status}
                        </span>
                        {camp.status === "Active" && (
                          <button
                            type="button"
                            onClick={() => triggerCampaignComplete(camp.id)}
                            className="p-1 hover:bg-[#31572c]/10 text-[#31572c] rounded-md transition cursor-pointer"
                            title="Complete campaign"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Required Drug</span>
                        <span className="font-extrabold text-slate-800">{camp.pesticide}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">FPO Inventory Volume</span>
                        <span className="font-extrabold text-slate-800">{camp.required}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Estimated Cost</span>
                        <span className="font-extrabold text-slate-800">₹{camp.cost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Farmers Reached</span>
                        <span className="font-extrabold text-slate-800">{camp.completed} / {camp.farmers}</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1.5">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-slate-400">Coverage Percentage</span>
                        <span className="text-[#31572c]">{Math.round((camp.completed / camp.farmers) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#31572c] h-full rounded-full transition-all duration-500" style={{ width: `${(camp.completed / camp.farmers) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Team Tracker Component */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                Field Team tracker
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
                {[
                  { name: "Vikram Dev", status: "Active in Kharindwa", completed: 18 },
                  { name: "Aman Preet", status: "Active in Bhucho Mandi", completed: 25 },
                  { name: "Ramesh Deshmukh", status: "Standby", completed: 12 }
                ].map((officer, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-slate-950 dark:text-white font-extrabold block">{officer.name}</span>
                      <span className="text-[9px] text-slate-450 block mt-0.5">{officer.status}</span>
                    </div>
                    <span className="text-[#31572c] font-black">{officer.completed} visits</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            {/* Create Campaign Panel */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#31572c]" />
                Schedule Response Campaign
              </h3>

              <form onSubmit={handleCreateCampaignSubmit} className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase">Target Disease</label>
                  <select
                    value={newCampaign.disease}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, disease: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 bg-white"
                  >
                    <option value="Rice Blast">Rice Blast</option>
                    <option value="Yellow Rust">Yellow Rust</option>
                    <option value="Late Blight">Late Blight</option>
                    <option value="Downy Mildew">Downy Mildew</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase">Target Village Cluster</label>
                  <select
                    value={newCampaign.village}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, village: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 bg-white"
                  >
                    <option value="Kharindwa">Kharindwa</option>
                    <option value="Bhucho Mandi">Bhucho Mandi</option>
                    <option value="Raman">Raman</option>
                    <option value="Shirur">Shirur</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase">Target Farmers count</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={newCampaign.farmers}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, farmers: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase">Campaign response type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 bg-white"
                  >
                    <option value="Preventive Spray">Preventive Spray</option>
                    <option value="Emergency Containment Spray">Emergency Containment Spray</option>
                    <option value="Crop Quarantine Action">Crop Quarantine Action</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-lg font-black uppercase tracking-wider transition-all mt-4 cursor-pointer"
                >
                  Schedule Campaign
                </button>
              </form>
            </div>

            {/* Resource Planning Calculator Display Widget */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                Resource Planning Calculator
              </h3>
              
              {(() => {
                const requiredFungicide = newCampaign.farmers * 1.5;
                const estimatedCost = newCampaign.farmers * 350;

                return (
                  <div className="space-y-3 text-xs font-bold text-slate-700">
                    <div className="flex justify-between">
                      <span>Required Fungicide:</span>
                      <span className="text-slate-950 font-extrabold">{requiredFungicide} Liters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Pesticide:</span>
                      <span className="text-slate-950 font-extrabold">{requiredFungicide * 2.5} WP bags</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Cost:</span>
                      <span className="text-slate-950 font-extrabold">₹{estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Warehouse Inventory:</span>
                      <span className="text-emerald-700 font-extrabold">450 Liters (Safe)</span>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* PAGE 7: DISEASE ALERTS & ADVISORIES */}
      {subPath === "alerts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispatch Panel */}
          <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#31572c]" />
              Draft Member Advisory Warning
            </h3>

            <form onSubmit={handleSendAlertSubmit} className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase">Warning Type</label>
                <select
                  value={alertFormGroup.type}
                  onChange={(e) => setAlertFormGroup(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 bg-white"
                >
                  <option value="Disease Alert">Disease Alert</option>
                  <option value="Weather Alert">Weather Alert</option>
                  <option value="Emergency Alert">Emergency Alert</option>
                  <option value="Treatment Advisory">Treatment Advisory</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase">Target Audience Group</label>
                <select
                  value={alertFormGroup.audience}
                  onChange={(e) => setAlertFormGroup(prev => ({ ...prev, audience: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 bg-white"
                >
                  <option value="Rice Growers">Rice Growers</option>
                  <option value="Wheat Growers">Wheat Growers</option>
                  <option value="Kharindwa Village">Kharindwa Village</option>
                  <option value="All active FPO members">All active FPO members</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase">Delivery Channel</label>
                <select
                  value={alertFormGroup.channel}
                  onChange={(e) => setAlertFormGroup(prev => ({ ...prev, channel: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 bg-white"
                >
                  <option value="SMS & WhatsApp">SMS & WhatsApp</option>
                  <option value="SMS Only">SMS Only</option>
                  <option value="WhatsApp Only">WhatsApp Only</option>
                  <option value="Mobile App Notification">Mobile App Notification</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase">Warning Message</label>
                <textarea
                  required
                  rows="4"
                  value={alertFormGroup.message}
                  onChange={(e) => setAlertFormGroup(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="e.g. High micro-humidity vectors registered. Plan split urea applications and inspect leaf veins immediately."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-lg font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Broadcast Advisory Alert
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            
            {/* Broadcast History log */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  Broadcasting Advisory logs
                </h3>

                {/* Alert Statistics Panel */}
                <div className="flex gap-4 text-xs font-bold text-slate-700">
                  <div>
                    <span className="text-[8px] text-slate-450 block uppercase">Sent</span>
                    <span className="text-xs font-black text-slate-950">1,850</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-[8px] text-slate-450 block uppercase">Delivered</span>
                    <span className="text-xs font-black text-emerald-650">98.5%</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-[8px] text-slate-450 block uppercase">Read Rate</span>
                    <span className="text-xs font-black text-purple-650">84.2%</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-2.5">Warning Type</th>
                      <th className="py-2.5">Audience Group</th>
                      <th className="py-2.5 text-center">Date Broadcasted</th>
                      <th className="py-2.5 text-center">Delivered</th>
                      <th className="py-2.5 text-center">Read Rate</th>
                      <th className="py-2.5 text-center">Acknowledged</th>
                      <th className="py-2.5 text-right">Delivery Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {dataState.alerts.map((al, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-blue-500" />
                          {al.type}
                        </td>
                        <td className="py-3 text-slate-700">{al.audience}</td>
                        <td className="py-3 text-center text-slate-400">{al.date}</td>
                        <td className="py-3 text-center text-slate-800">{al.delivered} / {al.sent}</td>
                        <td className="py-3 text-center text-purple-600 font-black">
                          {Math.round((al.read / al.delivered) * 100)}%
                        </td>
                        <td className="py-3 text-center text-slate-800">{al.acknowledged}</td>
                        <td className="py-3 text-right text-slate-400">{al.channel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alert Performance Analytics curves */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                Alert Performance Analytics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Open Rate</span>
                  <span className="text-lg font-black text-slate-950 mt-1 block">94.8%</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Read Rate</span>
                  <span className="text-lg font-black text-slate-950 mt-1 block">82.5%</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <span className="text-[9px] text-slate-400 block uppercase">Response Rate</span>
                  <span className="text-lg font-black text-purple-600 mt-1 block">74.2%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PAGE 8: IMPACT ANALYTICS */}
      {subPath === "analytics" && (
        <div className="space-y-6">
          {/* Yield vs Revenue Impact grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Yield Loss widgets */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                Sowing Yield Delta Loss Prevention
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Yield Loss</span>
                  <span className="text-2xl font-black text-red-650 block mt-1">{dataState.impact.expectedLoss}</span>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Based on untreated pathogen progression vectors</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Prevented Yield Loss</span>
                  <span className="text-2xl font-black text-emerald-650 block mt-1">{dataState.impact.preventedLoss}</span>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Yield saved through chemical/organic intervention</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Recovered Yield</span>
                  <span className="text-2xl font-black text-purple-650 block mt-1">{dataState.impact.recoveredYield}</span>
                </div>
              </div>
            </div>

            {/* Economic Impact widgets */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
                Business Financial Benefits Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Revenue Saved</span>
                  <span className="text-2xl font-black text-emerald-650 block mt-1">₹{dataState.impact.revenueSaved.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Loss Prevented</span>
                  <span className="text-2xl font-black text-slate-800 block mt-1">₹{dataState.impact.lossPrevented.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Treatment Cost</span>
                  <span className="text-2xl font-black text-red-655 block mt-1">₹{dataState.impact.treatmentCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Campaign benefit calculator */}
            <div className="bg-[#f4f7f4] border border-slate-200 dark:bg-brand-darkest dark:border-[#31572c]/20 text-slate-850 dark:text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-[#31572c] dark:text-[#ecf39e] uppercase tracking-wider pb-2 border-b border-[#31572c]/10">
                  Surveillance Campaign ROI
                </h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed mt-3">
                  Every Rupee spent by the FPO on pesticide inventory management and warning dispatch alerts returned <b>₹13.7</b> in protected crop arrival revenue at the Mandis.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700/60 mt-4">
                <span className="text-[10px] text-[#31572c]/75 dark:text-[#ecf39e]/75 font-bold uppercase block">Net Benefit</span>
                <span className="text-3xl font-black text-[#31572c] dark:text-[#ecf39e] mt-1 block">₹{dataState.impact.netBenefit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Disease Impact Rankings */}
          <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
              Disease Impact Rankings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-450 block uppercase">Most Damaging Diseases</span>
                <span className="text-sm font-black text-slate-950 mt-1 block">1. Rice Blast (22% loss)</span>
                <span className="text-slate-500 block mt-0.5">2. Late Blight (35% loss in Potato)</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-450 block uppercase">Most Affected Crops</span>
                <span className="text-sm font-black text-slate-950 mt-1 block">1. Rice (45% of outbreaks)</span>
                <span className="text-slate-500 block mt-0.5">2. Wheat (30% of outbreaks)</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-450 block uppercase">Most Vulnerable Villages</span>
                <span className="text-sm font-black text-[#31572c] mt-1 block">1. Kharindwa (92% vulnerability)</span>
                <span className="text-slate-500 block mt-0.5">2. Raman (79% vulnerability)</span>
              </div>
            </div>
          </div>

          {/* Treatment Performance Analytics */}
          <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100">
              Treatment Performance Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-450 block uppercase">Treatment Success %</span>
                <span className="text-lg font-black text-emerald-650 mt-1 block">91.4% (Tricyclazole)</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-450 block uppercase">Average Recovery Time</span>
                <span className="text-lg font-black text-slate-950 mt-1 block">5.4 Days</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-450 block uppercase">Campaign Success Rate</span>
                <span className="text-lg font-black text-purple-650 mt-1 block">88.5% coverage</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* PAGE 9: HISTORICAL DISEASE INTELLIGENCE */}
      {subPath === "history" && (
        <div className="space-y-6">
          
          {/* Historical Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold text-slate-700">
            {/* Village Intelligence */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">
                Village Intelligence
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Most Vulnerable:</span>
                  <span className="text-red-655 font-extrabold">Kharindwa Cluster</span>
                </div>
                <div className="flex justify-between">
                  <span>Highest Outbreak Freq:</span>
                  <span className="text-slate-800">Bhucho Mandi (4 outbreaks)</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Yield Loss:</span>
                  <span className="text-slate-850">14.2% annually</span>
                </div>
              </div>
            </div>

            {/* Crop Intelligence */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">
                Crop Intelligence
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Most Affected Crops:</span>
                  <span className="text-slate-800">Rice, Wheat</span>
                </div>
                <div className="flex justify-between">
                  <span>Most Resilient Crops:</span>
                  <span className="text-[#31572c] font-extrabold">Mustard (0.5% loss)</span>
                </div>
                <div className="flex justify-between">
                  <span>Recurring Disease Patterns:</span>
                  <span className="text-slate-850">Yellow Rust during CRI stage</span>
                </div>
              </div>
            </div>

            {/* Historical Forecast Accuracy */}
            <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">
                Historical Forecast Accuracy
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Prediction Accuracy:</span>
                  <span className="text-[#31572c] font-extrabold">88.4% (Gemini Core)</span>
                </div>
                <div className="flex justify-between">
                  <span>False Positives:</span>
                  <span className="text-slate-800">4 cases (last 12 mos)</span>
                </div>
                <div className="flex justify-between">
                  <span>False Negatives:</span>
                  <span className="text-slate-850">1 case (resolved)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Database Table */}
          <div className="bg-white dark:bg-brand-darkest rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Historical Pathogen Outbreaks Registry
                </h2>
                <p className="text-[10px] text-slate-450 font-semibold mt-1">
                  Crop protection records matching village conditions, crop stages, and yield deltas.
                </p>
              </div>
              <div className="text-xs font-black text-purple-600 uppercase">
                5-Year Audit Archive
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-2.5">Disease</th>
                    <th className="py-2.5">Affected Village Sector</th>
                    <th className="py-2.5">Crop Sown</th>
                    <th className="py-2.5 text-center">Farming Season</th>
                    <th className="py-2.5 text-center">Regional Impact Index</th>
                    <th className="py-2.5 text-right">Yield Loss percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {dataState.history.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-900 dark:text-white flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        {row.disease}
                      </td>
                      <td className="py-3 text-slate-500">{row.village}</td>
                      <td className="py-3 text-slate-700">{row.crop}</td>
                      <td className="py-3 text-center text-slate-800">{row.season}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase ${
                          row.impact.includes("Severe") ? "bg-red-50 text-red-700" : row.impact.includes("High") ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
                        }`}>
                          {row.impact}
                        </span>
                      </td>
                      <td className="py-3 text-right text-red-600 font-black">{row.yieldLoss}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      )}

    </div>
  );
}
