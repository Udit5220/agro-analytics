export const researchAnalystContent = {
  dashboard: {
    banner_heading: "Research & Analytics Dashboard",
    banner_subtext: "Dive deep into climate modeling, soil biotech, and predictive data analysis.",
    active_course: { title: "Predictive Crop Modeling", progress: 75, time_spent: "5h" },
    recommended_courses: [
      { title: "Climate Change Impact Analysis", duration: "4h", badge: "HOT", keyword_for_image: "climate change" },
      { title: "Advanced Soil Biotech", duration: "6h", badge: "PRO", keyword_for_image: "soil biotech" },
      { title: "Satellite Imagery in Agriculture", duration: "3h 30m", badge: "TECH", keyword_for_image: "satellite agriculture" },
      { title: "Machine Learning for Yield Prediction", duration: "8h", badge: "ADVANCED", keyword_for_image: "machine learning" }
    ]
  },
  lesson: {
    module_title: "Remote Sensing in Agriculture",
    tags: ["Satellite", "GIS", "Data"],
    duration: "1h 15m",
    notes: "Utilize NDVI (Normalized Difference Vegetation Index) to assess crop health from space.",
    key_insight: "NDVI values between 0.6 and 0.9 indicate dense, healthy vegetation.",
    timeline: []
  },
  quiz: {
    course_title: "GIS & Remote Sensing Quiz",
    question: "Which index is most commonly used to analyze live green vegetation using satellite data?",
    options: [
      { id: "A", text: "Air Quality Index (AQI)" },
      { id: "B", text: "Normalized Difference Vegetation Index (NDVI)" },
      { id: "C", text: "Consumer Price Index (CPI)" },
      { id: "D", text: "Body Mass Index (BMI)" }
    ],
    correct_option_id: "B",
    keyword_for_image: "satellite image"
  },
  analytics: {
    metrics: { total_learners: "2k+", average_score: "88%", certificates: "1.8k", at_risk: "2%" },
    top_modules: [], activities: []
  },
  defaultCatalog: {
    courses: [
      { title: "Climate Modeling Data", rating: "4.9", reviews: "600", duration: "5h", students: "2.5k", badge: "PRO", keyword_for_image: "climate model" },
      { title: "Soil Microbiome Analysis", rating: "4.8", reviews: "500", duration: "4h", students: "2k", badge: "SCIENCE", keyword_for_image: "microbiome" },
      { title: "Agricultural Big Data", rating: "4.7", reviews: "800", duration: "6h", students: "3.5k", badge: "HOT", keyword_for_image: "big data network" },
      { title: "Yield Prediction Algorithms", rating: "4.9", reviews: "900", duration: "7h", students: "4k", badge: "ADVANCED", keyword_for_image: "algorithm" },
      { title: "Drone Data Processing", rating: "4.6", reviews: "450", duration: "3h", students: "1.8k", badge: "TECH", keyword_for_image: "agricultural drone" },
      { title: "Genomic Selection in Crops", rating: "4.8", reviews: "300", duration: "5h", students: "1.2k", badge: "SCIENCE", keyword_for_image: "dna crop" },
      { title: "Hydrological Modeling", rating: "4.5", reviews: "200", duration: "4h", students: "900", badge: "CORE", keyword_for_image: "hydrology" },
      { title: "Statistical Analysis with R/Python", rating: "4.9", reviews: "1.2k", duration: "10h", students: "6k", badge: "ESSENTIAL", keyword_for_image: "python code" },
      { title: "Global Supply Chain Economics", rating: "4.7", reviews: "550", duration: "4h", students: "2.2k", badge: "ECON", keyword_for_image: "global economics" },
      { title: "Publishing Agricultural Research", rating: "4.4", reviews: "150", duration: "2h", students: "500", badge: "CAREER", keyword_for_image: "research paper" }
    ]
  }
};
