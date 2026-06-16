import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const crops = ['Wheat', 'Rice', 'Soybean', 'Cotton', 'Mustard', 'Maize', 'Sugarcane', 'Onion', 'Tomato', 'Potato'];
const regions = ['Punjab', 'Haryana', 'Maharashtra', 'Madhya Pradesh', 'UP', 'Gujarat', 'Karnataka', 'Telangana'];
const issues = ['Pest infestation', 'Unseasonal rains', 'Heatwave', 'Transport strike', 'Fertilizer shortage', 'Supply chain glut'];

const rolesConfig = {
  'Farmer': {
    'mandi-insights': { 
      templates: [
        "{crop} arrivals surge in {region} Mandis, modal price drops by ₹150/qtl.",
        "Traders anticipate a bullish trend for {crop} following strong export demand.",
        "Local mandi in {region} introduces e-NAM digital auctioning to improve transparency.",
        "{crop} procurement by state agencies begins at MSP of ₹2,275 per quintal."
      ],
      metrics: ['Arrival Vol: 1.2k Qtls', 'Modal: ₹2,450', 'Trend: Up +2%'], actions: ['Sell 40% immediately', 'Hold rest for 1 week'], tags: ['PRICE', 'TREND', 'MSP'] },
    'weather-safety': { 
      templates: [
        "IMD issues orange alert for heavy rainfall in {region} over the next 48 hours.",
        "Extended dry spell threatens {crop} yields in central {region}.",
        "Hailstorm damages early sown {crop} in northern districts.",
        "Optimal weather conditions forecast for upcoming {crop} sowing season."
      ],
      metrics: ['Precip: 45mm', 'Temp: 32°C', 'Humidity: 85%'], actions: ['Delay sowing by 3 days', 'Clear drainage canals'], tags: ['ALERT', 'WEATHER', 'CRITICAL'] },
    'agri-tech': { 
      templates: [
        "New AI-driven soil testing kits distributed to farmers in {region}.",
        "Subsidy announced for purchasing agricultural drones for precision spraying.",
        "Mobile app launched for real-time crop disease diagnosis using smartphone cameras.",
        "Adoption of solar water pumps increases by 20% due to favorable state policies."
      ],
      metrics: ['Drone Tech Adop: +15%', 'Subsidy: 50%', 'Cost: ₹4k/Acre'], actions: ['Apply for drone subsidy', 'Schedule soil mapping'], tags: ['TECH', 'SUBSIDY', 'UPDATE'] },
    'financial-credit': { 
      templates: [
        "RBI extends interest subvention scheme on short-term crop loans.",
        "Kisan Credit Card (KCC) limit increased for farmers cultivating {crop}.",
        "State cooperative banks announce loan restructuring for drought-affected areas.",
        "Digital lending platforms offer micro-credit with 24-hour approval."
      ],
      metrics: ['Interest: 4% Subvention', 'Limit: ₹3 Lakh', 'Approval: 48 Hrs'], actions: ['Submit KCC renewal', 'Check CIBIL score'], tags: ['CREDIT', 'KCC', 'SCHEME'] },
    'scheme-news': { 
      templates: [
        "PM-Kisan 15th installment released; 8 crore farmers benefit.",
        "New crop insurance premium rates announced under PMFBY for {crop}.",
        "State government launches direct benefit transfer (DBT) for fertilizer purchase.",
        "Deadline extended for e-KYC verification to receive scheme benefits."
      ],
      metrics: ['PM-Kisan: ₹2k Inst.', 'Target: 8Cr Farmers', 'Status: Active'], actions: ['Update e-KYC', 'Link Aadhaar to bank'], tags: ['PM-KISAN', 'SCHEME', 'DBT'] },

  },
  'FPO': {
    '': { 
      templates: [
        "Cluster audit reveals 92% compliance among participating FPOs in {region}.",
        "Risk assessment highlights potential vulnerability due to {issue}.",
        "FPO network expands with 15 new registered societies this quarter.",
        "Quarterly performance review shows a 12% increase in collective bargaining power."
      ],
      metrics: ['Cluster Risk: Low', 'Active FPOs: 45', 'Compliance: 92%'], actions: ['Review quarterly tax', 'Audit member logs'], tags: ['RISK', 'COMPLIANCE', 'AUDIT'] },
    'b2b-market': { 
      templates: [
        "Bulk buyers seeking forward contracts for {crop} at a premium.",
        "B2B demand for organic produce surges in urban centers.",
        "New institutional buyer partners with {region} FPO for direct procurement.",
        "Market sentiment remains positive despite minor fluctuations in commodity index."
      ],
      metrics: ['B2B Demand: High', 'Avg Contract: 50MT', 'Premium: +4%'], actions: ['Negotiate Q3 contracts', 'Verify buyer credit'], tags: ['B2B', 'CONTRACT', 'DEMAND'] },
    'input-procurement': { 
      templates: [
        "Bulk urea allocation approved for {region} FPOs ahead of Rabi season.",
        "Seed procurement costs negotiated down by 8% through collective buying.",
        "Supply chain disruptions cause temporary delays in agro-chemical deliveries.",
        "New organic fertilizer supplier onboarded with favorable terms."
      ],
      metrics: ['Urea Stock: 5k Bags', 'DAP Subsidy: Active', 'Delivery: 4 Days'], actions: ['Place bulk order', 'Distribute tokens'], tags: ['SUPPLY', 'INPUTS', 'RESTOCK'] },
    'logistics': { 
      templates: [
        "Cold storage capacity expanded in {region} to handle perishable {crop}.",
        "Freight rates stabilize following recent fluctuations in fuel prices.",
        "FPO consortium invests in shared transport fleet to reduce transit costs.",
        "Logistics optimization software deployment reduces delivery times by 15%."
      ],
      metrics: ['Truck Availability: 85%', 'Freight: ₹45/km', 'Transit Loss: <1%'], actions: ['Book cold storage', 'Optimize routing'], tags: ['FREIGHT', 'TRANSIT', 'STORAGE'] },
    'compliance-grants': { 
      templates: [
        "Nabard announces new grant pool for FPO infrastructure development.",
        "Compliance deadline approaching for annual financial audits.",
        "State government introduces tax incentives for FPOs engaged in food processing.",
        "Training program launched on legal compliance and corporate governance."
      ],
      metrics: ['Grant Pool: ₹50 Lakh', 'Deadline: 14 Days', 'Eligibility: Match'], actions: ['Submit audited financials', 'Draft proposal'], tags: ['GRANT', 'DEADLINE', 'FUNDS'] },

  },
  'Commodity Trader': {
    '': { 
      templates: [
        "Global commodity index rises on the back of tightening {crop} supplies.",
        "Macroeconomic trends indicate a shift towards essential agricultural commodities.",
        "Forex volatility impacts import costs for agricultural inputs.",
        "International futures markets show strong support levels for {crop}."
      ],
      metrics: ['Global Index: 112.4', 'YoY Growth: 3.2%', 'Forex: 83.5 INR/USD'], actions: ['Hedge currency risk', 'Expand portfolio'], tags: ['MACRO', 'GLOBAL', 'FOREX'] },
    'mandi-arbitrage': { 
      templates: [
        "Significant price spread observed between {region} and neighboring state mandis for {crop}.",
        "Arbitrage opportunities emerge due to localized oversupply of {crop}.",
        "Transport costs offset potential gains in short-term arbitrage trades.",
        "Traders capitalize on price discrepancies during peak arrival season."
      ],
      metrics: ['Spread: ₹120/qtl', 'Volume: 14k MT', 'Liquidity: High'], actions: ['Execute arbitrage across Hub A/B', 'Lock transport'], tags: ['ARBITRAGE', 'SPREAD', 'PROFIT'] },
    'supply-risk': { 
      templates: [
        "El Nino forecasts raise concerns over {crop} yields in key producing regions.",
        "Pest outbreaks reported in {region}, threatening to reduce marketable surplus.",
        "Stock-to-use ratios decline, signaling potential supply tightness.",
        "Early assessments indicate a 10% drop in {crop} production due to erratic weather."
      ],
      metrics: ['El Nino Index: High', 'Crop Damage: 12%', 'Stock-to-Use: 18%'], actions: ['Increase buffer stock', 'Diversify sourcing regions'], tags: ['SUPPLY', 'RISK', 'SHORTAGE'] },
    'export-policy': { 
      templates: [
        "Government imposes 20% export duty on {crop} to curb domestic inflation.",
        "Export quotas released for the upcoming quarter.",
        "Changes in phytosanitary requirements affect {crop} exports to European markets.",
        "Bilateral trade agreement opens new markets for value-added agricultural products."
      ],
      metrics: ['Tariff: 20% Export Duty', 'Quota: 50k MT', 'Clearance: 7 Days'], actions: ['File DGFT papers', 'Check port congestion'], tags: ['POLICY', 'DUTY', 'CUSTOMS'] },
    'institutional-flow': { 
      templates: [
        "FCI accelerates {crop} procurement in {region} to meet buffer stock targets.",
        "Private institutional buying outpaces government procurement in early season.",
        "Warehousing constraints slow down the pace of institutional flows.",
        "State agencies announce a bonus over MSP to encourage farmer participation."
      ],
      metrics: ['FCI Procured: 2M MT', 'Private Flow: 800k MT', 'Pace: +15%'], actions: ['Track FCI godown capacity', 'Align with state targets'], tags: ['FCI', 'FLOW', 'INSTITUTIONAL'] },

  },
  'Procurement Manager': {
    '': { 
      templates: [
        "Supply network analysis shows 98% fulfillment rate across all active nodes.",
        "Optimization required for Node C due to recurring delivery delays.",
        "Integration of new vendors improves overall supply chain resilience.",
        "Quarterly review indicates a 5% reduction in procurement cycle time."
      ],
      metrics: ['Supply Network: 98% Up', 'Active Nodes: 124', 'Fulfillment: 94%'], actions: ['Optimize Node C', 'Renew carrier contracts'], tags: ['SUPPLY', 'NETWORK', 'ACTIVE'] },
    'risk': { 
      templates: [
        "Sourcing risk elevated in {region} due to ongoing transport strikes.",
        "Vendor default rates remain low, indicating stable supply partnerships.",
        "Diversification strategy successfully mitigates impact of localized crop failures.",
        "Quality concerns from key suppliers trigger heightened inspection protocols."
      ],
      metrics: ['Sourcing Risk: Medium', 'Default Rate: 2%', 'Alt Vendors: 4'], actions: ['Activate backup vendor', 'Perform QC at origin'], tags: ['RISK', 'VENDOR', 'QC'] },
    'vendor-negotiations': { 
      templates: [
        "Successful negotiations lead to volume discounts for bulk {crop} purchases.",
        "Leveraging long-term contracts to stabilize procurement prices.",
        "Vendors push back on extended payment terms citing liquidity constraints.",
        "Strategic partnerships formed with key FPOs to ensure consistent supply."
      ],
      metrics: ['Current Price: ₹42/kg', 'Target Price: ₹39/kg', 'Leverage: High'], actions: ['Push for volume discount', 'Extend payment terms'], tags: ['NEGOTIATION', 'PRICE', 'CONTRACT'] },
    'quality-assaying': { 
      templates: [
        "Introduction of AI-based assaying reduces rejection rates by 1.4%.",
        "Moisture levels in incoming {crop} batches from {region} exceed acceptable limits.",
        "Strict adherence to grading standards improves overall product quality.",
        "New testing protocols implemented for detecting pesticide residues."
      ],
      metrics: ['Rejection Rate: 1.4%', 'Moisture Avg: 11%', 'Grade A: 85%'], actions: ['Calibrate assay machines', 'Issue strict moisture guidelines'], tags: ['QUALITY', 'ASSAY', 'GRADE'] },
    'logistics-routing': { 
      templates: [
        "Route optimization software implementation reduces idle time and fuel consumption.",
        "LTL shipments consolidated to improve logistics efficiency.",
        "Fleet availability impacted by seasonal demand spikes.",
        "Alternative routing strategies deployed to bypass highway construction zones."
      ],
      metrics: ['Fleet Active: 45', 'Idle Time: 2 Hrs', 'Fuel Efficiency: 4.2 km/l'], actions: ['Reroute to avoid toll block', 'Consolidate LTL shipments'], tags: ['LOGISTICS', 'ROUTE', 'FLEET'] },
  },
  'Agribusiness Manager': {
    '': { 
      templates: [
        "Corporate macro trends indicate a shift towards sustainable agriculture investments.",
        "Q2 financial results show steady revenue growth and improved EBITDA margins.",
        "Market share increases by 2% following successful product launch in {region}.",
        "Review of operating expenses highlights areas for potential cost savings."
      ],
      metrics: ['Market Share: 14%', 'Revenue YoY: +8%', 'EBITDA: 12%'], actions: ['Launch Q3 campaign', 'Review OPEX'], tags: ['MACRO', 'CORPORATE', 'FINANCE'] },
    'competitor-intel': { 
      templates: [
        "Competitor launches aggressive promotional campaign for new hybrid {crop} seeds.",
        "Market analysis reveals a shift in competitor pricing strategies.",
        "Intelligence reports indicate potential M&A activity among key rivals.",
        "New SKU introductions by competitors threaten market share in the premium segment."
      ],
      metrics: ['Competitor A Price: ₹450', 'Promo Spend: +20%', 'New SKUs: 3'], actions: ['Match promo offers', 'Accelerate SKU launch'], tags: ['COMPETITOR', 'INTEL', 'PRICE'] },
    'supply-chain': { 
      templates: [
        "Supply chain optimization efforts lead to a 10% reduction in holding costs.",
        "Implementation of Just-In-Time (JIT) inventory management improves cash flow.",
        "Lead times for imported agricultural inputs increase due to global shipping delays.",
        "Renegotiation of warehousing contracts yields significant cost savings."
      ],
      metrics: ['Inventory Turn: 4.5', 'Holding Cost: -2%', 'Lead Time: 12 Days'], actions: ['Implement JIT for packaging', 'Renegotiate warehousing'], tags: ['SUPPLY', 'OPTIMIZATION', 'INVENTORY'] },
    'retail-demand': { 
      templates: [
        "Consumer demand for organic and traceably sourced products continues to rise.",
        "Retail point-of-sale data shows a 5% increase in store footfall.",
        "Premium product bundles perform exceptionally well during the festive season.",
        "Shift in consumer preferences necessitates adjustments to product portfolio."
      ],
      metrics: ['Store Footfall: +5%', 'Cart Value: ₹1,200', 'Conversion: 8%'], actions: ['Push premium bundles', 'Boost point-of-sale visibility'], tags: ['RETAIL', 'DEMAND', 'SALES'] },
    'm-and-a': { 
      templates: [
        "Due diligence process nears completion for the acquisition of a regional ag-tech startup.",
        "Strategic merger expected to yield significant synergies in supply chain operations.",
        "Target company valuation finalized, term sheet presented to the board.",
        "Exploratory talks initiated with potential partners in the food processing sector."
      ],
      metrics: ['Target Valuation: $4M', 'Synergy: High', 'Due Diligence: 80%'], actions: ['Finalize term sheet', 'Present to board'], tags: ['M&A', 'GROWTH', 'STRATEGY'] },
  },
  'Research Analyst': {
    '': { 
      templates: [
        "New agronomy paper published on the efficacy of bio-stimulants in {crop} cultivation.",
        "Peer-reviewed study highlights the long-term benefits of regenerative agriculture practices.",
        "Research findings presented at the international conference on agricultural sustainability.",
        "Meta-analysis of field data confirms the superior yield potential of new hybrid varieties."
      ],
      metrics: ['Published Papers: 14', 'Citations: 124', 'Peer Reviews: Pending'], actions: ['Submit abstract to journal', 'Collate field data'], tags: ['RESEARCH', 'PAPER', 'ACADEMIC'] },
    'climate-modeling': { 
      templates: [
        "Climate models predict a 15% probability of severe drought in central {region}.",
        "Long-term forecasting indicates a shift in rainfall patterns affecting traditional sowing windows.",
        "Integration of satellite imagery improves the accuracy of localized climate impact models.",
        "Simulations highlight the vulnerability of {crop} production to rising average temperatures."
      ],
      metrics: ['Model Confidence: 94%', 'Forecast: Drought 15%', 'Data Points: 1.2M'], actions: ['Run secondary simulations', 'Cross-verify with ISRO data'], tags: ['CLIMATE', 'MODEL', 'FORECAST'] },
    'bio-tech': { 
      templates: [
        "Phase 2 trials of drought-resistant {crop} varieties show promising results.",
        "CRISPR gene-editing techniques successfully utilized to enhance disease resistance.",
        "New bio-fortified crop varieties developed to address nutritional deficiencies.",
        "Regulatory approval sought for the commercial release of genetically modified traits."
      ],
      metrics: ['Trial Success: 88%', 'Trait Stability: High', 'Gene Edit: CRISPR'], actions: ['Move to Phase 3 trial', 'Document side effects'], tags: ['GENOMICS', 'BIOTECH', 'TRIAL'] },
    'soil-microbiome': { 
      templates: [
        "Study reveals a strong correlation between soil microbial diversity and crop resilience.",
        "Application of specific bio-fertilizers significantly improves soil organic carbon levels.",
        "Research focuses on optimizing the soil microbiome to enhance nutrient uptake.",
        "Comprehensive soil health index developed based on biological indicators."
      ],
      metrics: ['Organic Carbon: 1.2%', 'PH: 6.8', 'Microbial Mass: High'], actions: ['Recommend bio-fertilizer', 'Publish soil health index'], tags: ['SOIL', 'MICROBIOME', 'HEALTH'] },
    'policy-economics': { 
      templates: [
        "Economic analysis of the recent fertilizer subsidy reveals a positive impact on crop yields.",
        "Policy brief highlights the need for targeted interventions to support smallholder farmers.",
        "Assessment of the MSP framework suggests reforms to better align with market dynamics.",
        "Study evaluates the fiscal cost of state-level agricultural debt waiver programs."
      ],
      metrics: ['Subisdy Impact: +12% Yield', 'MSP Ratio: 1.5', 'Fiscal Cost: ₹20k Cr'], actions: ['Draft policy brief', 'Present at ministerial panel'], tags: ['POLICY', 'ECONOMICS', 'IMPACT'] },
  },
  'Government Official': {
    '': { 
      templates: [
        "District crisis monitor activated in response to reports of severe {issue} in {region}.",
        "Rapid response teams deployed to assess crop damage following unseasonal rainfall.",
        "Inter-departmental coordination established to ensure timely supply of essential inputs.",
        "Real-time monitoring dashboard tracks the status of critical agricultural infrastructure."
      ],
      metrics: ['Districts Alert: 2', 'Response Time: <4 Hrs', 'Resources: Deployed'], actions: ['Activate NDRF teams', 'Setup relief camps'], tags: ['CRISIS', 'MONITOR', 'ALERT'] },
    'relief': { 
      templates: [
        "Phase 1 of disaster relief funds disbursed directly to affected farmers' bank accounts.",
        "Audit of the DBT system confirms a 98% success rate in targeted fund delivery.",
        "Grievance redressal mechanism established to address failed transactions and discrepancies.",
        "State government approves an additional relief package for severely impacted districts."
      ],
      metrics: ['Funds Disbursed: ₹450 Cr', 'Beneficiaries: 1.2M', 'Success Rate: 98%'], actions: ['Audit failed transactions', 'Release Phase 2 funds'], tags: ['RELIEF', 'DBT', 'DISBURSEMENT'] },
    'sentiment': { 
      templates: [
        "Public sentiment analysis indicates general approval of the new procurement policy.",
        "Concerns raised by farmer unions regarding the availability of subsidized fertilizers.",
        "Awareness campaigns launched to educate farmers about the benefits of crop insurance.",
        "Feedback mechanism implemented to capture grassroots sentiment on agricultural initiatives."
      ],
      metrics: ['Approval: 68%', 'Grievances: 1.2k', 'Resolution: 85%'], actions: ['Address top 3 grievances', 'Launch awareness drive'], tags: ['SENTIMENT', 'POLICY', 'PUBLIC'] },
    'food-security': { 
      templates: [
        "FCI buffer stocks deemed sufficient to meet PDS requirements for the current fiscal year.",
        "Audits of storage silos identify areas for improving preservation techniques and reducing wastage.",
        "Strategic allocations of food grains approved to stabilize open market prices.",
        "Long-term food security strategy emphasizes crop diversification and climate resilience."
      ],
      metrics: ['FCI Buffer: 40M MT', 'PDS Offtake: 3M MT', 'Wastage: 0.5%'], actions: ['Audit silo storage', 'Approve PDS allocations'], tags: ['FOOD', 'SECURITY', 'RESERVE'] },
    'infrastructure': { 
      templates: [
        "Construction of new godowns fast-tracked to expand scientific storage capacity.",
        "Irrigation coverage extended by 4% under the latest state-sponsored scheme.",
        "Capital expenditure utilization for agricultural infrastructure projects reaches 75%.",
        "Inspections of newly established cold chain facilities confirm adherence to quality standards."
      ],
      metrics: ['Godowns Built: 12', 'Irrigation Coverage: +4%', 'Capex Utilization: 75%'], actions: ['Fast-track pending dams', 'Inspect cold chains'], tags: ['INFRA', 'PROGRESS', 'CAPEX'] },
  },
  'Company Admin': {
    '': { 
      templates: [
        "Data ingestion engine operating at optimal capacity with an uptime of 99.99%.",
        "System alerts triggered by a temporary spike in data processing latency.",
        "Scaling up ingestion workers to handle increased volume from new data sources.",
        "Dead-letter queue cleared following resolution of API parsing errors."
      ],
      metrics: ['Ingestion Rate: 500 req/s', 'Latency: 45ms', 'Uptime: 99.99%'], actions: ['Scale up ingestion workers', 'Clear dead-letter queue'], tags: ['ENGINE', 'INGESTION', 'HEALTH'] },
    'api-health': { 
      templates: [
        "All critical API endpoints and active webhooks reporting 100% health.",
        "Routine rotation of API keys completed without service interruption.",
        "Bandwidth utilization analysis helps identify opportunities for payload compression.",
        "Rate limiting policies adjusted to accommodate peak usage times."
      ],
      metrics: ['Webhooks Active: 12', 'Error Rate: 0.01%', 'Bandwidth: 14 TB'], actions: ['Rotate API keys', 'Monitor rate limits'], tags: ['API', 'HEALTH', 'WEBHOOK'] },
    'user-access': { 
      templates: [
        "Active user base surpasses 1.2 million, with steady daily signups.",
        "Security audit of administrator roles and access permissions initiated.",
        "Mandatory two-factor authentication (2FA) enforcement rolled out for all privileged accounts.",
        "System successfully blocks multiple failed login attempts, preventing unauthorized access."
      ],
      metrics: ['Active Users: 1.2M', 'New Signups: 4k/day', 'Failed Logins: 120'], actions: ['Audit admin roles', 'Enforce 2FA'], tags: ['USERS', 'ACCESS', 'SECURITY'] },
    'security': { 
      templates: [
        "Web Application Firewall (WAF) successfully blocks 1.4k malicious requests.",
        "Recent penetration testing reveals zero high-severity vulnerabilities.",
        "Minor dependency patches applied to ensure ongoing system security.",
        "Comprehensive security audit completed, resulting in an A+ score."
      ],
      metrics: ['WAF Blocks: 1.4k', 'Vulnerabilities: 0 High', 'Audit Score: A+'], actions: ['Run pen-test', 'Patch minor dependencies'], tags: ['SECURITY', 'AUDIT', 'WAF'] },
  }
};

function getRoleCharts(role, pathKey) {
  const normalizedPath = pathKey === '' ? 'default' : pathKey;
  
  const chartsConfig = {
    'Farmer': {
      'default': [
        {
          title: "Soil Moisture Index (%)",
          type: "line",
          data: [ { label: "Wk 1", value: 45 }, { label: "Wk 2", value: 52 }, { label: "Wk 3", value: 38 }, { label: "Wk 4", value: 61 } ]
        },
        {
          title: "Weekly Rainfall (mm)",
          type: "bar",
          data: [ { label: "Wk 1", value: 12 }, { label: "Wk 2", value: 25 }, { label: "Wk 3", value: 50 }, { label: "Wk 4", value: 8 } ]
        }
      ],
      'mandi-insights': [
        {
          title: "Mandi Price Trend (₹/Quintal)",
          type: "line",
          data: [ { label: "Jan", value: 2250 }, { label: "Feb", value: 2310 }, { label: "Mar", value: 2450 }, { label: "Apr", value: 2410 }, { label: "May", value: 2380 } ]
        },
        {
          title: "Arrival Volume Trends (Quintals)",
          type: "bar",
          data: [ { label: "Wheat", value: 1200 }, { label: "Mustard", value: 950 }, { label: "Rice", value: 1400 }, { label: "Cotton", value: 600 } ]
        }
      ],
      'weather-safety': [
        {
          title: "Soil Moisture Index (%)",
          type: "line",
          data: [ { label: "Wk 1", value: 45 }, { label: "Wk 2", value: 52 }, { label: "Wk 3", value: 38 }, { label: "Wk 4", value: 61 } ]
        },
        {
          title: "Weekly Rainfall (mm)",
          type: "bar",
          data: [ { label: "Wk 1", value: 12 }, { label: "Wk 2", value: 25 }, { label: "Wk 3", value: 50 }, { label: "Wk 4", value: 8 } ]
        }
      ],
      'agri-tech': [
        {
          title: "Smart Drone Adoption Rate (%)",
          type: "line",
          data: [ { label: "2022", value: 12 }, { label: "2023", value: 25 }, { label: "2024", value: 48 }, { label: "2025", value: 72 } ]
        },
        {
          title: "Soil Testing Kits Distributed",
          type: "bar",
          data: [ { label: "Zone A", value: 180 }, { label: "Zone B", value: 310 }, { label: "Zone C", value: 290 }, { label: "Zone D", value: 420 } ]
        }
      ],
      'financial-credit': [
        {
          title: "KCC Loan Approvals",
          type: "bar",
          data: [ { label: "Jan", value: 180 }, { label: "Feb", value: 250 }, { label: "Mar", value: 390 }, { label: "Apr", value: 310 } ]
        },
        {
          title: "Average KCC Credit Limit (₹k)",
          type: "line",
          data: [ { label: "2023", value: 120 }, { label: "2024", value: 160 }, { label: "2025", value: 220 } ]
        }
      ],
      'scheme-news': [
        {
          title: "PM-Kisan Disbursement Rate (%)",
          type: "line",
          data: [ { label: "Batch 1", value: 88 }, { label: "Batch 2", value: 94 }, { label: "Batch 3", value: 92 }, { label: "Batch 4", value: 98 } ]
        },
        {
          title: "PMFBY Insurance Premium Share (%)",
          type: "bar",
          data: [ { label: "Central", value: 40 }, { label: "State", value: 40 }, { label: "Farmer", value: 20 } ]
        }
      ]
    },
    'FPO': {
      'default': [
        {
          title: "FPO Member Growth",
          type: "line",
          data: [ { label: "Q1", value: 240 }, { label: "Q2", value: 310 }, { label: "Q3", value: 450 }, { label: "Q4", value: 580 } ]
        },
        {
          title: "FPO Compliance Audit Score (%)",
          type: "bar",
          data: [ { label: "Audit 1", value: 82 }, { label: "Audit 2", value: 88 }, { label: "Audit 3", value: 92 }, { label: "Audit 4", value: 95 } ]
        }
      ],
      'b2b-market': [
        {
          title: "Bulk Contract Demand (MT)",
          type: "bar",
          data: [ { label: "Rice", value: 450 }, { label: "Onion", value: 300 }, { label: "Potato", value: 650 }, { label: "Wheat", value: 800 } ]
        },
        {
          title: "B2B Price Premium (%)",
          type: "line",
          data: [ { label: "Wk 1", value: 3 }, { label: "Wk 2", value: 5 }, { label: "Wk 3", value: 4 }, { label: "Wk 4", value: 7 } ]
        }
      ],
      'input-procurement': [
        {
          title: "Bulk Urea Procured (Bags)",
          type: "bar",
          data: [ { label: "Q1", value: 1200 }, { label: "Q2", value: 3500 }, { label: "Q3", value: 4800 }, { label: "Q4", value: 2200 } ]
        },
        {
          title: "Seed Procurement Cost Savings (%)",
          type: "line",
          data: [ { label: "Wheat", value: 6 }, { label: "Paddy", value: 9 }, { label: "Maize", value: 8 }, { label: "Cotton", value: 12 } ]
        }
      ],
      'logistics': [
        {
          title: "Truck Availability Rate (%)",
          type: "line",
          data: [ { label: "Wk 1", value: 72 }, { label: "Wk 2", value: 85 }, { label: "Wk 3", value: 81 }, { label: "Wk 4", value: 94 } ]
        },
        {
          title: "Transit Losses (%)",
          type: "bar",
          data: [ { label: "Route A", value: 1.2 }, { label: "Route B", value: 0.8 }, { label: "Route C", value: 2.1 } ]
        }
      ],
      'compliance-grants': [
        {
          title: "Infrastructure Grant Allocations (₹ Lakh)",
          type: "bar",
          data: [ { label: "Silo", value: 25 }, { label: "Dryer", value: 15 }, { label: "Sorting", value: 30 }, { label: "Cold Room", value: 45 } ]
        },
        {
          title: "Compliance Score Distribution (%)",
          type: "line",
          data: [ { label: "Batch A", value: 85 }, { label: "Batch B", value: 91 }, { label: "Batch C", value: 96 } ]
        }
      ]
    },
    'Commodity Trader': {
      'default': [
        {
          title: "Global Agriculture Index",
          type: "line",
          data: [ { label: "2023", value: 104 }, { label: "2024", value: 108 }, { label: "2025", value: 112 }, { label: "2026", value: 114 } ]
        },
        {
          title: "Trading Volume (MT)",
          type: "bar",
          data: [ { label: "Wheat", value: 1200 }, { label: "Soybean", value: 850 }, { label: "Corn", value: 1600 }, { label: "Cotton", value: 700 } ]
        }
      ],
      'mandi-arbitrage': [
        {
          title: "Mandi Price Spread (₹/Quintal)",
          type: "bar",
          data: [ { label: "Spread 1", value: 80 }, { label: "Spread 2", value: 140 }, { label: "Spread 3", value: 110 }, { label: "Spread 4", value: 160 } ]
        },
        {
          title: "Arbitrage Realized Margin (%)",
          type: "line",
          data: [ { label: "Wk 1", value: 4 }, { label: "Wk 2", value: 6 }, { label: "Wk 3", value: 5 }, { label: "Wk 4", value: 8 } ]
        }
      ],
      'supply-risk': [
        {
          title: "Crop Deficit Index (%)",
          type: "line",
          data: [ { label: "Wheat", value: 8 }, { label: "Soybean", value: 15 }, { label: "Rice", value: 12 }, { label: "Maize", value: 22 } ]
        },
        {
          title: "Stock-to-Use Ratio (%)",
          type: "bar",
          data: [ { label: "Q1", value: 15 }, { label: "Q2", value: 18 }, { label: "Q3", value: 21 }, { label: "Q4", value: 16 } ]
        }
      ],
      'export-policy': [
        {
          title: "Export Tariffs (%)",
          type: "bar",
          data: [ { label: "Rice", value: 20 }, { label: "Wheat", value: 0 }, { label: "Sugar", value: 10 }, { label: "Onion", value: 40 } ]
        },
        {
          title: "Port Clearance Time (Days)",
          type: "line",
          data: [ { label: "Jan", value: 6 }, { label: "Feb", value: 8 }, { label: "Mar", value: 7 }, { label: "Apr", value: 5 } ]
        }
      ],
      'institutional-flow': [
        {
          title: "FCI Grain Reserves (Million MT)",
          type: "line",
          data: [ { label: "2023", value: 35 }, { label: "2024", value: 38 }, { label: "2025", value: 41 }, { label: "2026", value: 40 } ]
        },
        {
          title: "Private Procurement Flow (MT)",
          type: "bar",
          data: [ { label: "Wheat", value: 2500 }, { label: "Paddy", value: 4200 }, { label: "Barley", value: 1100 } ]
        }
      ]
    },
    'Procurement Manager': {
      'default': [
        {
          title: "Sourcing Supply Network Fulfillment (%)",
          type: "line",
          data: [ { label: "Wk 1", value: 92 }, { label: "Wk 2", value: 96 }, { label: "Wk 3", value: 94 }, { label: "Wk 4", value: 98 } ]
        },
        {
          title: "Active Procurement Nodes",
          type: "bar",
          data: [ { label: "North", value: 45 }, { label: "South", value: 65 }, { label: "East", value: 25 }, { label: "West", value: 80 } ]
        }
      ],
      'risk': [
        {
          title: "Sourcing Defection Index",
          type: "line",
          data: [ { label: "Vendor A", value: 2 }, { label: "Vendor B", value: 4 }, { label: "Vendor C", value: 1 }, { label: "Vendor D", value: 3 } ]
        },
        {
          title: "Alternative Sourcing Vol (MT)",
          type: "bar",
          data: [ { label: "Vendor X", value: 150 }, { label: "Vendor Y", value: 380 }, { label: "Vendor Z", value: 220 } ]
        }
      ],
      'vendor-negotiations': [
        {
          title: "Target vs Actual Procurement Cost (₹/kg)",
          type: "bar",
          data: [ { label: "Wheat", value: 32 }, { label: "Maize", value: 28 }, { label: "Paddy", value: 36 } ]
        },
        {
          title: "Negotiated Volume Discounts (%)",
          type: "line",
          data: [ { label: "Q1", value: 3 }, { label: "Q2", value: 5 }, { label: "Q3", value: 4 }, { label: "Q4", value: 7 } ]
        }
      ],
      'quality-assaying': [
        {
          title: "Moisture Content Average (%)",
          type: "line",
          data: [ { label: "Lot 1", value: 11 }, { label: "Lot 2", value: 13 }, { label: "Lot 3", value: 10 }, { label: "Lot 4", value: 12 } ]
        },
        {
          title: "Quality Grade Share (Grade A %)",
          type: "bar",
          data: [ { label: "Lot 1", value: 80 }, { label: "Lot 2", value: 85 }, { label: "Lot 3", value: 78 }, { label: "Lot 4", value: 92 } ]
        }
      ],
      'logistics-routing': [
        {
          title: "Fleet Utilization Index",
          type: "line",
          data: [ { label: "Mon", value: 85 }, { label: "Tue", value: 92 }, { label: "Wed", value: 88 }, { label: "Thu", value: 96 } ]
        },
        {
          title: "Average Transit Times (Hours)",
          type: "bar",
          data: [ { label: "Route A", value: 24 }, { label: "Route B", value: 36 }, { label: "Route C", value: 18 } ]
        }
      ]
    },
    'Agribusiness Manager': {
      'default': [
        {
          title: "Agribusiness Market Share (%)",
          type: "line",
          data: [ { label: "2023", value: 12 }, { label: "2024", value: 13 }, { label: "2025", value: 14 }, { label: "2026", value: 14.5 } ]
        },
        {
          title: "Operating EBITDA margins (%)",
          type: "bar",
          data: [ { label: "Q1", value: 9.5 }, { label: "Q2", value: 11.2 }, { label: "Q3", value: 12.8 }, { label: "Q4", value: 10.5 } ]
        }
      ],
      'competitor-intel': [
        {
          title: "Competitor Price Premium (₹/kg)",
          type: "bar",
          data: [ { label: "Seed A", value: 80 }, { label: "Seed B", value: 120 }, { label: "Seed C", value: 95 } ]
        },
        {
          title: "Competitor Market Promotion Spend (₹ Lakh)",
          type: "line",
          data: [ { label: "Q1", value: 15 }, { label: "Q2", value: 28 }, { label: "Q3", value: 22 }, { label: "Q4", value: 34 } ]
        }
      ],
      'supply-chain': [
        {
          title: "Inventory Turnover Ratio",
          type: "line",
          data: [ { label: "Q1", value: 4.1 }, { label: "Q2", value: 4.8 }, { label: "Q3", value: 5.2 }, { label: "Q4", value: 4.5 } ]
        },
        {
          title: "Warehouse Storage Cost Savings (%)",
          type: "bar",
          data: [ { label: "Hub X", value: 8 }, { label: "Hub Y", value: 12 }, { label: "Hub Z", value: 6 } ]
        }
      ],
      'retail-demand': [
        {
          title: "Retail Store Footfall Growth (%)",
          type: "line",
          data: [ { label: "Jan", value: 3.5 }, { label: "Feb", value: 5.1 }, { label: "Mar", value: 4.8 }, { label: "Apr", value: 6.2 } ]
        },
        {
          title: "Average Retail Basket Value (₹)",
          type: "bar",
          data: [ { label: "Seed", value: 950 }, { label: "Fertilizer", value: 1400 }, { label: "Bio-Agri", value: 1100 } ]
        }
      ],
      'm-and-a': [
        {
          title: "M&A Target Diligence Progress (%)",
          type: "line",
          data: [ { label: "Legal", value: 90 }, { label: "Financial", value: 80 }, { label: "Tech", value: 75 }, { label: "Ops", value: 60 } ]
        },
        {
          title: "Acquisition Target Valuations ($ Million)",
          type: "bar",
          data: [ { label: "Target 1", value: 2.5 }, { label: "Target 2", value: 4.0 }, { label: "Target 3", value: 1.8 } ]
        }
      ]
    },
    'Research Analyst': {
      'default': [
        {
          title: "Published Research Citations",
          type: "line",
          data: [ { label: "2023", value: 95 }, { label: "2024", value: 110 }, { label: "2025", value: 120 }, { label: "2026", value: 135 } ]
        },
        {
          title: "Agri-Science Research Grants (₹ Lakh)",
          type: "bar",
          data: [ { label: "Govt", value: 45 }, { label: "Private", value: 30 }, { label: "NGO", value: 15 } ]
        }
      ],
      'climate-modeling': [
        {
          title: "Drought Prediction Probability (%)",
          type: "bar",
          data: [ { label: "Region A", value: 15 }, { label: "Region B", value: 40 }, { label: "Region C", value: 5 }, { label: "Region D", value: 25 } ]
        },
        {
          title: "Climate Model Confidence Interval (%)",
          type: "line",
          data: [ { label: "V1.0", value: 88 }, { label: "V1.5", value: 91 }, { label: "V2.0", value: 93 }, { label: "V3.0", value: 95 } ]
        }
      ],
      'bio-tech': [
        {
          title: "GM Crop Trait Stability Rate (%)",
          type: "line",
          data: [ { label: "Gen 1", value: 87 }, { label: "Gen 2", value: 92 }, { label: "Gen 3", value: 95 }, { label: "Gen 4", value: 97 } ]
        },
        {
          title: "CRISPR Trial Yield Boost (%)",
          type: "bar",
          data: [ { label: "Wheat", value: 12 }, { label: "Rice", value: 18 }, { label: "Maize", value: 15 } ]
        }
      ],
      'soil-microbiome': [
        {
          title: "Soil Organic Carbon Index (%)",
          type: "line",
          data: [ { label: "Plot 1", value: 0.9 }, { label: "Plot 2", value: 1.2 }, { label: "Plot 3", value: 1.4 }, { label: "Plot 4", value: 1.1 } ]
        },
        {
          title: "Soil pH Levels",
          type: "bar",
          data: [ { label: "Plot 1", value: 6.2 }, { label: "Plot 2", value: 6.8 }, { label: "Plot 3", value: 7.1 }, { label: "Plot 4", value: 6.5 } ]
        }
      ],
      'policy-economics': [
        {
          title: "Subsidy Yield Impact Correlation",
          type: "bar",
          data: [ { label: "Urea", value: 8 }, { label: "DAP", value: 12 }, { label: "NPK", value: 10 }, { label: "Organic", value: 15 } ]
        },
        {
          title: "State Agri Fiscal Deficit (₹k Crore)",
          type: "line",
          data: [ { label: "2023", value: 15 }, { label: "2024", value: 18 }, { label: "2025", value: 20 }, { label: "2026", value: 21 } ]
        }
      ]
    },
    'Government Official': {
      'default': [
        {
          title: "District Agri Crisis Alert Resolution (%)",
          type: "line",
          data: [ { label: "Wk 1", value: 82 }, { label: "Wk 2", value: 91 }, { label: "Wk 3", value: 87 }, { label: "Wk 4", value: 96 } ]
        },
        {
          title: "Crisis District Alert Count",
          type: "bar",
          data: [ { label: "Wheat Belt", value: 3 }, { label: "Rice Belt", value: 5 }, { label: "Oilseeds", value: 2 } ]
        }
      ],
      'relief': [
        {
          title: "Disaster Relief DBT Success Rate (%)",
          type: "line",
          data: [ { label: "Phase 1", value: 95 }, { label: "Phase 2", value: 98 }, { label: "Phase 3", value: 99 } ]
        },
        {
          title: "Relief Funds Disbursed (₹ Crore)",
          type: "bar",
          data: [ { label: "Dist A", value: 150 }, { label: "Dist B", value: 200 }, { label: "Dist C", value: 100 } ]
        }
      ],
      'sentiment': [
        {
          title: "Procurement Policy Approval Rate (%)",
          type: "line",
          data: [ { label: "Farmers", value: 65 }, { label: "Traders", value: 58 }, { label: "Consumers", value: 80 } ]
        },
        {
          title: "Grievance Redressal Metrics (Count)",
          type: "bar",
          data: [ { label: "Received", value: 1200 }, { label: "In Progress", value: 150 }, { label: "Resolved", value: 1050 } ]
        }
      ],
      'food-security': [
        {
          title: "National Buffer Stock Level (Million MT)",
          type: "bar",
          data: [ { label: "Wheat", value: 22 }, { label: "Rice", value: 18 }, { label: "Coarse Grain", value: 5 } ]
        },
        {
          title: "PDS Grain Offtake Rate (%)",
          type: "line",
          data: [ { label: "Jan", value: 88 }, { label: "Feb", value: 90 }, { label: "Mar", value: 92 }, { label: "Apr", value: 91 } ]
        }
      ],
      'infrastructure': [
        {
          title: "Modern Warehouse Construction (Units)",
          type: "bar",
          data: [ { label: "Silo", value: 8 }, { label: "Godown", value: 12 }, { label: "Cold Storage", value: 4 } ]
        },
        {
          title: "Capital Expenditure Utilization (%)",
          type: "line",
          data: [ { label: "Q1", value: 20 }, { label: "Q2", value: 45 }, { label: "Q3", value: 68 }, { label: "Q4", value: 75 } ]
        }
      ]
    },
    'Company Admin': {
      'default': [
        {
          title: "Ingestion Worker Throughput (req/s)",
          type: "line",
          data: [ { label: "Peak", value: 800 }, { label: "Avg", value: 500 }, { label: "Min", value: 300 } ]
        },
        {
          title: "Ingestion Latency Performance (ms)",
          type: "bar",
          data: [ { label: "V1 API", value: 55 }, { label: "V2 API", value: 45 }, { label: "GraphQL", value: 62 } ]
        }
      ],
      'api-health': [
        {
          title: "Webhook Delivery Success Rate (%)",
          type: "line",
          data: [ { label: "Wk 1", value: 99.8 }, { label: "Wk 2", value: 99.9 }, { label: "Wk 3", value: 99.95 }, { label: "Wk 4", value: 100 } ]
        },
        {
          title: "API Response Error Rates (%)",
          type: "bar",
          data: [ { label: "400", value: 0.05 }, { label: "401", value: 0.01 }, { label: "404", value: 0.02 }, { label: "500", value: 0.005 } ]
        }
      ],
      'user-access': [
        {
          title: "Platform Active User Growth (Millions)",
          type: "line",
          data: [ { label: "2023", value: 0.8 }, { label: "2024", value: 1.0 }, { label: "2025", value: 1.1 }, { label: "2026", value: 1.2 } ]
        },
        {
          title: "Daily Portal Signups (Count)",
          type: "bar",
          data: [ { label: "Farmer Portal", value: 2500 }, { label: "FPO Portal", value: 1200 }, { label: "Agribusiness", value: 300 } ]
        }
      ],
      'security': [
        {
          title: "WAF Malicious Request Blocks",
          type: "bar",
          data: [ { label: "DDoS", value: 800 }, { label: "XSS", value: 400 }, { label: "SQLi", value: 150 }, { label: "Auth Bypass", value: 50 } ]
        },
        {
          title: "Penetration Testing Vulnerability Count",
          type: "line",
          data: [ { label: "High", value: 0 }, { label: "Medium", value: 2 }, { label: "Low", value: 5 }, { label: "Info", value: 12 } ]
        }
      ]
    }
  };

  const roleConfig = chartsConfig[role];
  if (roleConfig) {
    const config = roleConfig[normalizedPath];
    if (config) return config;
    return roleConfig['default'] || [];
  }
  return [];
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template) {
  return template
    .replace('{crop}', getRandomElement(crops))
    .replace('{region}', getRandomElement(regions))
    .replace('{issue}', getRandomElement(issues));
}

function generateMockData() {
  const finalData = {};
  
  for (const [role, paths] of Object.entries(rolesConfig)) {
    finalData[role] = {};
    for (const [pathKey, config] of Object.entries(paths)) {
      const accordionItems = [];
      for (let i = 0; i < 7; i++) {
        const tag = config.tags[i % config.tags.length];
        const rawTemplate = config.templates[i % config.templates.length];
        const title = fillTemplate(rawTemplate);
        
        accordionItems.push({
          ticker_type: tag,
          single_line_summary: title,
          expanded_data_points: {
            primary_metrics: {
              [config.metrics[0].split(':')[0]]: config.metrics[0].split(':')[1]?.trim() || 'Optimal',
              [config.metrics[1].split(':')[0]]: config.metrics[1].split(':')[1]?.trim() || 'Stable',
              [config.metrics[2].split(':')[0]]: config.metrics[2].split(':')[1]?.trim() || 'Normal'
            },
            actionable_steps: config.actions,
            source_or_authority: `AgroSense Real-time Intelligence Feed`
          }
        });
      }

      const page_charts = getRoleCharts(role, pathKey);

      finalData[role][pathKey === '' ? 'default' : pathKey] = { accordionItems, page_charts };
    }
  }

  const outputPath = path.join(__dirname, '../data/newsMockData.json');
  fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
  console.log(`Successfully generated huge, highly realistic mock data at ${outputPath}`);
}

generateMockData();
