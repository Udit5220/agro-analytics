// src/pages/gov-schemes/farmer/MySchemes.jsx
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Sprout,
  ExternalLink
} from "lucide-react";
import { govSchemesApi } from "../../../services/apiService";

export default function MySchemes() {
  const [schemes, setSchemes] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch schemes from database
  useEffect(() => {
    govSchemesApi.getSchemes({ role: "farmer" })
      .then((res) => {
        if (res && res.schemes) {
          setSchemes(res.schemes);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load schemes:", err);
        setLoading(false);
      });
  }, []);

  // Dynamically compile categories from actual database schemes
  const categories = ["All", ...new Set(schemes.map((s) => s.category).filter(Boolean))];

  // Filter schemes based on Category
  const matchedSchemes = schemes.filter((scheme) => {
    return filterCategory === "All" || scheme.category === filterCategory;
  });

  const handleToggleGuide = (schemeId) => {
    const isExpanding = expandedScheme !== schemeId;
    setExpandedScheme(isExpanding ? schemeId : null);
    if (isExpanding) {
      // Log guide open telemetry interaction
      govSchemesApi.interact(schemeId, "guide_open").catch(console.error);
    }
  };

  const handleApplyClick = (schemeId) => {
    // Log apply telemetry interaction
    govSchemesApi.interact(schemeId, "apply_click").catch(console.error);
  };

  const getOfficialPortalUrl = (scheme) => {
    const name = scheme.name.toLowerCase();
    if (name.includes("kisan")) return "https://pmkisan.gov.in/";
    if (name.includes("fasal") || name.includes("insurance")) return "https://pmfby.gov.in/";
    if (name.includes("kusum")) return "https://pmkusum.mnre.gov.in/";
    return "https://www.myscheme.gov.in/";
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f0]/40 animate-fadeIn">
      
      {/* Hero Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#1A3A2A] text-white p-5 rounded-2xl border border-white/5 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-36 w-36 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="flex items-center gap-3.5 z-10">
          <div className="p-2.5 bg-white/10 text-[#C5F547] rounded-xl shrink-0">
            <BookmarkCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Government Schemes Directory</h1>
            <p className="text-xs text-[#a3b8a3] font-semibold">
              Browse active central and state agricultural programs and read portal guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Tab filter Category switcher */}
      <div className="mb-6 flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-xs max-w-lg">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              filterCategory === cat
                ? "bg-[#1A3A2A] text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs font-bold text-gray-500">Loading government schemes...</div>
        ) : matchedSchemes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-150 py-16 text-center shadow-sm">
            <Sprout className="h-10 w-10 text-gray-300 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-gray-500">No matching schemes for selected category.</p>
          </div>
        ) : (
          matchedSchemes.map((scheme) => {
            const requiredDocs = scheme.details?.documents?.map(d => d.name) || [
              "Aadhaar Card", 
              "Land Records (Jamabandi copy)",
              "Bank Passbook copy"
            ];
            const portalUrl = getOfficialPortalUrl(scheme);

            return (
              <div
                key={scheme.id}
                className={`border border-gray-150 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                  expandedScheme === scheme.id ? "ring-1 ring-[#2d5a3d]" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-gray-100 text-gray-600 text-[9px] font-extrabold px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
                        {scheme.category}
                      </span>
                      <h3 className="text-xs font-bold text-gray-900 leading-snug">{scheme.name}</h3>
                    </div>

                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      {scheme.details?.description || `${scheme.name} support program.`}
                    </p>

                    <p className="text-xs text-[#2d5a3d] font-bold">
                      Benefit: {scheme.benefit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleGuide(scheme.id)}
                      className="text-xs font-bold border border-gray-200 hover:bg-gray-50 text-gray-650 px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <span>Portal Guide</span>
                      {expandedScheme === scheme.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    
                    <a
                      href={portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleApplyClick(scheme.id)}
                      className="text-xs font-bold bg-[#1A3A2A] hover:bg-[#0F2E1F] text-white px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition animate-fadeIn"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Collapsible Guidelines & Checklist */}
                {expandedScheme === scheme.id && (
                  <div className="mt-4 pt-4 border-t border-gray-150 animate-fadeIn">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                      <span className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Government Portal Document Checklist</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 font-semibold">
                        {requiredDocs.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2d5a3d]"></span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
