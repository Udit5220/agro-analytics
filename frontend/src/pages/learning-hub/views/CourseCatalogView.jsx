import React, { useState } from 'react';
import { Search, Star, Clock, Users, ChevronRight, BookOpen } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function CourseCatalogView({ language, setActiveView, setSelectedCourse, data, loading, error }) {
  const isHindi = language === 'Hindi';
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [enrollModalCourse, setEnrollModalCourse] = useState(null);

  const filters = [
    { id: 'All', labelEn: 'All Courses', labelHi: 'सभी पाठ्यक्रम' }
  ];

  const courses = data?.uiElements?.courses || data?.courses || [];
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || !data) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="bg-emerald-900/10 rounded-3xl h-48 border border-gray-100 p-6 md:p-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-3xl h-80 border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn relative">
      
      {/* Enrollment Modal */}
      {enrollModalCourse && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slideUp relative">
            <button onClick={() => setEnrollModalCourse(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center">
               ✕
            </button>
            <h2 className="text-xl font-bold text-emerald-950 mb-2">{isHindi ? "नामांकन की पुष्टि करें" : "Confirm Enrollment"}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {isHindi ? "आप " : "You are enrolling in "}
              <span className="font-bold text-gray-900">{enrollModalCourse}</span>
              {isHindi ? " में नामांकन कर रहे हैं।" : "."}
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (setSelectedCourse) setSelectedCourse(enrollModalCourse);
              setActiveView('lesson');
              setEnrollModalCourse(null);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{isHindi ? "पूरा नाम" : "Full Name"}</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-colors" placeholder={isHindi ? "अपना नाम दर्ज करें" : "Enter your name"} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{isHindi ? "संभावित प्रारंभ तिथि" : "Expected Start Date"}</label>
                <input required type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors mt-6 shadow-md hover:shadow-lg">
                {isHindi ? "पुष्टि करें और पाठ शुरू करें" : "Confirm & Start Lesson"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
      
      {/* Top Action Controls */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isHindi && data?.uiElements?.pageTitle ? data.uiElements.pageTitle : (data?.uiElements?.pageTitle || "Browse Course Catalog")}
          </h1>
          <p className="text-gray-500 text-sm">
            {isHindi && data?.uiElements?.subHeading ? data.uiElements.subHeading : (data?.uiElements?.subHeading || "Discover specialized tutorials and certifications to upgrade your skills.")}
          </p>
        </div>

        {/* Large Rounded Search Field */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-emerald-500 focus:border-emerald-500 block pl-12 pr-4 py-3.5 sm:pr-6 sm:py-4 shadow-inner transition-all hover:bg-white"
            placeholder={isHindi ? "पाठ्यक्रम, कौशल, या प्रमाणन खोजें..." : "Search for courses, skills, or certifications..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute inset-y-1.5 right-1.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full transition-colors hidden sm:block shadow-sm">
            {isHindi ? "खोज" : "Search"}
          </button>
        </div>

        {/* Pill/Tag Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                activeFilter === filter.id
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-md transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {isHindi ? filter.labelHi : filter.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col">
            
            {/* Feature Cover Image */}
            <div className="h-48 w-full relative overflow-hidden bg-gray-100">
              <img 
                src={course.img} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Metadata Badge */}
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-sm border border-white/20 shadow-sm bg-emerald-100 text-emerald-800`}>
                {course.badge}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                
                {/* Ratings & Tallies */}
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{course.rating}</span>
                    <span className="text-gray-400 font-medium">({course.reviewCount || course.reviews})</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollmentCount || course.students}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {course.title}
                </h3>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  {course.duration}
                </div>
                
                {/* Action Button */}
                <button 
                  onClick={() => {
                    setEnrollModalCourse(course.title);
                  }}
                  className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  {course.actionText || (isHindi ? "नामांकन करें" : "Enroll Now")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-gray-500 text-sm font-medium">
            {isHindi ? "कोई पाठ्यक्रम नहीं मिला।" : "No courses found matching your search."}
          </div>
        )}
      </div>

    </div>
  );
}
