import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Eye, BookOpen, ArrowRight, TrendingUp, X, User, Calendar, Target, CheckCircle2, BookmarkCheck, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';

export default function ResearchAiDashboard() {
  const { "*": subPath } = useParams();
  const [activeRole] = useState(localStorage.getItem('userRole') || 'Farmer');
  const [data, setData] = useState({
    emergingTrends: [],
    industryReports: [],
    newPublications: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [selectedAbstract, setSelectedAbstract] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`researchWishlist_${activeRole}`) || '[]');
    setWishlist(saved);
  }, [activeRole]);

  const removeWishlist = (title) => {
    const updated = wishlist.filter(item => item.title !== title);
    setWishlist(updated);
    localStorage.setItem(`researchWishlist_${activeRole}`, JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const subpage = subPath || 'Overview';
        const url = new URL('http://localhost:5000/api/research/whitepaper-dashboard');
        url.searchParams.append('subpage', subpage);
        if (activeSearchQuery) {
          url.searchParams.append('searchQuery', activeSearchQuery);
        }

        const response = await fetch(url.toString(), {
          headers: { 'x-user-role': activeRole, 'x-language': 'English' }
        });
        if (response.ok) {
          const json = await response.json();
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch whitepaper dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [activeRole, subPath, activeSearchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearchQuery(searchQuery);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 relative">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Topic, keywords, or papers"
            className="block w-full pl-12 pr-14 py-4 border-none rounded-2xl bg-white shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm text-gray-900 transition-shadow hover:shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-colors shadow-sm">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          {/* Emerging Trends */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" /> Emerging Trends {activeSearchQuery && <span className="text-sm font-normal text-gray-500 ml-2">for "{activeSearchQuery}"</span>}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.emergingTrends.map((trend, idx) => {
                const isHotTopic = trend.badge === 'HOT TOPIC';
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedAbstract(trend)}
                    className={`cursor-pointer relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] group transition-all hover:-translate-y-1 hover:shadow-xl ${
                      isHotTopic 
                      ? 'bg-emerald-900 shadow-emerald-900/20' 
                      : 'bg-emerald-50 border border-emerald-100 hover:border-emerald-300 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start relative z-10 mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        isHotTopic ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {trend.type}
                      </span>
                      {trend.badge && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                          isHotTopic ? 'bg-[#ff6b6b] text-white' : 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                        }`}>
                          {trend.badge}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3 relative z-10">
                      <h3 className={`text-lg font-bold leading-tight line-clamp-2 ${isHotTopic ? 'text-white' : 'text-gray-900 group-hover:text-emerald-700 transition-colors'}`}>
                        {trend.title}
                      </h3>
                      <p className={`text-sm line-clamp-3 ${isHotTopic ? 'text-gray-300' : 'text-gray-600'}`}>
                        {trend.abstract}
                      </p>
                    </div>
                    <div className={`mt-6 pt-4 border-t flex justify-between items-center text-xs relative z-10 ${
                      isHotTopic ? 'border-white/10 text-gray-400' : 'border-emerald-200/60 text-emerald-800 font-medium'
                    }`}>
                      <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {trend.date}</div>
                      <div>{trend.author}</div>
                    </div>
                    {isHotTopic && (
                      <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12 transition-transform group-hover:scale-110">
                        <TrendingUp className="w-48 h-48" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom Grid for Industry Reports & New Publications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Industry Reports */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" /> Industry Reports
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4 w-1/3">Report Title</th>
                      <th className="px-6 py-4">Region</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.industryReports.map((report, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="whitespace-normal leading-snug">{report.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{report.region}</td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{report.author}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            report.status.toLowerCase() === 'published' ? 'bg-emerald-50 text-emerald-700' : 
                            report.status.toLowerCase() === 'draft' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-3 text-gray-400">
                          <button className="hover:text-emerald-600 transition-colors"><Eye className="w-4 h-4" /></button>
                          <button className="hover:text-emerald-600 transition-colors"><Download className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* New Publications */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-emerald-600" /> New Publications
              </h2>
              <div className="space-y-4">
                {data.newPublications.map((pub, idx) => (
                  <div key={idx} onClick={() => setSelectedAbstract(pub)} className="bg-white border border-gray-100 rounded-3xl p-4 flex gap-5 hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden relative border border-gray-50">
                       <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply group-hover:opacity-0 transition-opacity z-10" />
                       <img 
                         src={pub.imageUrl && pub.imageUrl.startsWith('http') ? pub.imageUrl : `https://loremflickr.com/400/400/?random=`} 
                         alt={pub.title}
                         className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                         onError={(e) => { e.target.onerror = null; e.target.src = `https://loremflickr.com/400/400/agriculture?random=`; }}
                       />
                    </div>
                    <div className="flex flex-col justify-between py-1 overflow-hidden w-full">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">{pub.journal}</span>
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><FileText className="w-3 h-3" /> {pub.readTime}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">{pub.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{pub.description}</p>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
                          Read Abstract <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Wishlisted Papers */}
          {wishlist.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <BookmarkCheck className="h-5 w-5 text-emerald-600" /> Wishlisted Papers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item, idx) => (
                  <div key={idx} className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between group relative overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base leading-snug mb-3 line-clamp-2">{item.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{item.abstract}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center relative z-10">
                      <button onClick={() => setSelectedAbstract({ title: item.title, abstract: item.abstract, type: 'Wishlist', date: 'Wishlisted' })} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
                        Read <ArrowRight className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeWishlist(item.title); }} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Abstract Modal */}
      {selectedAbstract && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                    {selectedAbstract.journal || selectedAbstract.type || selectedAbstract.badge || 'Research'}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {selectedAbstract.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    {selectedAbstract.author && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <User className="w-4 h-4 text-emerald-600" /> {selectedAbstract.author}
                      </span>
                    )}
                    {selectedAbstract.publishDate && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-4 h-4 text-emerald-600" /> {selectedAbstract.publishDate}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAbstract(null)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <img 
                  src={selectedAbstract.imageUrl && selectedAbstract.imageUrl.startsWith('http') ? selectedAbstract.imageUrl : `https://loremflickr.com/800/400/`}
                  alt={selectedAbstract.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://loremflickr.com/800/400/agriculture`; }}
                />
              </div>

              <div className="prose prose-emerald max-w-none">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Abstract</h4>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {selectedAbstract.abstract || selectedAbstract.description || "No abstract available for this publication."}
                </p>

                {selectedAbstract.keyFindings && selectedAbstract.keyFindings.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-600" /> Key Findings
                    </h4>
                    <ul className="space-y-2">
                      {selectedAbstract.keyFindings.map((finding, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-gray-600 text-sm sm:text-base">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> {selectedAbstract.readTime || selectedAbstract.date || 'Read More'}
                </span>
                <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download Full Paper
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
