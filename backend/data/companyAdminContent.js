export const companyAdminContent = {
  dashboard: {
    banner_heading: "Platform Administration Hub",
    banner_subtext: "Oversee platform metrics, user governance, and system health.",
    active_course: { title: "Data Privacy & Governance", progress: 80, time_spent: "4h" },
    recommended_courses: [
      { title: "System Architecture Basics", duration: "2h", badge: "CORE", keyword_for_image: "cloud server" },
      { title: "User Access Management", duration: "1h 30m", badge: "SECURITY", keyword_for_image: "security padlock" },
      { title: "Platform Analytics Interpretation", duration: "3h", badge: "HOT", keyword_for_image: "data dashboard" },
      { title: "Compliance & Auditing", duration: "4h", badge: "LEGAL", keyword_for_image: "audit document" }
    ]
  },
  lesson: {
    module_title: "Interpreting System Metrics",
    tags: ["Analytics", "System Health", "Admin"],
    duration: "50 mins",
    notes: "How to read API latency, error rates, and user engagement metrics across the platform.",
    key_insight: "Maintaining API latency under 200ms ensures high user retention.",
    timeline: []
  },
  quiz: {
    course_title: "Security & Governance Quiz",
    question: "What does RBAC stand for in system security?",
    options: [
      { id: "A", text: "Role-Based Access Control" },
      { id: "B", text: "Random Byte Authentication Code" },
      { id: "C", text: "Rapid Backup & Archive Center" },
      { id: "D", text: "Regional Broadcast Access Channel" }
    ],
    correct_option_id: "A",
    keyword_for_image: "network security"
  },
  analytics: {
    metrics: { total_learners: "800+", average_score: "92%", certificates: "600", at_risk: "1%" },
    top_modules: [], activities: []
  },
  defaultCatalog: {
    courses: [
      { title: "Administering Role-Based Access", rating: "4.8", reviews: "200", duration: "2h", students: "800", badge: "CORE", keyword_for_image: "access control" },
      { title: "Advanced Platform Analytics", rating: "4.9", reviews: "350", duration: "4h", students: "1.2k", badge: "PRO", keyword_for_image: "analytics dashboard" },
      { title: "Incident Response Planning", rating: "4.7", reviews: "150", duration: "3h", students: "600", badge: "CRITICAL", keyword_for_image: "emergency response" },
      { title: "Database Health Monitoring", rating: "4.6", reviews: "220", duration: "2.5h", students: "900", badge: "TECH", keyword_for_image: "database" },
      { title: "Global Compliance Laws", rating: "4.8", reviews: "400", duration: "5h", students: "1.5k", badge: "LEGAL", keyword_for_image: "law compliance" },
      { title: "Disaster Recovery Protocols", rating: "4.9", reviews: "500", duration: "4.5h", students: "2k", badge: "ESSENTIAL", keyword_for_image: "server backup" },
      { title: "API Usage Optimization", rating: "4.5", reviews: "180", duration: "2h", students: "700", badge: "TECH", keyword_for_image: "api interface" },
      { title: "Scaling Cloud Infrastructure", rating: "4.8", reviews: "320", duration: "4h", students: "1.1k", badge: "PRO", keyword_for_image: "cloud computing" },
      { title: "Employee Training Deployment", rating: "4.4", reviews: "110", duration: "1.5h", students: "500", badge: "HR", keyword_for_image: "training employees" },
      { title: "Audit Trail Management", rating: "4.7", reviews: "250", duration: "2.5h", students: "850", badge: "CORE", keyword_for_image: "audit trail" }
    ]
  }
};
